import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

function matchPath(pathname, settings) {
  // Exact match first
  const exact = settings.find((s) => s.path === pathname);
  if (exact) return exact;
  // Pattern match (e.g. /platform/:slug)
  for (const s of settings) {
    if (s.path && s.path.includes(':')) {
      const pattern = s.path.replace(/:[^/]+/g, '[^/]+');
      if (new RegExp(`^${pattern}$`).test(pathname)) return s;
    }
  }
  return null;
}

export function useSeo() {
  const location = useLocation();
  const { data: settings = [] } = useQuery({
    queryKey: ['seo-settings'],
    queryFn: () => base44.entities.SeoSetting.filter({ is_active: true }),
  });

  const matched = matchPath(location.pathname, settings);

  useEffect(() => {
    if (!matched) return;

    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (matched.title) document.title = matched.title;
    setMeta('name', 'description', matched.description);
    setMeta('name', 'keywords', matched.meta_keywords);
    setMeta('name', 'robots', matched.robots);
    setMeta('property', 'og:title', matched.og_title || matched.title);
    setMeta('property', 'og:description', matched.og_description || matched.description);
    setMeta('property', 'og:image', matched.og_image);
    setMeta('property', 'og:url', matched.canonical_url || window.location.href);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', matched.twitter_title || matched.og_title || matched.title);
    setMeta('name', 'twitter:description', matched.twitter_description || matched.og_description || matched.description);
    setMeta('name', 'twitter:image', matched.twitter_image || matched.og_image);

    if (matched.canonical_url) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', matched.canonical_url);
    }

    // JSON-LD schema: remove old injected scripts, add new ones
    document.head.querySelectorAll('script[data-seo-schema]').forEach((el) => el.remove());
    if (matched.schema_json) {
      try {
        const schemas = JSON.parse(matched.schema_json);
        const arr = Array.isArray(schemas) ? schemas : [schemas];
        arr.forEach((schema) => {
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.setAttribute('data-seo-schema', 'true');
          script.textContent = JSON.stringify(schema);
          document.head.appendChild(script);
        });
      } catch (e) {
        // invalid JSON — skip
      }
    }
  }, [matched?.id, location.pathname]);

  return matched;
}