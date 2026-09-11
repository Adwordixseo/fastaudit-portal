import React, { useState, useMemo } from 'react';
import { Link2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const INTERNAL_PATHS = ['/', '/app/audit', '/app/packages', '/app/projects', '/app/reports', '/app/support', '/platform/seo-audits', '/platform/keyword-tracking', '/platform/reporting', '/solutions/ecommerce', '/solutions/local-business', '/solutions/startups'];

function walkTextNodes(doc) {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName.toLowerCase();
      if (tag === 'a' || tag === 'script' || tag === 'style') return NodeFilter.FILTER_REJECT;
      if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  return nodes;
}

function findOccurrences(html, word) {
  if (!word.trim() || !html) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const search = word.toLowerCase().trim();
  const results = [];
  walkTextNodes(doc).forEach((node) => {
    const text = node.textContent;
    const lower = text.toLowerCase();
    let pos = 0;
    while ((pos = lower.indexOf(search, pos)) !== -1) {
      const start = Math.max(0, pos - 35);
      const end = Math.min(text.length, pos + search.length + 35);
      results.push({
        before: (start > 0 ? '…' : '') + text.slice(start, pos),
        match: text.slice(pos, pos + search.length),
        after: text.slice(pos + search.length, end) + (end < text.length ? '…' : ''),
      });
      pos += search.length;
    }
  });
  return results;
}

function applyLinkToOccurrence(html, word, url, selectedIndex) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const search = word.toLowerCase().trim();
  let count = 0;
  for (const node of walkTextNodes(doc)) {
    const text = node.textContent;
    const lower = text.toLowerCase();
    let pos = 0;
    while ((pos = lower.indexOf(search, pos)) !== -1) {
      if (count === selectedIndex) {
        const before = text.slice(0, pos);
        const match = text.slice(pos, pos + search.length);
        const after = text.slice(pos + search.length);
        const anchor = doc.createElement('a');
        anchor.href = url;
        anchor.textContent = match;
        const parent = node.parentNode;
        if (before) parent.insertBefore(doc.createTextNode(before), node);
        parent.insertBefore(anchor, node);
        if (after) parent.insertBefore(doc.createTextNode(after), node);
        parent.removeChild(node);
        return doc.body.innerHTML;
      }
      count++;
      pos += search.length;
    }
  }
  return html;
}

export default function InternalLinkInserter({ body, onChange }) {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState('');
  const [url, setUrl] = useState('');
  const [selected, setSelected] = useState(null);

  const occurrences = useMemo(() => findOccurrences(body, word), [body, word]);

  const apply = () => {
    if (selected === null || !url.trim() || !word.trim()) return;
    onChange(applyLinkToOccurrence(body, word, url.trim(), selected));
    setWord('');
    setUrl('');
    setSelected(null);
  };

  return (
    <div className="rounded-xl border border-slate-200">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between p-3 text-left">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Link2 className="h-4 w-4 text-indigo-600" /> Smart internal linking
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && (
        <div className="space-y-4 border-t border-slate-100 p-4">
          <p className="text-xs text-slate-400">
            Link a specific occurrence of a word — if the word appears multiple times, choose which one to link instead of linking all of them.
          </p>
          <datalist id="internal-link-paths">{INTERNAL_PATHS.map((p) => <option key={p} value={p} />)}</datalist>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Word / phrase to link</Label>
              <Input value={word} onChange={(e) => { setWord(e.target.value); setSelected(null); }} placeholder="audit" className="mt-1.5" />
            </div>
            <div>
              <Label>Internal link URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/app/audit" className="mt-1.5 font-mono text-sm" list="internal-link-paths" />
            </div>
          </div>

          {word.trim() && occurrences.length === 0 && (
            <p className="text-xs text-amber-600">No occurrences of &ldquo;{word}&rdquo; found in the body content.</p>
          )}

          {occurrences.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-500">
                {occurrences.length} occurrence{occurrences.length > 1 ? 's' : ''} found — select one to link:
              </p>
              <div className="max-h-52 space-y-1.5 overflow-y-auto">
                {occurrences.map((occ, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelected(i)}
                    className={`flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left text-sm transition-colors ${
                      selected === i ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${selected === i ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                      {selected === i && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="text-slate-600 leading-relaxed">
                      {occ.before}
                      <mark className="rounded bg-indigo-200 px-0.5 font-semibold text-indigo-900">{occ.match}</mark>
                      {occ.after}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button type="button" size="sm" onClick={apply} disabled={selected === null || !url.trim()}>
            <Link2 className="h-3.5 w-3.5" /> Apply link to selected occurrence
          </Button>
        </div>
      )}
    </div>
  );
}