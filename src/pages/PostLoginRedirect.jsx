import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export default function PostLoginRedirect() {
  const { isLoading, isTeam, isAdmin } = useUser();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isTeam) return <Navigate to="/team" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <Navigate to="/app" replace />;
}