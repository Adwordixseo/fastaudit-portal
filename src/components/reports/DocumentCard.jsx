import React from 'react';
import { FileText, FileSpreadsheet, File, Eye, Download, Check, MessageSquare, History, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import { fmtDate, fmtDateTime, fmtMonth, humanize } from '@/lib/format';

const icons = { pdf: FileText, document: FileText, spreadsheet: FileSpreadsheet, other: File };

export default function DocumentCard({ doc, projectName, onView, onApprove, onRequestChange }) {
  const Icon = icons[doc.file_type] || File;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-900">{doc.title}</h3><StatusBadge status={doc.status} /></div>
          <p className="mt-1 text-xs text-slate-500">{projectName} · {fmtMonth(doc.report_month)} · Uploaded {fmtDate(doc.created_date)} · <span className="capitalize">{doc.file_type}</span></p>
          {doc.admin_comment && <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">"{doc.admin_comment}"</p>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="rounded-full" onClick={() => onView(doc)}><Eye className="mr-1.5 h-3.5 w-3.5" /> Preview</Button>
        <Button asChild size="sm" variant="outline" className="rounded-full"><a href={doc.file_url} download target="_blank" rel="noreferrer"><Download className="mr-1.5 h-3.5 w-3.5" /> Download</a></Button>
        {doc.review_link && <Button asChild size="sm" variant="outline" className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"><a href={doc.review_link} target="_blank" rel="noreferrer"><ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open review link</a></Button>}
        {onApprove && doc.status !== 'approved' && <Button size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700" onClick={() => onApprove(doc)}><Check className="mr-1.5 h-3.5 w-3.5" /> Approve</Button>}
        {onRequestChange && doc.status === 'awaiting_approval' && <Button size="sm" variant="outline" className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => onRequestChange(doc)}><MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Request changes</Button>}
      </div>
      {doc.history?.length > 0 && (
        <details className="mt-4 text-xs text-slate-500">
          <summary className="flex cursor-pointer items-center gap-1.5 font-medium text-slate-600"><History className="h-3.5 w-3.5" /> Approval history ({doc.history.length})</summary>
          <ul className="mt-2 space-y-1.5 border-l-2 border-slate-100 pl-3">{[...doc.history].reverse().map((h, i) => <li key={i}><span className="font-medium capitalize text-slate-700">{humanize(h.action)}</span> by {h.by} · {fmtDateTime(h.date)}{h.note && <div className="text-slate-500">"{h.note}"</div>}</li>)}</ul>
        </details>
      )}
    </div>
  );
}