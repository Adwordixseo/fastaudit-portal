import React from 'react';
import { LayoutDashboard, Search, Package, FolderKanban, FileText, LifeBuoy, ShieldCheck } from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useUser } from '@/hooks/useUser';

const nav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/audit', label: 'Website Audit', icon: Search },
  { to: '/app/packages', label: 'Packages', icon: Package },
  { to: '/app/projects', label: 'Projects', icon: FolderKanban },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/app/support', label: 'Support', icon: LifeBuoy },
];

export default function ClientLayout() {
  const { isAdmin } = useUser();
  return <PortalLayout nav={nav} label="Client portal" footerLink={isAdmin ? { to: '/admin', label: 'Admin panel', icon: ShieldCheck } : null} />;
}