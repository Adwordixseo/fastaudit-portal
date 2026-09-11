import React from 'react';
import LegalPage, { LegalSection } from '@/components/site/LegalPage';

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" subtitle="How Adwordix collects, uses, and protects your data." lastUpdated="September 11, 2026">
      <LegalSection title="1. Overview">
        <p>Adwordix ("we", "us", "our") operates the FastAudit Portal platform, which provides website SEO auditing, project management, subscription billing, and reporting services. This Privacy Policy explains what personal data we collect, how we use it, and the choices you have regarding your information.</p>
        <p>By creating an account or using our services, you consent to the practices described in this policy.</p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p><strong>Account data:</strong> Your name, email address, and password (stored as a secure hash) when you register.</p>
        <p><strong>Website data:</strong> URLs you submit for SEO audits, audit results, and generated reports.</p>
        <p><strong>Project data:</strong> Project names, descriptions, milestones, assigned team members, and communication within support tickets.</p>
        <p><strong>Payment data:</strong> Billing address and subscription details. Card numbers are processed by Stripe and never stored on our servers.</p>
        <p><strong>Usage data:</strong> IP address, browser type, and interaction logs used for security and service improvement.</p>
      </LegalSection>

      <LegalSection title="3. How We Use Your Data">
        <p>We use your information to: provide SEO audits and reports, manage your projects and subscriptions, process payments through Stripe, send service notifications and support replies, improve our features and performance, and detect fraud or abuse.</p>
      </LegalSection>

      <LegalSection title="4. Data Sharing">
        <p>We do not sell your personal data. We share data only with:</p>
        <p><strong>Stripe</strong> — for secure payment processing and subscription management.</p>
        <p><strong>Service providers</strong> — hosting and infrastructure partners who help us operate the platform.</p>
        <p><strong>Legal authorities</strong> — when required by law or to protect our rights and users.</p>
      </LegalSection>

      <LegalSection title="5. Data Security">
        <p>We use encryption in transit (TLS) and at rest, restrict internal access to authorized personnel only, and regularly audit our systems. While we follow industry best practices, no method of transmission or storage is 100% secure.</p>
      </LegalSection>

      <LegalSection title="6. Cookies">
        <p>We use essential cookies for authentication and session management, and analytics cookies to understand how the platform is used. You can disable non-essential cookies in your browser settings, though some features may not function properly.</p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>You have the right to: access the personal data we hold about you, request correction of inaccurate data, request deletion of your data (subject to legal obligations), export your data in a portable format, and withdraw consent for data processing at any time.</p>
        <p>To exercise any of these rights, contact us at <a href="mailto:info@adwordix.com" className="text-indigo-600 underline">info@adwordix.com</a>.</p>
      </LegalSection>

      <LegalSection title="8. Data Retention">
        <p>We retain your data for as long as your account is active or as needed to provide our services. After account closure, we delete personal data within 90 days, except where retention is required by law (e.g., financial records).</p>
      </LegalSection>

      <LegalSection title="9. Children's Privacy">
        <p>Our services are not directed to individuals under 16. We do not knowingly collect data from children. If you believe we have collected data from a minor, contact us and we will delete it promptly.</p>
      </LegalSection>

      <LegalSection title="10. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app alert. Continued use after changes take effect constitutes acceptance of the updated policy.</p>
      </LegalSection>

      <LegalSection title="11. Contact Us">
        <p>If you have questions about this Privacy Policy or your data, email <a href="mailto:info@adwordix.com" className="text-indigo-600 underline">info@adwordix.com</a>.</p>
      </LegalSection>
    </LegalPage>
  );
}