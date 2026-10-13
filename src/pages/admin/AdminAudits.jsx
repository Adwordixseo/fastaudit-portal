import React, { useState, useEffect } from 'react';
import { Search, Loader2, ArrowRight, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import EmptyState from '@/components/portal/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fmtDate, scoreColor } from '@/lib/format';

const PAGE_SIZE = 50;

export default function AdminAudits() {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');

  // Debounce the search term so we don't fire a request on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const loadFirst = async (q) => {
    setLoading(true);
    try {
      const query = {};
      if (q) query.$or = [{ url: { $regex: q, $options: 'i' } }, { client_email: { $regex: q, $options: 'i' } }];
      const page = await base44.entities.Audit.filter(query, { sort: '-created_date', limit: PAGE_SIZE });
      setItems(page.items || []);
      setCursor(page.next_cursor || null);
      setHasMore(!!page.has_more);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!cursor || moreLoading) return;
    setMoreLoading(true);
    try {
      const query = {};
      if (debounced) query.$or = [{ url: { $regex: debounced, $options: 'i' } }, { client_email: { $regex: debounced, $options: 'i' } }];
      const page = await base44.entities.Audit.filter(query, { sort: '-created_date', limit: PAGE_SIZE, cursor });
      setItems((prev) => [...prev, ...(page.items || [])]);
      setCursor(page.next_cursor || null);
      setHasMore(!!page.has_more);
    } finally {
      setMoreLoading(false);
    }
  };

  useEffect(() => { loadFirst(debounced); }, [debounced]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Audits" description="Every website audit run by clients and visitors, newest first. Search by URL or email." />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search URL or email…"
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={Globe} title="No audits found" description={debounced ? "No audits match your search." : "No audits have been run yet."} />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Website</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60">
                      <td className="max-w-xs truncate px-4 py-3 text-slate-800">{a.url}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{a.client_name || '—'}</td>
                      <td className="px-4 py-3 text-slate-500">{a.client_email || '—'}</td>
                      <td className="px-4 py-3 text-slate-500">{a.client_phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`font-heading text-base font-bold ${scoreColor(a.overall_score)}`}>{a.overall_score ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{fmtDate(a.created_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{items.length} shown{hasMore ? ' (more available)' : ''}</span>
            {hasMore && (
              <Button variant="outline" onClick={loadMore} disabled={moreLoading}>
                {moreLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Load more <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}