import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import ProjectDialog from '@/components/admin/ProjectDialog';
import MilestonePanel from '@/components/admin/MilestonePanel';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import ExportButtons from '@/components/portal/ExportButtons';

export default function AdminProjects() {
  const qc = useQueryClient();
  const [dialog, setDialog] = useState({ open: false, project: null });
  const [selectedId, setSelectedId] = useState(null);
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => base44.entities.User.list() });
  const { data: projects = [] } = useQuery({ queryKey: ['admin-projects'], queryFn: () => base44.entities.Project.list('-updated_date') });
  const selected = projects.find((p) => p.id === selectedId) || projects[0];
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-projects'] });

  const save = async (form) => {
    if (dialog.project) await base44.entities.Project.update(dialog.project.id, form); else await base44.entities.Project.create(form);
    setDialog({ open: false, project: null }); refresh(); toast.success('Project saved');
  };
  const remove = async (p) => { if (!confirm(`Delete "${p.name}"?`)) return; await base44.entities.Project.delete(p.id); refresh(); };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Projects" description="Track every client project, its status and milestones." action={<div className="flex items-center gap-2"><ExportButtons data={projects} filename="admin-projects" title="All Projects" headers={[{ key: 'name', label: 'Project' }, { key: 'client_email', label: 'Client' }, { key: 'website', label: 'Website' }, { key: 'status', label: 'Status' }, { key: 'progress', label: 'Progress %' }]} /><Button onClick={() => setDialog({ open: true, project: null })} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> New project</Button></div>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="space-y-3">
          {projects.length === 0 && <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No projects yet. Create one and assign it to a client.</p>}
          {projects.map((p) => (
            <div key={p.id} onClick={() => setSelectedId(p.id)} className={cn('cursor-pointer rounded-3xl border bg-white p-5 transition', selected?.id === p.id ? 'border-indigo-300 shadow-lg shadow-indigo-500/10' : 'border-slate-200 hover:border-indigo-200')}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><h3 className="font-semibold text-slate-900">{p.name}</h3><p className="truncate text-xs text-slate-500">{p.client_email} {p.website && `· ${p.website}`}</p></div>
                <div className="flex items-center gap-1.5"><StatusBadge status={p.status} />
                  <button onClick={(e) => { e.stopPropagation(); setDialog({ open: true, project: p }); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><Pencil className="h-4 w-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); remove(p); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div>
              </div>
              <div className="mt-4 flex items-center gap-3"><Progress value={p.progress || 0} className="h-2" /><span className="text-xs font-semibold text-slate-700">{p.progress || 0}%</span></div>
            </div>
          ))}
        </div>
        {selected && <MilestonePanel key={selected.id} project={selected} />}
      </div>
      <ProjectDialog open={dialog.open} project={dialog.project} users={users} onOpenChange={(o) => setDialog({ open: o, project: o ? dialog.project : null })} onSave={save} />
    </div>
  );
}