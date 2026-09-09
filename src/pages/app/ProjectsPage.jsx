import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FolderKanban, Globe, ArrowRight, List, CalendarDays } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import ProjectProgressCard from '@/components/dashboard/ProjectProgressCard';
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
  const { data: projects = [] } = useQuery({ queryKey: ['projects', uid], queryFn: () => base44.entities.Project.filter({ client_id: uid }, '-updated_date'), enabled: !!uid });
  const { data: milestones = [] } = useQuery({ queryKey: ['milestones', uid], queryFn: async () => (await Promise.all(projects.map((p) => base44.entities.Milestone.filter({ project_id: p.id }, 'due_date')))).flat(), enabled: projects.length > 0 });
  const { data: docs = [] } = useQuery({ queryKey: ['documents', uid], queryFn: () => base44.entities.Document.filter({ client_id: uid }, '-created_date'), enabled: !!uid });
  const project = projects.find((p) => p.id === selectedId) || projects[0];

  if (projects.length === 0) return (
    <div><PageHeader eyebrow="Projects" title="Your projects" />
      <EmptyState icon={FolderKanban} title="No projects yet" text="Choose a package and our team will set up your first project dashboard." action={<Button asChild className="rounded-full"><Link to="/app/packages">Browse packages</Link></Button>} /></div>
  );

  const pm = milestones.filter((m) => m.project_id === project?.id);
  const pd = docs.filter((d) => d.project_id === project?.id);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Projects" title="Your projects" description="Each project has its own progress, milestones and deliverables."
        action={
          <div className="flex items-center gap-2"><ExportButtons data={projects} filename="projects" title="My Projects" headers={[{ key: 'name', label: 'Project' }, { key: 'website', label: 'Website' }, { key: 'status', label: 'Status' }, { key: 'progress', label: 'Progress %' }, { key: 'created_date', label: 'Started' }]} />
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
            <button onClick={() => setView('list')} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}><List className="h-4 w-4" /> List</button>
            <button onClick={() => setView('calendar')} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${view === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}><CalendarDays className="h-4 w-4" /> Calendar</button>
          </div></div>
        } />
      {view === 'calendar' ? (
        <ProjectCalendar milestones={milestones} documents={docs} projects={projects} />
      ) : (
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">{projects.map((p) => <ProjectProgressCard key={p.id} project={p} milestones={milestones.filter((m) => m.project_id === p.id)} onClick={() => setSelectedId(p.id)} />)}</div>
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
    </div>
  );
}