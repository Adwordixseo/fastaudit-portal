import { Search, FolderKanban, FileText, CheckCircle2, LifeBuoy, RefreshCw, Building2, Rocket, ShoppingBag, MapPin } from 'lucide-react';

export const platformItems = [
  {
    slug: 'instant-audit',
    icon: Search,
    title: 'Instant Website Audit',
    blurb: 'Score your SEO, performance, content and AI-readiness with a prioritised fix list.',
    tagline: 'A full SEO health check in under a minute — scored, explained, and ready to act on.',
    features: [
      { title: '5-axis scoring', text: 'SEO, performance, content, technical and AI-readiness scored 0–100 with an overall composite.' },
      { title: 'Prioritised fix list', text: 'Issues ranked by severity so you know exactly what to fix first for the biggest lift.' },
      { title: 'AI-readiness check', text: 'See how discoverable your site is to ChatGPT, Perplexity and Google AI Overviews.' },
      { title: 'PDF report', text: 'Download a branded audit PDF to share with stakeholders or keep on file.' },
    ],
  },
  {
    slug: 'project-progress',
    icon: FolderKanban,
    title: 'Project Progress',
    blurb: 'Watch every milestone move from pending to done with live progress bars.',
    tagline: 'Full transparency into your SEO project — milestones, status and progress, updated live.',
    features: [
      { title: 'Milestone tracking', text: 'Every task broken into milestones with pending, in-progress and done states.' },
      { title: 'Live progress bars', text: 'See percentage completion update in real time as your team ships work.' },
      { title: 'Calendar view', text: 'Visualise milestone due dates and document deliveries on one calendar.' },
      { title: 'Project history', text: 'A complete log of what changed and when, so nothing slips through the cracks.' },
    ],
  },
  {
    slug: 'monthly-reports',
    icon: FileText,
    title: 'Monthly Reports',
    blurb: 'PDFs, documents and spreadsheets delivered to your dashboard — preview or download.',
    tagline: 'Your monthly SEO performance, delivered straight to your portal — no email chase.',
    features: [
      { title: 'Centralised document hub', text: 'Every report, spreadsheet and deliverable stored against your project.' },
      { title: 'In-portal preview', text: 'View documents without downloading, then download when you need the file.' },
      { title: 'Monthly cadence', text: 'Reports tagged by month so you can track progress over time at a glance.' },
      { title: 'Email notifications', text: 'Get notified the moment a new report lands in your dashboard.' },
    ],
  },
  {
    slug: 'approvals',
    icon: CheckCircle2,
    title: 'One-click Approvals',
    blurb: 'Approve deliverables or request changes, with a full history log per document.',
    tagline: 'Keep delivery moving — approve or request changes in a click, with a full audit trail.',
    features: [
      { title: 'Approve or request changes', text: 'One click to approve a deliverable or send it back with feedback.' },
      { title: 'Version history', text: 'Every status change logged with who, what and when for full accountability.' },
      { title: 'Admin comments', text: 'Context from your team attached to each document so you always know the why.' },
      { title: 'Review links', text: 'Open Google Docs or Sheets directly from the portal for collaborative review.' },
    ],
  },
  {
    slug: 'support-tickets',
    icon: LifeBuoy,
    title: 'Support Tickets',
    blurb: 'Raise a ticket, track its status and keep the whole conversation in one thread.',
    tagline: 'A direct line to your SEO team — raise, track and resolve, all in one thread.',
    features: [
      { title: 'Categorised tickets', text: 'Tag requests as support, document request, query or billing for faster routing.' },
      { title: 'Priority levels', text: 'Set low, medium or high priority so urgent issues get attention first.' },
      { title: 'Threaded replies', text: 'The full conversation stays in one thread — no lost context across email.' },
      { title: 'Status tracking', text: 'Open, in-progress and resolved states keep everyone aligned.' },
    ],
  },
  {
    slug: 'renew-upgrade',
    icon: RefreshCw,
    title: 'Renew & Upgrade',
    blurb: 'See active and expired packages and renew or scale up in a couple of clicks.',
    tagline: 'Manage your subscription your way — renew, upgrade or switch billing cycles instantly.',
    features: [
      { title: 'Subscription dashboard', text: 'See every active and expired package in one place.' },
      { title: 'Flexible billing', text: 'Monthly, quarterly or yearly — switch cycles to suit your budget.' },
      { title: 'One-click renewal', text: 'Renew an expiring package or upgrade to a higher tier in seconds.' },
      { title: 'Package comparison', text: 'Clear feature breakdowns so you always pick the right plan.' },
    ],
  },
];

export const solutionsItems = [
  {
    slug: 'agencies',
    icon: Building2,
    title: 'For Agencies',
    blurb: 'White-glove reporting for every client project, delivered through one branded portal.',
    tagline: 'Run every client SEO engagement from one portal — milestones, reports and approvals, all client-facing.',
    features: [
      { title: 'Multi-project management', text: 'Manage every client as its own project with dedicated milestones and documents.' },
      { title: 'Client-facing reporting', text: 'Deliver monthly reports clients can preview, approve and download — no email chains.' },
      { title: 'Approval workflows', text: 'Keep clients in the loop with one-click approvals and a full change history.' },
      { title: 'Centralised support', text: 'Every client ticket and conversation in one thread, never lost in inbox.' },
    ],
  },
  {
    slug: 'saas-startups',
    icon: Rocket,
    title: 'For SaaS & Startups',
    blurb: 'Own the answers buyers ask Google and AI assistants at every stage of the funnel.',
    tagline: 'Win the buying queries that matter — from first search to AI-assistant recommendation.',
    features: [
      { title: 'AI-readiness scoring', text: 'Make sure ChatGPT and Perplexity can find and cite your product pages.' },
      { title: 'Funnel-stage targeting', text: 'Audit and optimise content for awareness, consideration and decision queries.' },
      { title: 'Technical SEO fixes', text: 'Clear, prioritised technical issues that block rankings and crawlability.' },
      { title: 'Progress tracking', text: 'Watch keyword positions climb with live milestone and score trends.' },
    ],
  },
  {
    slug: 'ecommerce',
    icon: ShoppingBag,
    title: 'For E-Commerce',
    blurb: 'Win product-intent searches and turn category pages into revenue machines.',
    tagline: 'Capture high-intent product searches and turn category pages into revenue.',
    features: [
      { title: 'Product-page audits', text: 'Score every product page for SEO, performance and AI-readiness.' },
      { title: 'Category-page optimisation', text: 'Identify content and technical gaps that limit category rankings.' },
      { title: 'Performance fixes', text: 'Speed issues flagged and prioritised — critical for conversion and ranking.' },
      { title: 'Monthly revenue reports', text: 'Tie SEO progress to milestones so you can see the work compounding.' },
    ],
  },
  {
    slug: 'local-business',
    icon: MapPin,
    title: 'For Local Business',
    blurb: 'Show up first on the map and in "near me" searches with local SEO that compounds.',
    tagline: 'Dominate the map pack and "near me" searches with local SEO that compounds.',
    features: [
      { title: 'GMB optimisation', text: 'Link and optimise your Google Business Profile directly from the portal.' },
      { title: 'Local keyword tracking', text: 'Track the "near me" and city-based queries that drive foot traffic.' },
      { title: 'Review & citation focus', text: 'Prioritised fixes for the signals that move local map rankings.' },
      { title: 'Onboarding walkthrough', text: 'New clients guided to complete their profile and GMB link from day one.' },
    ],
  },
];

export const findItem = (category, slug) => {
  const list = category === 'platform' ? platformItems : solutionsItems;
  return list.find((i) => i.slug === slug);
};