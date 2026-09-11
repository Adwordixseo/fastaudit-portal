import React, { useState, useEffect, useMemo } from 'react';
import { Link2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const INTERNAL_PATHS = ['/', '/app/audit', '/app/packages', '/app/projects', '/app/reports', '/app/support', '/platform/seo-audits', '/platform/keyword-tracking', '/platform/reporting', '/solutions/ecommerce', '/solutions/local-business', '/solutions/startups'];

export default function InternalLinkInserter({ editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [word, setWord] = useState('');
  const [selected, setSelected] = useState(null);
  const [textVersion, setTextVersion] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const selHandler = (range) => {
      if (range && range.length > 0) {
        const text = editor.getText(range.index, range.length).trim();
        if (text && text.length < 100 && !text.includes('\n')) {
          setWord(text);
          setSelected(null);
        }
      }
    };
    const textHandler = () => setTextVersion((v) => v + 1);
    editor.on('selection-change', selHandler);
    editor.on('text-change', textHandler);
    return () => {
      editor.off('selection-change', selHandler);
      editor.off('text-change', textHandler);
    };
  }, [editor]);

  const occurrences = useMemo(() => {
    if (!editor || !word.trim()) return [];
    const search = word.toLowerCase().trim();
    const fullText = editor.getText();
    const lower = fullText.toLowerCase();
    const results = [];
    let pos = 0;
    while ((pos = lower.indexOf(search, pos)) !== -1) {
      const start = Math.max(0, pos - 40);
      const end = Math.min(fullText.length, pos + search.length + 40);
      results.push({
        index: pos,
        length: search.length,
        match: fullText.slice(pos, pos + search.length),
        before: (start > 0 ? '…' : '') + fullText.slice(start, pos),
        after: fullText.slice(pos + search.length, end) + (end < fullText.length ? '…' : ''),
      });
      pos += search.length;
    }
    return results;
  }, [editor, word, textVersion]);

  const apply = () => {
    if (selected === null || !url.trim() || !editor || !occurrences[selected]) return;
    const occ = occurrences[selected];
    editor.setSelection(occ.index, occ.length);
    editor.format('link', url.trim());
    setUrl('');
    setWord('');
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
            Highlight a word in the editor above to auto-fill, or type one below. Then pick which occurrence to link — the link applies only to that one, not every instance.
          </p>
          <datalist id="internal-link-paths">{INTERNAL_PATHS.map((p) => <option key={p} value={p} />)}</datalist>

          <div>
            <Label>Word / phrase to find</Label>
            <Input value={word} onChange={(e) => { setWord(e.target.value); setSelected(null); }} placeholder="audit" className="mt-1.5" />
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

          <div>
            <Label>Internal link URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/app/audit" className="mt-1.5 font-mono text-sm" list="internal-link-paths" />
          </div>

          <Button type="button" size="sm" onClick={apply} disabled={selected === null || !url.trim()}>
            <Link2 className="h-3.5 w-3.5" /> Apply link to selected occurrence
          </Button>
        </div>
      )}
    </div>
  );
}