import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import { useSubscription } from '@/hooks/useSubscription';
import PageHeader from '@/components/portal/PageHeader';
import AuditForm from '@/components/audit/AuditForm';
import AuditResult from '@/components/audit/AuditResult';
import AuditHistory from '@/components/audit/AuditHistory';
import UpgradeDialog from '@/components/audit/UpgradeDialog';
import { generateAuditPdf } from '@/lib/generateAuditPdf';

export default function AuditPage() {
  const { user } = useUser();
  const { hasActive } = useSubscription();
  const qc = useQueryClient();
  const initialUrl = new URLSearchParams(window.location.search).get('url') || '';
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const { data: audits = [] } = useQuery({ queryKey: ['audits', user?.id], queryFn: () => base44.entities.Audit.filter({ client_id: user.id }, '-created_date', 50), enabled: !!user });
  const current = selected || audits[0] || null;

  const run = async (url) => {
    setRunning(true);
    const res = await base44.functions.invoke('runSeoAudit', { url });
    setRunning(false);
    if (res.data?.error) { toast.error(res.data.error); return; }
    setSelected(res.data.audit);
    qc.invalidateQueries({ queryKey: ['audits'] });
    toast.success('Audit complete');
  };

  const download = () => {
    if (!hasActive) { setUpgradeOpen(true); return; }
    generateAuditPdf(current);
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Website audit" title="Audit your website" description="Score your SEO, performance, content, technical health and AI-readiness in under a minute." />
      <AuditForm initialUrl={initialUrl} onRun={run} running={running} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {current ? <AuditResult audit={current} canDownload={hasActive} onDownload={download} /> : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">Your results will appear here. Enter a URL above to run your first free audit.</div>
          )}
        </div>
        <AuditHistory audits={audits} selectedId={current?.id} onSelect={setSelected} />
      </div>
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
}