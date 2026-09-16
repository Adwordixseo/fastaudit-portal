import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sendGmail } from '../../shared/gmailMime.js';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { name, phone, email, company, location, message } = body;

    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const rows = [
      ['Name', name],
      ['Phone', phone || '—'],
      ['Email', email],
      ['Company', company || '—'],
      ['Location', location || '—'],
    ];

    const infoRows = rows.map(
      ([k, v]) =>
        `<tr><td style="padding:8px 16px;color:#64748b;font-size:13px;font-weight:600;white-space:nowrap;vertical-align:top;">${k}</td><td style="padding:8px 16px;color:#0f172a;font-size:14px;vertical-align:top;">${v}</td></tr>`
    ).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#4f46e5;padding:24px 40px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">New Contact Form Enquiry</h1>
        </td></tr>
        <tr><td style="padding:28px 40px;">
          <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;">A new enquiry was submitted through the contact page on the website.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
            ${infoRows}
          </table>
          <p style="margin:0 0 8px;color:#64748b;font-size:13px;font-weight:600;">Message</p>
          <div style="padding:12px 16px;background:#f8fafc;border-radius:8px;color:#0f172a;font-size:14px;line-height:1.6;">${message.replace(/\n/g, '<br>')}</div>
        </td></tr>
        <tr><td style="padding:16px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">FastAudit Portal · Contact form submission</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    await sendGmail(base44, 'info@adwordix.com', `New contact enquiry from ${name}`, html, 'Adwordix Contact');
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}