import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const FAQ_PATHS = ['/', '/platform/:slug', '/solutions/:slug', '/resources/:slug'];

export default function FaqDialog({ open, onOpenChange, faq, onSave }) {
  const [form, setForm] = useState({ page_path: '', question: '', answer: '', sort_order: 0, is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        page_path: faq?.page_path || '',
        question: faq?.question || '',
        answer: faq?.answer || '',
        sort_order: faq?.sort_order || 0,
        is_active: faq?.is_active !== false,
      });
    }
  }, [open, faq]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.page_path.trim() || !form.question.trim() || !form.answer.trim()) {
      toast.error('Page path, question, and answer are required');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onOpenChange(false);
    } catch (e) {
      toast.error(e.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{faq ? 'Edit FAQ' : 'New FAQ'}</DialogTitle>
          <DialogDescription>Add a frequently asked question to a specific page.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <Label>Page path</Label>
            <Input value={form.page_path} onChange={(e) => set('page_path', e.target.value)} placeholder="/ or /platform/:slug" className="mt-1.5 font-mono text-sm" list="faq-paths" />
            <datalist id="faq-paths">{FAQ_PATHS.map((p) => <option key={p} value={p} />)}</datalist>
            <p className="mt-1 text-xs text-slate-400">Use <code className="font-mono">:slug</code> patterns to match dynamic pages (e.g. <code className="font-mono">/platform/:slug</code> matches all platform pages).</p>
          </div>
          <div>
            <Label>Question</Label>
            <Input value={form.question} onChange={(e) => set('question', e.target.value)} placeholder="Is the website audit really free?" className="mt-1.5" />
          </div>
          <div>
            <Label>Answer</Label>
            <Textarea value={form.answer} onChange={(e) => set('answer', e.target.value)} placeholder="Yes. Create an account, enter your URL..." className="mt-1.5 min-h-[120px]" />
          </div>
          <div className="flex items-end gap-4">
            <div>
              <Label>Sort order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} className="mt-1.5 w-32" />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => set('is_active', v)} id="faq-active" />
              <Label htmlFor="faq-active" className="text-sm text-slate-600">Active</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save FAQ'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}