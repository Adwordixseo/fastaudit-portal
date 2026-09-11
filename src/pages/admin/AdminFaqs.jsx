import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, HelpCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import FaqDialog from '@/components/admin/FaqDialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';


const KNOWN_PAGES = [
  { path: '/', label: 'Home (/)' },
  { path: '/platform/:slug', label: 'Platform pages (/platform/:slug)' },
  { path: '/solutions/:slug', label: 'Solutions pages (/solutions/:slug)' },
  { path: '/resources/:slug', label: 'Resource articles (/resources/:slug)' },
];

export default function AdminFaqs() {
  const qc = useQueryClient();
  const [dialog, setDialog] = useState({ open: false, faq: null });
  const [pageFilter, setPageFilter] = useState('all');
  const { data: faqs = [] } = useQuery({ queryKey: ['admin-faqs'], queryFn: () => base44.entities.FaqItem.list('sort_order') });
  const refresh = () => { qc.invalidateQueries({ queryKey: ['admin-faqs'] }); qc.invalidateQueries({ queryKey: ['faq-items'] }); };

  const pageOptions = useMemo(() => {
    const knownPaths = new Set(KNOWN_PAGES.map((p) => p.path));
    const extra = faqs
      .map((f) => f.page_path)
      .filter((p) => p && !knownPaths.has(p))
      .filter((p, i, arr) => arr.indexOf(p) === i)
      .map((p) => ({ path: p, label: p }));
    return [...KNOWN_PAGES, ...extra];
  }, [faqs]);

  const filtered = pageFilter === 'all' ? faqs : faqs.filter((f) => f.page_path === pageFilter);

  const save = async (form) => {
    if (dialog.faq) await base44.entities.FaqItem.update(dialog.faq.id, form);
    else await base44.entities.FaqItem.create(form);
    refresh();
    toast.success('FAQ saved');
  };

  const remove = async (f) => {
    if (!confirm('Delete this FAQ?')) return;
    await base44.entities.FaqItem.delete(f.id);
    refresh();
    toast.success('FAQ deleted');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="FAQs"
        description="Add, edit, or remove FAQ entries on any public page. Use :slug patterns to target dynamic pages. Pages with no CMS FAQs fall back to their default content."
        action={<Button onClick={() => setDialog({ open: true, faq: null })} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> New FAQ</Button>}
      />

      {faqs.length > 0 && (
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600"><Filter className="h-4 w-4" /> Filter by page</div>
          <select
            value={pageFilter}
            onChange={(e) => setPageFilter(e.target.value)}
            className="h-9 w-[280px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All pages ({faqs.length})</option>
            {pageOptions.map((p) => {
              const count = faqs.filter((f) => f.page_path === p.path).length;
              return <option key={p.path} value={p.path}>{p.label} ({count})</option>;
            })}
          </select>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><HelpCircle className="h-5 w-5" /></div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">{faqs.length === 0 ? 'No FAQs yet' : 'No FAQs for this page'}</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">{faqs.length === 0 ? 'Add FAQ entries to any public page. Pages without CMS FAQs will show their default content.' : 'Try a different page filter or add a new FAQ for this page.'}</p>
          <Button onClick={() => setDialog({ open: true, faq: null })} className="mt-4 rounded-full"><Plus className="mr-2 h-4 w-4" /> {faqs.length === 0 ? 'Add your first FAQ' : 'New FAQ'}</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((f) => (
            <div key={f.id} className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-slate-900">{f.question}</h3>
                    <StatusBadge status={f.is_active !== false ? 'active' : 'inactive'} />
                  </div>
                  <code className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500">{f.page_path}</code>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setDialog({ open: true, faq: f })} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(f)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-slate-500">{f.answer}</p>
            </div>
          ))}
        </div>
      )}

      <FaqDialog open={dialog.open} onOpenChange={(o) => setDialog({ open: o, faq: o ? dialog.faq : null })} faq={dialog.faq} onSave={save} />
    </div>
  );
}