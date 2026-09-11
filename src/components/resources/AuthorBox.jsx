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
    <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {image_url && (
          <img
            src={image_url}
            alt={name}
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        )}
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">Written by</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{name}</h3>
          {position && <p className="text-sm text-slate-500">{position}</p>}
          {description && <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>}
          {socials.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              {socials.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors hover:text-indigo-600 hover:ring-indigo-200"
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