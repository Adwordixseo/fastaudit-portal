import React from 'react';
import { cn } from '@/lib/utils';

const styles = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  in_review: 'bg-blue-100 text-blue-700 border-blue-200',
  resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const labels = {
  pending: 'Pending',
  in_review: 'In Review',
  resolved: 'Resolved',
};

export default function ChangeRequestStatusBadge({ status, className }) {
  const s = status || 'pending';
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', styles[s] || styles.pending, className)}>
      {labels[s] || s}
    </span>
  );
}