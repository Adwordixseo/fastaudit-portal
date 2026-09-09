import React, { useMemo } from 'react';
import { Upload, Paperclip, MessageSquare, FolderKanban, ListTodo } from 'lucide-react';
import { fmtDateTime } from '@/lib/format';

const iconMap = {
  upload: { Icon: Upload, tone: 'bg-indigo-50 text-indigo-600' },
  attachment: { Icon: Paperclip, tone: 'bg-violet-50 text-violet-600' },
  comment: { Icon: MessageSquare, tone: 'bg-emerald-50 text-emerald-600' },
  project: { Icon: FolderKanban, tone: 'bg-slate-100 text-slate-600' },
  task: { Icon: ListTodo, tone: 'bg-amber-50 text-amber-600' },
};

function describe(e) {
  switch (e.type) {
    case 'upload':
      return <>Uploaded deliverable <span className="font-medium text-slate-900">{e.title}</span>{e.project ? <> for <span className="font-medium text-slate-900">{e.project}</span></> : null}</>;
    case 'attachment':
      return <>Attached <span className="font-medium text-slate-900">{e.name}</span> to task <span className="font-medium text-slate-900">{e.task}</span></>;
    case 'comment':
      return <>Commented on <span className="font-medium text-slate-900">{e.task}</span>: “{e.message}”</>;
    case 'task':
      return <>Created task <span className="font-medium text-slate-900">{e.title}</span>{e.project ? <> in <span className="font-medium text-slate-900">{e.project}</span></> : null}</>;
    case 'project':
      return <>Project <span className="font-medium text-slate-900">{e.title}</span> updated</>;
    default:
      return null;
  }
}

export default function TeamActivityFeed({ projects = [], tasks = [], docs = [] }) {
  const events = useMemo(() => {
    const evts = [];
    const projectNames = new Map(projects.map((p) => [p.id, p.name]));

    docs.forEach((d) => {
      const h = d.history?.[0];
      evts.push({ id: `doc-${d.id}`, type: 'upload', by: h?.by || 'Team', title: d.title, project: projectNames.get(d.project_id), date: h?.date || d.created_date });
    });

    tasks.forEach((t) => {
      (t.feedback || []).forEach((f, i) => evts.push({ id: `fb-${t.id}-${i}`, type: 'comment', by: f.by, message: f.message, task: t.title, project: t.project_name, date: f.date }));
      (t.attachments || []).forEach((a, i) => evts.push({ id: `att-${t.id}-${i}`, type: 'attachment', by: a.by, name: a.name, task: t.title, project: t.project_name, date: a.date }));
      evts.push({ id: `task-${t.id}`, type: 'task', by: t.assigned_by_name || t.assigned_by_email, title: t.title, project: t.project_name, date: t.created_date });
    });

    projects.forEach((p) => {
      evts.push({ id: `proj-${p.id}`, type: 'project', title: p.name, status: p.status, date: p.updated_date || p.created_date });
    });

    return evts.filter((e) => e.date).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 25);
  }, [projects, tasks, docs]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Activity feed</h2>
      {events.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">No recent activity yet.</p>
      ) : (
        <ol className="space-y-1">
          {events.map((e) => {
            const { Icon, tone } = iconMap[e.type];
            return (
              <li key={e.id} className="flex gap-3 rounded-2xl px-2 py-2.5 hover:bg-slate-50">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone}`}><Icon className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700">{describe(e)}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{e.by ? `${e.by} · ` : ''}{fmtDateTime(e.date)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}