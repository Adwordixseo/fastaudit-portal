import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function ShareProjectDialog({ open, onOpenChange, project, onShared }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const share = async (e) => {
    e.preventDefault();
    if (!project) return;
    const target = email.trim().toLowerCase();
    if (!target) return;
    setSaving(true);
    try {
      await base44.entities.ProjectAccess.create({
        project_id: project.id,
        project_name: project.name,
        client_id: project.client_id,
        client_email: project.client_email,
        email: target,
        name: name.trim() || undefined,
        status: 'invited',
      });
      // They set their own password from the invite email, then land in this client portal.
      try {
        await base44.users.inviteUser(target, 'user');
        toast.success(`Access shared with ${target} — invite email sent`);
      } catch {
        toast.success(`Access shared with ${target}`);
      }
      setEmail('');
      setName('');
      onShared?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || 'Could not share this project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle>Share project with your team</DialogTitle>
          <DialogDescription>
            Give a team member access to {project?.name || 'this project'}. They sign in with this email and see it in the client portal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={share} className="space-y-4">
          <div>
            <Label>Team member email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="mt-1.5" />
          </div>
          <div>
            <Label>Name <span className="text-xs font-normal text-slate-400">(optional)</span></Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya, SEO lead" className="mt-1.5" />
          </div>
          <Button type="submit" disabled={saving} className="w-full rounded-xl">{saving ? 'Sharing…' : 'Share access'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}