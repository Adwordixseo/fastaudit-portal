import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export default function TeamTaskAssignDialog({ open, onOpenChange, projects, onSaved }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: team = [] } = useQuery({ queryKey: ['team-access'], queryFn: () => base44.entities.TeamAccess.list() });
  const [form, setForm] = useState({ project_id: '', title: '', description: '', assigned_to_email: '', deadline: '', priority: 'medium' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setForm({ project_id: '', title: '', description: '', assigned_to_email: '', deadline: '', priority: 'medium' }); }, [open]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.project_id || !form.title.trim() || !form.assigned_to_email.trim()) { toast({ title: 'Project, title and assignee are required', variant: 'destructive' }); return; }
    const project = projects.find((p) => p.id === form.project_id);
    setSaving(true);
    try {
      await base44.entities.TeamTask.create({
        title: form.title.trim(),
        description: form.description,
        project_id: project.id,
        project_name: project.name,
        assigned_to_email: form.assigned_to_email.trim(),
        assigned_by_email: user?.email,
        assigned_by_name: user?.full_name,
        deadline: form.deadline,
        priority: form.priority,
        status: 'todo',
      });
      onSaved();
      onOpenChange(false);
    } catch (e) { toast({ title: 'Failed to assign task', variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Assign task</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Project</Label>
            <Select value={form.project_id} onValueChange={(v) => set('project_id', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select project" /></SelectTrigger>
              <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Title</Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Task title" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Optional details" className="mt-1" rows={2} />
          </div>
          <div>
            <Label className="text-xs">Assign to (team member email)</Label>
            <Input list="team-emails-dash" value={form.assigned_to_email} onChange={(e) => set('assigned_to_email', e.target.value)} placeholder="teammate@example.com" className="mt-1" />
            <datalist id="team-emails-dash">{team.map((t) => <option key={t.id} value={t.email} />)}</datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Deadline</Label>
              <Input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <Select value={form.priority} onValueChange={(v) => set('priority', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? 'Assigning...' : 'Assign task'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}