import React, { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { fileTypeFromName } from '@/lib/format';

export default function UploadDocumentDialog({ open, onOpenChange, projects, onSaved }) {
  const [form, setForm] = useState({ project_id: '', title: '', report_month: new Date().toISOString().slice(0, 7), admin_comment: '' });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault(); if (!file) return; setSaving(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const project = projects.find((p) => p.id === form.project_id);
    await base44.entities.Document.create({ ...form, client_id: project.client_id, file_url, file_type: fileTypeFromName(file.name), status: 'awaiting_approval',
      history: [{ action: 'uploaded', by: 'Support team', note: form.admin_comment, date: new Date().toISOString() }] });
    try {
      await base44.functions.invoke('sendDocumentNotification', { clientEmail: project.client_email, documentTitle: form.title, projectName: project.name, comment: form.admin_comment, uploadedBy: 'Support team' });
    } catch (_e) { /* notification is best-effort */ }
    setSaving(false); setFile(null); setForm((f) => ({ ...f, title: '', admin_comment: '' }));
    toast.success('Document uploaded and shared with the client'); onOpenChange(false); onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl">
        <DialogHeader><DialogTitle>Upload a document</DialogTitle><DialogDescription>PDF, Word, Excel or CSV. The client will be asked to approve it.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div><Label>Project</Label>
            <Select value={form.project_id} onValueChange={set('project_id')}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a project" /></SelectTrigger>
              <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} · {p.client_email}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Title</Label><Input required value={form.title} onChange={(e) => set('title')(e.target.value)} placeholder="Monthly SEO report" className="mt-1.5" /></div>
            <div><Label>Report month</Label><Input type="month" required value={form.report_month} onChange={(e) => set('report_month')(e.target.value)} className="mt-1.5" /></div>
          </div>
          <div><Label>File</Label><Input type="file" required accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1.5" /></div>
          <div><Label>Comment for client (optional)</Label><Textarea rows={2} value={form.admin_comment} onChange={(e) => set('admin_comment')(e.target.value)} className="mt-1.5" /></div>
          <Button type="submit" disabled={saving || !form.project_id || !file} className="w-full rounded-xl">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="mr-2 h-4 w-4" /> Upload & share</>}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}