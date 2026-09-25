import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const DEFAULT_FAQS = [
  ["Does Adwordix LLC offer a completely free online SEO audit tool?", "Yes. Adwordix LLC offers a free online SEO audit tool that checks your website and provides insights into its SEO strengths, issues, and areas that may need improvement. You can start with the tool for free and get a precise SEO audit report."],
  ["How can I check my website's SEO for free?", "Enter your website URL into the free website SEO audit tool and run the analysis. You'll receive an instant free SEO report that highlights important areas of your website, including strengths and potential gaps. Then, if you need more assistance and growth plans, you can pick a package that fits your requirements."],
  ["What can a free SEO audit tell me about my website?", "A free SEO audit can help you identify important website issues and optimization opportunities. It gives you a starting point for understanding your current SEO health and deciding what needs attention. From content gaps to AI readiness and technical insights, it covers what exactly limits and strengthens your online performance."],
  ["Are free SEO audit tools enough for a complete SEO analysis?", "Not always. While a free audit is useful for identifying key issues and opportunities, a deeper SEO analysis may require more detailed technical, content, keyword, competitor, and performance research. This happens when you choose the right SEO tool package. Here, you can access multiple SEO plans and everything on one dashboard. From reports to support, everything is seamless with Adwordix LLC's website audit services."],
  ["Can a free SEO audit improve my website rankings?", "The audit itself does not improve rankings. It identifies SEO issues and opportunities that you can act on. Improving rankings requires implementing the right changes and maintaining an ongoing SEO strategy based on your website, competition, search intent, and other ranking factors."],
  ["Is an SEO audit useful if my website already ranks on Google?", "Yes. An SEO audit can help identify areas that may be limiting your existing visibility, along with opportunities to improve pages, content, technical SEO, and search performance. Even if you do not have SEO knowledge or your website is already ranking, you can always find a new parameter to work on."],
  ["What should I do after receiving my free SEO report?", "Start with the most important findings and prioritize fixes based on their potential impact. If you prefer expert support, you can use the audit findings as a starting point to choose an SEO package and take your optimization further."],
  ["Does Adwordix LLC offer a white-label website audit tool for agencies?", "Yes. Adwordix LLC offers a white-label website audit tool that agencies can use to audit client websites, present SEO findings under their own brand, and provide clients with clear, professional audit reports."],
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

  // Auto-inject FAQPage JSON-LD schema from the FAQs actually displayed on this page
  const faqKey = JSON.stringify(faqs);
  useEffect(() => {
    document.head.querySelectorAll('script[data-faq-schema]').forEach((el) => el.remove());
    if (!faqs.length) return;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-faq-schema', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      document.head.querySelectorAll('script[data-faq-schema]').forEach((el) => el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faqKey]);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="bg-[#0f0a1e] py-24">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">FAQs</span>
          <h2 className="mt-3 text-4xl font-bold text-white">Free SEO Audit Tool: Your Questions, Answered</h2>
        </div>
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map(([q, a], i) => (
            <AccordionItem key={i} value={`f${i}`} className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 backdrop-blur">
              <AccordionTrigger className="text-left text-base font-semibold text-white hover:no-underline">{q}</AccordionTrigger>
              <AccordionContent className="text-slate-400">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}