import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';

const ROUTE_HINTS = ['/', '/platform/:slug', '/solutions/:slug', '/resources/:slug', '/login', '/register', '/app', '/app/audit', '/app/packages', '/app/projects', '/app/reports'];

export default function SeoSettingDialog({ open, onOpenChange, setting, onSave }) {
  const [form, setForm] = useState({ path: '', page_name: '', title: '', description: '', meta_keywords: '', robots: 'index, follow', og_title: '', og_description: '', og_image: '', twitter_title: '', twitter_description: '', twitter_image: '', canonical_url: '', schema_json: '', h1: '', hero_subheading: '', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        path: setting?.path || '',
        page_name: setting?.page_name || '',
        title: setting?.title || '',
        description: setting?.description || '',
        meta_keywords: setting?.meta_keywords || '',
        robots: setting?.robots || 'index, follow',
        og_title: setting?.og_title || '',
        og_description: setting?.og_description || '',
        og_image: setting?.og_image || '',
        twitter_title: setting?.twitter_title || '',
        twitter_description: setting?.twitter_description || '',
        twitter_image: setting?.twitter_image || '',
        canonical_url: setting?.canonical_url || '',
        schema_json: setting?.schema_json || '',
        h1: setting?.h1 || '',
        hero_subheading: setting?.hero_subheading || '',
        is_active: setting?.is_active !== false,
      });
    }
  }, [open, setting]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.path.trim() || !form.page_name.trim()) { toast.error('Path and page name are required'); return; }
    if (form.schema_json.trim()) {
      try { JSON.parse(form.schema_json); } catch { toast.error('Schema JSON is not valid JSON'); return; }
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{setting ? 'Edit SEO setting' : 'New SEO setting'}</DialogTitle>
          <DialogDescription>Configure how this page appears in search results and social shares.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Page info */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Page</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>URL path / pattern</Label>
                <Input value={form.path} onChange={(e) => set('path', e.target.value)} placeholder="/ or /platform/:slug" className="mt-1.5 font-mono text-sm" />
                <p className="mt-1 text-xs text-slate-400">Use :slug for dynamic pages</p>
              </div>
              <div>
                <Label>Page name</Label>
                <Input value={form.page_name} onChange={(e) => set('page_name', e.target.value)} placeholder="Homepage" className="mt-1.5" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Switch checked={form.is_active} onCheckedChange={(v) => set('is_active', v)} id="seo-active" />
              <Label htmlFor="seo-active" className="text-sm text-slate-600">Active</Label>
            </div>
          </section>

          {/* Basic meta */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Search engine meta</h4>
            <div>
              <Label>Meta title</Label>
              <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="RankPilot — Free SEO Audit Tool" className="mt-1.5" />
              <p className="mt-1 text-xs text-slate-400">{form.title.length}/60 characters</p>
            </div>
            <div>
              <Label>Meta description</Label>
              <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Run a free instant SEO audit..." className="mt-1.5" rows={3} />
              <p className="mt-1 text-xs text-slate-400">{form.description.length}/160 characters</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Keywords</Label>
                <Input value={form.meta_keywords} onChange={(e) => set('meta_keywords', e.target.value)} placeholder="seo audit, website audit" className="mt-1.5" />
              </div>
              <div>
                <Label>Robots</Label>
                <Input value={form.robots} onChange={(e) => set('robots', e.target.value)} placeholder="index, follow" className="mt-1.5" />
              </div>
            </div>
          </section>

          {/* Open Graph */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Open Graph (Facebook, LinkedIn)</h4>
            <div>
              <Label>OG title</Label>
              <Input value={form.og_title} onChange={(e) => set('og_title', e.target.value)} placeholder="Falls back to meta title" className="mt-1.5" />
            </div>
            <div>
              <Label>OG description</Label>
              <Textarea value={form.og_description} onChange={(e) => set('og_description', e.target.value)} placeholder="Falls back to meta description" className="mt-1.5" rows={2} />
            </div>
            <div>
              <Label>OG image URL</Label>
              <Input value={form.og_image} onChange={(e) => set('og_image', e.target.value)} placeholder="https://..." className="mt-1.5" />
            </div>
          </section>

          {/* Twitter */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Twitter card</h4>
            <div>
              <Label>Twitter title</Label>
              <Input value={form.twitter_title} onChange={(e) => set('twitter_title', e.target.value)} placeholder="Falls back to OG title" className="mt-1.5" />
            </div>
            <div>
              <Label>Twitter description</Label>
              <Textarea value={form.twitter_description} onChange={(e) => set('twitter_description', e.target.value)} placeholder="Falls back to OG description" className="mt-1.5" rows={2} />
            </div>
            <div>
              <Label>Twitter image URL</Label>
              <Input value={form.twitter_image} onChange={(e) => set('twitter_image', e.target.value)} placeholder="Falls back to OG image" className="mt-1.5" />
            </div>
          </section>

          {/* Canonical & Schema */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Canonical URL & schema</h4>
            <div>
              <Label>Canonical URL</Label>
              <Input value={form.canonical_url} onChange={(e) => set('canonical_url', e.target.value)} placeholder="https://yourdomain.com/page" className="mt-1.5" />
            </div>
            <div>
              <Label>JSON-LD schema</Label>
              <Textarea value={form.schema_json} onChange={(e) => set('schema_json', e.target.value)} placeholder='{"@context":"https://schema.org","@type":"WebPage","name":"..."}' className="mt-1.5 font-mono text-xs" rows={5} />
              <p className="mt-1 text-xs text-slate-400">Paste valid JSON-LD. Can be a single object or an array.</p>
            </div>
          </section>

          {/* Page content overrides */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Page content overrides</h4>
            <div>
              <Label>H1 heading</Label>
              <Input value={form.h1} onChange={(e) => set('h1', e.target.value)} placeholder="Override the page's H1" className="mt-1.5" />
            </div>
            <div>
              <Label>Hero subheading</Label>
              <Textarea value={form.hero_subheading} onChange={(e) => set('hero_subheading', e.target.value)} placeholder="Override the hero subheading text" className="mt-1.5" rows={2} />
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}