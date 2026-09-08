import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Check, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const perks = ['Full downloadable PDF audit report', 'Dedicated project dashboard & milestones', 'Monthly reports, documents and spreadsheets', 'Priority support tickets'];

export default function UpgradeDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl p-0">
        <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white">
          <div className="grid-fade absolute inset-0 opacity-50" />
          <div className="relative">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><Lock className="h-5 w-5" /></span>
            <DialogTitle className="mt-5 text-2xl font-bold">Your full report is ready to download</DialogTitle>
            <p className="mt-2 text-sm text-indigo-100">Choose a package to unlock the complete PDF — plus everything you need to actually fix what we found.</p>
          </div>
        </div>
        <div className="p-8">
          <ul className="space-y-3">{perks.map((p) => <li key={p} className="flex items-center gap-2.5 text-sm text-slate-700"><Check className="h-4 w-4 text-emerald-500" /> {p}</li>)}</ul>
          <Button asChild size="lg" className="mt-7 w-full rounded-xl font-semibold"><Link to="/app/packages">See packages & pricing <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          <button onClick={() => onOpenChange(false)} className="mt-3 w-full text-center text-sm text-slate-500 hover:text-slate-800">Maybe later</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}