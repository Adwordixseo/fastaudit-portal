import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Globe, UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import ShareProjectDialog from '@/components/projects/ShareProjectDialog';
import ProjectAccessList from '@/components/projects/ProjectAccessList';
import { Button } from '@/components/ui/button';

export default function TeamAccessPage() {
  const { user } = useUser();
  const uid = user?.id;
  const qc = useQueryClient();
  const [shareProject, setShareProject] = useState(null);
  const { data: projects = [] } = useQuery({ queryKey: ['projects', uid], queryFn: () => base44.entities.Project.filter({ client_id: uid }, '-updated_date'), enabled: !!uid });
  const { data: access = [] } = useQuery({ queryKey: ['project-access', uid], queryFn: () => base44.entities.ProjectAccess.filter({ client_id: uid }, '-created_date'), enabled: !!uid });
  const refresh = () => qc.invalidateQueries({ queryKey: ['project-access', uid] });

  const revoke = async (a) => {
    if (!confirm(`Remove ${a.email}'s access to this project?`)) return;
    await base44.entities.ProjectAccess.delete(a.id);
    refresh();
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Team access" title="Share projects with your team" description="Give a team member access with their email id — they sign in and see the shared project in this client portal." />

      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" text="Once you have a project you can share it with your team here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => {
            const pAccess = access.filter((a) => a.project_id === p.id);
            return (
              <div key={p.id} className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-900">{p.name}</h3>
                    {p.website && <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Globe className="h-3 w-3" /> {p.website}</p>}
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => setShareProject(p)}><UserPlus className="mr-1.5 h-3.5 w-3.5" /> Share with team</Button>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-2">
                  <ProjectAccessList access={pAccess} onRevoke={revoke} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ShareProjectDialog open={!!shareProject} onOpenChange={(o) => !o && setShareProject(null)} project={shareProject} onShared={refresh} />
    </div>
  );
}