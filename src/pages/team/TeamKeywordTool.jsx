import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, Globe, TrendingUp, ExternalLink, Upload, Save, FolderKanban, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/portal/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TeamKeywordTool() {
  const [url, setUrl] = useState('');
  const [location, setLocation] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [saveProjectId, setSaveProjectId] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: projects = [] } = useQuery({ queryKey: ['admin-projects'], queryFn: () => base44.entities.Project.list('-updated_date') });

  const run = async () => {
    const keywords = keywordsText.split('\n').map((k) => k.trim()).filter(Boolean);
    if (!url.trim()) { toast.error('Enter a website URL'); return; }
    if (keywords.length === 0) { toast.error('Enter at least one keyword'); return; }
    if (keywords.length > 20) { toast.error('Maximum 20 keywords at a time'); return; }
    setRunning(true); setResults(null);
    try {
      const res = await base44.functions.invoke('bulkKeywordRanking', { url: url.trim(), location: location.trim(), keywords });
      setResults(res.data);
      toast.success(`Checked ${res.data.results.length} keywords`);
    } catch (err) { toast.error(err.message || 'Ranking check failed'); }
    setRunning(false);
  };

  const ranked = results?.results.filter((r) => r.found) || [];
  const avgPos = ranked.length ? Math.round(ranked.reduce((s, r) => s + r.position, 0) / ranked.length) : 0;

  const exportCsv = () => {
    if (!results) return;
    const rows = ['keyword,location,position,found,found_url,page_title', ...results.results.map((r) => `"${r.keyword}","${r.location || ''}",${r.position},${r.found},"${r.found_url || ''}","${(r.page_title || '').replace(/"/g, '""')}"`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'keyword-rankings.csv'; link.click();
  };

  const saveToProject = async () => {
    if (!saveProjectId) { toast.error('Select a project to save to'); return; }
    setSaving(true);
    try {
      const rows = ['keyword,location,position,found,found_url,page_title', ...results.results.map((r) => `"${r.keyword}","${r.location || ''}",${r.position},${r.found},"${r.found_url || ''}","${(r.page_title || '').replace(/"/g, '""')}"`)];
      const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
      const file = new File([blob], `keyword-rankings-${results.hostname}-${new Date().toISOString().slice(0, 10)}.csv`, { type: 'text/csv' });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const project = projects.find((p) => p.id === saveProjectId);
      await base44.entities.Document.create({
        project_id: saveProjectId,
        client_id: project?.client_id || '',
        title: `Keyword Rankings — ${results.hostname} (${new Date().toLocaleDateString()})`,
        file_url,
        file_type: 'spreadsheet',
        report_month: new Date().toISOString().slice(0, 7),
        status: 'awaiting_approval',
        history: [{ action: 'uploaded', by: 'Team', note: 'Bulk keyword ranking report', date: new Date().toISOString() }],
      });
      toast.success('Saved to project files — client can review it now');
      setSaveProjectId('');
    } catch (err) { toast.error(err.message || 'Could not save'); }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Team" title="Bulk keyword ranking" description="Check where a website ranks across multiple keywords in one go. Up to 20 keywords per check." />

      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Website URL</Label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3">
              <Globe className="h-4 w-4 text-slate-400" />
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com" className="w-full bg-transparent py-2 text-sm outline-none" />
            </div>
          </div>
          <div>
            <Label>Prefill from project (optional)</Label>
            <Select value={projectFilter} onValueChange={(v) => { setProjectFilter(v); const p = projects.find((x) => x.id === v); if (p) setUrl(p.website || ''); }}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose a project website" /></SelectTrigger>
              <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>
          </div>
          <div>
            <Label>Location (optional)</Label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3">
              <MapPin className="h-4 w-4 text-slate-400" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. India, United States, London" className="w-full bg-transparent py-2 text-sm outline-none" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Label>Keywords (one per line, max 20)</Label>
          <Textarea rows={6} value={keywordsText} onChange={(e) => setKeywordsText(e.target.value)} placeholder={'best running shoes\naffordable web hosting\nseo audit tool'} className="mt-1.5 font-mono text-sm" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={run} disabled={running} className="rounded-full">{running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />} Check rankings</Button>
          {results && <Button variant="outline" onClick={exportCsv} className="rounded-full"><Upload className="mr-2 h-4 w-4" /> Export CSV</Button>}
        </div>
      </div>

      {running && (
        <div className="grid place-items-center rounded-3xl border border-slate-200 bg-white py-16">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="mt-3 text-sm text-slate-500">Searching the web for rankings...</p>
        </div>
      )}

      {results && !running && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5"><div className="text-sm font-medium text-slate-500">Keywords checked</div><div className="mt-2 font-heading text-3xl font-bold text-slate-900">{results.results.length}</div></div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5"><div className="text-sm font-medium text-slate-500">Ranking keywords</div><div className="mt-2 font-heading text-3xl font-bold text-emerald-600">{ranked.length}</div></div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-1.5 text-sm font-medium text-slate-500"><TrendingUp className="h-4 w-4" /> Avg position</div><div className="mt-2 font-heading text-3xl font-bold text-slate-900">{avgPos || '—'}</div></div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">Results for {results.hostname}</h2>
                {results.location && <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"><MapPin className="h-3 w-3" />{results.location}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Select value={saveProjectId} onValueChange={setSaveProjectId}><SelectTrigger className="w-48 rounded-full"><SelectValue placeholder="Save to project..." /></SelectTrigger>
                  <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>
                <Button onClick={saveToProject} disabled={saving || !saveProjectId} className="rounded-full">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save to files</Button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {results.results.map((r, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-900">{r.keyword}</div>
                    <div className="mt-0.5 flex items-center gap-2">
                      {r.location && <span className="inline-flex items-center gap-1 truncate text-xs text-slate-500"><MapPin className="h-3 w-3 shrink-0" />{r.location}</span>}
                      {r.page_title && <span className="truncate text-xs text-slate-400">{r.page_title}</span>}
                    </div>
                  </div>
                  {r.found ? (
                    <div className="flex items-center gap-3">
                      {r.found_url && <a href={r.found_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"><ExternalLink className="h-3 w-3" /> URL</a>}
                      <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${r.position <= 3 ? 'bg-emerald-50 text-emerald-700' : r.position <= 10 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{r.position}</span>
                    </div>
                  ) : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-400">Not in top 100</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}