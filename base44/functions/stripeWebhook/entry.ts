import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

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
        }
      }
    }
    return Response.json({ received: true });
  } catch (error) {
    console.error('stripeWebhook error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}