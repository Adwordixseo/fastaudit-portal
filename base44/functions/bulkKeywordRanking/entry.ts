import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const url = String(body?.url || '').trim();
    const keywords = Array.isArray(body?.keywords) ? body.keywords.map((k) => String(k).trim()).filter(Boolean) : [];

    if (!url) return Response.json({ error: 'A website URL is required' }, { status: 400 });
    if (keywords.length === 0) return Response.json({ error: 'Enter at least one keyword' }, { status: 400 });
    if (keywords.length > 20) return Response.json({ error: 'Maximum 20 keywords per check' }, { status: 400 });

    let hostname;
    try { hostname = new URL(url.startsWith('http') ? url : 'https://' + url).hostname.replace(/^www\./, ''); }
    catch { return Response.json({ error: 'Invalid URL' }, { status: 400 }); }

    const prompt = `You are an SEO rank-tracking tool. For the website "${hostname}", find its organic ranking position in Google search results for each of these keywords:
${JSON.stringify(keywords)}

For each keyword, search the web and determine where ${hostname} (or any page on this domain) appears in the top 100 organic results. Return the position (1-100), or 0 if the site does not rank in the top 100. Include the exact ranking URL if found, and a brief page title. Be accurate — only report a position if you actually find the domain in the results.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gemini_3_flash',
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          results: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                keyword: { type: 'string' },
                position: { type: 'number' },
                found: { type: 'boolean' },
                found_url: { type: 'string' },
                page_title: { type: 'string' }
              }
            }
          }
        }
      }
    });

    return Response.json({ results: result.results || [], hostname });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}