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
  return { user: q.data || null, isLoading: q.isLoading, isAdmin: q.data?.role === 'admin' };
}