import React, { useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { money, cyclePrice, cycleMonths, cycleLabel } from '@/lib/format';

export default function PurchaseDialog({ pkg, cycle, user, open, onOpenChange, onDone }) {
  const [saving, setSaving] = useState(false);
  if (!pkg) return null;
  const amount = cyclePrice(pkg, cycle);

  const confirm = async () => {
    if (window.self !== window.top) { toast.error('Checkout works only from the published app. Open the app in a new tab to pay.'); return; }
    setSaving(true);
    try {
      const res = await base44.functions.invoke('createCheckoutSession', { package_id: pkg.id, package_name: pkg.name, cycle, amount });
      const url = res.data?.url;
      if (!url) { toast.error(res.data?.error || 'Could not start checkout'); setSaving(false); return; }
      window.location.href = url;
    } catch (e) {
      toast.error(e.message || 'Could not start checkout');
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm your package</DialogTitle>
          <DialogDescription>Review your selection, then pay securely via Stripe. Your package activates automatically once payment succeeds.</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center justify-between"><span className="font-semibold text-slate-900">{pkg.name}</span><span className="text-sm capitalize text-slate-500">{cycle} billing</span></div>
          <div className="mt-3 flex items-end gap-1"><span className="font-heading text-4xl font-extrabold text-slate-900">{money(amount)}</span><span className="mb-1.5 text-sm text-slate-500">{cycleLabel[cycle]}</span></div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Full PDF reports unlock the moment your package is activated.</p>
        </div>
        <Button onClick={confirm} disabled={saving} size="lg" className="w-full rounded-xl font-semibold">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay & activate · ${money(amount)}`}</Button>
      </DialogContent>
    </Dialog>
  );
}