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
    e.preventDefault();
    setSaving(true);
    const targetEmail = email.trim();
    // The platform invite API only accepts "user" or "admin".
    // Team members are invited as "user" and flagged via is_team_member.
    const inviteRole = role === 'team' ? 'user' : role;
    try {
      await base44.users.inviteUser(targetEmail, inviteRole);
      let teamGranted = false;
      if (role === 'team') {
        // Persist the team designation at invite time (the User record may not exist yet).
        try { await base44.entities.TeamAccess.create({ email: targetEmail, invited_by: 'team' }); } catch { /* may already exist */ }
        try {
          const matches = await base44.entities.User.filter({ email: targetEmail });
          const u = matches[0];
          if (u) { await base44.entities.User.update(u.id, { is_team_member: true }); teamGranted = true; }
        } catch {
          /* user record may appear after they accept; flag is backfilled on next login via TeamAccess */
        }
      }
      toast.success(
        role === 'team'
          ? (teamGranted ? `Invitation sent to ${targetEmail} with team access` : `Invitation sent to ${targetEmail}. Grant team access from the Users page once they join.`)
          : `Invitation sent to ${targetEmail}`
      );
      setEmail('');
      setRole(defaultRole);
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || 'Could not send invite');
    }
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