import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const DEFAULT_FAQS = [
  ['Is the website audit really free?', 'Yes. Create an account, enter your URL and you get scored results on screen instantly. The full downloadable PDF report is unlocked when you choose any package.'],
  ['What does a package include?', 'A dedicated project dashboard, milestone tracking, monthly reports (PDF, documents and spreadsheets), one-click approvals and priority support tickets.'],
  ['Can I pay monthly, quarterly or yearly?', 'All three. Quarterly and yearly billing come with a built-in discount and you can renew or upgrade at any time from your dashboard.'],
  ['How do approvals work?', 'Every deliverable we upload shows an Approve or Request Changes button. Your decision and notes are logged so nothing gets lost.'],
  ['How quickly will I see results?', 'Technical fixes usually show within weeks; competitive keyword growth typically compounds over 3–6 months. Your monthly reports show the trend.'],
  ['Can I manage more than one website?', 'Yes — add as many projects as you like under one account. Each project gets its own dashboard, reports and milestones.'],
];

function matchPath(pathname, items) {
  return items.filter((item) => {
    if (item.page_path === pathname) return true;
    if (item.page_path && item.page_path.includes(':')) {
      const pattern = item.page_path.replace(/:[^/]+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(pathname);
    }
    return false;
  });
}

export default function FaqSection({ pagePath, fallbackFaqs }) {
  const location = useLocation();
  const path = pagePath || location.pathname;

  const { data: faqItems = [] } = useQuery({
    queryKey: ['faq-items'],
    queryFn: () => base44.entities.FaqItem.filter({ is_active: true }),
  });

  const matched = useMemo(
    () => matchPath(path, faqItems).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    [faqItems, path]
  );

  const faqs = matched.length > 0
    ? matched.map((f) => [f.question, f.answer])
    : (fallbackFaqs || DEFAULT_FAQS).map((f) => (Array.isArray(f) ? f : [f.q, f.a]));

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">FAQ</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900">Common questions</h2>
        </div>
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map(([q, a], i) => (
            <AccordionItem key={i} value={`f${i}`} className="rounded-2xl border border-slate-200 bg-white px-6">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:no-underline">{q}</AccordionTrigger>
              <AccordionContent className="text-slate-500">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}