import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/site/Logo';

const columns = [
  { title: 'Platform', links: [{ l: 'Website Audit', to: '/app/audit' }, { l: 'Monthly Reports', to: '/app/reports' }, { l: 'Project Tracking', to: '/app/projects' }, { l: 'Approvals', to: '/app/reports' }] },
  { title: 'Solutions', links: [{ l: 'For Agencies', href: '/#solutions' }, { l: 'For SaaS', href: '/#solutions' }, { l: 'For E-Commerce', href: '/#solutions' }, { l: 'For Local Business', href: '/#solutions' }] },
  { title: 'Resources', links: [{ l: 'Free Audit', to: '/app/audit' }, { l: 'Pricing', href: '/#pricing' }, { l: 'FAQ', href: '/#faq' }, { l: 'Support', to: '/app/support' }] },
  { title: 'Company', links: [{ l: 'Login', to: '/login' }, { l: 'Team login', to: '/team' }, { l: 'Get started', to: '/register' }, { l: 'Privacy Policy', href: '#' }, { l: 'Terms of Service', href: '#' }] },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Audit your website, choose a growth package and track every milestone, report and approval from one beautiful portal.
            </p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((x) => (
                  <li key={x.l}>
                    {x.to ? <Link to={x.to} className="text-sm text-slate-500 hover:text-indigo-600">{x.l}</Link> : <a href={x.href} className="text-sm text-slate-500 hover:text-indigo-600">{x.l}</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Adwordix. All rights reserved.</span>
          <span>Built for agencies that deliver measurable growth.</span>
        </div>
      </div>
    </footer>
  );
}