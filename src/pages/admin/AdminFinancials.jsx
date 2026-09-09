import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { CreditCard, TrendingUp, Wallet, RefreshCw, ArrowUpRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import StatCard from '@/components/portal/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fmtDate, money, cycleMonths } from '@/lib/format';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function AdminFinancials() {
  const { data: subs = [] } = useQuery({ queryKey: ['admin-subs'], queryFn: () => base44.entities.Subscription.list('-created_date') });
  const { data: packages = [] } = useQuery({ queryKey: ['admin-packages'], queryFn: () => base44.entities.Package.list('sort_order') });

  const stats = useMemo(() => {
    const active = subs.filter((s) => s.status === 'active');
    const pending = subs.filter((s) => s.status === 'pending');
    const expired = subs.filter((s) => s.status === 'expired');

    // MRR: normalize each active sub to its monthly equivalent
    const mrr = active.reduce((sum, s) => {
      const months = cycleMonths[s.billing_cycle] || 1;
      return sum + (s.amount || 0) / months;
    }, 0);

    // Total collected: sum of all active subscription amounts (lifetime booked)
    const collected = active.reduce((sum, s) => sum + (s.amount || 0), 0);
    const pendingValue = pending.reduce((sum, s) => sum + (s.amount || 0), 0);

    // Revenue by package
    const byPackage = {};
    active.forEach((s) => {
      const name = s.package_name || 'Unknown';
      byPackage[name] = (byPackage[name] || 0) + (s.amount || 0);
    });
    const packageRows = Object.entries(byPackage).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    // Active subs by billing cycle
    const byCycle = { monthly: 0, quarterly: 0, yearly: 0 };
    active.forEach((s) => { if (byCycle[s.billing_cycle] !== undefined) byCycle[s.billing_cycle] += 1; });
    const cycleRows = [
      { label: 'Monthly', count: byCycle.monthly },
      { label: 'Quarterly', count: byCycle.quarterly },
      { label: 'Yearly', count: byCycle.yearly },
    ];

    return { active, activeCount: active.length, pendingCount: pending.length, expiredCount: expired.length, mrr, collected, pendingValue, packageRows, cycleRows };
  }, [subs]);

  const recent = subs.slice(0, 8);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Admin" title="Financial overview" description="Track active subscriptions, monthly recurring revenue and total collected from packages." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Total collected" value={money(Math.round(stats.collected))} hint={`${stats.activeCount} active subscriptions`} tone="emerald" />
        <StatCard icon={TrendingUp} label="Monthly recurring" value={money(Math.round(stats.mrr))} hint="Normalized MRR" />
        <StatCard icon={CreditCard} label="Active subscriptions" value={stats.activeCount} hint={`${stats.pendingCount} pending · ${stats.expiredCount} expired`} tone="violet" />
        <StatCard icon={RefreshCw} label="Pending value" value={money(Math.round(stats.pendingValue))} hint="Awaiting activation" tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 lg:col-span-3">
          <h2 className="text-base font-semibold text-slate-900">Revenue by package</h2>
          <p className="mt-0.5 text-sm text-slate-500">Collected amount per package among active subscriptions.</p>
          {stats.packageRows.length === 0 ? (
            <div className="grid h-64 place-items-center text-sm text-slate-400">No active subscriptions yet.</div>
          ) : (
            <div className="mt-5 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.packageRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => '$' + v} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(v) => [money(v), 'Collected']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
                    {stats.packageRows.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Active by billing cycle</h2>
          <p className="mt-0.5 text-sm text-slate-500">How active subscribers are distributed.</p>
          <ul className="mt-5 space-y-4">
            {stats.cycleRows.map((c) => {
              const pct = stats.activeCount ? Math.round((c.count / stats.activeCount) * 100) : 0;
              return (
                <li key={c.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{c.label}</span>
                    <span className="text-slate-500">{c.count} <span className="text-slate-400">· {pct}%</span></span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Annualized run-rate</div>
            <div className="mt-1 font-heading text-2xl font-bold text-slate-900">{money(Math.round(stats.mrr * 12))}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600"><ArrowUpRight className="h-3.5 w-3.5" /> Based on current MRR</div>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Recent transactions</h2>
          <span className="text-xs text-slate-400">{subs.length} total orders</span>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Package</TableHead><TableHead>Billing</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {recent.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">No transactions yet.</TableCell></TableRow>}
            {recent.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-sm text-slate-800">{s.client_email}</TableCell>
                <TableCell className="font-medium text-slate-900">{s.package_name}</TableCell>
                <TableCell className="text-sm capitalize text-slate-600">{s.billing_cycle}</TableCell>
                <TableCell className="text-sm font-semibold text-slate-900">{money(s.amount)}</TableCell>
                <TableCell className="text-xs text-slate-500">{fmtDate(s.created_date)}</TableCell>
                <TableCell><StatusBadge status={s.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}