import React, { useState } from 'react';
import { Loader2, Upload, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';
import { fileTypeFromName } from '@/lib/format';

export default function TeamUploadDialog({ open, onOpenChange, projects, onSaved, defaultProjectId }) {
  const [form, setForm] = useState({ project_id: defaultProjectId || '', title: '', report_month: new Date().toISOString().slice(0, 7), admin_comment: '' });
  const [file, setFile] = useState(null);
  const [reviewLink, setReviewLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [requestApproval, setRequestApproval] = useState(true);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!file && !reviewLink.trim()) { toast.error('Upload a file or attach a link'); return; }
    setSaving(true);
    try {
      let fileUrl = '';
      let fileType = 'other';
      if (file) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        fileUrl = file_url;
        fileType = fileTypeFromName(file.name);
      } else {
        fileUrl = reviewLink.trim();
      }
      const project = projects.find((p) => p.id === form.project_id);
      const status = requestApproval ? 'awaiting_approval' : 'draft';
      await base44.entities.Document.create({
        ...form,
        client_id: project?.client_id || '',
        file_url: fileUrl,
        file_type: fileType,
        review_link: file ? reviewLink.trim() || undefined : reviewLink.trim(),
        status,
        history: [{ action: requestApproval ? 'uploaded' : 'uploaded_draft', by: 'Team', note: form.admin_comment, date: new Date().toISOString() }]
      });
      if (requestApproval) {
        try {
          await base44.functions.invoke('sendDocumentNotification', { clientEmail: project?.client_email, documentTitle: form.title, projectName: project?.name, comment: form.admin_comment, uploadedBy: 'Team' });
        } catch (_e) { /* notification is best-effort */ }
      }
      setFile(null); setReviewLink(''); setForm((f) => ({ ...f, title: '', admin_comment: '' }));
      toast.success(requestApproval ? 'Shared with the client for approval' : 'Saved as internal draft');
      onOpenChange(false); onSaved?.();
    } catch (err) { toast.error(err.message || 'Could not upload'); }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl">
        <DialogHeader><DialogTitle>Share a deliverable</DialogTitle><DialogDescription>Upload a file or attach a link for the client to review and approve.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div><Label>Project</Label>
            <Select value={form.project_id} onValueChange={set('project_id')}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a project" /></SelectTrigger>
              <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} · {p.client_email}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Title</Label><Input required value={form.title} onChange={(e) => set('title')(e.target.value)} placeholder="Monthly SEO report" className="mt-1.5" /></div>
            <div><Label>Report month</Label><Input type="month" required value={form.report_month} onChange={(e) => set('report_month')(e.target.value)} className="mt-1.5" /></div>
          </div>
          <div><Label>File (PDF, Word, Excel, CSV)</Label><Input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1.5" /></div>
          <div className="flex items-center gap-2 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />or attach a link <span className="h-px flex-1 bg-slate-200" /></div>
          <div><Label className="flex items-center gap-1.5"><LinkIcon className="h-3.5 w-3.5" /> Review link (Google Doc, Sheet, etc.)</Label><Input type="url" value={reviewLink} onChange={(e) => setReviewLink(e.target.value)} placeholder="https://docs.google.com/..." className="mt-1.5" /></div>
          <div><Label>Comment for client (optional)</Label><Textarea rows={2} value={form.admin_comment} onChange={(e) => set('admin_comment')(e.target.value)} className="mt-1.5" /></div>
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span><span className="block text-sm font-medium text-slate-800">Request client approval</span><span className="block text-xs text-slate-500">Share with the client for review. Turn off to keep as an internal draft.</span></span>
            <Switch checked={requestApproval} onCheckedChange={setRequestApproval} />
          </label>
          <Button type="submit" disabled={saving || !form.project_id || (!file && !reviewLink.trim())} className="w-full rounded-xl">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="mr-2 h-4 w-4" /> {requestApproval ? 'Share with client' : 'Save as draft'}</>}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}