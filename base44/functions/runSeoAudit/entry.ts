import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const STOPWORDS = new Set(['this','that','with','from','your','have','will','about','which','their','they','them','than','then','when','where','what','while','also','into','over','under','more','most','some','such','only','just','being','been','were','are','was','the','and','for','you','our','all','can','has','not','but','out','get','use','one','who','how','its','ing']);

const NAMED_ENTITIES = { amp:'&', lt:'<', gt:'>', quot:'"', apos:"'", nbsp:' ', mdash:'—', ndash:'–', rsquo:'\u2019', lsquo:'\u2018', rdquo:'\u201D', ldquo:'\u201C', hellip:'…', copy:'©', reg:'®', trade:'™', bull:'•', deg:'°', pound:'£', euro:'€', cent:'¢' };
const decodeEntities = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/&([a-zA-Z]+);/g, (m, n) => NAMED_ENTITIES[n] !== undefined ? NAMED_ENTITIES[n] : m);
const stripTags = (h) => decodeEntities(h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const matchAllText = (html, re) => [...html.matchAll(re)].map((m) => stripTags(m[1] || '').trim()).filter(Boolean);

function fetchWithTimeout(url, opts = {}, ms = 8000) {
  return fetch(url, { ...opts, signal: AbortSignal.timeout(ms) });
}

function parseRobots(text) {
  const blocks = [];
  let current = null;
  text.split(/\r?\n/).forEach((line) => {
    const l = line.trim();
    if (!l || l.startsWith('#')) return;
    const [rawKey, ...rest] = l.split(':');
    const key = (rawKey || '').trim().toLowerCase();
    const value = rest.join(':').trim();
    if (key === 'user-agent') {
      if (!current || current.disallow.length || current.sitemap) { current = { agents: [value.toLowerCase()], disallow: [], sitemap: '' }; blocks.push(current); }
      else current.agents.push(value.toLowerCase());
    } else if (key === 'disallow' && current) {
      current.disallow.push(value);
    } else if (key === 'sitemap') {
      const b = { agents: [], disallow: [], sitemap: value };
      blocks.push(b);
    }
  });
  return blocks;
}

function isBlocked(blocks, agent) {
  const blk = blocks.find((b) => b.agents.includes(agent.toLowerCase()) || b.agents.includes('*'));
  if (!blk) return false;
  return blk.disallow.some((d) => d === '/' || d === '');
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    let url = String(body?.url || '').trim();
    if (!url) return Response.json({ error: 'A website URL is required' }, { status: 400 });
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    if (url.length > 200) return Response.json({ error: 'URL too long' }, { status: 400 });
    let hostname, origin;
    try {
      const u = new URL(url);
      hostname = u.hostname;
      origin = `${u.protocol}//${u.hostname}`;
      // Validate the hostname looks like a real domain (must contain a TLD)
      if (!hostname || !hostname.includes('.') || hostname.length < 4) {
        return Response.json({ error: 'Please enter a valid domain (e.g. example.com or example.com/about)' }, { status: 400 });
      }
      // If only a domain is entered (no path or just "/"), normalise to the homepage
      if (!u.pathname || u.pathname === '/') {
        url = origin + '/';
      }
    } catch { return Response.json({ error: 'Invalid URL' }, { status: 400 }); }

    const checks = [];
    const addCheck = (section, title, status, value, detail) => checks.push({ section, title, status, value: value || '', detail: detail || '' });

    // --- Fetch the live page ---
    let html = '';
    let fetchStatus = 0;
    let loadMs = 0;
    let contentLength = 0;
    let contentEncoding = '';
    let finalUrl = url;
    let fetchFailed = false;
    try {
      const started = Date.now();
      const res = await fetchWithTimeout(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9' } }, 12000);
      loadMs = Date.now() - started;
      fetchStatus = res.status;
      finalUrl = res.url || url;
      contentLength = Number(res.headers.get('content-length') || 0);
      contentEncoding = res.headers.get('content-encoding') || '';
      const raw = await res.text();
      if (!contentLength) contentLength = raw.length;
      html = raw.slice(0, 150000);
    } catch (_e) {
      fetchFailed = true;
    }

    if (fetchFailed || !html) {
      addCheck('technical', 'Website Reachability', 'fail', `HTTP ${fetchStatus || 'timeout'}`, 'We could not successfully load the live page, so most checks could not run.');
      const audit = await base44.entities.Audit.create({
        url, client_id: user.id, client_email: user.email,
        overall_score: 0,
        scores: { seo: 0, performance: 0, content: 0, technical: 0, ai_readiness: 0 },
        summary: 'The page could not be reached, so a full audit could not be performed. Verify the URL is correct and publicly accessible.',
        issues: [{ title: 'Website unreachable', severity: 'high', detail: 'The audit tool could not load this URL. It may be down, blocking automated requests, or the address may be incorrect.' }],
        recommendations: ['Confirm the URL is correct and publicly accessible, then re-run the audit.'],
        checks, word_count: 0, keywords: [], technology: []
      });
      return Response.json({ audit });
    }

    const pick = (re) => { const m = html.match(re); return m ? stripTags(m[1]).slice(0, 300) : ''; };
    const count = (re) => (html.match(re) || []).length;

    const title = pick(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const metaDescription = pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
    const canonical = pick(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) || pick(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
    const langAttr = pick(/<html[^>]+lang=["']([^"']*)["']/i);
    const h1s = matchAllText(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
    const h2s = matchAllText(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi);
    const h3Count = count(/<h3[\s>]/gi), h4Count = count(/<h4[\s>]/gi), h5Count = count(/<h5[\s>]/gi), h6Count = count(/<h6[\s>]/gi);
    // Extract <body> content only for text analysis (word count, keywords, emails, phones)
    // — the full `html` includes <head> metadata (title, meta content, JSON-LD) which
    // would inflate word counts and pollute keyword extraction with non-visible text.
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyHtml = bodyMatch ? bodyMatch[1] : html;
    const bodyText = stripTags(bodyHtml);
    const wordCount = bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0;

    // --- On-Page SEO ---
    if (!title) addCheck('on_page_seo', 'Title Tag', 'fail', '', 'Your page is missing a Title Tag entirely. This is one of the most important on-page SEO elements.');
    else if (title.length < 30 || title.length > 65) addCheck('on_page_seo', 'Title Tag', 'warning', `"${title}" (${title.length} chars)`, 'You have a Title Tag, but ideally it should be between 50 and 60 characters in length.');
    else addCheck('on_page_seo', 'Title Tag', 'pass', `"${title}" (${title.length} chars)`, 'Your Title Tag is present and at a good length.');

    if (!metaDescription) addCheck('on_page_seo', 'Meta Description Tag', 'fail', '', 'Your page is missing a Meta Description. Search engines often use this as the snippet shown in results.');
    else if (metaDescription.length < 120 || metaDescription.length > 160) addCheck('on_page_seo', 'Meta Description Tag', 'warning', `"${metaDescription}" (${metaDescription.length} chars)`, 'Your Meta Description exists but is outside the optimal 120-160 character range.');
    else addCheck('on_page_seo', 'Meta Description Tag', 'pass', `"${metaDescription}" (${metaDescription.length} chars)`, 'Your page has a Meta Description of optimal length.');

    const hasHreflang = /<link[^>]+rel=["']alternate["'][^>]+hreflang=/i.test(html);
    addCheck('on_page_seo', 'Hreflang Usage', hasHreflang ? 'pass' : 'info', hasHreflang ? 'Present' : 'Not used', hasHreflang ? 'Your page specifies alternate language/region versions.' : 'Your page is not making use of Hreflang attributes. Only needed if you have multi-language versions of this page.');

    addCheck('on_page_seo', 'Language Attribute', langAttr ? 'pass' : 'warning', langAttr || 'Not set', langAttr ? `Your page is using the Lang Attribute (declared: ${langAttr}).` : 'Your page is missing the HTML lang attribute.');

    if (h1s.length === 0) addCheck('on_page_seo', 'H1 Header Tag Usage', 'fail', '0 found', 'Your page has no H1 Tag. Every page should have exactly one H1 summarizing its topic.');
    else if (h1s.length > 1) addCheck('on_page_seo', 'H1 Header Tag Usage', 'warning', h1s.slice(0, 5).join(' | '), `Your page has ${h1s.length} H1 Tags. It is generally recommended to only use one H1 Tag per page.`);
    else addCheck('on_page_seo', 'H1 Header Tag Usage', 'pass', h1s[0], 'Your page correctly uses a single H1 Tag.');

    const otherLevels = [h2s.length > 0, h3Count > 0, h4Count > 0, h5Count > 0, h6Count > 0].filter(Boolean).length;
    addCheck('on_page_seo', 'H2-H6 Header Tag Usage', otherLevels >= 1 ? 'pass' : 'warning', `H2:${h2s.length} H3:${h3Count} H4:${h4Count} H5:${h5Count} H6:${h6Count}`, otherLevels >= 1 ? 'Your page is making use of multiple levels of Header Tags to organize content.' : 'Your page has no H2-H6 tags. Adding subheadings helps both users and search engines understand structure.');

    const emailMatches = (bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []);
    addCheck('on_page_seo', 'Email Privacy', emailMatches.length ? 'warning' : 'pass', emailMatches.length ? emailMatches.slice(0, 3).join(', ') : 'None found', emailMatches.length ? 'Plain-text email addresses were found on the page, which can be scraped by spam bots.' : 'No plain-text email addresses were found on the page.');

    if (wordCount < 300) addCheck('content', 'Amount of Content', 'fail', `${wordCount} words`, "Your page has a low volume of text content which search engines can interpret as 'thin content'. Aim for at least 500 words.");
    else if (wordCount < 500) addCheck('content', 'Amount of Content', 'warning', `${wordCount} words`, 'Your page has a moderate amount of content. Consider expanding toward 500+ words for stronger ranking potential.');
    else addCheck('content', 'Amount of Content', 'pass', `${wordCount} words`, 'Your page has a healthy volume of text content.');

    const imgTags = html.match(/<img[^>]*>/gi) || [];
    const imgsWithoutAlt = imgTags.filter((t) => !/\balt=["'][^"']*["']/i.test(t) || /\balt=["']["']/i.test(t));
    addCheck('content', 'Image Alt Attributes', imgTags.length === 0 ? 'info' : (imgsWithoutAlt.length === 0 ? 'pass' : 'fail'), `${imgsWithoutAlt.length} of ${imgTags.length} missing`, imgTags.length === 0 ? 'No images were found on the page.' : (imgsWithoutAlt.length === 0 ? 'All images have Alt Attributes.' : `${imgsWithoutAlt.length} of ${imgTags.length} images are missing descriptive Alt Attributes.`));

    // Keyword consistency
    const words = bodyText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !STOPWORDS.has(w));
    const freq = {};
    words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
    const topKeywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([keyword, kcount]) => {
      const lowerTitle = title.toLowerCase(), lowerMeta = metaDescription.toLowerCase(), headingsText = [...h1s, ...h2s].join(' ').toLowerCase();
      return { keyword, count: kcount, in_title: lowerTitle.includes(keyword), in_meta: lowerMeta.includes(keyword), in_headings: headingsText.includes(keyword) };
    });
    const keywordsInTitleOrHeadings = topKeywords.filter((k) => k.in_title || k.in_headings).length;
    addCheck('content', 'Keyword Consistency', keywordsInTitleOrHeadings >= 3 ? 'pass' : 'warning', `${keywordsInTitleOrHeadings}/${topKeywords.length} top keywords in Title/Headings`, keywordsInTitleOrHeadings >= 3 ? "Your page's main keywords are distributed well across the important HTML Tags." : 'Your most frequent keywords appear inconsistently across Title, Meta Description and Headings.');

    // --- Technical ---
    const noindexMeta = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
    addCheck('technical', 'Noindex Tag Test', noindexMeta ? 'fail' : 'pass', noindexMeta ? 'noindex found' : 'Not present', noindexMeta ? 'Your page is using a Noindex Tag which prevents it from being indexed by search engines.' : 'Your page is not using the Noindex Tag which prevents indexing.');

    addCheck('technical', 'Canonical Tag', canonical ? 'pass' : 'warning', canonical || 'Not set', canonical ? `Your page is using the Canonical Tag (${canonical}).` : 'Your page is missing a Canonical Tag.');

    const isHttps = finalUrl.startsWith('https://');
    addCheck('technical', 'SSL Enabled', isHttps ? 'pass' : 'fail', isHttps ? 'HTTPS' : 'HTTP', isHttps ? 'Your website has SSL enabled.' : 'Your website is not using HTTPS.');

    let httpsRedirects = isHttps;
    try {
      const httpRes = await fetchWithTimeout(`http://${hostname}`, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' } }, 8000);
      httpsRedirects = (httpRes.url || '').startsWith('https://');
    } catch { /* leave as isHttps */ }
    addCheck('technical', 'HTTPS Redirect', httpsRedirects ? 'pass' : 'warning', httpsRedirects ? 'Redirects to HTTPS' : 'No redirect detected', httpsRedirects ? 'Your page successfully redirects to a HTTPS (SSL secure) version.' : 'The HTTP version of your page does not redirect to HTTPS.');

    const inlineStyleCount = count(/\sstyle=["']/gi);
    addCheck('technical', 'Inline Styles', inlineStyleCount > 0 ? 'warning' : 'pass', `${inlineStyleCount} found`, inlineStyleCount > 0 ? 'Your page is using Inline Styles, an older practice discouraged in favor of CSS stylesheets.' : 'No inline styles were detected.');

    const deprecatedCount = count(/<(font|center|marquee|strike|big|tt|frameset)[\s>]/gi);
    addCheck('technical', 'Deprecated HTML', deprecatedCount > 0 ? 'warning' : 'pass', deprecatedCount > 0 ? `${deprecatedCount} tags found` : 'None found', deprecatedCount > 0 ? 'Deprecated HTML tags were found within your page.' : 'No deprecated HTML tags have been found within your page.');

    const hasFlash = /\.swf|application\/x-shockwave-flash/i.test(html);
    addCheck('technical', 'Flash Used?', hasFlash ? 'warning' : 'pass', hasFlash ? 'Detected' : 'Not detected', hasFlash ? 'Flash content was identified on your page, which is not supported on modern devices.' : 'No Flash content has been identified on your page.');

    const iframeCount = count(/<iframe[\s>]/gi);
    addCheck('technical', 'iFrames Used?', iframeCount > 0 ? 'info' : 'pass', iframeCount > 0 ? `${iframeCount} found` : 'None found', iframeCount > 0 ? `${iframeCount} iFrame(s) detected on your page.` : 'There are no iFrames detected on your page.');

    const hasFavicon = /<link[^>]+rel=["'](?:shortcut icon|icon)["']/i.test(html);
    addCheck('technical', 'Favicon', hasFavicon ? 'pass' : 'warning', hasFavicon ? 'Present' : 'Missing', hasFavicon ? 'Your page has specified a Favicon.' : 'Your page is missing a Favicon.');

    // Extract JSON-LD schema types from the page
    const schemaBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    const schemaTypes = [];
    schemaBlocks.forEach((m) => {
      try {
        const cleaned = m[1].trim().replace(/<!--[\s\S]*?-->/g, '');
        const parsed = JSON.parse(cleaned);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        items.forEach((item) => {
          if (item && item['@type']) {
            const types = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
            types.forEach((t) => { if (t && !schemaTypes.includes(t)) schemaTypes.push(t); });
          }
        });
      } catch { /* skip invalid JSON-LD */ }
    });
    const hasJsonLd = schemaBlocks.length > 0;
    addCheck('technical', 'Schema.org Structured Data', hasJsonLd ? 'pass' : 'warning', hasJsonLd ? schemaTypes.join(', ') : 'Not found', hasJsonLd ? `You are using JSON-LD Schema (${schemaTypes.join(', ')}).` : 'No Schema.org structured data was found on your page.');

    // robots.txt / sitemap
    let robotsText = '', robotsOk = false;
    try {
      const rRes = await fetchWithTimeout(`${origin}/robots.txt`, {}, 8000);
      robotsOk = rRes.ok;
      if (robotsOk) robotsText = await rRes.text();
    } catch { /* not available */ }
    addCheck('technical', 'Robots.txt', robotsOk ? 'pass' : 'warning', robotsOk ? `${origin}/robots.txt` : 'Not found', robotsOk ? 'Your website appears to have a robots.txt file.' : 'No robots.txt file could be found.');

    const robotsBlocks = robotsOk ? parseRobots(robotsText) : [];
    const blockedMajor = robotsOk && (isBlocked(robotsBlocks, 'googlebot') || isBlocked(robotsBlocks, 'bingbot') || isBlocked(robotsBlocks, '*'));
    addCheck('technical', 'Search Engines Blocked by Robots.txt', blockedMajor ? 'fail' : 'pass', blockedMajor ? 'Blocked' : 'Not blocked', blockedMajor ? 'Your robots.txt appears to block major search engines from crawling your page.' : 'Your page is crawlable by the major search engines.');

    const sitemapMatch = robotsText.match(/Sitemap:\s*(\S+)/i);
    let sitemapFound = !!sitemapMatch;
    let sitemapUrl = sitemapMatch ? sitemapMatch[1] : '';
    if (!sitemapFound) {
      try { const sRes = await fetchWithTimeout(`${origin}/sitemap.xml`, {}, 6000); if (sRes.ok) { sitemapFound = true; sitemapUrl = `${origin}/sitemap.xml`; } } catch { /* ignore */ }
    }
    addCheck('technical', 'XML Sitemaps', sitemapFound ? 'pass' : 'warning', sitemapFound ? sitemapUrl : 'Not found', sitemapFound ? 'Your website appears to have an XML Sitemap.' : 'No XML Sitemap could be found.');

    const analyticsDetected = /gtag\(|GoogleAnalyticsObject|UA-\d{4,}|G-[A-Z0-9]{6,}|googletagmanager\.com\/gtm\.js/i.test(html);
    addCheck('technical', 'Analytics', analyticsDetected ? 'pass' : 'warning', analyticsDetected ? 'Detected' : 'Not detected', analyticsDetected ? 'Your page is using an analytics tool.' : 'No web analytics tool was detected on your page.');

    // --- Performance ---
    if (loadMs > 4000) addCheck('performance', 'Website Load Speed', 'fail', `${(loadMs / 1000).toFixed(2)}s`, 'Your page loads slowly. This can affect user experience and search rankings.');
    else if (loadMs > 2000) addCheck('performance', 'Website Load Speed', 'warning', `${(loadMs / 1000).toFixed(2)}s`, 'Your page load time has some room for improvement.');
    else addCheck('performance', 'Website Load Speed', 'pass', `${(loadMs / 1000).toFixed(2)}s`, 'Your page loads quickly.');

    const sizeMb = contentLength / (1024 * 1024);
    addCheck('performance', 'Website Download Size', sizeMb > 5 ? 'warning' : 'pass', `${sizeMb.toFixed(2)}MB`, sizeMb > 5 ? 'Your HTML document size is on the larger side.' : "Your page's HTML size is reasonably low.");

    addCheck('performance', 'Compression Usage', contentEncoding ? 'pass' : 'warning', contentEncoding || 'None detected', contentEncoding ? `Your website is using ${contentEncoding} compression.` : 'No compression (Gzip/Brotli) was detected on this response.');

    const scriptCount = count(/<script[\s>]/gi);
    const cssCount = count(/<link[^>]+rel=["']stylesheet["']/gi);
    addCheck('performance', 'Resources Breakdown', 'info', `${scriptCount} scripts, ${cssCount} stylesheets, ${imgTags.length} images`, 'Total count of key resource types requested by this page.');

    // --- Social ---
    const hasOg = /property=["']og:/i.test(html);
    addCheck('social', 'Open Graph Tags', hasOg ? 'pass' : 'warning', hasOg ? 'Present' : 'Missing', hasOg ? 'Your page is using Open Graph Tags for social sharing.' : 'Your page is missing Open Graph Tags.');
    const hasTwitterCard = /name=["']twitter:card["']/i.test(html);
    addCheck('social', 'Twitter/X Cards', hasTwitterCard ? 'pass' : 'info', hasTwitterCard ? 'Present' : 'Missing', hasTwitterCard ? 'Your page is using X/Twitter Cards.' : 'No X/Twitter Card markup was found.');
    const socialPlatforms = [['Facebook', /facebook\.com\//i], ['X (Twitter)', /(?:twitter|x)\.com\//i], ['Instagram', /instagram\.com\//i], ['LinkedIn', /linkedin\.com\//i], ['YouTube', /youtube\.com\//i]];
    socialPlatforms.forEach(([name, re]) => {
      const linked = re.test(html);
      addCheck('social', `${name} Page Linked`, linked ? 'pass' : 'info', linked ? 'Linked' : 'Not linked', linked ? `A ${name} profile link was found on your page.` : `No associated ${name} profile link found on your page.`);
    });

    // --- Local SEO ---
    const phoneMatch = bodyText.match(/(\+?\d[\d\s().-]{7,}\d)/);
    addCheck('local_seo', 'Phone Number Shown', phoneMatch ? 'pass' : 'warning', phoneMatch ? phoneMatch[0].trim() : 'Not found', phoneMatch ? 'A phone number is clearly visible in the page text.' : 'No phone number could be identified in the page text.');
    const hasLocalBusinessSchema = /"@type"\s*:\s*"LocalBusiness"|"@type"\s*:\s*"[A-Za-z]*Business/i.test(html);
    addCheck('local_seo', 'Local Business Schema', hasLocalBusinessSchema ? 'pass' : 'info', hasLocalBusinessSchema ? 'Present' : 'Not found', hasLocalBusinessSchema ? 'Local Business structured data was identified on the page.' : 'No Local Business Schema markup was identified on the page. Only relevant if you are a local business.');

    // --- AI Readiness / GEO ---
    let llmsOk = false;
    try { const lRes = await fetchWithTimeout(`${origin}/llms.txt`, {}, 6000); llmsOk = lRes.ok; } catch { /* ignore */ }
    addCheck('ai_readiness', 'Llms.txt', llmsOk ? 'pass' : 'info', llmsOk ? 'Found' : 'Not found', llmsOk ? 'A llms.txt file was found on your site.' : 'We have not detected a llms.txt file. This is an emerging standard, not yet essential.');

    const aiBots = ['gptbot', 'google-extended', 'claudebot', 'perplexitybot', 'ccbot'];
    const aiBlocked = robotsOk && aiBots.some((bot) => isBlocked(robotsBlocks, bot));
    addCheck('ai_readiness', 'AI Crawlers Blocked by Robots.txt', aiBlocked ? 'fail' : 'pass', aiBlocked ? 'Blocked' : 'Not blocked', aiBlocked ? 'Your robots.txt blocks major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.), preventing citation in AI answers.' : 'Your robots.txt allows major AI crawlers to access your site.');

    const hasFaqSchema = /"@type"\s*:\s*"FAQPage"/i.test(html);
    const hasQuestionHeadings = [...h1s, ...h2s].some((h) => h.includes('?')) || /\bFAQ\b|frequently asked/i.test(bodyText);
    addCheck('ai_readiness', 'Answer Alignment (FAQ)', (hasFaqSchema || hasQuestionHeadings) ? 'pass' : 'warning', (hasFaqSchema || hasQuestionHeadings) ? 'Present' : 'Not found', (hasFaqSchema || hasQuestionHeadings) ? 'Your page includes question-and-answer style content or FAQ schema.' : 'Your page lacks question-and-answer style content such as an FAQ, which maps well to how people query LLMs.');

    // --- Technology detection ---
    const technology = [];
    if (/wp-content|<meta[^>]+name=["']generator["'][^>]+content=["']WordPress/i.test(html)) technology.push('WordPress');
    if (/elementor/i.test(html)) technology.push('Elementor');
    if (/jquery(?:-|\.)/i.test(html)) technology.push('jQuery');
    if (/googletagmanager\.com/i.test(html)) technology.push('Google Tag Manager');
    if (/gtag\(|UA-\d{4,}|G-[A-Z0-9]{6,}/i.test(html)) technology.push('Google Analytics');
    if (/shopify/i.test(html)) technology.push('Shopify');
    if (/wixsite\.com|wix\.com\/apps/i.test(html)) technology.push('Wix');
    if (/react/i.test(html) && /__next|_next\/static/i.test(html)) technology.push('Next.js');

    // --- Score computation (derived only from measured checks, never guessed) ---
    const statusScore = { pass: 100, warning: 60, fail: 0, info: null };
    const sectionToGroup = { on_page_seo: 'seo', technical: 'technical', content: 'content', performance: 'performance', ai_readiness: 'ai_readiness', social: 'seo', local_seo: 'seo' };
    const groups = { seo: [], performance: [], content: [], technical: [], ai_readiness: [] };
    checks.forEach((c) => {
      const group = sectionToGroup[c.section];
      const s = statusScore[c.status];
      if (group && s !== null) groups[group].push(s);
    });
    const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
    const scores = {};
    Object.keys(groups).forEach((g) => { scores[g] = groups[g].length ? clamp(groups[g].reduce((a, b) => a + b, 0) / groups[g].length) : 70; });
    const overall = clamp(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);

    // Issues & recommendations derived directly from failed/warning checks (deterministic, no hallucination)
    const problemChecks = checks.filter((c) => c.status === 'fail' || c.status === 'warning');
    const issues = problemChecks.slice(0, 8).map((c) => ({ title: c.title, severity: c.status === 'fail' ? 'high' : 'medium', detail: c.detail }));
    const recommendations = problemChecks.slice(0, 7).map((c) => c.detail);

    // Short LLM-written executive summary, strictly grounded in the real scores/issues (no free-form fact claims)
    let summary = '';
    try {
      const summaryPrompt = `Write a concise 2-3 sentence executive summary for an SEO audit of ${url}.
Overall score: ${overall}/100. Category scores: ${JSON.stringify(scores)}.
Top issues found (already verified from the live page, do not add or invent any other issues): ${JSON.stringify(problemChecks.slice(0, 5).map((c) => c.title))}.
Write for a business owner, plain language, no invented facts beyond what's listed.`;
      summary = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt: summaryPrompt });
      if (typeof summary !== 'string') summary = '';
    } catch { summary = ''; }
    if (!summary) summary = `This page scores ${overall}/100 overall. ${problemChecks.length ? `The main areas to improve are: ${problemChecks.slice(0, 3).map((c) => c.title).join(', ')}.` : 'No major issues were found.'}`;

    const audit = await base44.entities.Audit.create({
      url, client_id: user.id, client_email: user.email,
      overall_score: overall, scores,
      summary,
      issues,
      recommendations,
      word_count: wordCount,
      keywords: topKeywords,
      technology,
      checks
    });

    return Response.json({ audit });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}