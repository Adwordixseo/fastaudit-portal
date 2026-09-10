import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Globe, Plus, ArrowRight, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import { Progress } from '@/components/ui/progress';
import AddWebsiteDialog from './AddWebsiteDialog';

export default function WebsiteSlots({ activeSubscriptions }) {
  const { user } = useUser();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [addSlot, setAddSlot] = useState(null);
  const { data: projects = [] } = useQuery({ queryKey: ['projects', user?.id], queryFn: () => base44.entities.Project.filter({ client_id: user.id }, '-updated_date'), enabled: !!user });

  const refresh = () => { qc.invalidateQueries({ queryKey: ['projects'] }); qc.invalidateQueries({ queryKey: ['subscriptions'] }); };

  if (activeSubscriptions.length === 0) {
    return (
      <section>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Your websites</h2></div>
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-indigo-600"><Package className="h-6 w-6" /></div>
          <p className="mt-3 text-sm font-semibold text-slate-700">No website slots yet</p>
          <p className="mt-1 text-sm text-slate-500">Each package gives you one website slot. Choose a package to get started.</p>
          <Button asChild className="mt-4 rounded-full"><Link to="/app/packages">Browse packages</Link></Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Your websites</h2>
        <span className="text-sm text-slate-500">{activeSubscriptions.length} package{activeSubscriptions.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {activeSubscriptions.map((sub) => {
          const project = projects.find((p) => p.id === sub.project_id);
          if (project) {
            return (
              <div key={sub.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{sub.package_name}</span>
                  <StatusBadge status={project.status} />
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">{project.name}</h3>
                {project.website && <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Globe className="h-3 w-3" /> {project.website}</p>}
                <Progress value={project.progress || 0} className="mt-3 h-1.5" />
                <Button variant="ghost" size="sm" className="mt-2 -ml-2 text-indigo-600" onClick={() => navigate(`/app/projects?id=${project.id}`)}>View project <ArrowRight className="ml-1 h-3 w-3" /></Button>
              </div>
            );
          }
          return (
            <button key={sub.id} onClick={() => setAddSlot(sub)} className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-50 text-indigo-600"><Plus className="h-5 w-5" /></div>
              <div><p className="text-sm font-semibold text-slate-700">Add website</p><p className="text-xs text-slate-400">{sub.package_name} slot</p></div>
            </button>
          );
        })}
      </div>
      <AddWebsiteDialog open={!!addSlot} onOpenChange={(o) => !o && setAddSlot(null)} subscription={addSlot} onDone={refresh} />
    </section>
  );
}