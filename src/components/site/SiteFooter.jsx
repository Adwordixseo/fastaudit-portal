import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/site/Logo';

const columns = [
  { title: 'Features', links: [{ l: 'Website Audit', to: '/platform/instant-audit' }, { l: 'Project Progress', to: '/platform/project-progress' }, { l: 'Monthly Reports', to: '/platform/monthly-reports' }, { l: 'Approvals', to: '/platform/approvals' }, { l: 'Support Tickets', to: '/platform/support-tickets' }, { l: 'Renew & Upgrade', to: '/platform/renew-upgrade' }] },
  { title: 'Solutions', links: [{ l: 'For Agencies', to: '/solutions/agencies' }, { l: 'For SaaS', to: '/solutions/saas-startups' }, { l: 'For E-Commerce', to: '/solutions/ecommerce' }, { l: 'For Local Business', to: '/solutions/local-business' }] },
  { title: 'Company', links: [{ l: 'Contact', to: '/contact' }, { l: 'Login', to: '/login' }, { l: 'Get started', to: '/register' }, { l: 'Privacy Policy', to: '/privacy-policy' }, { l: 'Terms of Service', to: '/terms' }] },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0815]">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <h3 className="mt-6 max-w-sm font-heading text-2xl font-bold leading-tight text-white">
              Grow visibility, <span className="gradient-text">the measurable way.</span>
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Audit your website, choose a growth package and track every milestone, report and approval from one beautiful portal.
            </p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-white">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((x) => (
                  <li key={x.l}>
                    <Link to={x.to} className="text-sm text-slate-400 hover:text-pink-400">{x.l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Adwordix. All rights reserved.</span>
          <span>Built for agencies that deliver measurable growth.</span>
        </div>
      </div>
    </footer>
  );
}