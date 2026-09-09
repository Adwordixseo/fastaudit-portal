import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Search, Upload, Globe, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';
import MilestonePanel from '@/components/admin/MilestonePanel';
import TeamUploadDialog from '@/components/team/TeamUploadDialog';
import TeamTaskPanel from '@/components/team/TeamTaskPanel';
import ExportButtons from '@/components/portal/ExportButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fmtDate, fileTypeFromName } from '@/lib/format';

export default function TeamProjects() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { data: projects = [] } = useQuery({ queryKey: ['admin-projects'], queryFn: () => base44.entities.Project.list('-updated_date') });
  const { data: docs = [] } = useQuery({ queryKey: ['admin-docs'], queryFn: () => base44.entities.Document.list('-created_date') });

  const filtered = projects.filter((p) => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.client_email?.toLowerCase().includes(search.toLowerCase()));
  const selected = projects.find((p) => p.id === selectedId) || filtered[0] || null;
  const sdocs = selected ? docs.filter((d) => d.project_id === selected.id) : [];

  const refresh = () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); qc.invalidateQueries({ queryKey: ['admin-docs'] }); };

  const saveProgress = async (val) => { if (!selected) return; await base44.entities.Project.update(selected.id, { progress: Number(val) || 0 }); refresh(); };
  const saveStatus = async (val) => { if (!selected) return; await base44.entities.Project.update(selected.id, { status: val }); refresh(); };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Team" title="Projects" description="Track progress, manage milestones and share deliverables with clients."
        action={<div className="flex items-center gap-2">
          <ExportButtons data={projects} filename="team-projects" title="Team Projects" headers={[{ key: 'name', label: 'Project' }, { key: 'client_email', label: 'Client' }, { key: 'website', label: 'Website' }, { key: 'status', label: 'Status' }, { key: 'progress', label: 'Progress %' }]} />
          <Button onClick={() => setUploadOpen(true)} className="rounded-full"><Upload className="mr-2 h-4 w-4" /> Share deliverable</Button>
        </div>} />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Project list */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
          </div>
          <div className="space-y-2.5">
            {filtered.length === 0 ? (
              <EmptyState icon={FolderKanban} title="No projects" text="No projects match your search." />
            ) : filtered.map((p) => {
              const pdocs = docs.filter((d) => d.project_id === p.id);
              const pending = pdocs.filter((d) => d.status === 'awaiting_approval').length;
              const active = selected?.id === p.id;
              return (
                <button key={p.id} onClick={() => setSelectedId(p.id)} className={`w-full rounded-2xl border p-4 text-left transition ${active ? 'border-indigo-300 bg-indigo-50/60 ring-1 ring-indigo-200' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{p.name}</h3>
                    <ChevronRight className={`h-4 w-4 shrink-0 ${active ? 'text-indigo-500' : 'text-slate-300'}`} />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{p.client_email}</p>
                  <div className="mt-2 flex items-center justify-between"><StatusBadge status={p.status} /><span className="text-xs font-medium text-slate-700">{p.progress || 0}%</span></div>
                  {p.assigned_to_name && <p className="mt-1.5 truncate text-xs text-slate-500">Assigned to <span className="font-medium text-slate-700">{p.assigned_to_name}</span></p>}
                  {pending > 0 && <p className="mt-1.5 text-xs text-amber-600">{pending} deliverable{pending > 1 ? 's' : ''} pending approval</p>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project detail */}
        {selected ? (
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-slate-900">{selected.name}</h2>
                  {selected.website && <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Globe className="h-3 w-3" /> {selected.website}</p>}
                  <p className="mt-0.5 text-xs text-slate-400">Client: {selected.client_email}</p>
                  {selected.assigned_to_name && <p className="mt-0.5 text-xs text-slate-400">Assigned to: <span className="font-medium text-indigo-600">{selected.assigned_to_name}</span></p>}
                </div>
                <StatusBadge status={selected.status} />
              </div>
              {selected.description && <p className="mt-3 text-sm text-slate-600">{selected.description}</p>}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs text-slate-500">Progress (%)</Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Input type="number" min={0} max={100} defaultValue={selected.progress || 0} onBlur={(e) => saveProgress(e.target.value)} className="w-24" />
                    <Progress value={selected.progress || 0} className="h-2 flex-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Status</Label>
                  <Select value={selected.status} onValueChange={saveStatus}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="todo">To Do</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
                </div>
              </div>
            </div>

            <MilestonePanel project={selected} />
            <TeamTaskPanel project={selected} />

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Deliverables · {sdocs.length}</h3>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => setUploadOpen(true)}><Upload className="mr-1.5 h-3.5 w-3.5" /> Upload</Button>
              </div>
              <div className="mt-4 space-y-2.5">
                {sdocs.length === 0 ? (
                  <p className="text-sm text-slate-400">No deliverables shared yet.</p>
                ) : sdocs.map((d) => {
                  const approval = (d.history || []).find((h) => h.action === 'approved');
                  return (
                  <div key={d.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{d.title}</p>
                      <p className="text-xs text-slate-400">{fileTypeFromName(d.file_url || d.title)} · {fmtDate(d.created_date)}</p>
                      {d.status === 'approved' && approval && <p className="mt-0.5 text-xs font-medium text-emerald-600">✓ Approved by client{approval.by ? ` · ${approval.by}` : ''}{approval.date ? ` · ${fmtDate(approval.date)}` : ''}</p>}
                      {d.status === 'changes_requested' && <p className="mt-0.5 text-xs font-medium text-rose-600">Changes requested by client</p>}
                      {d.status === 'draft' && <p className="mt-0.5 text-xs text-slate-400">Internal draft — not shared with client</p>}
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState icon={FolderKanban} title="Select a project" text="Choose a project from the list to manage its milestones and deliverables." />
        )}
      </div>

      <TeamUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} projects={projects} onSaved={refresh} defaultProjectId={selected?.id} />
    </div>
  );
}