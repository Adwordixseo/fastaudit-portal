import React, { useState, useEffect } from 'react';

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractHeadings(html) {
  if (!html) return { headings: [], html: '' };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headings = [];
    const usedIds = new Set();
    doc.querySelectorAll('h2, h3').forEach((el) => {
      const text = (el.textContent || '').trim();
      if (!text) return;
      let id = slugify(text);
      const base = id;
      let i = 1;
      while (usedIds.has(id)) {
        id = `${base}-${i++}`;
      }
      usedIds.add(id);
      el.id = id;
      headings.push({ id, text, level: el.tagName.toLowerCase() });
    });
    return { headings, html: doc.body.innerHTML };
  } catch {
    return { headings: [], html };
  }
}

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!headings || headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <nav className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">On this page</p>
      <ul className="space-y-0.5 border-l border-slate-200">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`-ml-px block border-l-2 py-1 transition-colors ${
                h.level === 'h3' ? 'pl-7' : 'pl-3'
              } ${
                activeId === h.id
                  ? 'border-indigo-500 font-medium text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}