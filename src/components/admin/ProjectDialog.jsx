import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const empty = { name: '', website: '', client_id: '', status: 'active', progress: 0, description: '' };

export default function ProjectDialog({ open, onOpenChange, project, users, onSave }) {
  const [form, setForm] = useState(empty);
  useEffect(() => { setForm(project ? { ...empty, ...project } : empty); }, [project, open]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e) => { e.preventDefault(); const client = users.find((u) => u.id === form.client_id); onSave({ ...form, progress: Number(form.progress) || 0, client_email: client?.email || form.client_email }); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl">
        <DialogHeader><DialogTitle>{project ? 'Edit project' : 'New project'}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div><Label>Project name</Label><Input required value={form.name} onChange={(e) => set('name')(e.target.value)} className="mt-1.5" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Website</Label><Input value={form.website} onChange={(e) => set('website')(e.target.value)} placeholder="https://" className="mt-1.5" /></div>
            <div><Label>Client</Label>
              <Select value={form.client_id} onValueChange={set('client_id')}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>{users.map((u) => <SelectItem key={u.id} value={u.id}>{u.full_name || u.email}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Status</Label>
              <Select value={form.status} onValueChange={set('status')}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="on_hold">On hold</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select></div>
            <div><Label>Progress (%)</Label><Input type="number" min={0} max={100} value={form.progress} onChange={(e) => set('progress')(e.target.value)} className="mt-1.5" /></div>
          </div>
          <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => set('description')(e.target.value)} className="mt-1.5" /></div>
          <Button type="submit" disabled={!form.client_id} className="w-full rounded-xl">{project ? 'Save changes' : 'Create project'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}