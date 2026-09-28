import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function CouponDialog({ coupon, open, onOpenChange, onSave }) {
  const [form, setForm] = useState(() => ({
    code: coupon?.code || '',
    discount_percent: coupon?.discount_percent ?? 40,
    max_uses: coupon?.max_uses ?? 0,
    active: coupon?.active ?? true,
  }));
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) return;
    setSaving(true);
    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_percent: Math.max(0, Math.min(100, Math.round(Number(form.discount_percent) || 0))),
      max_uses: Math.max(0, Math.round(Number(form.max_uses) || 0)),
      active: form.active,
    };
    await onSave(payload);
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>{coupon ? 'Edit coupon' : 'New coupon'}</DialogTitle>
          <DialogDescription>Set the code and the discount clients receive at checkout.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="code">Coupon code</Label>
            <Input id="code" value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="e.g. WELCOME40" autoComplete="off" disabled={!!coupon} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="discount">Discount %</Label>
              <Input id="discount" type="number" min="1" max="100" value={form.discount_percent} onChange={(e) => set('discount_percent', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max_uses">Max uses (0 = unlimited)</Label>
              <Input id="max_uses" type="number" min="0" value={form.max_uses} onChange={(e) => set('max_uses', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <div><div className="text-sm font-medium text-slate-900">Active</div><div className="text-xs text-slate-500">Inactive codes are rejected at checkout.</div></div>
            <Switch checked={form.active} onCheckedChange={(v) => set('active', v)} />
          </div>
          <Button type="submit" disabled={saving} className="w-full rounded-xl font-semibold">{saving ? 'Saving…' : 'Save coupon'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}