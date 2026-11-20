import React from 'react';
import { LayoutDashboard, Search, Package, FolderKanban, FileText, LifeBuoy, ShieldCheck, UserPlus } from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useUser } from '@/hooks/useUser';
import { useIsSharedMember } from '@/hooks/useClientProjects';

const nav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/audit', label: 'Website Audit', icon: Search },
  { to: '/app/packages', label: 'Packages', icon: Package },
  { to: '/app/projects', label: 'Projects', icon: FolderKanban },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/app/support', label: 'Support', icon: LifeBuoy },
  { to: '/app/team-access', label: 'Team access', icon: UserPlus },
];

// Pages a shared team member never gets: packages and sharing projects onward.
const sharedMemberHidden = ['/app/packages', '/app/team-access'];

export default function ClientLayout() {
  const { isAdmin } = useUser();
  const isSharedMember = useIsSharedMember();
  const links = isSharedMember ? nav.filter((n) => !sharedMemberHidden.includes(n.to)) : nav;
  return <PortalLayout nav={links} label="Client portal" footerLink={isAdmin ? { to: '/admin', label: 'Admin panel', icon: ShieldCheck } : null} />;
}