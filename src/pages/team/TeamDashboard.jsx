import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Upload, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import StatCard from '@/components/portal/StatCard';
import TeamUploadDialog from '@/components/team/TeamUploadDialog';
import ProjectKanban from '@/components/team/ProjectKanban';
import ExportButtons from '@/components/portal/ExportButtons';
import { Button } from '@/components/ui/button';

export default function TeamDashboard() {
  const qc = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['admin-projects'], queryFn: () => base44.entities.Project.list('-updated_date') });
  const { data: docs = [] } = useQuery({ queryKey: ['admin-docs'], queryFn: () => base44.entities.Document.list('-created_date') });

  const inProgress = projects.filter((p) => p.status === 'in_progress');
  const filtered = projects.filter((p) => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.client_email?.toLowerCase().includes(search.toLowerCase()));
  const pendingApprovals = docs.filter((d) => d.status === 'awaiting_approval').length;

  const refresh = () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); qc.invalidateQueries({ queryKey: ['admin-docs'] }); };
  const saveStatus = async (id, val) => { await base44.entities.Project.update(id, { status: val }); refresh(); };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Team" title="Dashboard" description="Manage active projects, upload deliverables and attach review links for client approval."
        action={<div className="flex items-center gap-2"><ExportButtons data={projects} filename="team-projects" title="Team Projects" headers={[{ key: 'name', label: 'Project' }, { key: 'client_email', label: 'Client' }, { key: 'website', label: 'Website' }, { key: 'status', label: 'Status' }, { key: 'progress', label: 'Progress %' }]} /><Button onClick={() => setUploadOpen(true)} className="rounded-full"><Upload className="mr-2 h-4 w-4" /> Share deliverable</Button></div>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FolderKanban} label="In progress" value={inProgress.length} hint={`${projects.length} total`} />
        <StatCard icon={Upload} label="Pending approvals" value={pendingApprovals} hint="Awaiting client review" tone="amber" />
        <StatCard icon={Search} label="Deliverables shared" value={docs.length} hint="All time" tone="violet" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects or clients..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" text="No projects have been created yet." />
      ) : (
        <ProjectKanban projects={filtered} onMove={saveStatus} />
      )}

      <TeamUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} projects={projects} onSaved={refresh} />
    </div>
  );
}