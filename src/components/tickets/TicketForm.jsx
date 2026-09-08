import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const empty = { subject: '', message: '', category: 'support', priority: 'medium' };

export default function TicketForm({ onSubmit }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e) => { e.preventDefault(); setSaving(true); await onSubmit(form); setForm(empty); setSaving(false); };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Raise a ticket</h2>
      <div><Label>Subject</Label><Input required value={form.subject} onChange={(e) => set('subject')(e.target.value)} placeholder="What do you need help with?" className="mt-1.5" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Type</Label>
          <Select value={form.category} onValueChange={set('category')}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="support">Support</SelectItem><SelectItem value="document_request">Request a document</SelectItem><SelectItem value="query">Custom query</SelectItem><SelectItem value="billing">Billing</SelectItem></SelectContent></Select></div>
        <div><Label>Priority</Label>
          <Select value={form.priority} onValueChange={set('priority')}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
      </div>
      <div><Label>Message</Label><Textarea required rows={5} value={form.message} onChange={(e) => set('message')(e.target.value)} placeholder="Describe your request in detail…" className="mt-1.5" /></div>
      <Button type="submit" disabled={saving} className="w-full rounded-xl">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Submit ticket</>}</Button>
    </form>
  );
}