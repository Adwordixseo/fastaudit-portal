import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Upload, Search, ListTodo, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import StatCard from '@/components/portal/StatCard';
import TeamUploadDialog from '@/components/team/TeamUploadDialog';
import ProjectKanban from '@/components/team/ProjectKanban';
import TeamTaskKanban from '@/components/team/TeamTaskKanban';
import TeamActivityFeed from '@/components/team/TeamActivityFeed';
import WeeklyTaskCompletionChart from '@/components/team/WeeklyTaskCompletionChart';
import TeamTaskAssignDialog from '@/components/team/TeamTaskAssignDialog';
import ExportButtons from '@/components/portal/ExportButtons';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TeamDashboard() {
  const qc = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [assignOpen, setAssignOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [dueFilter, setDueFilter] = useState('all');
  const { data: projects = [] } = useQuery({ queryKey: ['admin-projects'], queryFn: () => base44.entities.Project.list('-updated_date') });
  const { data: docs = [] } = useQuery({ queryKey: ['admin-docs'], queryFn: () => base44.entities.Document.list('-created_date') });
  const { data: tasks = [] } = useQuery({ queryKey: ['team-tasks'], queryFn: () => base44.entities.TeamTask.list('-updated_date') });

  const inProgress = projects.filter((p) => p.status === 'in_progress');
  const filtered = projects.filter((p) => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.client_email?.toLowerCase().includes(search.toLowerCase()));
  const assignees = useMemo(() => { const map = new Map(); tasks.forEach((t) => { if (t.assigned_to_email) map.set(t.assigned_to_email, t.assigned_to_name || t.assigned_to_email); }); return [...map.entries()]; }, [tasks]);
  const dueMatch = (t) => {
    if (dueFilter === 'all') return true;
    if (dueFilter === 'none') return !t.deadline;
    if (!t.deadline) return false;
    const d = new Date(t.deadline); d.setHours(0, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = (d - today) / 86400000;
    if (dueFilter === 'overdue') return diff < 0;
    if (dueFilter === 'this_week') return diff >= 0 && diff <= 7;
    if (dueFilter === 'next_week') return diff > 7 && diff <= 14;
    return true;
  };
  const filteredTasks = tasks.filter((t) => (priorityFilter === 'all' || t.priority === priorityFilter) && (assigneeFilter === 'all' || t.assigned_to_email === assigneeFilter) && dueMatch(t));
  const pendingApprovals = docs.filter((d) => d.status === 'awaiting_approval').length;

  const refresh = () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); qc.invalidateQueries({ queryKey: ['admin-docs'] }); };
  const saveStatus = async (id, val) => { await base44.entities.Project.update(id, { status: val }); refresh(); };
  const saveTaskStatus = async (id, status) => { await base44.entities.TeamTask.update(id, { status }); qc.invalidateQueries({ queryKey: ['team-tasks'] }); };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Team" title="Dashboard" description="Manage active projects, upload deliverables and attach review links for client approval."
        action={<div className="flex items-center gap-2"><ExportButtons data={projects} filename="team-projects" title="Team Projects" headers={[{ key: 'name', label: 'Project' }, { key: 'client_email', label: 'Client' }, { key: 'website', label: 'Website' }, { key: 'status', label: 'Status' }, { key: 'progress', label: 'Progress %' }]} /><Button onClick={() => setUploadOpen(true)} className="rounded-full"><Upload className="mr-2 h-4 w-4" /> Share deliverable</Button></div>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FolderKanban} label="In progress" value={inProgress.length} hint={`${projects.length} total`} />
        <StatCard icon={Upload} label="Pending approvals" value={pendingApprovals} hint="Awaiting client review" tone="amber" />
        <StatCard icon={Search} label="Deliverables shared" value={docs.length} hint="All time" tone="violet" />
      </div>

      <WeeklyTaskCompletionChart tasks={tasks} />

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

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Task board</h2>
          {projects.length > 0 && <Button onClick={() => setAssignOpen(true)} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Assign task</Button>}
        </div>
        {tasks.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40 rounded-full"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-48 rounded-full"><SelectValue placeholder="Assignee" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All team members</SelectItem>
                {assignees.map(([email, name]) => <SelectItem key={email} value={email}>{name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={dueFilter} onValueChange={setDueFilter}>
              <SelectTrigger className="w-44 rounded-full"><SelectValue placeholder="Due date" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All due dates</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="this_week">Due this week</SelectItem>
                <SelectItem value="next_week">Due next week</SelectItem>
                <SelectItem value="none">No deadline</SelectItem>
              </SelectContent>
            </Select>
            {(priorityFilter !== 'all' || assigneeFilter !== 'all' || dueFilter !== 'all') && <Button variant="ghost" size="sm" className="rounded-full" onClick={() => { setPriorityFilter('all'); setAssigneeFilter('all'); setDueFilter('all'); }}>Clear</Button>}
          </div>
        )}
        {tasks.length === 0 ? (
          <EmptyState icon={ListTodo} title="No tasks yet" text="Assign a task to get started." action={projects.length > 0 ? <Button onClick={() => setAssignOpen(true)} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Assign task</Button> : null} />
        ) : filteredTasks.length === 0 ? (
          <EmptyState icon={ListTodo} title="No tasks match" text="Try adjusting the filters." />
        ) : (
          <TeamTaskKanban tasks={filteredTasks} onMove={saveTaskStatus} />
        )}
      </section>

      <TeamActivityFeed projects={projects} tasks={tasks} docs={docs} />

      <TeamTaskAssignDialog open={assignOpen} onOpenChange={setAssignOpen} projects={projects} onSaved={() => qc.invalidateQueries({ queryKey: ['team-tasks'] })} />
      <TeamUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} projects={projects} onSaved={refresh} />
    </div>
  );
}