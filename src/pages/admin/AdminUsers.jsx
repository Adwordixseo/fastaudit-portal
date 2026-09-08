import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import InviteUserDialog from '@/components/admin/InviteUserDialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fmtDate } from '@/lib/format';

export default function AdminUsers() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [inviteOpen, setInviteOpen] = useState(false);
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => base44.entities.User.list('-created_date') });
  const { data: subs = [] } = useQuery({ queryKey: ['admin-subs'], queryFn: () => base44.entities.Subscription.list() });
  const planOf = (u) => subs.find((s) => s.client_id === u.id && s.status === 'active');
  const rows = users.filter((u) => filter === 'all' || (filter === 'active' ? planOf(u) : !planOf(u)));

  const toggle = async (u) => { await base44.entities.User.update(u.id, { account_status: u.account_status === 'inactive' ? 'active' : 'inactive' }); qc.invalidateQueries({ queryKey: ['admin-users'] }); };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Users" description="All registered clients, their plan status and account state."
        action={<div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All users</SelectItem><SelectItem value="active">Active plan</SelectItem><SelectItem value="expired">No active plan</SelectItem></SelectContent></Select>
          <Button onClick={() => setInviteOpen(true)} className="rounded-full"><UserPlus className="mr-2 h-4 w-4" /> Add user</Button>
        </div>} />
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <Table>
          <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Company</TableHead><TableHead>Website</TableHead><TableHead>Plan</TableHead><TableHead>Account</TableHead><TableHead>Joined</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {rows.map((u) => { const plan = planOf(u); return (
              <TableRow key={u.id}>
                <TableCell><div className="font-medium text-slate-900">{u.full_name || '—'}</div><div className="text-xs text-slate-500">{u.email}{u.phone ? ` · ${u.phone}` : ''}</div></TableCell>
                <TableCell className="text-sm text-slate-600">{u.company || '—'}{u.location ? <div className="text-xs text-slate-400">{u.location}</div> : null}</TableCell>
                <TableCell className="text-sm text-slate-600">{u.website || '—'}</TableCell>
                <TableCell>{plan ? <StatusBadge status="active" /> : <StatusBadge status="expired" />}<div className="mt-1 text-xs text-slate-500">{plan?.package_name || 'No plan'}</div></TableCell>
                <TableCell><StatusBadge status={u.account_status || 'active'} />{u.role === 'admin' && <div className="mt-1 text-xs text-indigo-600">Admin</div>}</TableCell>
                <TableCell className="text-sm text-slate-500">{fmtDate(u.created_date)}</TableCell>
                <TableCell className="text-right">{u.role !== 'admin' && <Button size="sm" variant="outline" className="rounded-full" onClick={() => toggle(u)}>{u.account_status === 'inactive' ? 'Activate' : 'Deactivate'}</Button>}</TableCell>
              </TableRow>); })}
          </TableBody>
        </Table>
      </div>
      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}