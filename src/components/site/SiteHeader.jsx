import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/site/Logo';
import { useUser } from '@/hooks/useUser';

const nav = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Free Audit', to: '/app/audit' },
  { label: 'Resources', href: '/#resources' },
  { label: 'FAQ', href: '/#faq' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useUser();
  const linkCls = 'text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => n.to ? <Link key={n.label} to={n.to} className={linkCls}>{n.label}</Link> : <a key={n.label} href={n.href} className={linkCls}>{n.label}</a>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <Button asChild className="rounded-full px-5"><Link to={isAdmin ? '/admin' : '/app'}>Go to dashboard <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-full"><Link to="/login">Login</Link></Button>
              <Button asChild className="rounded-full px-5 shadow-lg shadow-indigo-500/25"><Link to="/register">Get started free</Link></Button>
            </>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 lg:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {nav.map((n) => n.to
              ? <Link key={n.label} to={n.to} onClick={() => setOpen(false)} className="py-1.5 text-base font-medium text-slate-800">{n.label}</Link>
              : <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="py-1.5 text-base font-medium text-slate-800">{n.label}</a>)}
            <div className="mt-2 flex gap-3">
              {user ? <Button asChild className="flex-1 rounded-full"><Link to={isAdmin ? '/admin' : '/app'}>Dashboard</Link></Button> : (
                <>
                  <Button asChild variant="outline" className="flex-1 rounded-full"><Link to="/login">Login</Link></Button>
                  <Button asChild className="flex-1 rounded-full"><Link to="/register">Get started</Link></Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}