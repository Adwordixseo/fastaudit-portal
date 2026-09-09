import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import InviteUserDialog from '@/components/admin/InviteUserDialog';
import ExportButtons from '@/components/portal/ExportButtons';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fmtDate } from '@/lib/format';

export default function AdminUsers() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState('user');
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => base44.entities.User.list('-created_date') });
  const { data: subs = [] } = useQuery({ queryKey: ['admin-subs'], queryFn: () => base44.entities.Subscription.list() });
  const planOf = (u) => subs.find((s) => s.client_id === u.id && s.status === 'active');
  const rows = users.filter((u) => filter === 'all' || (filter === 'active' ? planOf(u) : !planOf(u)));

  const toggle = async (u) => { await base44.entities.User.update(u.id, { account_status: u.account_status === 'inactive' ? 'active' : 'inactive' }); qc.invalidateQueries({ queryKey: ['admin-users'] }); };
  const toggleTeam = async (u) => { await base44.entities.User.update(u.id, { is_team_member: !u.is_team_member }); qc.invalidateQueries({ queryKey: ['admin-users'] }); };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Users" description="All registered clients, their plan status and account state."
        action={<div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All users</SelectItem><SelectItem value="active">Active plan</SelectItem><SelectItem value="expired">No active plan</SelectItem></SelectContent></Select>
          <ExportButtons data={rows} filename="users" title="Users" headers={[{ key: 'full_name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'company', label: 'Company' }, { key: 'website', label: 'Website' }, { key: 'location', label: 'Location' }, { key: 'created_date', label: 'Joined' }]} />
          <Button onClick={() => { setInviteRole('user'); setInviteOpen(true); }} className="rounded-full"><UserPlus className="mr-2 h-4 w-4" /> Add user</Button>
          <Button onClick={() => { setInviteRole('team'); setInviteOpen(true); }} variant="outline" className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"><UserPlus className="mr-2 h-4 w-4" /> Invite team member</Button>
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
                <TableCell><StatusBadge status={u.account_status || 'active'} />{u.role === 'admin' && <div className="mt-1 text-xs text-indigo-600">Admin</div>}{u.is_team_member && <div className="mt-1 text-xs text-violet-600">Team</div>}</TableCell>
                <TableCell className="text-sm text-slate-500">{fmtDate(u.created_date)}</TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-2">{u.role !== 'admin' && <Button size="sm" variant={u.is_team_member ? 'secondary' : 'outline'} className="rounded-full" onClick={() => toggleTeam(u)}>{u.is_team_member ? 'Revoke team' : 'Grant team'}</Button>}{u.role !== 'admin' && <Button size="sm" variant="outline" className="rounded-full" onClick={() => toggle(u)}>{u.account_status === 'inactive' ? 'Activate' : 'Deactivate'}</Button>}</div></TableCell>
              </TableRow>); })}
          </TableBody>
        </Table>
      </div>
      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} defaultRole={inviteRole} />
    </div>
  );
}