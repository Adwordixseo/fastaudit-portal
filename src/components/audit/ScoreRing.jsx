import React from 'react';
import { scoreStroke } from '@/lib/format';

export default function ScoreRing({ value = 0, size = 96, stroke = 8, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={scoreStroke(value)} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * value) / 100} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="rotate-90 font-heading font-bold" style={{ transformOrigin: 'center', fontSize: size / 3.6, fill: '#0f172a' }}>{value}</text>
      </svg>
      {label && <span className="text-xs font-medium capitalize text-slate-500">{label.replace('_', ' ')}</span>}
    </div>
  );
}