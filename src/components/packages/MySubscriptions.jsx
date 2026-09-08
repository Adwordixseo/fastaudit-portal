import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import { fmtDate, money } from '@/lib/format';

export default function MySubscriptions({ subscriptions, onRenew }) {
  if (!subscriptions.length) return null;
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Your packages</h2>
      <ul className="mt-4 divide-y divide-slate-100">
        {subscriptions.map((s) => (
          <li key={s.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2"><span className="font-semibold text-slate-900">{s.package_name}</span><StatusBadge status={s.status} /></div>
              <p className="mt-1 text-xs text-slate-500 capitalize">{s.billing_cycle} · {money(s.amount)} · {fmtDate(s.start_date)} → {fmtDate(s.end_date)}</p>
            </div>
            {s.status === 'expired' && <Button variant="outline" size="sm" className="rounded-full" onClick={() => onRenew(s)}><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Renew</Button>}
            {s.status === 'pending' && <span className="text-xs text-amber-600">Awaiting payment confirmation</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}