import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import BillingToggle from '@/components/packages/BillingToggle';
import PackageCard from '@/components/packages/PackageCard';

export default function PricingSection() {
  const [cycle, setCycle] = useState('monthly');
  const navigate = useNavigate();
  const { data: packages = [] } = useQuery({ queryKey: ['packages', 'active'], queryFn: () => base44.entities.Package.filter({ active: true }, 'sort_order') });

  return (
    <section id="pricing" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Pricing</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">Simple packages. Serious results.</h2>
          <p className="mt-4 text-slate-500">Every package unlocks your full PDF audit report, a dedicated project dashboard and monthly reporting.</p>
          <div className="mt-8"><BillingToggle value={cycle} onChange={setCycle} /></div>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {packages.map((p) => <PackageCard key={p.id} pkg={p} cycle={cycle} onSelect={() => navigate(`/app/packages?plan=${p.id}&cycle=${cycle}`)} ctaLabel="Choose package" />)}
        </div>
      </div>
    </section>
  );
}