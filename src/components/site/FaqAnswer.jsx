import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const linkClass = 'font-medium text-pink-400 underline decoration-pink-400/40 underline-offset-2 hover:text-pink-300';

function Anchor({ url, children }) {
  if (url.startsWith('http')) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {children}<ArrowUpRight className="ml-0.5 inline h-3 w-3" />
      </a>
    );
  }
  return (
    <Link to={url} className={linkClass}>
      {children}<ArrowRight className="ml-0.5 inline h-3 w-3" />
    </Link>
  );
}

// Makes the matching word/phrase inside the answer text clickable instead of
// appending the link as a separate word underneath.
export default function FaqAnswer({ text = '', links = [] }) {
  let nodes = [text];
  const unmatched = [];

  links.forEach((link, li) => {
    const label = (link.label || '').trim();
    const url = (link.url || '').trim();
    if (!label || !url) return;

    let hit = false;
    const next = [];
    nodes.forEach((node) => {
      if (typeof node !== 'string') { next.push(node); return; }
      const idx = node.toLowerCase().indexOf(label.toLowerCase());
      if (idx === -1) { next.push(node); return; }
      hit = true;
      if (idx > 0) next.push(node.slice(0, idx));
      next.push(<Anchor key={`link-${li}`} url={url}>{node.slice(idx, idx + label.length)}</Anchor>);
      const rest = node.slice(idx + label.length);
      if (rest) next.push(rest);
    });

    if (hit) nodes = next;
    else unmatched.push({ label, url, key: `unmatched-${li}` });
  });

  return (
    <>
      {nodes.map((n, i) => (
        <React.Fragment key={i}>{n}</React.Fragment>
      ))}
      {unmatched.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {unmatched.map((l) => (
            <Anchor key={l.key} url={l.url}>{l.label}</Anchor>
          ))}
        </div>
      )}
    </>
  );
}