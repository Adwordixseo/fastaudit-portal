import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    let url = String(body?.url || '').trim();
    if (!url) return Response.json({ error: 'A website URL is required' }, { status: 400 });
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    let hostname;
    try { hostname = new URL(url).hostname; } catch { return Response.json({ error: 'Invalid URL' }, { status: 400 }); }
    if (url.length > 200) return Response.json({ error: 'URL too long' }, { status: 400 });

    // Fetch a bounded slice of the live page so the analysis is grounded in the real HTML.
    let html = '';
    let fetchStatus = 0;
    let loadMs = 0;
    try {
      const started = Date.now();
      const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RankPilotAudit/1.0)' }, signal: AbortSignal.timeout(12000) });
      loadMs = Date.now() - started;
      fetchStatus = res.status;
      html = (await res.text()).slice(0, 60000);
    } catch (_e) {
      html = '';
    }

    const pick = (re) => { const m = html.match(re); return m ? m[1].replace(/\s+/g, ' ').trim().slice(0, 300) : ''; };
    const count = (re) => (html.match(re) || []).length;
    const title = pick(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const metaDescription = pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i) || pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
    const canonical = pick(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) || pick(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
    const h1Text = pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const facts = {
      hostname,
      http_status: fetchStatus,
      load_time_ms: loadMs,
      html_bytes: html.length,
      title,
      has_title: !!title,
      meta_description: metaDescription,
      has_meta_description: !!metaDescription,
      canonical,
      has_canonical: !!canonical,
      viewport: !!html.match(/<meta[^>]+name=["']viewport["']/i),
      h1_count: count(/<h1[\s>]/gi),
      h1_text: h1Text,
      h2_count: count(/<h2[\s>]/gi),
      img_count: count(/<img[\s>]/gi),
      img_without_alt: count(/<img(?![^>]*\balt=)[^>]*>/gi),
      internal_links: count(/<a[^>]+href=["']\//gi),
      external_links: count(/<a[^>]+href=["']https?:\/\//gi),
      has_json_ld: !!html.match(/application\/ld\+json/i),
      has_open_graph: !!html.match(/property=["']og:/i),
      has_robots_meta: !!html.match(/name=["']robots["']/i),
      script_count: count(/<script[\s>]/gi),
      has_https: url.startsWith('https://'),
      lang_attr: pick(/<html[^>]+lang=["']([^"']*)["']/i)
    };

    // Build an explicit present/missing summary so the LLM cannot hallucinate missing elements.
    const presence = [
      `Title tag: ${facts.has_title ? 'PRESENT' : 'MISSING'}${facts.title ? ` — "${facts.title}"` : ''}`,
      `Meta description: ${facts.has_meta_description ? 'PRESENT' : 'MISSING'}${facts.meta_description ? ` — "${facts.meta_description}"` : ''}`,
      `Canonical URL: ${facts.has_canonical ? 'PRESENT' : 'MISSING'}${facts.canonical ? ` — ${facts.canonical}` : ''}`,
      `H1 headings: ${facts.h1_count} found${facts.h1_text ? ` — "${facts.h1_text}"` : ''}`,
      `Viewport meta: ${facts.viewport ? 'PRESENT' : 'MISSING'}`,
      `JSON-LD structured data: ${facts.has_json_ld ? 'PRESENT' : 'MISSING'}`,
      `Open Graph tags: ${facts.has_open_graph ? 'PRESENT' : 'MISSING'}`,
      `HTTPS: ${facts.has_https ? 'YES' : 'NO'}`,
      `Robots meta: ${facts.has_robots_meta ? 'PRESENT' : 'MISSING'}`,
      `Images without alt: ${facts.img_without_alt} of ${facts.img_count}`,
    ].join('\n');

    const prompt = `You are a senior SEO and AI-search (AEO) consultant. Produce a concise but professional website audit for ${url}.

MEASURED FACTS from the live page HTML (these are authoritative — do not contradict them):
${presence}

Full raw facts:
${JSON.stringify(facts, null, 2)}

CRITICAL RULES:
- If a fact says PRESENT, do NOT report it as missing or absent. For example, if "Title tag: PRESENT" then you must NOT include any issue about a missing title tag.
- Only report an issue for an element that is marked MISSING, or for an element that is present but could be improved (e.g. too short, too long, not descriptive enough).
- If the page could not be fetched (http_status is 0), note that the live page was unreachable and base the audit on that limitation.

Score each category 0-100 (be realistic, most sites score 40-75). Categories: seo (on-page & meta), performance (load time, page weight, scripts), content (headings, depth, clarity), technical (https, canonical, structured data, robots, viewport), ai_readiness (structured data, quotable content, entity clarity for ChatGPT/Perplexity/Google AI Overviews).
Return 5-8 concrete issues with severity, a 2-3 sentence executive summary, and 5-7 actionable recommendations ordered by impact. Write for a business owner, not an engineer.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          overall_score: { type: 'number' },
          scores: {
            type: 'object',
            properties: {
              seo: { type: 'number' }, performance: { type: 'number' }, content: { type: 'number' },
              technical: { type: 'number' }, ai_readiness: { type: 'number' }
            }
          },
          summary: { type: 'string' },
          issues: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, severity: { type: 'string' }, detail: { type: 'string' } } } },
          recommendations: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
    const scores = {
      seo: clamp(result.scores?.seo), performance: clamp(result.scores?.performance), content: clamp(result.scores?.content),
      technical: clamp(result.scores?.technical), ai_readiness: clamp(result.scores?.ai_readiness)
    };
    const overall = clamp(result.overall_score) || Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);

    const audit = await base44.entities.Audit.create({
      url, client_id: user.id, client_email: user.email,
      overall_score: overall, scores,
      summary: result.summary || '',
      issues: (result.issues || []).slice(0, 8).map((i) => ({ title: i.title, severity: ['high', 'medium', 'low'].includes(i.severity) ? i.severity : 'medium', detail: i.detail })),
      recommendations: (result.recommendations || []).slice(0, 7)
    });

    return Response.json({ audit });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}