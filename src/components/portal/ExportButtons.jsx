import React from 'react';
import { Download, FileSpreadsheet, FileText, FileType2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { exportToCsv, exportToPdf, exportToDoc } from '@/lib/exports';

export default function ExportButtons({ data, headers, filename = 'export', title, disabled }) {
  const isDisabled = disabled || !data || data.length === 0;
  const run = (fmt) => {
    const rows = data.map((item) => headers.map((h) => item[h.key] ?? ''));
    const labels = headers.map((h) => h.label);
    if (fmt === 'csv') exportToCsv(filename, labels, rows);
    else if (fmt === 'pdf') exportToPdf(title || filename, labels, rows, filename);
    else exportToDoc(filename, title || filename, labels, rows);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full" disabled={isDisabled}><Download className="mr-2 h-4 w-4" /> Export</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => run('csv')}><FileSpreadsheet className="mr-2 h-4 w-4" /> Sheet (CSV)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => run('doc')}><FileText className="mr-2 h-4 w-4" /> Document (Word)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => run('pdf')}><FileType2 className="mr-2 h-4 w-4" /> PDF</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}