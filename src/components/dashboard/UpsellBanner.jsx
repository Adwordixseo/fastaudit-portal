import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UpsellBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white sm:p-8">
      <div className="grid-fade absolute inset-0 opacity-50" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15"><Lock className="h-5 w-5" /></span>
          <div>
            <h3 className="text-xl font-semibold">Unlock your full PDF audit report</h3>
            <p className="mt-1 text-sm text-indigo-100">Choose a growth package to download complete reports, get a dedicated project dashboard and monthly deliverables.</p>
          </div>
        </div>
        <Button asChild className="shrink-0 rounded-full bg-white px-6 text-indigo-700 hover:bg-indigo-50"><Link to="/app/packages">View packages <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
      </div>
    </div>
  );
}