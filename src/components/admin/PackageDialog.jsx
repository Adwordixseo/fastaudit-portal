import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const empty = { name: '', tagline: '', features: '', price_monthly: '', price_quarterly: '', price_yearly: '', highlight: false, active: true, sort_order: 0 };

export default function PackageDialog({ open, onOpenChange, pkg, onSave }) {
  const [form, setForm] = useState(empty);
  useEffect(() => { setForm(pkg ? { ...empty, ...pkg, features: (pkg.features || []).join('\n') } : empty); }, [pkg, open]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    const m = Number(form.price_monthly) || 0;
    onSave({ name: form.name, tagline: form.tagline, features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
      price_monthly: m, price_quarterly: Number(form.price_quarterly) || Math.round(m * 3 * 0.9), price_yearly: Number(form.price_yearly) || Math.round(m * 12 * 0.8),
      highlight: !!form.highlight, active: !!form.active, sort_order: Number(form.sort_order) || 0 });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl">
        <DialogHeader><DialogTitle>{pkg ? 'Edit package' : 'New package'}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Name</Label><Input required value={form.name} onChange={(e) => set('name')(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => set('tagline')(e.target.value)} className="mt-1.5" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Monthly ($)</Label><Input required type="number" value={form.price_monthly} onChange={(e) => set('price_monthly')(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Quarterly ($)</Label><Input type="number" value={form.price_quarterly} onChange={(e) => set('price_quarterly')(e.target.value)} placeholder="auto −10%" className="mt-1.5" /></div>
            <div><Label>Yearly ($)</Label><Input type="number" value={form.price_yearly} onChange={(e) => set('price_yearly')(e.target.value)} placeholder="auto −20%" className="mt-1.5" /></div>
          </div>
          <div><Label>Features (one per line)</Label><Textarea rows={5} value={form.features} onChange={(e) => set('features')(e.target.value)} className="mt-1.5" /></div>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.highlight} onCheckedChange={set('highlight')} /> Most popular</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.active} onCheckedChange={set('active')} /> Visible to clients</label>
            <div className="flex items-center gap-2 text-sm"><Label>Order</Label><Input type="number" value={form.sort_order} onChange={(e) => set('sort_order')(e.target.value)} className="w-20" /></div>
          </div>
          <Button type="submit" className="w-full rounded-xl">{pkg ? 'Save changes' : 'Create package'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}