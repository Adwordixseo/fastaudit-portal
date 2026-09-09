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
    stats: [
      { value: '< 60s', label: 'Audit runtime' },
      { value: '5', label: 'Scoring axes' },
      { value: '0–100', label: 'Composite score' },
      { value: 'PDF', label: 'Exportable report' },
    ],
    steps: [
      { title: 'Enter your URL', text: 'Drop your website address into the audit form — no signup needed to start.' },
      { title: 'We scan every axis', text: 'Our engine checks SEO, performance, content, technical and AI-readiness in parallel.' },
      { title: 'Get your score & fix list', text: 'Receive a composite score plus a prioritised list of issues with clear guidance.' },
      { title: 'Download & share', text: 'Export a branded PDF report and hand it to your team or stakeholders.' },
    ],
    faq: [
      { q: 'Is the audit really free?', a: 'Yes — you can run a full audit without an account. A package unlocks the downloadable PDF and ongoing tracking.' },
      { q: 'How long does an audit take?', a: 'Most sites complete in under a minute. Larger sites may take slightly longer as we crawl more pages.' },
      { q: 'What does AI-readiness measure?', a: 'How easily AI answer engines like ChatGPT and Perplexity can crawl, extract and cite your content.' },
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
    stats: [
      { value: 'Live', label: 'Progress updates' },
      { value: '3', label: 'Milestone states' },
      { value: '100%', label: 'Transparency' },
      { value: '24/7', label: 'Access' },
    ],
    steps: [
      { title: 'We build your plan', text: 'Your SEO project is broken into clear milestones with target due dates.' },
      { title: 'Track in real time', text: 'Watch milestones move from pending to in-progress to done as work ships.' },
      { title: 'See it on the calendar', text: 'Milestone and document delivery dates appear on one shared calendar.' },
      { title: 'Never lose context', text: 'A full history log records every status change for accountability.' },
    ],
    faq: [
      { q: 'How often is progress updated?', a: 'Progress updates live as your team completes milestones — no waiting for a monthly report.' },
      { q: 'Can I see due dates at a glance?', a: 'Yes, the calendar view shows every milestone and document delivery date in one place.' },
      { q: 'Is there a history of changes?', a: 'Every status change is logged with who changed it and when, so you have a full audit trail.' },
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
    stats: [
      { value: 'Monthly', label: 'Reporting cadence' },
      { value: 'PDF', label: 'Branded format' },
      { value: 'In-portal', label: 'Preview' },
      { value: 'Auto', label: 'Email alerts' },
    ],
    steps: [
      { title: 'We compile your month', text: 'Your team gathers rankings, traffic and work completed into a clear report.' },
      { title: 'Upload to your portal', text: 'The report lands in your dashboard, tagged by month for easy lookup.' },
      { title: 'Get notified', text: 'You receive an email the moment the report is available.' },
      { title: 'Preview or download', text: 'Read it in-portal or download the PDF to share internally.' },
    ],
    faq: [
      { q: 'What format are reports in?', a: 'Reports are delivered as branded PDFs, with supporting spreadsheets where useful.' },
      { q: 'Will I know when a report is ready?', a: 'Yes — you get an email notification the moment a new report is uploaded to your portal.' },
      { q: 'Can I access old reports?', a: 'Every report is stored against your project and tagged by month, so history is always available.' },
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
    stats: [
      { value: '1-click', label: 'Approve or reject' },
      { value: 'Full', label: 'History log' },
      { value: '3', label: 'Status states' },
      { value: '0', label: 'Email back-and-forth' },
    ],
    steps: [
      { title: 'Receive a deliverable', text: 'A new document appears in your portal awaiting your review.' },
      { title: 'Preview in-portal', text: 'Open the document or its review link without leaving the dashboard.' },
      { title: 'Approve or request changes', text: 'One click to approve, or send it back with a note explaining what to change.' },
      { title: 'Track the history', text: 'Every decision is logged so there is a clear record of approvals and feedback.' },
    ],
    faq: [
      { q: 'What happens when I request changes?', a: 'The document returns to your team with your feedback, and you will get a new version to review.' },
      { q: 'Is there a record of who approved what?', a: 'Yes — every status change is logged with the person and timestamp for full accountability.' },
      { q: 'Can I review in Google Docs?', a: 'If your team provides a review link, it opens directly from the portal for collaborative editing.' },
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
    stats: [
      { value: '24h', label: 'Avg response' },
      { value: '4', label: 'Categories' },
      { value: '3', label: 'Priority levels' },
      { value: '1', label: 'Thread per ticket' },
    ],
    steps: [
      { title: 'Raise a ticket', text: 'Describe your request, pick a category and set a priority level.' },
      { title: 'Your team responds', text: 'A team member picks it up and replies in the same thread.' },
      { title: 'Track the status', text: 'Watch it move from open to in-progress to resolved.' },
      { title: 'Keep the context', text: 'The whole conversation stays together so nothing gets lost.' },
    ],
    faq: [
      { q: 'How fast will I get a response?', a: 'Average response time is under 24 hours, with high-priority tickets handled first.' },
      { q: 'Can I categorise my request?', a: 'Yes — choose support, document request, query or billing so it routes to the right person.' },
      { q: 'Where does the conversation live?', a: 'Every reply stays in the original ticket thread, so full context is always preserved.' },
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
    stats: [
      { value: '3', label: 'Billing cycles' },
      { value: '1-click', label: 'Renew or upgrade' },
      { value: 'Clear', label: 'Feature comparison' },
      { value: 'No', label: 'Lock-in' },
    ],
    steps: [
      { title: 'View your subscriptions', text: 'See every active and expired package on one dashboard.' },
      { title: 'Compare plans', text: 'Review features side-by-side to decide whether to renew or upgrade.' },
      { title: 'Pick a billing cycle', text: 'Choose monthly, quarterly or yearly to match your budget.' },
      { title: 'Confirm in a click', text: 'Renew or upgrade instantly — no paperwork, no waiting.' },
    ],
    faq: [
      { q: 'Can I switch billing cycles?', a: 'Yes — move between monthly, quarterly and yearly at renewal to suit your budget.' },
      { q: 'Will I be notified before expiry?', a: 'Your dashboard shows expiring packages so you can renew before they lapse.' },
      { q: 'Is there a long-term contract?', a: 'No lock-in — you can renew, upgrade or cancel cycle by cycle.' },
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
    stats: [
      { value: 'Unlimited', label: 'Client projects' },
      { value: '1', label: 'Portal for all' },
      { value: 'Client-facing', label: 'Reports' },
      { value: 'Full', label: 'Audit trail' },
    ],
    steps: [
      { title: 'Set up each client', text: 'Create a project per client with its own milestones, documents and team.' },
      { title: 'Deliver monthly reports', text: 'Upload client-facing reports they can preview, approve and download in-portal.' },
      { title: 'Manage approvals', text: 'Clients approve or request changes in a click, with a full history log.' },
      { title: 'Handle support in one place', text: 'Every client ticket stays in one thread — no more inbox archaeology.' },
    ],
    faq: [
      { q: 'Can I manage multiple clients?', a: 'Yes — each client gets its own project with dedicated milestones, documents and tickets.' },
      { q: 'Do clients see data from other clients?', a: 'No — every project is isolated so each client only sees their own work.' },
      { q: 'Can clients approve reports themselves?', a: 'Yes, clients approve or request changes in one click, with a full history trail.' },
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
    stats: [
      { value: '5', label: 'Audit axes' },
      { value: 'AI-ready', label: 'Scoring' },
      { value: 'Full-funnel', label: 'Coverage' },
      { value: 'Live', label: 'Rank tracking' },
    ],
    steps: [
      { title: 'Audit your site', text: 'Run a free audit to score SEO, performance, content and AI-readiness.' },
      { title: 'Target funnel stages', text: 'Optimise content for awareness, consideration and decision queries.' },
      { title: 'Fix technical blockers', text: 'Work through a prioritised list of technical issues with your team.' },
      { title: 'Track the climb', text: 'Watch keyword positions and scores trend up over time.' },
    ],
    faq: [
      { q: 'How does this help with AI search?', a: 'Our AI-readiness score shows how easily ChatGPT and Perplexity can cite your pages, with fixes to improve it.' },
      { q: 'Can I target different funnel stages?', a: 'Yes — we audit and optimise content across awareness, consideration and decision queries.' },
      { q: 'Do you handle technical SEO?', a: 'Yes — you get a prioritised list of technical issues that block rankings and crawlability.' },
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
    stats: [
      { value: 'Per-page', label: 'Audits' },
      { value: 'Speed', label: 'Prioritised' },
      { value: 'Category', label: 'Optimisation' },
      { value: 'Monthly', label: 'Reports' },
    ],
    steps: [
      { title: 'Audit product pages', text: 'Score every product page for SEO, performance and AI-readiness.' },
      { title: 'Optimise categories', text: 'Find and fix the content and technical gaps limiting category rankings.' },
      { title: 'Fix speed issues', text: 'Tackle prioritised performance problems that hurt conversion and ranking.' },
      { title: 'Review monthly', text: 'See SEO progress mapped to milestones in your monthly report.' },
    ],
    faq: [
      { q: 'Do you audit individual product pages?', a: 'Yes — every product page is scored for SEO, performance and AI-readiness.' },
      { q: 'How do you help category pages?', a: 'We identify the content and technical gaps that hold category pages back and prioritise fixes.' },
      { q: 'Is site speed included?', a: 'Yes — performance issues are flagged and prioritised, since speed affects both ranking and conversion.' },
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
    stats: [
      { value: 'GMB', label: 'Linked & optimised' },
      { value: 'Near me', label: 'Tracking' },
      { value: 'Map-pack', label: 'Focus' },
      { value: 'Day 1', label: 'Onboarding' },
    ],
    steps: [
      { title: 'Complete your profile', text: 'Our onboarding walkthrough guides you to add business details and link GMB.' },
      { title: 'Track local queries', text: 'Monitor "near me" and city-based keywords that drive foot traffic.' },
      { title: 'Optimise your GMB', text: 'Improve your Google Business Profile with prioritised fixes.' },
      { title: 'Climb the map pack', text: 'Watch local rankings compound as reviews and citations build.' },
    ],
    faq: [
      { q: 'Do you optimise my Google Business Profile?', a: 'Yes — you can link your GMB from the portal and we prioritise the fixes that move map rankings.' },
      { q: 'Can I track "near me" searches?', a: 'Yes — local and city-based keyword tracking is built in for foot-traffic queries.' },
      { q: 'Is there onboarding for new clients?', a: 'Yes — a walkthrough guides new clients to complete their profile and link GMB from day one.' },
    ],
  },
];

export const findItem = (category, slug) => {
  const list = category === 'platform' ? platformItems : solutionsItems;
  return list.find((i) => i.slug === slug);
};