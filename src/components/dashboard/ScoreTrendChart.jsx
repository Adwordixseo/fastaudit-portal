import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import { scoreColor } from '@/lib/format';

const SERIES = [
  { key: 'overall_score', label: 'Overall', color: '#6366f1' },
  { key: 'seo', label: 'SEO', color: '#10b981' },
  { key: 'performance', label: 'Performance', color: '#f59e0b' },
  { key: 'content', label: 'Content', color: '#ec4899' },
  { key: 'technical', label: 'Technical', color: '#3b82f6' },
  { key: 'ai_readiness', label: 'AI-readiness', color: '#8b5cf6' },
];

export default function ScoreTrendChart() {
  const { user } = useUser();
  const uid = user?.id;
  const [showAll, setShowAll] = useState(false);
  const { data: audits = [], isLoading } = useQuery({
    queryKey: ['audit-trend', uid],
    queryFn: () => base44.entities.Audit.filter({ client_id: uid }, 'created_date', 50),
    enabled: !!uid,
  });

  const chartData = useMemo(() => audits.map((a) => ({
    date: new Date(a.created_date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    overall_score: a.overall_score ?? 0,
    seo: a.scores?.seo ?? 0,
    performance: a.scores?.performance ?? 0,
    content: a.scores?.content ?? 0,
    technical: a.scores?.technical ?? 0,
    ai_readiness: a.scores?.ai_readiness ?? 0,
    url: a.url,
  })), [audits]);

  const delta = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0].overall_score;
    const last = chartData[chartData.length - 1].overall_score;
    return { value: last - first, first, last };
  }, [chartData]);

  const visibleSeries = showAll ? SERIES : SERIES.slice(0, 2);

  if (isLoading) return <div className="grid h-64 place-items-center rounded-3xl border border-slate-200 bg-white"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" /></div>;

  if (chartData.length === 0) return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">SEO score trend</h2>
      <p className="mt-4 text-sm text-slate-500">Run your first audit to start tracking score improvements over time. <a href="/app/audit" className="font-medium text-indigo-600">Run an audit →</a></p>
    </div>
  );

  if (chartData.length === 1) return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">SEO score trend</h2>
      <p className="mt-4 text-sm text-slate-500">You have one audit on record. Run another after our team has made improvements to see your score climb over time.</p>
    </div>
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">SEO score trend</h2>
          <p className="text-sm text-slate-500">Your audit scores over time — see the impact of our work.</p>
        </div>
        {delta && (
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${delta.value > 0 ? 'bg-emerald-50 text-emerald-700' : delta.value < 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
            {delta.value > 0 ? <TrendingUp className="h-4 w-4" /> : delta.value < 0 ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            {delta.value > 0 ? '+' : ''}{delta.value} pts since first audit
          </div>
        )}
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)', fontSize: 13 }} labelStyle={{ fontWeight: 600 }} />
            {showAll && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />}
            {visibleSeries.map((s) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={s.key === 'overall_score' ? 3 : 2} dot={{ r: 3, fill: s.color }} activeDot={{ r: 5 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {SERIES.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-xs text-slate-500"><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{s.label}</span>
          ))}
        </div>
        <button onClick={() => setShowAll((v) => !v)} className="text-xs font-semibold text-indigo-600 hover:underline">{showAll ? 'Show summary' : 'Show all metrics'}</button>
      </div>
    </div>
  );
}