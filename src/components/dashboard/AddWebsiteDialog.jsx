import React, { useState, useEffect } from 'react';
import { Loader2, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

export default function AddWebsiteDialog({ open, onOpenChange, subscription, onDone }) {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!open) { setName(''); setWebsite(''); } }, [open]);

  if (!subscription) return null;

  const submit = async () => {
    if (!website.trim()) { toast.error('Please enter a website URL'); return; }
    setSaving(true);
    try {
      let url = website.trim();
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      const projectName = name.trim() || url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      const project = await base44.entities.Project.create({
        name: projectName,
        website: url,
        client_id: subscription.client_id,
        client_email: subscription.client_email,
        status: 'todo',
        progress: 0,
      });
      await base44.entities.Subscription.update(subscription.id, { project_id: project.id });
      toast.success('Website added to your dashboard');
      onOpenChange(false);
      onDone?.();
    } catch (e) {
      toast.error(e.message || 'Could not add website');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add your website</DialogTitle>
          <DialogDescription>Uses one package slot. Enter the website you want audited and managed under <span className="font-semibold text-slate-700">{subscription.package_name}</span>.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Website URL</Label>
            <div className="mt-1.5 flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0 text-slate-400" />
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="example.com" className="flex-1" autoFocus />
            </div>
          </div>
          <div>
            <Label>Project name (optional)</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Auto-detected from URL" className="mt-1.5" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add website'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}