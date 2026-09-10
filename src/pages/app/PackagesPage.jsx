import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import { useSubscription } from '@/hooks/useSubscription';
import PageHeader from '@/components/portal/PageHeader';
import BillingToggle from '@/components/packages/BillingToggle';
import PackageCard from '@/components/packages/PackageCard';
import PurchaseDialog from '@/components/packages/PurchaseDialog';
import MySubscriptions from '@/components/packages/MySubscriptions';

export default function PackagesPage() {
  const params = new URLSearchParams(window.location.search);
  const { user } = useUser();
  const { subscriptions, activeSubscription } = useSubscription();
  const qc = useQueryClient();
  const [cycle, setCycle] = useState(params.get('cycle') || 'monthly');
  const [selected, setSelected] = useState(null);
  const { data: packages = [] } = useQuery({ queryKey: ['packages', 'active'], queryFn: () => base44.entities.Package.filter({ active: true }, 'sort_order') });

  const preselect = params.get('plan');
  React.useEffect(() => { if (preselect && packages.length && !selected) { const p = packages.find((x) => x.id === preselect); if (p) setSelected(p); } }, [preselect, packages]); // eslint-disable-line

  const renew = (sub) => { const p = packages.find((x) => x.id === sub.package_id); if (p) { setCycle(sub.billing_cycle); setSelected(p); } };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Packages" title="Choose your growth package" description="Each package covers one website. Need more websites? Purchase a package for each one."
        action={<BillingToggle value={cycle} onChange={setCycle} />} />
      <div className="grid gap-6 lg:grid-cols-3">
        {packages.map((p) => (
          <PackageCard key={p.id} pkg={p} cycle={cycle} onSelect={setSelected}
            ctaLabel={activeSubscription ? 'Add website · Buy package' : 'Choose package'} />
        ))}
      </div>
      <MySubscriptions subscriptions={subscriptions} onRenew={renew} />
      <PurchaseDialog pkg={selected} cycle={cycle} user={user} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} onDone={() => qc.invalidateQueries({ queryKey: ['subscriptions'] })} />
    </div>
  );
}