import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function buildRawMime(from, to, subject, html) {
  const boundary = '----=_Part_' + Math.random().toString(36).slice(2);
  const mime = [
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `MIME-Version: 1.0`,
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    base64UrlEncode(html),
    `--${boundary}--`,
    ``,
  ].join('\r\n');
  return base64UrlEncode(mime);
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { email, fullName } = body;

    if (!email) {
      return Response.json({ error: 'email is required' }, { status: 400 });
    }

    const greeting = fullName ? `Hi ${fullName},` : 'Hello,';

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#4f46e5;padding:28px 40px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">Welcome to FastAudit Portal</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 16px;color:#1e293b;font-size:16px;">${greeting}</p>
          <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;">Your account is verified and ready to go. You now have access to instant website audits, project tracking, monthly reports, and our support team — all in one dashboard.</p>
          <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">Here's what you can do next:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr><td style="padding:8px 0;color:#4f46e5;font-size:14px;">✓ &nbsp; Run a free SEO audit on your website</td></tr>
            <tr><td style="padding:8px 0;color:#4f46e5;font-size:14px;">✓ &nbsp; Explore our service packages</td></tr>
            <tr><td style="padding:8px 0;color:#4f46e5;font-size:14px;">✓ &nbsp; Track your project milestones and reports</td></tr>
            <tr><td style="padding:8px 0;color:#4f46e5;font-size:14px;">✓ &nbsp; Reach our support team anytime</td></tr>
          </table>
          <a href="https://apricot-audit-growth-flow.base44.app/login" style="display:inline-block;padding:12px 28px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">Go to your dashboard</a>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">FastAudit Portal · This is an automated welcome message.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const raw = buildRawMime('FastAudit Portal <fastaudit@gmail.com>', email, 'Welcome to FastAudit Portal', html);

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: `Gmail API error: ${err}` }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}