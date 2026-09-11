import React, { useState, useEffect } from 'react';
import { Link2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const INTERNAL_PATHS = ['/', '/app/audit', '/app/packages', '/app/projects', '/app/reports', '/app/support', '/platform/seo-audits', '/platform/keyword-tracking', '/platform/reporting', '/solutions/ecommerce', '/solutions/local-business', '/solutions/startups'];

export default function InternalLinkInserter({ editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    if (!editor) return;
    const handler = (range) => {
      if (range && range.length > 0) {
        const text = editor.getText(range.index, range.length);
        setSelection({ text: text.trim(), index: range.index, length: range.length });
      } else {
        setSelection(null);
      }
    };
    editor.on('selection-change', handler);
    return () => editor.off('selection-change', handler);
  }, [editor]);

  const apply = () => {
    if (!selection || !url.trim() || !editor) return;
    editor.setSelection(selection.index, selection.length);
    editor.format('link', url.trim());
    setUrl('');
    setSelection(null);
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
            Highlight a word or phrase in the editor above, then enter a URL below. The link applies only to the highlighted text — not every instance on the page.
          </p>
          <datalist id="internal-link-paths">{INTERNAL_PATHS.map((p) => <option key={p} value={p} />)}</datalist>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            {selection ? (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-indigo-600" />
                <span className="text-sm text-slate-700">
                  Selected: <mark className="rounded bg-indigo-200 px-1 font-semibold text-indigo-900">{selection.text}</mark>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <Link2 className="h-4 w-4 shrink-0" />
                <span className="text-sm">No text selected — highlight a word in the editor above.</span>
              </div>
            )}
          </div>

          <div>
            <Label>Internal link URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/app/audit" className="mt-1.5 font-mono text-sm" list="internal-link-paths" />
          </div>

          <Button type="button" size="sm" onClick={apply} disabled={!selection || !url.trim()}>
            <Link2 className="h-3.5 w-3.5" /> Apply link to selection
          </Button>
        </div>
      )}
    </div>
  );
}