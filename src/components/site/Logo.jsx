import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ dark = false, className }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5', className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
        <Zap className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className={cn('font-heading text-xl font-bold tracking-tight', dark ? 'text-white' : 'text-slate-900')}>
        Rank<span className="gradient-text">Pilot</span>
      </span>
    </Link>
  );
}