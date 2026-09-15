import React from 'react';
import { Check, X } from 'lucide-react';

const Mark = ({ on }) => on ? <Check className="mx-auto h-4 w-4 text-emerald-600" /> : <X className="mx-auto h-4 w-4 text-rose-400" />;

export default function KeywordTable({ keywords }) {
  if (!keywords?.length) return null;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h3 className="text-base font-semibold text-slate-900">Keyword Consistency</h3>
      <p className="mt-1 text-sm text-slate-500">Your most frequent page keywords and whether they appear in key HTML tags.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="py-2">Keyword</th>
              <th className="py-2 text-center">Title</th>
              <th className="py-2 text-center">Meta Description</th>
              <th className="py-2 text-center">Headings</th>
              <th className="py-2 text-right">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((k, idx) => (
              <tr key={idx} className="border-t border-slate-100">
                <td className="py-2 font-medium text-slate-700">{k.keyword}</td>
                <td className="py-2"><Mark on={k.in_title} /></td>
                <td className="py-2"><Mark on={k.in_meta} /></td>
                <td className="py-2"><Mark on={k.in_headings} /></td>
                <td className="py-2 text-right text-slate-500">{k.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}