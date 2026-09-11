import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { base44 } from '@/api/base44Client';
import PortalLogo from '@/components/portal/PortalLogo';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';

export default function PortalLayout({ nav, label, footerLink }) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const Nav = () => (
    <nav className="flex-1 space-y-1 px-3">
      {nav.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}
          className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white')}>
          <n.icon className="h-4 w-4" /> {n.label}
        </NavLink>
      ))}
    </nav>
  );

  const Side = () => (
    <div className="flex h-full flex-col bg-[#0B1020] py-6 text-white">
      <div className="px-6"><PortalLogo /><span className="mt-2 inline-block rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-300">{label}</span></div>
      <div className="mt-8 flex-1 overflow-y-auto"><Nav /></div>
      <div className="mx-3 mt-4 space-y-2 border-t border-white/10 pt-4">
        {footerLink && <Link to={footerLink.to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-white"><footerLink.icon className="h-4 w-4" /> {footerLink.label}</Link>}
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to website</Link>
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold">{(user?.full_name || user?.email || '?')[0].toUpperCase()}</span>
          <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{user?.full_name || 'Client'}</div><div className="truncate text-xs text-slate-400">{user?.email}</div></div>
          <button onClick={() => base44.auth.logout('/')} title="Sign out" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen"><Side /></aside>
      <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:hidden">
        <PortalLogo />
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-700"><Menu className="h-5 w-5" /></button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72"><Side /><button onClick={() => setOpen(false)} className="absolute right-3 top-6 rounded-lg p-2 text-slate-300"><X className="h-5 w-5" /></button></div>
        </div>
      )}
      <main className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-10 lg:py-10"><Outlet /></main>
      <Toaster richColors position="top-right" />
    </div>
  );
}