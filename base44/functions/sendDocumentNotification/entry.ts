import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sendGmail } from '../../shared/gmailMime.js';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { clientEmail, clientName, documentTitle, projectName, comment, uploadedBy } = body;

    if (!clientEmail || !documentTitle) {
      return Response.json({ error: 'clientEmail and documentTitle are required' }, { status: 400 });
    }

    const greeting = clientName ? `Hi ${clientName},` : 'Hello,';
    const projectLine = projectName ? `<p style="margin:0 0 16px;color:#475569;">A new file has been added to your project <strong style="color:#1e293b;">${projectName}</strong>.</p>` : '';
    const commentLine = comment ? `<div style="margin:16px 0;padding:12px 16px;background:#f1f5f9;border-radius:8px;font-size:14px;color:#475569;"><strong>Note from team:</strong> ${comment}</div>` : '';

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#4f46e5;padding:28px 40px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">New document ready for review</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 16px;color:#1e293b;font-size:16px;">${greeting}</p>
          ${projectLine}
          <div style="margin:24px 0;padding:20px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
            <p style="margin:0 0 4px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Document</p>
            <p style="margin:0;color:#1e293b;font-size:18px;font-weight:bold;">${documentTitle}</p>
            ${uploadedBy ? `<p style="margin:8px 0 0;color:#64748b;font-size:13px;">Uploaded by ${uploadedBy}</p>` : ''}
          </div>
          ${commentLine}
          <p style="margin:24px 0 0;color:#475569;font-size:14px;line-height:1.6;">Log in to your portal to preview, download, and approve or request changes. We're here if you have any questions.</p>
          <a href="https://apricot-audit-growth-flow.base44.app/login" style="display:inline-block;margin:24px 0 0;padding:12px 28px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">Go to portal</a>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">FastAudit Portal · This is an automated message from your project dashboard.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    await sendGmail(base44, clientEmail, `New document ready for review: ${documentTitle}`, html);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}