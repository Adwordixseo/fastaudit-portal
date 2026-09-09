import { format } from 'date-fns';

export const fmtDate = (d) => (d ? format(new Date(d), 'dd MMM yyyy') : '—');
export const fmtDateTime = (d) => (d ? format(new Date(d), 'dd MMM yyyy, HH:mm') : '—');
export const fmtMonth = (m) => (m ? format(new Date(m + '-01T00:00:00'), 'MMMM yyyy') : '—');
export const money = (n) => '$' + Number(n || 0).toLocaleString();

export const cycleMonths = { monthly: 1, quarterly: 3, yearly: 12 };
export const cycleLabel = { monthly: '/ month', quarterly: '/ quarter', yearly: '/ year' };
export const cyclePrice = (pkg, cycle) =>
  cycle === 'monthly' ? pkg.price_monthly : cycle === 'quarterly' ? pkg.price_quarterly : pkg.price_yearly;

export const statusTone = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  todo: 'bg-slate-100 text-slate-600 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  expired: 'bg-slate-100 text-slate-600 border-slate-200',
  on_hold: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  open: 'bg-rose-50 text-rose-700 border-rose-200',
  in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  awaiting_approval: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  changes_requested: 'bg-rose-50 text-rose-700 border-rose-200',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};
export const humanize = (s) => (s || '').replace(/_/g, ' ');

export const fileTypeFromName = (name = '') => {
  const ext = name.split('?')[0].split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) return 'document';
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return 'spreadsheet';
  return 'other';
};

export const scoreColor = (n) => (n >= 75 ? 'text-emerald-500' : n >= 50 ? 'text-amber-500' : 'text-rose-500');
export const scoreStroke = (n) => (n >= 75 ? '#10b981' : n >= 50 ? '#f59e0b' : '#f43f5e');