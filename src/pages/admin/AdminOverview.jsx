import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, FolderKanban, CreditCard, MessageSquare, FileText, Search, ListTodo } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import StatCard from '@/components/portal/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/portal/EmptyState';
import WeeklyTaskCompletionChart from '@/components/team/WeeklyTaskCompletionChart';
import TeamTaskKanban from '@/components/team/TeamTaskKanban';
import { fmtDate, scoreColor } from '@/lib/format';

export default function AdminOverview() {
  const qc = useQueryClient();
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => base44.entities.User.list() });
  const { data: projects = [] } = useQuery({ queryKey: ['admin-projects'], queryFn: () => base44.entities.Project.list('-updated_date') });
  const { data: subs = [] } = useQuery({ queryKey: ['admin-subs'], queryFn: () => base44.entities.Subscription.list('-created_date') });
  const { data: tickets = [] } = useQuery({ queryKey: ['admin-tickets'], queryFn: () => base44.entities.Ticket.list('-created_date') });
  const { data: docs = [] } = useQuery({ queryKey: ['admin-docs'], queryFn: () => base44.entities.Document.list('-created_date') });
  const { data: audits = [] } = useQuery({ queryKey: ['admin-audits'], queryFn: () => base44.entities.Audit.list('-created_date', 8) });
  const { data: tasks = [] } = useQuery({ queryKey: ['team-tasks'], queryFn: () => base44.entities.TeamTask.list('-updated_date') });

  const saveTaskStatus = async (id, status) => { await base44.entities.TeamTask.update(id, { status }); qc.invalidateQueries({ queryKey: ['team-tasks'] }); };
  const approved = docs.filter((d) => d.status === 'approved').length;
  const popular = Object.entries(subs.reduce((a, s) => ({ ...a, [s.package_name]: (a[s.package_name] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Admin" title="Overview" description="A live snapshot of clients, projects, revenue and support." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Users} label="Active users" value={users.filter((u) => u.account_status !== 'inactive').length} hint={`${users.length} registered`} />
        <StatCard icon={FolderKanban} label="Projects in progress" value={projects.filter((p) => p.status === 'in_progress').length} hint={`${projects.length} total`} tone="violet" />
        <StatCard icon={CreditCard} label="Pending orders" value={subs.filter((s) => s.status === 'pending').length} hint={`${subs.filter((s) => s.status === 'active').length} active`} tone="amber" />
        <StatCard icon={MessageSquare} label="Open tickets" value={tickets.filter((t) => t.status !== 'resolved').length} tone="rose" />
        <StatCard icon={FileText} label="Approval ratio" value={docs.length ? Math.round((approved / docs.length) * 100) + '%' : '—'} hint={`${approved}/${docs.length} approved`} tone="emerald" />
        <StatCard icon={Search} label="Audits run" value={audits.length >= 8 ? '8+' : audits.length} hint="Recent" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-base font-semibold text-slate-900">Most popular packages</h2>
          <ul className="mt-4 space-y-3">{popular.length === 0 ? <li className="text-sm text-slate-500">No orders yet.</li> : popular.map(([n, c]) => <li key={n} className="flex items-center justify-between text-sm"><span className="text-slate-700">{n}</span><span className="font-semibold text-slate-900">{c}</span></li>)}</ul></section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-base font-semibold text-slate-900">Recent audits</h2>
          <ul className="mt-4 divide-y divide-slate-100">{audits.map((a) => <li key={a.id} className="flex items-center justify-between py-2.5"><div className="min-w-0"><div className="truncate text-sm text-slate-800">{a.url}</div><div className="text-xs text-slate-400">{a.client_email} · {fmtDate(a.created_date)}</div></div><span className={`font-heading text-lg font-bold ${scoreColor(a.overall_score)}`}>{a.overall_score}</span></li>)}</ul></section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-base font-semibold text-slate-900">Latest tickets</h2>
          <ul className="mt-4 divide-y divide-slate-100">{tickets.slice(0, 6).map((t) => <li key={t.id} className="flex items-center justify-between gap-3 py-2.5"><div className="min-w-0"><div className="truncate text-sm text-slate-800">{t.subject}</div><div className="text-xs text-slate-400">{t.client_email}</div></div><StatusBadge status={t.status} /></li>)}</ul></section>
      </div>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><ListTodo className="h-5 w-5" /></span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Team performance</h2>
            <p className="text-sm text-slate-500">Live view of what the team is working on and weekly throughput.</p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1"><WeeklyTaskCompletionChart tasks={tasks} /></div>
          <div className="lg:col-span-2">
            {tasks.length === 0 ? (
              <EmptyState icon={ListTodo} title="No team tasks" text="The team hasn't created any tasks yet." />
            ) : (
              <TeamTaskKanban tasks={tasks} onMove={saveTaskStatus} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}