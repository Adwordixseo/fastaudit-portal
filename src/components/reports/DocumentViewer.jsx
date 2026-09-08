import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DocumentViewer({ doc, open, onOpenChange }) {
  if (!doc) return null;
  const src = doc.file_type === 'pdf' || doc.file_type === 'other' ? doc.file_url : `https://docs.google.com/viewer?url=${encodeURIComponent(doc.file_url)}&embedded=true`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-w-5xl flex-col rounded-3xl p-0">
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <DialogTitle className="truncate text-base">{doc.title}</DialogTitle>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full"><a href={doc.file_url} target="_blank" rel="noreferrer"><ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open</a></Button>
            <Button asChild size="sm" className="rounded-full"><a href={doc.file_url} download target="_blank" rel="noreferrer"><Download className="mr-1.5 h-3.5 w-3.5" /> Download</a></Button>
          </div>
        </DialogHeader>
        <iframe title={doc.title} src={src} className="flex-1 w-full rounded-b-3xl bg-slate-100" />
      </DialogContent>
    </Dialog>
  );
}