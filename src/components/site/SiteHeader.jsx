import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/site/Logo';
import { useUser } from '@/hooks/useUser';
import NavDropdown from '@/components/site/NavDropdown';
import { platformItems, solutionsItems } from '@/lib/siteNav';

const nav = [
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Free Audit', to: '/app/audit' },
  { label: 'Resources', href: '/#resources' },
  { label: 'FAQ', href: '/#faq' },
];

function MobileGroup({ label, items, basePath, onNav }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-slate-100 pb-2">
      <button onClick={() => setExpanded((e) => !e)} className="flex w-full items-center justify-between py-1.5 text-base font-medium text-slate-800">
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="mt-1 flex flex-col gap-1 pl-3">
          {items.map((it) => (
            <Link key={it.slug} to={`${basePath}/${it.slug}`} onClick={onNav} className="py-1.5 text-sm text-slate-600">{it.title}</Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useUser();
  const linkCls = 'text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          <NavDropdown label="Platform" items={platformItems} basePath="/platform" />
          <NavDropdown label="Solutions" items={solutionsItems} basePath="/solutions" />
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
            <MobileGroup label="Platform" items={platformItems} basePath="/platform" onNav={() => setOpen(false)} />
            <MobileGroup label="Solutions" items={solutionsItems} basePath="/solutions" onNav={() => setOpen(false)} />
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