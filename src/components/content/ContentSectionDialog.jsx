import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUpload from '@/components/admin/ImageUpload';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const INTERNAL_PATHS = ['/', '/app/audit', '/app/packages', '/app/projects', '/app/reports', '/app/support', '/platform/seo-audits', '/platform/keyword-tracking', '/platform/reporting', '/solutions/ecommerce', '/solutions/local-business', '/solutions/startups'];

export default function ContentSectionDialog({ open, onOpenChange, section, onSave }) {
  const [form, setForm] = useState({ page_path: '', section_name: '', heading: '', body: '', image_url: '', image_alt: '', image_position: 'top', link_url: '', link_label: '', sort_order: 0, background: 'white', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        page_path: section?.page_path || '',
        section_name: section?.section_name || '',
        heading: section?.heading || '',
        body: section?.body || '',
        image_url: section?.image_url || '',
        image_alt: section?.image_alt || '',
        image_position: section?.image_position || 'top',
        link_url: section?.link_url || '',
        link_label: section?.link_label || '',
        sort_order: section?.sort_order || 0,
        background: section?.background || 'white',
        is_active: section?.is_active !== false,
      });
    }
  }, [open, section]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.page_path.trim() || !form.section_name.trim()) { toast.error('Page path and section name are required'); return; }
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
          <DialogTitle className="text-2xl">{section ? 'Edit content section' : 'New content section'}</DialogTitle>
          <DialogDescription>Add an editable section with rich text and internal links to any page.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Page path</Label>
              <Input value={form.page_path} onChange={(e) => set('page_path', e.target.value)} placeholder="/ or /platform/:slug" className="mt-1.5 font-mono text-sm" list="content-paths" />
              <datalist id="content-paths">{INTERNAL_PATHS.map((p) => <option key={p} value={p} />)}</datalist>
            </div>
            <div>
              <Label>Section name</Label>
              <Input value={form.section_name} onChange={(e) => set('section_name', e.target.value)} placeholder="Why SEO matters" className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label>Heading</Label>
            <Input value={form.heading} onChange={(e) => set('heading', e.target.value)} placeholder="Section heading (H2)" className="mt-1.5" />
          </div>

          <div>
            <Label>Body content</Label>
            <p className="mb-1.5 text-xs text-slate-400">Use the link button to add internal links to other pages (e.g. /app/audit).</p>
            <RichTextEditor
              value={form.body}
              onChange={(v) => set('body', v)}
              placeholder="Write your content here..."
              minHeight={180}
            />
          </div>

          <ImageUpload
            label="Section image"
            value={form.image_url}
            onChange={(v) => set('image_url', v)}
            help="Optional image for this section."
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Image alt text</Label>
              <Input value={form.image_alt} onChange={(e) => set('image_alt', e.target.value)} placeholder="Describe the image" className="mt-1.5" />
            </div>
            <div>
              <Label>Image position</Label>
              <Select value={form.image_position} onValueChange={(v) => set('image_position', v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top (full width)</SelectItem>
                  <SelectItem value="left">Left of text</SelectItem>
                  <SelectItem value="right">Right of text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Internal link URL</Label>
              <Input value={form.link_url} onChange={(e) => set('link_url', e.target.value)} placeholder="/app/audit" className="mt-1.5 font-mono text-sm" list="content-paths" />
            </div>
            <div>
              <Label>Link label</Label>
              <Input value={form.link_label} onChange={(e) => set('link_label', e.target.value)} placeholder="Run a free audit" className="mt-1.5" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Sort order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} className="mt-1.5" />
            </div>
            <div>
              <Label>Background</Label>
              <Select value={form.background} onValueChange={(v) => set('background', v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="slate">Slate</SelectItem>
                  <SelectItem value="indigo">Indigo tint</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => set('is_active', v)} id="cs-active" />
                <Label htmlFor="cs-active" className="text-sm text-slate-600">Active</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save section'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}