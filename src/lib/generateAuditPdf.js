import { jsPDF } from 'jspdf';
import { fmtDate } from '@/lib/format';

export function generateAuditPdf(audit) {
  const doc = new jsPDF();
  const W = 210, M = 16;
  let y = 0;

  doc.setFillColor(11, 16, 32); doc.rect(0, 0, W, 42, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(20); doc.setFont(undefined, 'bold');
  doc.text('Website Audit Report', M, 18);
  doc.setFontSize(10); doc.setFont(undefined, 'normal'); doc.setTextColor(180, 190, 220);
  doc.text(`${audit.url}   ·   Generated ${fmtDate(audit.created_date)}   ·   RankPilot`, M, 28);
  y = 56;

  doc.setTextColor(15, 23, 42); doc.setFontSize(44); doc.setFont(undefined, 'bold');
  doc.text(String(audit.overall_score), M, y + 6);
  doc.setFontSize(11); doc.setFont(undefined, 'normal'); doc.setTextColor(100, 116, 139);
  doc.text('Overall score out of 100', M + 34, y + 4);

  let x = 105;
  Object.entries(audit.scores || {}).forEach(([k, v]) => {
    doc.setFontSize(14); doc.setTextColor(15, 23, 42); doc.setFont(undefined, 'bold'); doc.text(String(v), x, y);
    doc.setFontSize(8); doc.setTextColor(100, 116, 139); doc.setFont(undefined, 'normal'); doc.text(k.replace('_', ' '), x, y + 5);
    x += 20;
  });
  y += 20;

  const section = (title) => { if (y > 260) { doc.addPage(); y = 20; } doc.setFontSize(13); doc.setFont(undefined, 'bold'); doc.setTextColor(79, 70, 229); doc.text(title, M, y); y += 7; };
  const para = (text, size = 10, color = [51, 65, 85]) => {
    doc.setFontSize(size); doc.setFont(undefined, 'normal'); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, W - M * 2);
    lines.forEach((l) => { if (y > 280) { doc.addPage(); y = 20; } doc.text(l, M, y); y += size * 0.5; });
    y += 3;
  };

  section('Executive summary'); para(audit.summary || '');
  section('Issues found');
  (audit.issues || []).forEach((i) => { para(`[${(i.severity || 'medium').toUpperCase()}]  ${i.title}`, 10.5, [15, 23, 42]); para(i.detail || '', 9.5); });
  section('Recommendations');
  (audit.recommendations || []).forEach((r, idx) => para(`${idx + 1}. ${r}`));

  const host = (() => { try { return new URL(audit.url).hostname; } catch { return 'website'; } })();
  doc.save(`audit-${host}.pdf`);
}