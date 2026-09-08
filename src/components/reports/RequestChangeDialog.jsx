import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function RequestChangeDialog({ open, onOpenChange, onSubmit }) {
  const [note, setNote] = useState('');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader><DialogTitle>Request changes</DialogTitle><DialogDescription>Tell our team what you'd like adjusted in this deliverable.</DialogDescription></DialogHeader>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} placeholder="e.g. Please add the keyword ranking table for the blog section…" />
        <Button disabled={!note.trim()} onClick={() => { onSubmit(note.trim()); setNote(''); }} className="w-full rounded-xl">Send request</Button>
      </DialogContent>
    </Dialog>
  );
}