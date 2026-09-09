import React from 'react';
import { Navigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Search } from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useUser } from '@/hooks/useUser';

const nav = [
  { to: '/team', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/team/projects', label: 'Projects', icon: FolderKanban },
  { to: '/team/keywords', label: 'Keyword Tracker', icon: Search },
];

export default function TeamLayout() {
  const { user, isLoading, isAdmin, isTeam } = useUser();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isTeam && !isAdmin) return <Navigate to="/app" replace />;
  return <PortalLayout nav={nav} label="Team panel" footerLink={null} />;
}