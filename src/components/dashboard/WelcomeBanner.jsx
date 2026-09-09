import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WelcomeBanner({ user, auditCount, projectCount }) {
  const first = user?.full_name ? user.full_name.split(' ')[0] : 'there';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-500/20 sm:p-8"
    >
      {/* decorative orbs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-fuchsia-400/30 blur-2xl" />
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-40" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Dashboard
          </span>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, {first}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-indigo-100 sm:text-base">
            Here's where your projects, reports and audits stand today — {projectCount} active {projectCount === 1 ? 'project' : 'projects'} and {auditCount} {auditCount === 1 ? 'audit' : 'audits'} on record.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-white px-5 text-indigo-700 shadow-lg shadow-indigo-900/20 hover:bg-indigo-50">
              <Link to="/app/audit"><Search className="mr-2 h-4 w-4" /> Run a new audit</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="rounded-full px-5 text-white hover:bg-white/10 hover:text-white">
              <Link to="/app/projects">View projects <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}