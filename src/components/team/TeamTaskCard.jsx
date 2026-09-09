import React, { useState } from 'react';
import { Calendar, Paperclip, MessageSquare, Upload, Flag } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fmtDate } from '@/lib/format';

const priorityTone = { low: 'text-emerald-600 bg-emerald-50', medium: 'text-amber-600 bg-amber-50', high: 'text-rose-600 bg-rose-50' };
const statusLabel = { todo: 'To do', in_progress: 'In progress', review: 'Review', done: 'Done' };

export default function TeamTaskCard({ task, onSaved }) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);

  const update = async (patch) => { await base44.entities.TeamTask.update(task.id, patch); onSaved(); };
  const saveStatus = (v) => update({ status: v });

  const addComment = async () => {
    if (!comment.trim()) return;
    const feedback = [...(task.feedback || []), { by: user?.email, message: comment.trim(), date: new Date().toISOString() }];
    setComment('');
    await update({ feedback });
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const attachments = [...(task.attachments || []), { file_url, name: file.name, by: user?.email, date: new Date().toISOString() }];
      await update({ attachments });
    } finally { setUploading(false); e.target.value = ''; }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900">{task.title}</h4>
          {task.description && <p className="mt-0.5 text-xs text-slate-500">{task.description}</p>}
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${priorityTone[task.priority] || priorityTone.medium}`}><Flag className="h-3 w-3" /> {task.priority}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
        <span>Assigned to: <span className="font-medium text-slate-700">{task.assigned_to_email}</span></span>
        <span>By: {task.assigned_by_email}</span>
        {task.deadline && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {fmtDate(task.deadline)}</span>}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-slate-500">Status</span>
        <Select value={task.status} onValueChange={saveStatus}>
          <SelectTrigger className="h-8 w-36 rounded-full text-xs"><SelectValue>{statusLabel[task.status]}</SelectValue></SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To do</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 text-xs font-medium text-slate-600"><Paperclip className="h-3.5 w-3.5" /> Attachments · {task.attachments?.length || 0}</p>
          <label className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-indigo-600">
            <Upload className="h-3.5 w-3.5" /> {uploading ? 'Uploading...' : 'Upload'}
            <input type="file" className="hidden" onChange={onUpload} disabled={uploading} />
          </label>
        </div>
        {task.attachments?.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {task.attachments.map((a, i) => (
              <a key={i} href={a.file_url} target="_blank" rel="noreferrer" className="block truncate rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">{a.name}</a>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="flex items-center gap-1 text-xs font-medium text-slate-600"><MessageSquare className="h-3.5 w-3.5" /> Feedback · {task.feedback?.length || 0}</p>
        <div className="mt-2 space-y-1.5">
          {task.feedback?.map((f, i) => (
            <div key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-xs text-slate-700">{f.message}</p>
              <p className="mt-0.5 text-[10px] text-slate-400">{f.by} · {fmtDate(f.date)}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add feedback..." className="h-8 text-xs" onKeyDown={(e) => e.key === 'Enter' && addComment()} />
          <Button size="sm" variant="outline" className="rounded-full" onClick={addComment}>Send</Button>
        </div>
      </div>
    </div>
  );
}