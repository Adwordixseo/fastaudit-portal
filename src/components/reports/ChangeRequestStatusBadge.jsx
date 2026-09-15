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

// Derive the change-request status from the document, falling back to history
// so a team reply always reads as "resolved" even if the field is stale.
export function deriveChangeRequestStatus(doc) {
  const history = doc.history || [];
  if (history.some((h) => h.action === 'team_replied')) return 'resolved';
  return doc.change_request_status || 'pending';
}

export default function ChangeRequestStatusBadge({ status, className }) {
  const s = status || 'pending';
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', styles[s] || styles.pending, className)}>
      {labels[s] || s}
    </span>
  );
}