import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import PageHeader from '@/components/portal/PageHeader';
import TicketThread from '@/components/tickets/TicketThread';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminTickets() {
  const { user } = useUser();
  const qc = useQueryClient();
  const [status, setStatus] = useState('all');
  const { data: tickets = [] } = useQuery({ queryKey: ['admin-tickets'], queryFn: () => base44.entities.Ticket.list('-created_date') });
  const rows = tickets.filter((t) => status === 'all' || t.status === status);
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-tickets'] });

  const reply = async (t, message) => {
    await base44.entities.Ticket.update(t.id, { status: t.status === 'open' ? 'in_progress' : t.status, replies: [...(t.replies || []), { by: user.email, role: 'admin', message, date: new Date().toISOString() }] });
    refresh();
  };
  const setTicketStatus = async (t, s) => { await base44.entities.Ticket.update(t.id, { status: s }); refresh(); };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Support tickets" description="Reply to client requests and keep every ticket moving."
        action={<Select value={status} onValueChange={setStatus}><SelectTrigger className="w-44 rounded-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All tickets</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="in_progress">In progress</SelectItem><SelectItem value="resolved">Resolved</SelectItem></SelectContent></Select>} />
      <div className="space-y-3">
        {rows.length === 0 && <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No tickets here.</p>}
        {rows.map((t) => (
          <TicketThread key={t.id} ticket={t} me={user} onReply={reply}
            headerExtra={<div onClick={(e) => e.stopPropagation()}>
              <Select value={t.status} onValueChange={(s) => setTicketStatus(t, s)}><SelectTrigger className="h-8 w-36 rounded-full text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="in_progress">In progress</SelectItem><SelectItem value="resolved">Resolved</SelectItem></SelectContent></Select>
            </div>} />
        ))}
      </div>
    </div>
  );
}