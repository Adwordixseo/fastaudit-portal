import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useUser() {
  const q = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const authed = await base44.auth.isAuthenticated();
      return authed ? base44.auth.me() : null;
    },
    retry: false,
    staleTime: 60_000,
  });
  const email = q.data?.email;
  const needsTeamCheck = !!email && q.data?.is_team_member !== true && q.data?.role !== 'admin' && q.data?.role !== 'team';
  const ta = useQuery({
    queryKey: ['team-access', email],
    queryFn: () => base44.entities.TeamAccess.filter({ email }),
    enabled: needsTeamCheck,
    retry: false,
    staleTime: 60_000,
  });
  const isTeam = q.data?.is_team_member === true || q.data?.role === 'team' || (ta.data?.length > 0);
  const isLoading = q.isLoading || (needsTeamCheck && ta.isLoading);
  return { user: q.data || null, isLoading, isAdmin: q.data?.role === 'admin', isTeam };
}