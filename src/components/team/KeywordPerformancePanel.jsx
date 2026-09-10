import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, MapPin, Globe, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EmptyState from '@/components/portal/EmptyState';

export default function KeywordPerformancePanel({ projects }) {
  const [projectFilter, setProjectFilter] = React.useState('all');
  const { data: rankings = [] } = useQuery({ queryKey: ['keyword-rankings'], queryFn: () => base44.entities.KeywordRanking.list('-created_date', 200) });

  const filtered = useMemo(() => {
    return rankings.filter((r) => projectFilter === 'all' || r.project_id === projectFilter);
  }, [rankings, projectFilter]);

  const ranked = filtered.filter((r) => r.found && r.position > 0);
  const avgPos = ranked.length ? Math.round(ranked.reduce((s, r) => s + r.position, 0) / ranked.length) : 0;
  const topThree = ranked.filter((r) => r.position <= 3).length;

  // Latest check per keyword+location
  const latest = useMemo(() => {
    const seen = new Map();
    for (const r of filtered) {
      const key = `${r.keyword}__${r.city || ''}__${r.country || ''}`;
      if (!seen.has(key)) seen.set(key, r); // list is sorted desc by created_date
    }
    return [...seen.values()];
  }, [filtered]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><TrendingUp className="h-5 w-5" /></div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Keyword performance</h2>
            <p className="text-xs text-slate-500">Tracked ranking positions and locations across projects</p>
          </div>
        </div>
        {projects.length > 0 && (
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-48 rounded-full"><SelectValue placeholder="All projects" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="text-xs font-medium text-slate-500">Tracked keywords</div>
          <div className="mt-1 font-heading text-2xl font-bold text-slate-900">{latest.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="text-xs font-medium text-slate-500">Avg position</div>
          <div className="mt-1 font-heading text-2xl font-bold text-slate-900">{avgPos || '—'}</div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="text-xs font-medium text-slate-500">Top 3 rankings</div>
          <div className="mt-1 font-heading text-2xl font-bold text-emerald-600">{topThree}</div>
        </div>
      </div>

      {latest.length === 0 ? (
        <EmptyState icon={Search} title="No rankings tracked yet" text="Run a bulk keyword check and save it to a project to see performance here." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <div className="grid grid-cols-12 gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <div className="col-span-5">Keyword</div>
            <div className="col-span-3">Location</div>
            <div className="col-span-2">Project</div>
            <div className="col-span-2 text-right">Position</div>
          </div>
          <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
            {latest.map((r) => (
              <div key={r.id} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                <div className="col-span-5 min-w-0">
                  <div className="truncate font-medium text-slate-900">{r.keyword}</div>
                  <div className="truncate text-xs text-slate-400">{r.hostname}</div>
                </div>
                <div className="col-span-3 min-w-0 space-y-0.5">
                  {r.city && <div className="flex items-center gap-1 truncate text-xs text-slate-600"><MapPin className="h-3 w-3 shrink-0 text-slate-400" />{r.city}</div>}
                  {r.country && <div className="flex items-center gap-1 truncate text-xs text-slate-500"><Globe className="h-3 w-3 shrink-0 text-slate-400" />{r.country}</div>}
                  {!r.city && !r.country && <div className="text-xs text-slate-400">Global</div>}
                </div>
                <div className="col-span-2 min-w-0">
                  <span className="truncate text-xs text-slate-500">{r.project_name || '—'}</span>
                </div>
                <div className="col-span-2 flex justify-end">
                  {r.found && r.position > 0 ? (
                    <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${r.position <= 3 ? 'bg-emerald-50 text-emerald-700' : r.position <= 10 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{r.position}</span>
                  ) : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-400">Not in top 100</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}