import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/hooks/useUser';

export function useSubscription() {
  const { user } = useUser();
  const q = useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: () => base44.entities.Subscription.filter({ client_id: user.id }, '-created_date'),
    enabled: !!user,
  });
  const subs = q.data || [];
  const activeSubs = subs.filter((s) => s.status === 'active');
  return { subscriptions: subs, activeSubscription: activeSubs[0], activeSubscriptions: activeSubs, activeCount: activeSubs.length, hasActive: activeSubs.length > 0, isLoading: q.isLoading };
}