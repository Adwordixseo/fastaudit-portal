import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ReplyToClientDialog({ open, onOpenChange, onSubmit, clientNote }) {
  const [note, setNote] = useState('');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Reply to client</DialogTitle>
          <DialogDescription>Respond to the client's change request so they know their feedback was seen and addressed.</DialogDescription>
        </DialogHeader>
        {clientNote && (
          <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
            <span className="font-semibold">Client requested:</span> &ldquo;{clientNote}&rdquo;
          </div>
        )}
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} placeholder="e.g. Thanks for the feedback — we've updated the sheet with the keyword ranking table…" />
        <Button disabled={!note.trim()} onClick={() => { onSubmit(note.trim()); setNote(''); }} className="w-full rounded-xl">Send reply</Button>
      </DialogContent>
    </Dialog>
  );
}