import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function PostLoginRedirect() {
  const { user, isLoadingAuth, authChecked } = useAuth();
  const email = user?.email;

  // A project shared from a client portal keeps the person in that client portal.
  const { data: shares = [], isLoading: sharesLoading } = useQuery({
    queryKey: ['shared-access', email],
    queryFn: () => base44.entities.ProjectAccess.filter({ email, status: { $ne: 'revoked' } }),
    enabled: !!email,
    retry: false,
    staleTime: 60_000,
  });

  if (isLoadingAuth || !authChecked || (email && sharesLoading)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (shares.length > 0) return <Navigate to="/app" replace />;
  if (user?.is_team_member) return <Navigate to="/team" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/app" replace />;
}