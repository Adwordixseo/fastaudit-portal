// Maps the app's routes to the replaceable hardcoded sections on each page template.
// Used by the content section CMS to populate the "replace existing section" dropdown
// dynamically based on the page path the admin enters.

export const ROUTE_SECTIONS = [
  {
    pattern: '/',
    label: 'Landing',
    sections: [
      { value: 'hero', label: 'Hero' },
      { value: 'platform', label: 'Platform features' },
      { value: 'how_it_works', label: 'How it works' },
      { value: 'solutions', label: 'Solutions' },
      { value: 'pricing', label: 'Pricing' },
      { value: 'resources', label: 'Resources' },
      { value: 'faq', label: 'FAQ' },
      { value: 'cta', label: 'CTA banner' },
      { value: 'testimonials', label: 'Testimonials' },
      { value: 'stats', label: 'Stats' },
    ],
  },
  {
    pattern: '/platform/:slug',
    label: 'Platform feature detail',
    sections: [
      { value: 'hero', label: 'Hero' },
      { value: 'stats', label: 'Stats' },
      { value: 'features', label: 'Features grid' },
      { value: 'steps', label: 'How it works steps' },
      { value: 'faq', label: 'FAQ' },
      { value: 'cta', label: 'CTA banner' },
    ],
  },
  {
    pattern: '/solutions/:slug',
    label: 'Solution detail',
    sections: [
      { value: 'hero', label: 'Hero' },
      { value: 'stats', label: 'Stats' },
      { value: 'features', label: 'Features grid' },
      { value: 'steps', label: 'How it works steps' },
      { value: 'faq', label: 'FAQ' },
      { value: 'cta', label: 'CTA banner' },
    ],
  },
  {
    pattern: '/resources',
    label: 'Resources listing',
    sections: [
      { value: 'hero', label: 'Hero' },
      { value: 'cta', label: 'CTA banner' },
    ],
  },
  {
    pattern: '/resources/:slug',
    label: 'Resource article',
    sections: [
      { value: 'hero', label: 'Hero' },
      { value: 'body', label: 'Article body' },
      { value: 'faq', label: 'FAQ' },
      { value: 'cta', label: 'CTA banner' },
    ],
  },
  {
    pattern: '/pricing',
    label: 'Pricing',
    sections: [
      { value: 'pricing', label: 'Pricing packages' },
      { value: 'faq', label: 'FAQ' },
      { value: 'cta', label: 'CTA banner' },
    ],
  },
  {
    pattern: '/contact',
    label: 'Contact',
    sections: [
      { value: 'hero', label: 'Hero' },
      { value: 'cta', label: 'CTA banner' },
    ],
  },
];

// Suggestions shown in the page path datalist. Concrete slugs are included so
// admins can pick an exact page, but pattern matching resolves any matching path.
export const INTERNAL_PATHS = [
  '/',
  '/platform/seo-audits',
  '/platform/keyword-tracking',
  '/platform/reporting',
  '/solutions/agencies',
  '/solutions/ecommerce',
  '/solutions/local-business',
  '/solutions/saas-startups',
  '/resources',
  '/pricing',
  '/contact',
];

function patternToRegex(pattern) {
  return new RegExp('^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$');
}

function resolveRoute(path) {
  if (!path) return null;
  const trimmed = path.trim();
  const exact = ROUTE_SECTIONS.find((r) => r.pattern === trimmed);
  if (exact) return exact;
  for (const r of ROUTE_SECTIONS) {
    if (r.pattern.includes(':') && patternToRegex(r.pattern).test(trimmed)) return r;
  }
  return null;
}

export function getSectionsForPage(path) {
  const route = resolveRoute(path);
  return route ? route.sections : [];
}

export function getRouteLabel(path) {
  const route = resolveRoute(path);
  return route ? route.label : '';
}