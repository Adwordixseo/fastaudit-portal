import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import ContentSectionDialog from '@/components/content/ContentSectionDialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminContent() {
  const qc = useQueryClient();
  const [dialog, setDialog] = useState({ open: false, section: null });
  const { data: sections = [] } = useQuery({ queryKey: ['admin-content'], queryFn: () => base44.entities.ContentSection.list('sort_order') });
  const refresh = () => { qc.invalidateQueries({ queryKey: ['admin-content'] }); qc.invalidateQueries({ queryKey: ['content-sections'] }); };

  const save = async (form) => {
    if (dialog.section) await base44.entities.ContentSection.update(dialog.section.id, form);
    else await base44.entities.ContentSection.create(form);
    refresh();
    toast.success('Content section saved');
  };

  const remove = async (s) => {
    if (!confirm(`Delete "${s.section_name}"?`)) return;
    await base44.entities.ContentSection.delete(s.id);
    refresh();
    toast.success('Section deleted');
  };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Content sections" description="Add editable sections with rich text and internal links to any page. Great for SEO content and internal linking." action={<Button onClick={() => setDialog({ open: true, section: null })} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> New section</Button>} />

      {sections.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><FileText className="h-5 w-5" /></div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">No content sections yet</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">Add rich text sections to any page to expand your content and build internal links for SEO.</p>
          <Button onClick={() => setDialog({ open: true, section: null })} className="mt-4 rounded-full"><Plus className="mr-2 h-4 w-4" /> Add your first section</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((s) => (
            <div key={s.id} className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{s.section_name}</h3>
                    <StatusBadge status={s.is_active !== false ? 'active' : 'inactive'} />
                  </div>
                  <code className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500">{s.page_path}</code>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setDialog({ open: true, section: s })} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {s.heading && <h4 className="mt-3 text-base font-semibold text-slate-800">{s.heading}</h4>}
              {s.body && <div className="rich-text mt-2 line-clamp-3 text-sm text-slate-500" dangerouslySetInnerHTML={{ __html: s.body }} />}
              {s.link_url && s.link_label && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600">
                  <ArrowRight className="h-3.5 w-3.5" /> {s.link_label} → <code className="font-mono text-xs">{s.link_url}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ContentSectionDialog open={dialog.open} onOpenChange={(o) => setDialog({ open: o, section: o ? dialog.section : null })} section={dialog.section} onSave={save} />
    </div>
  );
}