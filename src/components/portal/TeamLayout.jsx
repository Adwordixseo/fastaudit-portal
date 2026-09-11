import React from 'react';
import { Navigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Search, ListTodo, FileText, HelpCircle, BookOpen, Settings } from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useUser } from '@/hooks/useUser';

const nav = [
  { to: '/team', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/team/projects', label: 'Projects', icon: FolderKanban },
  { to: '/team/keywords', label: 'Keyword Tracker', icon: Search },
  { to: '/team/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/team/seo', label: 'SEO settings', icon: Settings },
  { to: '/team/content', label: 'Content sections', icon: FileText },
  { to: '/team/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/team/resources', label: 'Resources', icon: BookOpen },
];

export default function TeamLayout() {
  const { user, isLoading, isAdmin, isTeam } = useUser();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isTeam && !isAdmin) return <Navigate to="/app" replace />;
  return <PortalLayout nav={nav} label="Team panel" footerLink={null} />;
}