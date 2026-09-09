import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FolderKanban, Package, Search, Clock, ArrowRight, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import { useSubscription } from '@/hooks/useSubscription';
import PageHeader from '@/components/portal/PageHeader';
import StatCard from '@/components/portal/StatCard';
import UpsellBanner from '@/components/dashboard/UpsellBanner';
import ProjectProgressCard from '@/components/dashboard/ProjectProgressCard';
import ScoreTrendChart from '@/components/dashboard/ScoreTrendChart';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/portal/EmptyState';
import { Button } from '@/components/ui/button';
import { fmtDate, scoreColor } from '@/lib/format';

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { activeSubscription, hasActive, isLoading: subLoading } = useSubscription();
  const uid = user?.id;
  const { data: projects = [] } = useQuery({ queryKey: ['projects', uid], queryFn: () => base44.entities.Project.filter({ client_id: uid }, '-updated_date'), enabled: !!uid });
  const { data: milestones = [] } = useQuery({ queryKey: ['milestones', uid], queryFn: async () => (await Promise.all(projects.map((p) => base44.entities.Milestone.filter({ project_id: p.id })))).flat(), enabled: projects.length > 0 });
  const { data: audits = [] } = useQuery({ queryKey: ['audits', uid], queryFn: () => base44.entities.Audit.filter({ client_id: uid }, '-created_date', 5), enabled: !!uid });
  const { data: docs = [] } = useQuery({ queryKey: ['documents', uid], queryFn: () => base44.entities.Document.filter({ client_id: uid }, '-created_date'), enabled: !!uid });
  const pending = docs.filter((d) => d.status === 'awaiting_approval');

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Dashboard" title={`Welcome back${user?.full_name ? ', ' + user.full_name.split(' ')[0] : ''}`} description="Here's where your projects, reports and audits stand today."
        action={<Button asChild className="rounded-full"><Link to="/app/audit"><Search className="mr-2 h-4 w-4" /> New audit</Link></Button>} />

      {!subLoading && !hasActive && <UpsellBanner />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FolderKanban} label="Ongoing projects" value={projects.filter((p) => p.status === 'active').length} hint={`${projects.length} total`} />
        <StatCard icon={Package} label="Active package" value={activeSubscription ? activeSubscription.package_name : 'None'} hint={activeSubscription ? `Renews ${fmtDate(activeSubscription.end_date)}` : 'Choose a package to unlock reports'} tone="violet" />
        <StatCard icon={Search} label="Audits run" value={audits.length} hint="Latest 5 shown below" tone="emerald" />
        <StatCard icon={Clock} label="Pending approvals" value={pending.length} hint="Deliverables awaiting your review" tone="amber" />
      </div>

      <ScoreTrendChart />

      <section>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Your projects</h2><Link to="/app/projects" className="text-sm font-medium text-indigo-600">View all</Link></div>
        {projects.length === 0 ? (
          <EmptyState icon={FolderKanban} title="No projects yet" text="Once you choose a package our team sets up your project and you'll see progress here." action={<Button asChild variant="outline" className="rounded-full"><Link to="/app/packages">Browse packages</Link></Button>} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.slice(0, 3).map((p) => <ProjectProgressCard key={p.id} project={p} milestones={milestones.filter((m) => m.project_id === p.id)} onClick={() => navigate(`/app/projects?id=${p.id}`)} />)}</div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Recent audits</h2><Link to="/app/audit" className="text-sm font-medium text-indigo-600">All audits</Link></div>
          {audits.length === 0 ? <p className="text-sm text-slate-500">You haven't run an audit yet. <Link to="/app/audit" className="font-medium text-indigo-600">Run one now →</Link></p> : (
            <ul className="divide-y divide-slate-100">{audits.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3">
                <div className="min-w-0"><div className="truncate text-sm font-medium text-slate-900">{a.url}</div><div className="text-xs text-slate-400">{fmtDate(a.created_date)}</div></div>
                <span className={`font-heading text-2xl font-bold ${scoreColor(a.overall_score)}`}>{a.overall_score}</span>
              </li>))}</ul>
          )}
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Pending approvals</h2><Link to="/app/reports" className="text-sm font-medium text-indigo-600">All reports</Link></div>
          {pending.length === 0 ? <p className="text-sm text-slate-500">Nothing waiting for your approval. Nice.</p> : (
            <ul className="divide-y divide-slate-100">{pending.slice(0, 5).map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3"><FileText className="h-4 w-4 shrink-0 text-indigo-500" /><div className="min-w-0"><div className="truncate text-sm font-medium text-slate-900">{d.title}</div><div className="text-xs text-slate-400">{fmtDate(d.created_date)}</div></div></div>
                <Link to="/app/reports" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">Review <ArrowRight className="h-3 w-3" /></Link>
              </li>))}</ul>
          )}
        </section>
      </div>
    </div>
  );
}