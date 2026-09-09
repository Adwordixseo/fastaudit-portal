import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { CheckCircle2 } from 'lucide-react';

const weekStart = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - day);
  return date;
};
const fmtWeek = (d) => `${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getDate()}`;

export default function WeeklyTaskCompletionChart({ tasks = [] }) {
  const data = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'done' && t.updated_date);
    const buckets = new Map();
    const thisWeek = weekStart(new Date());
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const ws = new Date(thisWeek);
      ws.setDate(ws.getDate() - i * 7);
      const key = ws.toISOString().slice(0, 10);
      weeks.push({ key, label: fmtWeek(ws), count: 0 });
      buckets.set(key, weeks[weeks.length - 1]);
    }
    done.forEach((t) => {
      const ws = weekStart(t.updated_date);
      const key = ws.toISOString().slice(0, 10);
      const b = buckets.get(key);
      if (b) b.count += 1;
    });
    return weeks;
  }, [tasks]);

  const total = data.reduce((a, b) => a + b.count, 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-5 w-5" /></span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Tasks completed per week</h3>
            <p className="text-xs text-slate-500">Last 8 weeks · {total} completed</p>
          </div>
        </div>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} labelStyle={{ fontWeight: 600 }} formatter={(v) => [`${v} task${v === 1 ? '' : 's'}`, 'Completed']} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={42}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.count > 0 ? '#10b981' : '#e2e8f0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}