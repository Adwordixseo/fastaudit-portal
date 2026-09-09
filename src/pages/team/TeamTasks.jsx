import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ListTodo, Plus, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import TeamTaskKanban from '@/components/team/TeamTaskKanban';
import TeamTaskAssignDialog from '@/components/team/TeamTaskAssignDialog';
import { Button } from '@/components/ui/button';

export default function TeamTasks() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [assignOpen, setAssignOpen] = useState(false);
  const { data: projects = [] } = useQuery({ queryKey: ['admin-projects'], queryFn: () => base44.entities.Project.list('-updated_date') });
  const { data: tasks = [] } = useQuery({ queryKey: ['team-tasks'], queryFn: () => base44.entities.TeamTask.list('-updated_date') });

  const q = search.trim().toLowerCase();
  const filteredTasks = useMemo(() => tasks.filter((t) => !q || (t.assigned_to_email || '').toLowerCase().includes(q) || (t.assigned_to_name || '').toLowerCase().includes(q)), [tasks, q]);

  const saveTaskStatus = async (id, status) => { await base44.entities.TeamTask.update(id, { status }); qc.invalidateQueries({ queryKey: ['team-tasks'] }); };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Team" title="Tasks" description="View and filter tasks assigned across the team by name or email."
        action={<Button onClick={() => setAssignOpen(true)} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Assign task</Button>} />

      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2">
        <Search className="h-4 w-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by team member name or email..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
      </div>

      {tasks.length === 0 ? (
        <EmptyState icon={ListTodo} title="No tasks yet" text="Assign a task to get started." action={projects.length > 0 ? <Button onClick={() => setAssignOpen(true)} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Assign task</Button> : null} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState icon={ListTodo} title="No tasks match" text="No tasks are assigned to that team member." />
      ) : (
        <TeamTaskKanban tasks={filteredTasks} onMove={saveTaskStatus} />
      )}

      <TeamTaskAssignDialog open={assignOpen} onOpenChange={setAssignOpen} projects={projects} onSaved={() => qc.invalidateQueries({ queryKey: ['team-tasks'] })} />
    </div>
  );
}