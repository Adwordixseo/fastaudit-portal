import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ListTodo, Plus, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/portal/EmptyState';
import TeamTaskDialog from './TeamTaskDialog';
import TeamTaskCard from './TeamTaskCard';

export default function TeamTaskPanel({ project }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: tasks = [] } = useQuery({
    queryKey: ['team-tasks', project?.id],
    queryFn: () => base44.entities.TeamTask.filter({ project_id: project.id }, '-created_date'),
    enabled: !!project,
  });
  const { data: team = [] } = useQuery({ queryKey: ['team-access'], queryFn: () => base44.entities.TeamAccess.list() });
  const refresh = () => qc.invalidateQueries({ queryKey: ['team-tasks'] });
  if (!project) return null;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-slate-900">Team tasks · {tasks.length}</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"><Clock className="h-3 w-3" /> {tasks.reduce((a, t) => a + (t.hours_logged || 0), 0).toFixed(1)}h total</span>
        </div>
        <Button size="sm" className="rounded-full" onClick={() => setOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> Assign task</Button>
      </div>
      <div className="mt-4 space-y-3">
        {tasks.length === 0 ? (
          <EmptyState icon={ListTodo} title="No tasks yet" text="Assign a task to a teammate with a deadline and priority." />
        ) : tasks.map((t) => (
          <TeamTaskCard key={t.id} task={t} onSaved={refresh} />
        ))}
      </div>
      <TeamTaskDialog open={open} onOpenChange={setOpen} project={project} team={team} onSaved={refresh} />
    </div>
  );
}