import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import { fmtDateTime, humanize } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function TicketThread({ ticket, me, onReply, headerExtra }) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState('');
  const send = async () => { if (!reply.trim()) return; await onReply(ticket, reply.trim()); setReply(''); };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white">
      <button onClick={() => setOpen(!open)} className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-900">{ticket.subject}</h3><StatusBadge status={ticket.status} /><StatusBadge status={ticket.priority} /></div>
          <p className="mt-1 text-xs text-slate-500 capitalize">{humanize(ticket.category)} · {ticket.client_email} · {fmtDateTime(ticket.created_date)} · {(ticket.replies || []).length} replies</p>
        </div>
        {headerExtra}
      </button>
      {open && (
        <div className="border-t border-slate-100 p-5">
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><div className="mb-1 text-xs font-medium text-slate-500">{ticket.client_email}</div>{ticket.message}</div>
            {(ticket.replies || []).map((r, i) => (
              <div key={i} className={cn('rounded-2xl p-4 text-sm', r.role === 'admin' ? 'ml-6 bg-indigo-50 text-indigo-900' : 'bg-slate-50 text-slate-700')}>
                <div className="mb-1 text-xs font-medium opacity-70">{r.role === 'admin' ? 'Support team' : r.by} · {fmtDateTime(r.date)}</div>{r.message}
              </div>
            ))}
          </div>
          {ticket.status !== 'resolved' && (
            <div className="mt-4 flex gap-2">
              <Textarea rows={2} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" />
              <Button onClick={send} disabled={!reply.trim()} className="h-auto rounded-xl"><Send className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}