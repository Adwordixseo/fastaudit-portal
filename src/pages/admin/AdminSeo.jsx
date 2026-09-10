import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import SeoSettingDialog from '@/components/seo/SeoSettingDialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminSeo() {
  const qc = useQueryClient();
  const [dialog, setDialog] = useState({ open: false, setting: null });
  const { data: settings = [] } = useQuery({ queryKey: ['admin-seo'], queryFn: () => base44.entities.SeoSetting.list('path') });
  const refresh = () => { qc.invalidateQueries({ queryKey: ['admin-seo'] }); qc.invalidateQueries({ queryKey: ['seo-settings'] }); };

  const save = async (form) => {
    if (dialog.setting) await base44.entities.SeoSetting.update(dialog.setting.id, form);
    else await base44.entities.SeoSetting.create(form);
    refresh();
    toast.success('SEO setting saved');
  };

  const remove = async (s) => {
    if (!confirm(`Delete SEO settings for "${s.page_name}"?`)) return;
    await base44.entities.SeoSetting.delete(s.id);
    refresh();
    toast.success('SEO setting deleted');
  };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="SEO settings" description="Manage meta tags, Open Graph, schema and content overrides for every page. Changes apply live to the published site." action={<Button onClick={() => setDialog({ open: true, setting: null })} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> New SEO setting</Button>} />

      {settings.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Search className="h-5 w-5" /></div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">No SEO settings yet</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">Add SEO settings for each page to control how it appears in search results and social shares.</p>
          <Button onClick={() => setDialog({ open: true, setting: null })} className="mt-4 rounded-full"><Plus className="mr-2 h-4 w-4" /> Add your first page</Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Page</th>
                <th className="px-5 py-3">Path</th>
                <th className="px-5 py-3">Meta title</th>
                <th className="px-5 py-3">Schema</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settings.map((s) => (
                <tr key={s.id} className="text-sm">
                  <td className="px-5 py-4 font-medium text-slate-900">{s.page_name}</td>
                  <td className="px-5 py-4"><code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">{s.path}</code></td>
                  <td className="max-w-xs px-5 py-4 truncate text-slate-600">{s.title || <span className="text-slate-400">—</span>}</td>
                  <td className="px-5 py-4">{s.schema_json ? <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Yes</span> : <span className="text-slate-400">—</span>}</td>
                  <td className="px-5 py-4"><StatusBadge status={s.is_active !== false ? 'active' : 'inactive'} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`https://apricot-audit-growth-flow.base44.app${s.path}`} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><ExternalLink className="h-4 w-4" /></a>
                      <button onClick={() => setDialog({ open: true, setting: s })} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SeoSettingDialog open={dialog.open} onOpenChange={(o) => setDialog({ open: o, setting: o ? dialog.setting : null })} setting={dialog.setting} onSave={save} />
    </div>
  );
}