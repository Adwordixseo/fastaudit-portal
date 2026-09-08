import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import PackageDialog from '@/components/admin/PackageDialog';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { money } from '@/lib/format';

export default function AdminPackages() {
  const qc = useQueryClient();
  const [dialog, setDialog] = useState({ open: false, pkg: null });
  const { data: packages = [] } = useQuery({ queryKey: ['admin-packages'], queryFn: () => base44.entities.Package.list('sort_order') });
  const refresh = () => { qc.invalidateQueries({ queryKey: ['admin-packages'] }); qc.invalidateQueries({ queryKey: ['packages'] }); };

  const save = async (form) => { if (dialog.pkg) await base44.entities.Package.update(dialog.pkg.id, form); else await base44.entities.Package.create(form); setDialog({ open: false, pkg: null }); refresh(); toast.success('Package saved'); };
  const remove = async (p) => { if (!confirm(`Delete "${p.name}"?`)) return; await base44.entities.Package.delete(p.id); refresh(); };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Packages" description="Manage the service packages shown on the website and inside the portal." action={<Button onClick={() => setDialog({ open: true, pkg: null })} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> New package</Button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((p) => (
          <div key={p.id} className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="font-semibold text-slate-900">{p.name}</h3><p className="text-xs text-slate-500">{p.tagline}</p></div>
              <div className="flex gap-1"><button onClick={() => setDialog({ open: true, pkg: p })} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><Pencil className="h-4 w-4" /></button><button onClick={() => remove(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[['Monthly', p.price_monthly], ['Quarterly', p.price_quarterly], ['Yearly', p.price_yearly]].map(([l, v]) => <div key={l} className="rounded-xl bg-slate-50 p-2"><div className="font-heading text-lg font-bold text-slate-900">{money(v)}</div><div className="text-[10px] uppercase tracking-wide text-slate-400">{l}</div></div>)}
            </div>
            <ul className="mt-4 space-y-1 text-sm text-slate-600">{(p.features || []).slice(0, 4).map((f) => <li key={f}>• {f}</li>)}{(p.features || []).length > 4 && <li className="text-xs text-slate-400">+{p.features.length - 4} more</li>}</ul>
            <div className="mt-4 flex gap-2">{p.highlight && <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">Most popular</span>}<StatusBadge status={p.active ? 'active' : 'inactive'} /></div>
          </div>
        ))}
      </div>
      <PackageDialog open={dialog.open} pkg={dialog.pkg} onOpenChange={(o) => setDialog({ open: o, pkg: o ? dialog.pkg : null })} onSave={save} />
    </div>
  );
}