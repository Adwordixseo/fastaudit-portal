import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import { sendGmail } from '../../shared/gmailMime.js';

const CYCLE_MONTHS = { monthly: 1, quarterly: 3, yearly: 12 };
const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

async function verifySignature(bodyText, sigHeader, secret) {
  const parts = sigHeader.split(',').map((s) => s.trim());
  const tPart = parts.find((p) => p.startsWith('t='));
  const v1Part = parts.find((p) => p.startsWith('v1='));
  if (!tPart || !v1Part) return false;
  const t = tPart.split('=')[1];
  const v1 = v1Part.split('=')[1];
  const payload = `${t}.${bodyText}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sigBytes = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const computed = [...new Uint8Array(sigBytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
  const age = Math.abs(Date.now() / 1000 - Number(t));
  return computed === v1 && age < 300;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const bodyText = await req.text();
    const sig = req.headers.get('stripe-signature') || '';
    const secret = secrets.get('STRIPE_WEBHOOK_SECRET');
    if (!secret) return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
    const ok = await verifySignature(bodyText, sig, secret);
    if (!ok) return Response.json({ error: 'Invalid signature' }, { status: 401 });

    const event = JSON.parse(bodyText);
    if (event.type === 'checkout.session.completed') {
      const obj = event.data.object;
      const sessionId = obj.id;
      const md = obj.metadata || {};
      const clientId = md.client_id;
      const clientEmail = md.client_email;
      const packageId = md.package_id;
      const packageName = md.package_name;
      const cycle = ['monthly', 'quarterly', 'yearly'].includes(md.cycle) ? md.cycle : 'monthly';
      const amount = Number(md.amount) || 0;
      if (clientId && packageId) {
        const existing = await base44.asServiceRole.entities.Subscription.filter({ stripe_session_id: sessionId });
        if (!existing || existing.length === 0) {
          const start = new Date();
          const end = new Date(start);
          end.setMonth(end.getMonth() + CYCLE_MONTHS[cycle]);
          await base44.asServiceRole.entities.Subscription.create({
            client_id: clientId, client_email: clientEmail, package_id: packageId, package_name: packageName,
            billing_cycle: cycle, amount, status: 'active',
            start_date: fmt(start), end_date: fmt(end), stripe_session_id: sessionId
          });
          if (clientEmail) {
            try {
              const fmtMoney = (n) => '$' + (n / 100).toFixed(2);
              const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#16a34a;padding:28px 40px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">Payment Confirmed</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 16px;color:#1e293b;font-size:16px;">Thank you for your purchase!</p>
          <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;">Your subscription is now active. Here's a summary of your order:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e2e8f0;border-radius:8px;">
            <tr><td style="padding:12px 16px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0;">Package</td><td style="padding:12px 16px;color:#1e293b;font-size:14px;font-weight:bold;border-bottom:1px solid #e2e8f0;text-align:right;">${packageName || '—'}</td></tr>
            <tr><td style="padding:12px 16px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0;">Billing cycle</td><td style="padding:12px 16px;color:#1e293b;font-size:14px;font-weight:bold;border-bottom:1px solid #e2e8f0;text-align:right;text-transform:capitalize;">${cycle}</td></tr>
            <tr><td style="padding:12px 16px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0;">Amount</td><td style="padding:12px 16px;color:#1e293b;font-size:14px;font-weight:bold;border-bottom:1px solid #e2e8f0;text-align:right;">${fmtMoney(amount)}</td></tr>
            <tr><td style="padding:12px 16px;color:#64748b;font-size:13px;">Active from</td><td style="padding:12px 16px;color:#1e293b;font-size:14px;font-weight:bold;text-align:right;">${fmt(start)} → ${fmt(end)}</td></tr>
          </table>
          <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;">You can view your subscription details and manage your projects from the dashboard.</p>
          <a href="https://apricot-audit-growth-flow.base44.app/app" style="display:inline-block;padding:12px 28px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">Go to your dashboard</a>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">FastAudit Portal · This is an automated confirmation message.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
              await sendGmail(base44, clientEmail, 'Payment Confirmed — ' + (packageName || 'Your Package'), html);
            } catch (emailErr) {
              console.error('Purchase confirmation email failed', emailErr);
            }
          }
        }
      }
    }
    return Response.json({ received: true });
  } catch (error) {
    console.error('stripeWebhook error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}