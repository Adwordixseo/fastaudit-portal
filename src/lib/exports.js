import { jsPDF } from 'jspdf';

function download(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 2000);
}

export function exportToCsv(filename, headers, rows) {
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
  download(new Blob([csv], { type: 'text/csv' }), filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

export function exportToPdf(title, headers, rows, filename) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const W = 297, M = 14;
  doc.setFillColor(11, 16, 32); doc.rect(0, 0, W, 26, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(15); doc.setFont(undefined, 'bold');
  doc.text(title, M, 16);
  doc.setFontSize(8); doc.setFont(undefined, 'normal'); doc.setTextColor(180, 190, 220);
  doc.text(`Generated ${new Date().toLocaleDateString()}`, M, 22);

  let y = 36;
  const colW = (W - M * 2) / headers.length;
  doc.setFillColor(241, 245, 249); doc.rect(M, y - 5, W - M * 2, 7, 'F');
  doc.setFontSize(8.5); doc.setFont(undefined, 'bold'); doc.setTextColor(15, 23, 42);
  headers.forEach((h, i) => doc.text(String(h).slice(0, 28), M + i * colW, y));
  y += 8;

  doc.setFont(undefined, 'normal'); doc.setTextColor(51, 65, 85);
  rows.forEach((row) => {
    if (y > 200) { doc.addPage(); y = 20; }
    doc.setFontSize(8);
    row.forEach((c, i) => {
      const lines = doc.splitTextToSize(String(c ?? ''), colW - 3);
      doc.text(lines[0] || '', M + i * colW, y);
    });
    y += 6;
  });

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

export function exportToDoc(filename, title, headers, rows) {
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;padding:48px;color:#1e293b}h1{font-size:22px;margin-bottom:4px}p.meta{color:#64748b;font-size:12px;margin-bottom:24px}table{border-collapse:collapse;width:100%;font-size:12px}th{background:#f1f5f9;text-align:left;padding:8px 10px;border:1px solid #cbd5e1;font-weight:bold}td{padding:8px 10px;border:1px solid #e2e8f0}</style></head><body><h1>${esc(title)}</h1><p class="meta">Generated ${new Date().toLocaleString()}</p><table><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
  download(new Blob([html], { type: 'application/msword' }), filename.endsWith('.doc') ? filename : `${filename}.doc`);
}