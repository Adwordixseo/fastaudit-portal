import React, { useState } from 'react';
import { Phone, Loader2, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function PhoneRequired({ onSaved }) {
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7) { setError('Enter a valid phone number'); return; }
    setError('');
    setSaving(true);
    try {
      await base44.auth.updateMe({ phone: phone.trim() });
      onSaved?.();
    } catch (err) {
      setError(err?.message || 'Could not save your phone number');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="relative overflow-hidden rounded-3xl bg-[#0B1020] p-6 text-white sm:p-8">
      <div className="grid-fade absolute inset-0" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300"><Phone className="h-3.5 w-3.5" /> One quick step</span>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Add your phone number to run audits</h2>
        <p className="mt-2 text-sm text-slate-300">We need a contact number on file so our team can follow up on your audit findings. This is required once — it's saved to your account.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4">
            <Phone className="h-4 w-4 text-slate-400" />
            <input value={phone} onChange={(e) => { setPhone(e.target.value); setError(''); }} placeholder="+1 555 123 4567" disabled={saving} className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-500" />
          </div>
          <Button type="submit" disabled={saving || !phone.trim()} className="h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 font-semibold hover:from-indigo-400 hover:to-violet-400">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : 'Save & continue'}
          </Button>
        </div>
        {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400"><ShieldCheck className="h-3.5 w-3.5" /> Your number stays private and is only used for audit follow-up.</p>
      </div>
    </form>
  );
}