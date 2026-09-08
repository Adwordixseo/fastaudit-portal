import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-8 py-16 text-center text-white sm:px-16">
        <div className="grid-fade absolute inset-0 opacity-60" />
        <div className="relative">
          <h2 className="text-4xl font-bold sm:text-5xl">Your competitors are already ranking.</h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">Run your free audit now and see exactly what to fix first. It takes less than a minute.</p>
          <Button asChild size="lg" className="mt-8 h-13 rounded-full bg-white px-8 text-base font-semibold text-indigo-700 hover:bg-indigo-50">
            <Link to="/app/audit">Get my free audit <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}