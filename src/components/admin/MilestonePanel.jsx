import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MilestoneList from '@/components/projects/MilestoneList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const next = { pending: 'in_progress', in_progress: 'done', done: 'pending' };

export default function MilestonePanel({ project }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const { data: milestones = [] } = useQuery({ queryKey: ['milestones', 'project', project.id], queryFn: () => base44.entities.Milestone.filter({ project_id: project.id }, 'due_date') });
  const refresh = () => qc.invalidateQueries({ queryKey: ['milestones'] });

  const add = async (e) => { e.preventDefault(); await base44.entities.Milestone.create({ project_id: project.id, title: title.trim(), due_date: due || undefined, status: 'pending' }); setTitle(''); setDue(''); refresh(); };
  const toggle = async (m) => { await base44.entities.Milestone.update(m.id, { status: next[m.status] }); refresh(); };
  const remove = async (m) => { await base44.entities.Milestone.delete(m.id); refresh(); };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h3 className="text-base font-semibold text-slate-900">Milestones · {project.name}</h3>
      <p className="mt-1 text-xs text-slate-500">Click a milestone's icon to move it pending → in progress → done.</p>
      <form onSubmit={add} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New milestone, e.g. Technical SEO fixes" />
        <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="sm:w-44" />
        <Button type="submit" className="rounded-xl"><Plus className="h-4 w-4" /></Button>
      </form>
      <div className="mt-4 space-y-2">
        <MilestoneList milestones={milestones} onToggle={toggle} />
        {milestones.length > 0 && <div className="flex flex-wrap gap-2 pt-2">{milestones.map((m) => <button key={m.id} onClick={() => remove(m)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 hover:border-rose-200 hover:text-rose-600"><Trash2 className="h-3 w-3" /> {m.title}</button>)}</div>}
      </div>
    </div>
  );
}