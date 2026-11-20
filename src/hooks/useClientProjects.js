import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';

// Projects the signed-in client owns, plus projects shared with their email.
export function useClientProjects() {
  const { user } = useUser();
  const uid = user?.id;
  const email = user?.email;

  return useQuery({
    queryKey: ['projects', uid, email],
    enabled: !!uid,
    queryFn: async () => {
      const own = await base44.entities.Project.filter({ client_id: uid }, '-updated_date');
      if (!email) return own;
      const shares = await base44.entities.ProjectAccess.filter({ email, status: { $ne: 'revoked' } });
      const ids = shares.map((s) => s.project_id).filter((id) => id && !own.some((p) => p.id === id));
      if (ids.length === 0) return own;
      const shared = await base44.entities.Project.filter({ id: { $in: ids } }, '-updated_date');
      return [...own, ...shared];
    },
  });
}

// True when the signed-in user is a team member who only sees projects shared with
// them by a main client (they own no projects of their own).
export function useIsSharedMember() {
  const { user } = useUser();
  const { data: projects } = useClientProjects();
  if (!user?.id || !projects) return false;
  return projects.length > 0 && !projects.some((p) => p.client_id === user.id);
}

// Documents for the client's own projects and for projects shared with them.
export function useClientDocuments(projects = []) {
  const { user } = useUser();
  const uid = user?.id;
  const sharedIds = projects.filter((p) => p.client_id !== uid).map((p) => p.id);
  const sharedKey = sharedIds.join(',');

  return useQuery({
    queryKey: ['documents', uid, sharedKey],
    enabled: !!uid,
    queryFn: async () => {
      const own = await base44.entities.Document.filter({ client_id: uid }, '-created_date');
      if (!sharedIds.length) return own;
      const shared = await base44.entities.Document.filter({ project_id: { $in: sharedIds } }, '-created_date');
      return [...own, ...shared];
    },
  });
}