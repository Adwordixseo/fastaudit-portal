export default async function(req) {
  try {
    const { body_url } = await req.json();
    if (!body_url || typeof body_url !== 'string') {
      return Response.json({ error: 'body_url is required' }, { status: 400 });
    }
    // Restrict to Base44 file storage to prevent SSRF
    const url = new URL(body_url);
    const allowed =
      url.hostname === 'base44.app' ||
      url.hostname === 'media.base44.com' ||
      url.hostname.endsWith('.base44.app') ||
      url.hostname.endsWith('.base44.com');
    if (!allowed) {
      return Response.json({ error: 'URL not allowed' }, { status: 400 });
    }
    const res = await fetch(body_url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return Response.json({ error: 'Failed to fetch body' }, { status: 502 });
    }
    const html = await res.text();
    return Response.json({ html });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}