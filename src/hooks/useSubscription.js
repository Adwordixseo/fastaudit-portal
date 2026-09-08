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
  const active = subs.find((s) => s.status === 'active');
  return { subscriptions: subs, activeSubscription: active, hasActive: !!active, isLoading: q.isLoading };
}