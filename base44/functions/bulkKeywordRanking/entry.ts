import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const url = String(body?.url || '').trim();
    const location = String(body?.location || '').trim();
    const city = String(body?.city || '').trim();
    const country = String(body?.country || '').trim();
    const keywords = Array.isArray(body?.keywords) ? body.keywords.map((k) => String(k).trim()).filter(Boolean) : [];

    const locationParts = [city, country].filter(Boolean).join(', ');
    const effectiveLocation = location || locationParts;

    if (!url) return Response.json({ error: 'A website URL is required' }, { status: 400 });
    if (keywords.length === 0) return Response.json({ error: 'Enter at least one keyword' }, { status: 400 });
    if (keywords.length > 20) return Response.json({ error: 'Maximum 20 keywords per check' }, { status: 400 });

    let hostname;
    try { hostname = new URL(url.startsWith('http') ? url : 'https://' + url).hostname.replace(/^www\./, ''); }
    catch { return Response.json({ error: 'Invalid URL' }, { status: 400 }); }

    const locationClause = effectiveLocation ? ` Focus the search on the location "${effectiveLocation}" — use its local Google edition (e.g. google.co.in for India, google.co.uk for the UK) and bias results toward that region/city. Report the city and country you searched in for each keyword.` : ' Search the global Google results.';

    const prompt = `You are an SEO rank-tracking tool. For the website "${hostname}", find its organic ranking position in Google search results for each of these keywords:
${JSON.stringify(keywords)}
${locationClause}

For each keyword, search the web and determine where ${hostname} (or any page on this domain) appears in the top 100 organic results. Return the position (1-100), or 0 if the site does not rank in the top 100. Include the exact ranking URL if found, a brief page title, and the location the ranking was checked in. Be accurate — only report a position if you actually find the domain in the results.`;

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
                page_title: { type: 'string' },
                location: { type: 'string' },
                city: { type: 'string' },
                country: { type: 'string' }
              }
            }
          }
        }
      }
    });

    return Response.json({ results: result.results || [], hostname, location: effectiveLocation, city, country });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}