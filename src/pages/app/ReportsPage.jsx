import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import DocumentCard from '@/components/reports/DocumentCard';
import DocumentViewer from '@/components/reports/DocumentViewer';
import RequestChangeDialog from '@/components/reports/RequestChangeDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function ReportsPage() {
  const { user } = useUser();
  const uid = user?.id;
  const qc = useQueryClient();
  const [projectFilter, setProjectFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [viewing, setViewing] = useState(null);
  const [changing, setChanging] = useState(null);

  const { data: projects = [] } = useQuery({ queryKey: ['projects', uid], queryFn: () => base44.entities.Project.filter({ client_id: uid }), enabled: !!uid });
  const { data: docs = [], isLoading } = useQuery({ queryKey: ['documents', uid], queryFn: () => base44.entities.Document.filter({ client_id: uid }, '-created_date'), enabled: !!uid });
  const projectName = (id) => projects.find((p) => p.id === id)?.name || 'Project';
  const filtered = docs.filter((d) => (projectFilter === 'all' || d.project_id === projectFilter) && (!monthFilter || d.report_month === monthFilter) && d.status !== 'draft');

  const decide = async (doc, status, note = '') => {
    await base44.entities.Document.update(doc.id, { status, history: [...(doc.history || []), { action: status, by: user.email, note, date: new Date().toISOString() }] });
    qc.invalidateQueries({ queryKey: ['documents'] });
    toast.success(status === 'approved' ? 'Deliverable approved' : 'Change request sent to our team');
    if (status === 'approved' || status === 'changes_requested') {
      try {
        await base44.functions.invoke('notifyTeamDocumentDecision', {
          decision: status,
          documentTitle: doc.title,
          projectName: projectName(doc.project_id),
          projectId: doc.project_id,
          clientName: user.full_name,
          clientEmail: user.email,
          note,
        });
      } catch { /* alert is best-effort; don't block the client */ }
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Reports" title="Monthly reports & deliverables" description="Preview, download and approve everything our team uploads for your projects."
        action={<div className="flex gap-2">
          <Select value={projectFilter} onValueChange={setProjectFilter}><SelectTrigger className="w-44 rounded-full"><SelectValue placeholder="All projects" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All projects</SelectItem>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>
          <Input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="w-44 rounded-full" />
        </div>} />
      {!isLoading && filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No reports yet" text={docs.length ? 'No documents match these filters.' : 'Your monthly reports and deliverables will appear here as soon as our team uploads them.'} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">{filtered.map((d) => <DocumentCard key={d.id} doc={d} projectName={projectName(d.project_id)} onView={setViewing} onApprove={(doc) => decide(doc, 'approved')} onRequestChange={setChanging} />)}</div>
      )}
      <DocumentViewer doc={viewing} open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} />
      <RequestChangeDialog open={!!changing} onOpenChange={(o) => !o && setChanging(null)} onSubmit={(note) => { decide(changing, 'changes_requested', note); setChanging(null); }} />
    </div>
  );
}