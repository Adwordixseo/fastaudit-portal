import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Upload, Globe, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import StatCard from '@/components/portal/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import TeamUploadDialog from '@/components/team/TeamUploadDialog';
import ExportButtons from '@/components/portal/ExportButtons';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fmtDate } from '@/lib/format';

export default function TeamDashboard() {
  const qc = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['admin-projects'], queryFn: () => base44.entities.Project.list('-updated_date') });
  const { data: docs = [] } = useQuery({ queryKey: ['admin-docs'], queryFn: () => base44.entities.Document.list('-created_date') });

  const active = projects.filter((p) => p.status === 'active');
  const filtered = projects.filter((p) => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.client_email?.toLowerCase().includes(search.toLowerCase()));
  const pendingApprovals = docs.filter((d) => d.status === 'awaiting_approval').length;

  const refresh = () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); qc.invalidateQueries({ queryKey: ['admin-docs'] }); };
  const saveStatus = async (id, val) => { await base44.entities.Project.update(id, { status: val }); refresh(); };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Team" title="Dashboard" description="Manage active projects, upload deliverables and attach review links for client approval."
        action={<div className="flex items-center gap-2"><ExportButtons data={projects} filename="team-projects" title="Team Projects" headers={[{ key: 'name', label: 'Project' }, { key: 'client_email', label: 'Client' }, { key: 'website', label: 'Website' }, { key: 'status', label: 'Status' }, { key: 'progress', label: 'Progress %' }]} /><Button onClick={() => setUploadOpen(true)} className="rounded-full"><Upload className="mr-2 h-4 w-4" /> Share deliverable</Button></div>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FolderKanban} label="Active projects" value={active.length} hint={`${projects.length} total`} />
        <StatCard icon={Upload} label="Pending approvals" value={pendingApprovals} hint="Awaiting client review" tone="amber" />
        <StatCard icon={Search} label="Deliverables shared" value={docs.length} hint="All time" tone="violet" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects or clients..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects found" text={projects.length ? 'Try a different search.' : 'No projects have been created yet.'} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((p) => {
            const pdocs = docs.filter((d) => d.project_id === p.id);
            const pending = pdocs.filter((d) => d.status === 'awaiting_approval').length;
            return (
              <div key={p.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">{p.name}</h3>
                    {p.website && <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Globe className="h-3 w-3" /> {p.website}</p>}
                    <p className="mt-0.5 text-xs text-slate-400">{p.client_email}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                {p.description && <p className="mt-3 line-clamp-2 text-sm text-slate-600">{p.description}</p>}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>Progress</span><span className="font-semibold text-slate-900">{p.progress || 0}%</span></div>
                <Progress value={p.progress || 0} className="mt-1.5 h-2" />
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Status</span>
                  <Select value={p.status} onValueChange={(v) => saveStatus(p.id, v)}>
                    <SelectTrigger className="h-8 w-36 rounded-full text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_hold">On hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">{pdocs.length} deliverables{pending > 0 && <span className="text-amber-600"> · {pending} pending</span>}</span>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => setUploadOpen(true)}><Upload className="mr-1.5 h-3.5 w-3.5" /> Upload</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TeamUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} projects={projects} onSaved={refresh} />
    </div>
  );
}