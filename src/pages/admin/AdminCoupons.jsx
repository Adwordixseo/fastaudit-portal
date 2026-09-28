import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import CouponDialog from '@/components/admin/CouponDialog';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';

const USES_LABEL = { 0: 'Unlimited', [null]: 'Unlimited' };

export default function AdminCoupons() {
  const qc = useQueryClient();
  const [dialog, setDialog] = useState({ open: false, coupon: null });
  const { data: coupons = [] } = useQuery({ queryKey: ['admin-coupons'], queryFn: () => base44.entities.Coupon.list('-created_date') });
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-coupons'] });

  const save = async (form) => {
    if (dialog.coupon) await base44.entities.Coupon.update(dialog.coupon.id, form);
    else await base44.entities.Coupon.create(form);
    setDialog({ open: false, coupon: null });
    refresh();
    toast.success('Coupon saved');
  };
  const remove = async (c) => { if (!confirm(`Delete coupon "${c.code}"?`)) return; await base44.entities.Coupon.delete(c.id); refresh(); };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Coupons" description="Create discount codes clients can enter at checkout. The discount is applied inside Stripe before payment." action={<Button onClick={() => setDialog({ open: true, coupon: null })} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> New coupon</Button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.id} className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2"><span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-mono text-sm font-bold text-indigo-700">{c.code}</span><StatusBadge status={c.active ? 'active' : 'inactive'} /></div>
              <div className="flex gap-1"><button onClick={() => setDialog({ open: true, coupon: c })} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><Pencil className="h-4 w-4" /></button><button onClick={() => remove(c)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div>
            </div>
            <div className="mt-4 flex items-end gap-1"><span className="font-heading text-3xl font-extrabold text-slate-900">{c.discount_percent}%</span><span className="mb-1 text-sm text-slate-500">off</span></div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>Used <span className="font-semibold text-slate-700">{c.uses || 0}</span> / {c.max_uses > 0 ? c.max_uses : '∞'}</span><span>{c.duration === 'forever' ? 'Recurring' : 'One-time'}</span></div>
          </div>
        ))}
      </div>
      <CouponDialog open={dialog.open} coupon={dialog.coupon} onOpenChange={(o) => setDialog({ open: o, coupon: o ? dialog.coupon : null })} onSave={save} />
    </div>
  );
}