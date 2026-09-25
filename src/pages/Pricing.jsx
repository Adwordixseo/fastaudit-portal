import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import BillingToggle from '@/components/packages/BillingToggle';
import PackageCard from '@/components/packages/PackageCard';

export default function Pricing() {
  const [cycle, setCycle] = useState('monthly');
  const navigate = useNavigate();
  const { data: packages = [] } = useQuery({ queryKey: ['packages', 'active'], queryFn: () => base44.entities.Package.filter({ active: true }, 'sort_order') });

  return (
    <div className="min-h-screen bg-[#0a0815]">
      <SiteHeader />
      <section className="bg-[#0a0815] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">Pricing</span>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Simple packages. Serious results.</h1>
            <p className="mt-4 text-slate-400">Every package unlocks your full PDF audit report, a dedicated project dashboard and monthly reporting.</p>
            <div className="mt-8"><BillingToggle value={cycle} onChange={setCycle} dark /></div>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {packages.map((p) => <PackageCard key={p.id} pkg={p} cycle={cycle} onSelect={() => navigate(`/app/packages?plan=${p.id}&cycle=${cycle}`)} ctaLabel="Choose package" dark />)}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}