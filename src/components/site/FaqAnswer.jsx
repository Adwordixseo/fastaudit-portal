import React from 'react';
import { Link } from 'react-router-dom';

const DARK_LINK = 'font-medium text-pink-400 underline decoration-pink-400/40 underline-offset-2 hover:text-pink-300';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Anchor({ url, className, children }) {
  if (url.startsWith('http')) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
  }
  return <Link to={url} className={className}>{children}</Link>;
}

// Links the matching word/phrase inside the answer text. Nothing is ever
// appended after the paragraph, so a link can only appear on existing text.
export default function FaqAnswer({ text = '', links = [], linkClassName = DARK_LINK }) {
  let parts = [text];

  links.forEach((link, li) => {
    const label = (link?.label || '').replace(/\s+/g, ' ').trim();
    const url = (link?.url || '').trim();
    if (!label || !url) return;

    const pattern = escapeRegExp(label).replace(/\s+/g, '\\s+');
    const rx = new RegExp(pattern, 'gi');
    const next = [];

    parts.forEach((part) => {
      if (typeof part !== 'string') { next.push(part); return; }
      let cursor = 0;
      let match;
      rx.lastIndex = 0;
      while ((match = rx.exec(part)) !== null) {
        if (match.index > cursor) next.push(part.slice(cursor, match.index));
        next.push(
          <Anchor key={`l${li}-${next.length}`} url={url} className={linkClassName}>
            {match[0]}
          </Anchor>
        );
        cursor = match.index + match[0].length;
        if (match[0].length === 0) rx.lastIndex += 1;
      }
      if (cursor < part.length) next.push(part.slice(cursor));
    });

    parts = next;
  });

  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? <React.Fragment key={i}>{part}</React.Fragment> : part
      )}
    </>
  );
}