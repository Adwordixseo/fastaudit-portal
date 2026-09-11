import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import FaqDialog from '@/components/admin/FaqDialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminFaqs() {
  const qc = useQueryClient();
  const [dialog, setDialog] = useState({ open: false, faq: null });
  const { data: faqs = [] } = useQuery({ queryKey: ['admin-faqs'], queryFn: () => base44.entities.FaqItem.list('sort_order') });
  const refresh = () => { qc.invalidateQueries({ queryKey: ['admin-faqs'] }); qc.invalidateQueries({ queryKey: ['faq-items'] }); };

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

      {faqs.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><HelpCircle className="h-5 w-5" /></div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">No FAQs yet</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">Add FAQ entries to any public page. Pages without CMS FAQs will show their default content.</p>
          <Button onClick={() => setDialog({ open: true, faq: null })} className="mt-4 rounded-full"><Plus className="mr-2 h-4 w-4" /> Add your first FAQ</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((f) => (
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