import React from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart3, Users, FolderKanban, Package, Upload, CreditCard, MessageSquare, LayoutDashboard, Wallet } from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useUser } from '@/hooks/useUser';

const nav = [
  { to: '/admin', label: 'Overview', icon: BarChart3, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/documents', label: 'Documents', icon: Upload },
  { to: '/admin/financials', label: 'Financials', icon: Wallet },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/admin/tickets', label: 'Tickets', icon: MessageSquare },
];

export default function AdminLayout() {
  const { isAdmin, isLoading } = useUser();
  if (isLoading) return null;
  if (!isAdmin) return <Navigate to="/app" replace />;
  return <PortalLayout nav={nav} label="Admin panel" footerLink={{ to: '/app', label: 'Client view', icon: LayoutDashboard }} />;
}