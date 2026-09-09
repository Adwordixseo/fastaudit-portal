import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

export default function InviteUserDialog({ open, onOpenChange, defaultRole = 'user' }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [saving, setSaving] = useState(false);
  const invite = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await base44.users.inviteUser(email.trim(), role); toast.success(`Invitation sent to ${email}`); setEmail(''); setRole(defaultRole); onOpenChange(false); }
    catch (err) { toast.error(err.message || 'Could not send invite'); }
    setSaving(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader><DialogTitle>Invite a user</DialogTitle><DialogDescription>They'll receive an email invitation to join the portal.</DialogDescription></DialogHeader>
        <form onSubmit={invite} className="space-y-4">
          <div><Label>Email address</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="mt-1.5" /></div>
          <div><Label>Role</Label>
            <Select value={role} onValueChange={setRole}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="user">Client — access client portal</SelectItem><SelectItem value="team">Team — access team panel</SelectItem></SelectContent></Select></div>
          <Button type="submit" disabled={saving} className="w-full rounded-xl">Send invitation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}