import React from 'react';
import LegalPage, { LegalSection } from '@/components/site/LegalPage';

export default function TermsOfService() {
  return (
    <LegalPage title="Terms & Conditions" subtitle="The terms governing your use of Adwordix." lastUpdated="September 11, 2026">
      <LegalSection title="1. Acceptance of Terms">
        <p>By accessing or using the Adwordix FastAudit Portal ("the Service"), you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, you may not use the Service.</p>
      </LegalSection>

      <LegalSection title="2. Description of Service">
        <p>Adwordix provides an SEO management platform that includes website auditing, project tracking, subscription-based growth packages, milestone management, document sharing, and support ticketing. We reserve the right to modify, suspend, or discontinue any feature at any time.</p>
      </LegalSection>

      <LegalSection title="3. Account Registration">
        <p>You must provide accurate and complete information when registering. You are responsible for safeguarding your password and for all activity under your account. You agree to notify us immediately of any unauthorized use.</p>
        <p>You must be at least 16 years old to create an account. One person or entity may not maintain multiple free accounts.</p>
      </LegalSection>

      <LegalSection title="4. Subscriptions and Billing">
        <p>Paid subscriptions are billed monthly, quarterly, or yearly depending on the package you select. All payments are processed by Stripe.</p>
        <p><strong>Auto-renewal:</strong> Subscriptions renew automatically at the end of each billing cycle unless cancelled before the renewal date.</p>
        <p><strong>Refunds:</strong> Fees are non-refundable except where required by law. You may cancel at any time; cancellation takes effect at the end of the current billing period.</p>
        <p><strong>Price changes:</strong> We may change pricing with at least 30 days' notice. Existing subscribers keep the current rate until the next renewal.</p>
      </LegalSection>

      <LegalSection title="5. Acceptable Use">
        <p>You agree not to: use the Service for any unlawful purpose, submit URLs or content you do not own or have permission to audit, attempt to access another user's data, reverse-engineer or disrupt the platform, use automated tools to scrape or overload our systems, or transmit malware or harmful code.</p>
        <p>Violation of these rules may result in account suspension or termination without refund.</p>
      </LegalSection>

      <LegalSection title="6. Intellectual Property">
        <p>All platform software, design, audit methodology, and content are the property of Adwordix. You retain ownership of the website data you submit and the reports generated from it. You grant us a limited license to process your data solely to provide the Service.</p>
      </LegalSection>

      <LegalSection title="7. User Content">
        <p>You are solely responsible for any content you submit (website URLs, project descriptions, support messages). You represent that you have the rights to submit such content and that it does not violate any law or third-party rights.</p>
      </LegalSection>

      <LegalSection title="8. Disclaimers">
        <p>The Service is provided "as is" without warranties of any kind. We do not guarantee that audit results will improve search rankings or business outcomes. SEO results depend on many factors outside our control, including search engine algorithms and your implementation of recommendations.</p>
      </LegalSection>

      <LegalSection title="9. Limitation of Liability">
        <p>To the maximum extent permitted by law, Adwordix shall not be liable for any indirect, incidental, or consequential damages, including loss of profits, data, or business opportunities. Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
      </LegalSection>

      <LegalSection title="10. Indemnification">
        <p>You agree to indemnify and hold Adwordix harmless from any claims, damages, or expenses arising from your use of the Service, your violation of these Terms, or your infringement of any third-party rights.</p>
      </LegalSection>

      <LegalSection title="11. Termination">
        <p>You may close your account at any time. We may suspend or terminate your account for violations of these Terms, fraudulent activity, or non-payment. Upon termination, your right to use the Service ends immediately.</p>
      </LegalSection>

      <LegalSection title="12. Governing Law">
        <p>These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of competent jurisdiction in India.</p>
      </LegalSection>

      <LegalSection title="13. Changes to Terms">
        <p>We may update these Terms periodically. We will notify you of material changes via email or an in-app alert. Continued use after changes take effect constitutes acceptance of the updated Terms.</p>
      </LegalSection>

      <LegalSection title="14. Contact Us">
        <p>For questions about these Terms, email <a href="mailto:info@adwordix.com" className="text-indigo-600 underline">info@adwordix.com</a>.</p>
      </LegalSection>
    </LegalPage>
  );
}