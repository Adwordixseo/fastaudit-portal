import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addMonths, format } from 'date-fns';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fmtDate, money, cycleMonths } from '@/lib/format';

export default function AdminSubscriptions() {
  const qc = useQueryClient();
  const { data: subs = [] } = useQuery({ queryKey: ['admin-subs'], queryFn: () => base44.entities.Subscription.list('-created_date') });
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-subs'] });

  const activate = async (s) => {
    const start = new Date();
    await base44.entities.Subscription.update(s.id, { status: 'active', start_date: format(start, 'yyyy-MM-dd'), end_date: format(addMonths(start, cycleMonths[s.billing_cycle] || 1), 'yyyy-MM-dd') });
    refresh(); toast.success(`${s.package_name} activated for ${s.client_email}`);
  };
  const expire = async (s) => { await base44.entities.Subscription.update(s.id, { status: 'expired' }); refresh(); };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Subscriptions & payments" description="Confirm payments to activate packages, or mark them expired." />
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <Table>
          <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Package</TableHead><TableHead>Billing</TableHead><TableHead>Amount</TableHead><TableHead>Period</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {subs.length === 0 && <TableRow><TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">No orders yet.</TableCell></TableRow>}
            {subs.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-sm text-slate-800">{s.client_email}</TableCell>
                <TableCell className="font-medium text-slate-900">{s.package_name}</TableCell>
                <TableCell className="text-sm capitalize text-slate-600">{s.billing_cycle}</TableCell>
                <TableCell className="text-sm font-semibold text-slate-900">{money(s.amount)}</TableCell>
                <TableCell className="text-xs text-slate-500">{fmtDate(s.start_date)} → {fmtDate(s.end_date)}</TableCell>
                <TableCell><StatusBadge status={s.status} /></TableCell>
                <TableCell className="text-right">
                  {s.status !== 'active' && <Button size="sm" className="rounded-full" onClick={() => activate(s)}>Activate</Button>}
                  {s.status === 'active' && <Button size="sm" variant="outline" className="rounded-full" onClick={() => expire(s)}>Mark expired</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}