import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sendGmail } from '../../shared/gmailMime.js';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { decision, documentTitle, projectName, projectId, clientName, clientEmail, note } = body;

    if (!decision || !documentTitle) {
      return Response.json({ error: 'decision and documentTitle are required' }, { status: 400 });
    }

    // Resolve the team member assigned to the project (source of truth server-side).
    let teamEmail = '';
    let teamName = '';
    if (projectId) {
      try {
        const project = await base44.asServiceRole.entities.Project.get(projectId);
        teamEmail = project?.assigned_to_email || '';
        teamName = project?.assigned_to_name || '';
      } catch { /* project lookup is best-effort */ }
    }
    if (!teamEmail) {
      return Response.json({ ok: true, skipped: 'No team member assigned to this project' });
    }

    const approved = decision === 'approved';
    const subject = approved
      ? `Client approved: ${documentTitle}`
      : `Client requested changes: ${documentTitle}`;

    const greeting = teamName ? `Hi ${teamName},` : 'Hi,';
    const projectLine = projectName ? `<p style="margin:0 0 16px;color:#475569;">Project: <strong style="color:#1e293b;">${projectName}</strong></p>` : '';
    const noteLine = note ? `<div style="margin:16px 0;padding:12px 16px;background:#f1f5f9;border-radius:8px;font-size:14px;color:#475569;"><strong>Client's note:</strong> ${note}</div>` : '';
    const bannerColor = approved ? '#16a34a' : '#e11d48';
    const headline = approved ? 'A client just approved a deliverable' : 'A client requested changes to a deliverable';

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:${bannerColor};padding:28px 40px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">${headline}</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 16px;color:#1e293b;font-size:16px;">${greeting}</p>
          ${projectLine}
          <div style="margin:24px 0;padding:20px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
            <p style="margin:0 0 4px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Document</p>
            <p style="margin:0;color:#1e293b;font-size:18px;font-weight:bold;">${documentTitle}</p>
            ${clientName ? `<p style="margin:8px 0 0;color:#64748b;font-size:13px;">Action by ${clientName} (${clientEmail || ''})</p>` : ''}
          </div>
          ${noteLine}
          <p style="margin:24px 0 0;color:#475569;font-size:14px;line-height:1.6;">${approved ? 'The deliverable is now marked as approved. You can archive it or proceed with the next milestone.' : 'Please review the requested changes and update the deliverable accordingly.'}</p>
          <a href="https://apricot-audit-growth-flow.base44.app/team" style="display:inline-block;margin:24px 0 0;padding:12px 28px;background:${bannerColor};color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">Open team dashboard</a>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">FastAudit Portal · This is an automated alert from your project dashboard.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    await sendGmail(base44, teamEmail, subject, html);
    return Response.json({ ok: true, sentTo: teamEmail });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}