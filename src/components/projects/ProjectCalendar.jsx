import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Flag, FileText, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, format } from 'date-fns';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ProjectCalendar({ milestones = [], documents = [], projects = [], onSelect }) {
  const [cursor, setCursor] = useState(new Date());
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const projectName = (id) => projects.find((p) => p.id === id)?.name || '';

  const eventsFor = (day) => {
    const evs = [];
    milestones.forEach((m) => {
      if (m.due_date && isSameDay(new Date(m.due_date + 'T00:00:00'), day)) {
        evs.push({ id: m.id, type: 'milestone', title: m.title, status: m.status, project: projectName(m.project_id), ref: m });
      }
    });
    documents.forEach((d) => {
      if (d.created_date && isSameDay(new Date(d.created_date), day)) {
        evs.push({ id: d.id, type: 'document', title: d.title, status: d.status, project: projectName(d.project_id), ref: d });
      }
    });
    return evs;
  };

  const today = new Date();
  const monthEvents = days.reduce((n, d) => n + eventsFor(d).length, 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">{format(cursor, 'MMMM yyyy')}</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{monthEvents} events</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setCursor(new Date())}>Today</Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setCursor(addMonths(cursor, -1))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {WEEKDAYS.map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, cursor);
          const isToday = isSameDay(day, today);
          const evs = eventsFor(day);
          return (
            <div key={day.toISOString()} className={cn('min-h-[84px] rounded-xl border p-1.5 text-left', inMonth ? 'border-slate-100 bg-white' : 'border-transparent bg-slate-50/60', isToday && 'border-indigo-300 ring-1 ring-indigo-200')}>
              <div className={cn('text-xs font-medium', isToday ? 'grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white' : inMonth ? 'text-slate-600' : 'text-slate-300')}>{format(day, 'd')}</div>
              <div className="mt-1 space-y-1">
                {evs.slice(0, 3).map((e) => (
                  <button key={e.id} onClick={() => onSelect?.(e)} title={`${e.title}${e.project ? ' · ' + e.project : ''}`}
                    className={cn('flex w-full items-center gap-1 rounded-md px-1 py-0.5 text-left text-[10px] font-medium leading-tight transition-colors hover:opacity-80',
                      e.type === 'milestone' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700')}>
                    {e.type === 'milestone' ? <Flag className="h-2.5 w-2.5 shrink-0" /> : <FileText className="h-2.5 w-2.5 shrink-0" />}
                    <span className="truncate">{e.title}</span>
                  </button>
                ))}
                {evs.length > 3 && <div className="pl-1 text-[10px] text-slate-400">+{evs.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="grid h-4 w-4 place-items-center rounded bg-indigo-50"><Flag className="h-2.5 w-2.5 text-indigo-700" /></span> Milestone due</span>
        <span className="flex items-center gap-1.5"><span className="grid h-4 w-4 place-items-center rounded bg-emerald-50"><FileText className="h-2.5 w-2.5 text-emerald-700" /></span> Document delivery</span>
      </div>
    </div>
  );
}