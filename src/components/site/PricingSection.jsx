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
    <section id="pricing" className="bg-[#0f0a1e] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">Pricing</span>
          <h2 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Start for Free & Choose the Right Plan to Succeed</h2>
          <p className="mt-4 text-slate-400">You can access website audit services and more on one dashboard with our subscription-based website audit packages.</p>
          <div className="mt-8"><BillingToggle value={cycle} onChange={setCycle} dark /></div>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {packages.map((p) => <PackageCard key={p.id} pkg={p} cycle={cycle} onSelect={() => navigate(`/app/packages?plan=${p.id}&cycle=${cycle}`)} ctaLabel="Choose package" dark />)}
        </div>
      </div>
    </section>
  );
}