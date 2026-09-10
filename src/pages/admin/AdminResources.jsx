import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import ResourceDialog from '@/components/admin/ResourceDialog';
import EmptyState from '@/components/portal/EmptyState';

export default function AdminResources() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toggling, setToggling] = useState(null);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => base44.entities.Resource.list('-sort_order', 100),
  });

  const openNew = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (r) => { setEditing(r); setDialogOpen(true); };

  const save = async (form) => {
    if (editing) {
      await base44.entities.Resource.update(editing.id, form);
    } else {
      await base44.entities.Resource.create(form);
    }
    qc.invalidateQueries({ queryKey: ['resources'] });
  };

  const remove = async (r) => {
    if (!confirm(`Delete "${r.title}"? This removes the page at /resources/${r.slug}.`)) return;
    await base44.entities.Resource.delete(r.id);
    qc.invalidateQueries({ queryKey: ['resources'] });
  };

  const toggleActive = async (r) => {
    setToggling(r.id);
    try {
      await base44.entities.Resource.update(r.id, { is_active: !r.is_active });
      qc.invalidateQueries({ queryKey: ['resources'] });
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        eyebrow="CMS"
        title="Resources"
        description="Create and manage resource articles. Edit the slug to change the page URL, swap the hero image, and update body content — no code needed."
        action={<Button onClick={openNew} className="rounded-full"><Plus className="h-4 w-4" /> New resource</Button>}
      />

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
      ) : resources.length === 0 ? (
        <EmptyState
          title="No resources yet"
          description="Create your first resource article — it will appear on the landing page and at /resources/your-slug."
          action={<Button onClick={openNew} className="rounded-full"><Plus className="h-4 w-4" /> New resource</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <div key={r.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {r.image_url && (
                <img src={r.image_url} alt="" className="h-36 w-full object-cover" />
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">{r.tag || 'Article'}</span>
                  <div className="flex items-center gap-1.5">
                    <Switch checked={r.is_active !== false} onCheckedChange={() => toggleActive(r)} disabled={toggling === r.id} />
                  </div>
                </div>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{r.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{r.excerpt}</p>
                <p className="mt-2 font-mono text-xs text-slate-400">/resources/{r.slug}</p>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                  <Button variant="outline" size="sm" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                  <Button variant="ghost" size="sm" asChild><a href={`/resources/${r.slug}`} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /> View</a></Button>
                  <Button variant="ghost" size="sm" className="ml-auto text-red-600 hover:text-red-700" onClick={() => remove(r)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ResourceDialog open={dialogOpen} onOpenChange={setDialogOpen} resource={editing} onSave={save} />
    </div>
  );
}