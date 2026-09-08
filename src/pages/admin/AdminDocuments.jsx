import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import UploadDocumentDialog from '@/components/admin/UploadDocumentDialog';
import DocumentCard from '@/components/reports/DocumentCard';
import DocumentViewer from '@/components/reports/DocumentViewer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminDocuments() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [status, setStatus] = useState('all');
  const { data: projects = [] } = useQuery({ queryKey: ['admin-projects'], queryFn: () => base44.entities.Project.list('-updated_date') });
  const { data: docs = [] } = useQuery({ queryKey: ['admin-docs'], queryFn: () => base44.entities.Document.list('-created_date') });
  const rows = docs.filter((d) => status === 'all' || d.status === status);
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-docs'] });
  const remove = async (d) => { if (!confirm(`Delete "${d.title}"?`)) return; await base44.entities.Document.delete(d.id); refresh(); };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Documents & approvals" description="Upload monthly reports, sheets and PDFs to client projects and track approvals."
        action={<div className="flex gap-2">
          <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-48 rounded-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="awaiting_approval">Awaiting approval</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="changes_requested">Changes requested</SelectItem></SelectContent></Select>
          <Button onClick={() => setOpen(true)} className="rounded-full" disabled={!projects.length}><Upload className="mr-2 h-4 w-4" /> Upload</Button>
        </div>} />
      {rows.length === 0 ? <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">{projects.length ? 'No documents yet. Upload your first report.' : 'Create a project first, then upload documents to it.'}</p> : (
        <div className="grid gap-4 lg:grid-cols-2">{rows.map((d) => (
          <div key={d.id} className="relative">
            <DocumentCard doc={d} projectName={projects.find((p) => p.id === d.project_id)?.name || 'Project'} onView={setViewing} />
            <button onClick={() => remove(d)} className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
          </div>))}</div>
      )}
      <UploadDocumentDialog open={open} onOpenChange={setOpen} projects={projects} onSaved={refresh} />
      <DocumentViewer doc={viewing} open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} />
    </div>
  );
}