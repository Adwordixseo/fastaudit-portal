import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export default function TeamTaskDialog({ open, onOpenChange, project, team, onSaved }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ title: '', description: '', assigned_to_email: '', deadline: '', priority: 'medium' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setForm({ title: '', description: '', assigned_to_email: '', deadline: '', priority: 'medium' }); }, [open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title.trim() || !form.assigned_to_email.trim()) { toast({ title: 'Title and assignee are required', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      await base44.entities.TeamTask.create({
        ...form,
        project_id: project.id,
        project_name: project.name,
        assigned_by_email: user?.email,
        assigned_by_name: user?.full_name,
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
        <DialogHeader><DialogTitle>Assign task · {project?.name}</DialogTitle></DialogHeader>
        <div className="space-y-3">
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
            <Input list="team-emails" value={form.assigned_to_email} onChange={(e) => set('assigned_to_email', e.target.value)} placeholder="teammate@example.com" className="mt-1" />
            <datalist id="team-emails">{team.map((t) => <option key={t.id} value={t.email} />)}</datalist>
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