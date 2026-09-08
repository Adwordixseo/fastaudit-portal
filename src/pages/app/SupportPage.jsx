import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LifeBuoy } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import TicketForm from '@/components/tickets/TicketForm';
import TicketThread from '@/components/tickets/TicketThread';

export default function SupportPage() {
  const { user } = useUser();
  const qc = useQueryClient();
  const { data: tickets = [] } = useQuery({ queryKey: ['tickets', user?.id], queryFn: () => base44.entities.Ticket.filter({ client_id: user.id }, '-created_date'), enabled: !!user });

  const create = async (form) => {
    await base44.entities.Ticket.create({ ...form, client_id: user.id, client_email: user.email, status: 'open', replies: [] });
    qc.invalidateQueries({ queryKey: ['tickets'] });
    toast.success('Ticket submitted — we usually reply within 24 hours.');
  };
  const reply = async (t, message) => {
    await base44.entities.Ticket.update(t.id, { replies: [...(t.replies || []), { by: user.email, role: 'client', message, date: new Date().toISOString() }] });
    qc.invalidateQueries({ queryKey: ['tickets'] });
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Help & support" title="Support & requests" description="Raise a ticket, request documents or ask anything — and track every reply here." />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <TicketForm onSubmit={create} />
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Your tickets</h2>
          {tickets.length === 0 ? <EmptyState icon={LifeBuoy} title="No tickets yet" text="Anything you send us will show up here with its status and replies." /> : tickets.map((t) => <TicketThread key={t.id} ticket={t} me={user} onReply={reply} />)}
        </div>
      </div>
    </div>
  );
}