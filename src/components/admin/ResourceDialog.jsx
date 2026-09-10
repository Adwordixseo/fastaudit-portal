import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUpload from '@/components/admin/ImageUpload';

function slugify(str) {
  return (str || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function ResourceDialog({ open, onOpenChange, resource, onSave }) {
  const [form, setForm] = useState({ slug: '', title: '', tag: '', excerpt: '', body: '', image_url: '', author: '', read_time: '', date: '', sort_order: 0, is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        slug: resource?.slug || '',
        title: resource?.title || '',
        tag: resource?.tag || '',
        excerpt: resource?.excerpt || '',
        body: resource?.body || '',
        image_url: resource?.image_url || '',
        author: resource?.author || '',
        read_time: resource?.read_time || '',
        date: resource?.date || '',
        sort_order: resource?.sort_order || 0,
        is_active: resource?.is_active !== false,
      });
    }
  }, [open, resource]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.slug.trim() || !form.title.trim()) { toast.error('Slug and title are required'); return; }
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{resource ? 'Edit resource' : 'New resource'}</DialogTitle>
          <DialogDescription>Create an article with an editable slug, rich text body and hero image.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Slug (URL)</Label>
              <Input
                value={form.slug}
                onChange={(e) => set('slug', slugify(e.target.value))}
                placeholder="my-article"
                className="mt-1.5 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-slate-400">Page URL: /resources/{form.slug || '...'}</p>
            </div>
            <div>
              <Label>Tag</Label>
              <Input value={form.tag} onChange={(e) => set('tag', e.target.value)} placeholder="Guide" className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="What a good SEO score means" className="mt-1.5" />
          </div>

          <div>
            <Label>Excerpt</Label>
            <Input value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short summary for the card" className="mt-1.5" />
          </div>

          <ImageUpload
            label="Hero image"
            value={form.image_url}
            onChange={(v) => set('image_url', v)}
            help="Shown at the top of the article and on the card."
          />

          <div>
            <Label>Body content</Label>
            <p className="mb-1.5 text-xs text-slate-400">Use the link button for internal links and the image button to upload inline images.</p>
            <RichTextEditor value={form.body} onChange={(v) => set('body', v)} placeholder="Write your article..." minHeight={220} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Author</Label>
              <Input value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Adwordix Team" className="mt-1.5" />
            </div>
            <div>
              <Label>Read time</Label>
              <Input value={form.read_time} onChange={(e) => set('read_time', e.target.value)} placeholder="6 min read" className="mt-1.5" />
            </div>
            <div>
              <Label>Date</Label>
              <Input value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="Sep 2026" className="mt-1.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Sort order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} className="mt-1.5" />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => set('is_active', v)} id="res-active" />
                <Label htmlFor="res-active" className="text-sm text-slate-600">Active</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save resource'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}