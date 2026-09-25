import React from 'react';
import { Twitter, Linkedin, Globe } from 'lucide-react';

export default function AuthorBox({ name, position, description, image_url, twitter, linkedin, website }) {
  if (!name) return null;

  const socials = [
    twitter && { url: twitter, Icon: Twitter, label: 'Twitter' },
    linkedin && { url: linkedin, Icon: Linkedin, label: 'LinkedIn' },
    website && { url: website, Icon: Globe, label: 'Website' },
  ].filter(Boolean);

  return (
    <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {image_url && (
          <img
            src={image_url}
            alt={name}
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white/20 shadow-sm"
          />
        )}
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-pink-400">Written by</p>
          <h3 className="mt-1 text-lg font-bold text-white">{name}</h3>
          {position && <p className="text-sm text-slate-400">{position}</p>}
          {description && <p className="mt-3 text-sm leading-relaxed text-slate-300">{description}</p>}
          {socials.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              {socials.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-slate-400 ring-1 ring-white/10 transition-colors hover:text-pink-400 hover:ring-pink-400/40"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}