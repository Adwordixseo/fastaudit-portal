import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Logo from '@/components/site/Logo';

const columns = [
  { title: 'Features', links: [{ l: 'Website Audit', to: '/app/audit' }, { l: 'Monthly Reports', to: '/app/reports' }, { l: 'Project Tracking', to: '/app/projects' }, { l: 'Approvals', to: '/app/reports' }] },
  { title: 'Solutions', links: [{ l: 'For Agencies', to: '/solutions/agencies' }, { l: 'For SaaS', to: '/solutions/saas-startups' }, { l: 'For E-Commerce', to: '/solutions/ecommerce' }, { l: 'For Local Business', to: '/solutions/local-business' }] },
  { title: 'Resources', links: [{ l: 'Free Audit', to: '/app/audit' }, { l: 'Pricing', to: '/pricing' }, { l: 'FAQ', to: '/#faq' }, { l: 'Support', to: '/app/support' }] },
  { title: 'Company', links: [{ l: 'Contact', to: '/contact' }, { l: 'Login', to: '/login' }, { l: 'Team login', to: '/team' }, { l: 'Get started', to: '/register' }, { l: 'Privacy Policy', to: '/privacy-policy' }, { l: 'Terms of Service', to: '/terms' }] },
];

export default function SiteFooter() {
  const { data: latestPosts = [] } = useQuery({
    queryKey: ['footer-latest-resources'],
    queryFn: () => base44.entities.Resource.filter({ is_active: true }, '-created_date', 3),
  });

  return (
    <footer className="border-t border-white/10 bg-[#0a0815]">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
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
        {latestPosts.length > 0 && (
          <div className="mt-12 border-t border-white/10 pt-10">
            <h4 className="text-sm font-semibold text-white">Latest from the blog</h4>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.id} to={`/resources/${post.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-pink-400/40 hover:bg-white/[0.07]">
                  {post.tag && <span className="text-xs font-semibold uppercase tracking-wide text-pink-400">{post.tag}</span>}
                  <p className="mt-1.5 text-sm font-medium text-white group-hover:text-pink-300">{post.title}</p>
                  {post.read_time && <p className="mt-1 text-xs text-slate-500">{post.read_time}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Adwordix. All rights reserved.</span>
          <span>Built for agencies that deliver measurable growth.</span>
        </div>
      </div>
    </footer>
  );
}