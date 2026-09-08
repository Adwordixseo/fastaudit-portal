import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function InviteUserDialog({ open, onOpenChange }) {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const invite = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await base44.users.inviteUser(email.trim(), 'user'); toast.success(`Invitation sent to ${email}`); setEmail(''); onOpenChange(false); }
    catch (err) { toast.error(err.message || 'Could not send invite'); }
    setSaving(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader><DialogTitle>Add a client</DialogTitle><DialogDescription>They'll receive an email invitation to join the portal.</DialogDescription></DialogHeader>
        <form onSubmit={invite} className="space-y-3">
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@company.com" />
          <Button type="submit" disabled={saving} className="w-full rounded-xl">Send invitation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}