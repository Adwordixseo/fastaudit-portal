import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const FAQ_PATHS = ['/', '/platform/:slug', '/solutions/:slug', '/resources/:slug'];

export default function FaqDialog({ open, onOpenChange, faq, onSave }) {
  const isEdit = !!faq;
  const [pagePath, setPagePath] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [items, setItems] = useState([{ question: '', answer: '' }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (faq) {
        setPagePath(faq.page_path || '');
        setSortOrder(faq.sort_order || 0);
        setIsActive(faq.is_active !== false);
        setItems([{ question: faq.question || '', answer: faq.answer || '' }]);
      } else {
        setPagePath('');
        setSortOrder(0);
        setIsActive(true);
        setItems([{ question: '', answer: '' }]);
      }
    }
  }, [open, faq]);

  const addItem = () => setItems((prev) => [...prev, { question: '', answer: '' }]);
  const removeItem = (i) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateItem = (i, key, val) => setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));

  const submit = async () => {
    if (!pagePath.trim()) { toast.error('Page path is required'); return; }
    const validItems = items.filter((it) => it.question.trim() && it.answer.trim());
    if (validItems.length === 0) { toast.error('At least one question and answer is required'); return; }
    if (validItems.length < items.length) { toast.error('Each FAQ needs both a question and an answer'); return; }

    setSaving(true);
    try {
      if (isEdit) {
        await onSave({ page_path: pagePath, question: items[0].question, answer: items[0].answer, sort_order: sortOrder, is_active: isActive });
      } else {
        const forms = items.map((it, i) => ({ page_path: pagePath, question: it.question, answer: it.answer, sort_order: sortOrder + i, is_active: isActive }));
        await onSave(forms);
      }
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
          <DialogTitle className="text-2xl">{isEdit ? 'Edit FAQ' : 'New FAQs'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Edit a frequently asked question.' : 'Add one or more FAQs to a specific page at once.'}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <Label>Page path</Label>
            <Input value={pagePath} onChange={(e) => setPagePath(e.target.value)} placeholder="/ or /platform/:slug" className="mt-1.5 font-mono text-sm" list="faq-paths" />
            <datalist id="faq-paths">{FAQ_PATHS.map((p) => <option key={p} value={p} />)}</datalist>
            <p className="mt-1 text-xs text-slate-400">Use <code className="font-mono">:slug</code> patterns to match dynamic pages.</p>
          </div>

          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">FAQ {i + 1}</span>
                {items.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)} className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div>
                <Label>Question</Label>
                <Input value={item.question} onChange={(e) => updateItem(i, 'question', e.target.value)} placeholder="Is the website audit really free?" className="mt-1.5" />
              </div>
              <div className="mt-3">
                <Label>Answer</Label>
                <Textarea value={item.answer} onChange={(e) => updateItem(i, 'answer', e.target.value)} placeholder="Yes. Create an account, enter your URL..." className="mt-1.5 min-h-[100px]" />
              </div>
            </div>
          ))}

          {!isEdit && (
            <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full">
              <Plus className="h-4 w-4" /> Add another FAQ
            </Button>
          )}

          <div className="flex items-end gap-4">
            <div>
              <Label>Sort order (start)</Label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="mt-1.5 w-32" />
              {!isEdit && items.length > 1 && <p className="mt-1 text-xs text-slate-400">Each FAQ increments by 1</p>}
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} id="faq-active" />
              <Label htmlFor="faq-active" className="text-sm text-slate-600">Active</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? 'Save FAQ' : `Save ${items.length} FAQ${items.length > 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}