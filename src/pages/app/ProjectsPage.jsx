import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Globe, ArrowRight, List, CalendarDays, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import { useSubscription } from '@/hooks/useSubscription';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import ProjectProgressCard from '@/components/dashboard/ProjectProgressCard';
import AddWebsiteDialog from '@/components/dashboard/AddWebsiteDialog';
import MilestoneList from '@/components/projects/MilestoneList';
import ProjectCalendar from '@/components/projects/ProjectCalendar';
import StatusBadge from '@/components/ui/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import ExportButtons from '@/components/portal/ExportButtons';
import { fmtDate, fmtMonth } from '@/lib/format';

export default function ProjectsPage() {
  const { user } = useUser();
  const uid = user?.id;
  const [selectedId, setSelectedId] = useState(new URLSearchParams(window.location.search).get('id'));
  const [view, setView] = useState('list');
  const [addSlot, setAddSlot] = useState(null);
  const { data: projects = [] } = useQuery({ queryKey: ['projects', uid], queryFn: () => base44.entities.Project.filter({ client_id: uid }, '-updated_date'), enabled: !!uid });
  const { data: milestones = [] } = useQuery({ queryKey: ['milestones', uid], queryFn: async () => (await Promise.all(projects.map((p) => base44.entities.Milestone.filter({ project_id: p.id }, 'due_date')))).flat(), enabled: projects.length > 0 });
  const { data: docs = [] } = useQuery({ queryKey: ['documents', uid], queryFn: () => base44.entities.Document.filter({ client_id: uid }, '-created_date'), enabled: !!uid });
  const qc = useQueryClient();
  const { activeSubscriptions } = useSubscription();
  const linkedProjectIds = activeSubscriptions.map((s) => s.project_id).filter(Boolean);
  const activeProjects = projects.filter((p) => linkedProjectIds.includes(p.id));
  const availableSlots = activeSubscriptions.filter((s) => !activeProjects.find((p) => p.id === s.project_id));
  const refresh = () => { qc.invalidateQueries({ queryKey: ['projects', uid] }); qc.invalidateQueries({ queryKey: ['subscriptions'] }); };
  const project = activeProjects.find((p) => p.id === selectedId) || activeProjects[0];

  if (activeProjects.length === 0 && availableSlots.length === 0) return (
    <div><PageHeader eyebrow="Projects" title="Your projects" />
      <EmptyState icon={FolderKanban} title="No projects yet" text="Choose a package and add your first website to get started." action={<Button asChild className="rounded-full"><Link to="/app/packages">Browse packages</Link></Button>} /></div>
  );

  const pm = milestones.filter((m) => m.project_id === project?.id);
  const pd = docs.filter((d) => d.project_id === project?.id);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Projects" title="Your projects" description="Each project has its own progress, milestones and deliverables."
        action={
          <div className="flex items-center gap-2"><ExportButtons data={activeProjects} filename="projects" title="My Projects" headers={[{ key: 'name', label: 'Project' }, { key: 'website', label: 'Website' }, { key: 'status', label: 'Status' }, { key: 'progress', label: 'Progress %' }, { key: 'created_date', label: 'Started' }]} />
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
            <button onClick={() => setView('list')} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}><List className="h-4 w-4" /> List</button>
            <button onClick={() => setView('calendar')} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${view === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}><CalendarDays className="h-4 w-4" /> Calendar</button>
          </div></div>
        } />
      {activeSubscriptions.length > 0 && (
        <div className="flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/40 px-4 py-2.5 text-sm">
          <span className="font-semibold text-indigo-700">{activeProjects.length} of {activeSubscriptions.length}</span>
          <span className="text-slate-600">website slot{activeSubscriptions.length !== 1 ? 's' : ''} in use</span>
          {availableSlots.length > 0 && <span className="text-slate-500">· {availableSlots.length} available to add</span>}
        </div>
      )}
      {view === 'calendar' ? (
        <ProjectCalendar milestones={milestones} documents={docs} projects={activeProjects} />
      ) : (
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
                {activeProjects.map((p) => <ProjectProgressCard key={p.id} project={p} milestones={milestones.filter((m) => m.project_id === p.id)} onClick={() => setSelectedId(p.id)} />)}
                {availableSlots.map((s) => (
                  <button key={s.id} onClick={() => setAddSlot(s)} className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-50 text-indigo-600"><Plus className="h-5 w-5" /></div>
                    <div><p className="text-sm font-semibold text-slate-700">Add website</p><p className="text-xs text-slate-400">{s.package_name} slot available</p></div>
                  </button>
                ))}
              </div>
        {project && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>{project.website && <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><Globe className="h-3.5 w-3.5" /> {project.website}</p>}</div>
                <StatusBadge status={project.status} />
              </div>
              {project.description && <p className="mt-4 text-sm text-slate-600">{project.description}</p>}
              <div className="mt-6 flex items-center justify-between text-sm"><span className="text-slate-500">Overall progress</span><span className="font-semibold text-slate-900">{project.progress || 0}%</span></div>
              <Progress value={project.progress || 0} className="mt-2 h-2.5" />
              <p className="mt-2 text-xs text-slate-400">Started {fmtDate(project.created_date)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-900">Milestones ({pm.filter((m) => m.status === 'done').length}/{pm.length} done)</h3>
              <MilestoneList milestones={pm} />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between"><h3 className="text-base font-semibold text-slate-900">Deliverables</h3><Link to="/app/reports" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600">Open reports <ArrowRight className="h-3.5 w-3.5" /></Link></div>
              {pd.length === 0 ? <p className="text-sm text-slate-500">No documents uploaded for this project yet.</p> : (
                <ul className="divide-y divide-slate-100">{pd.slice(0, 6).map((d) => <li key={d.id} className="flex items-center justify-between py-2.5 text-sm"><span className="truncate text-slate-800">{d.title} <span className="text-slate-400">· {fmtMonth(d.report_month)}</span></span><StatusBadge status={d.status} /></li>)}</ul>
              )}
            </div>
          </div>
        )}
      </div>
      )}
      <AddWebsiteDialog open={!!addSlot} onOpenChange={(o) => !o && setAddSlot(null)} subscription={addSlot} onDone={refresh} />
    </div>
  );
}