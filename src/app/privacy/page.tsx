export default function PrivacyPage() {
  return (
    <div>
      <section className="section bg-blue-50">
        <div className="container max-w-3xl">
          <h1 className="heading-md mb-4">Privacy Policy</h1>
          <p className="text-muted">Last updated: October 2, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl">
          <div className="space-y-8">
            <div>
              <h2 className="heading-sm mb-3">1. Information We Collect</h2>
              <p className="text-muted">
                We collect information you voluntarily provide through our contact form, including name, email,
                phone number, company, and message content.
              </p>
            </div>

            <div>
              <h2 className="heading-sm mb-3">2. How We Use Your Information</h2>
              <p className="text-muted">
                We use the information you provide to respond to your inquiries, provide services, and improve
                our website experience.
              </p>
            </div>

            <div>
              <h2 className="heading-sm mb-3">3. Data Security</h2>
              <p className="text-muted">
                We implement appropriate technical and organizational measures to protect your personal data
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h2 className="heading-sm mb-3">4. GDPR Compliance</h2>
              <p className="text-muted">
                If you are located in the EU, you have the right to request access to, correction of, or
                deletion of your personal data.
              </p>
            </div>

            <div>
              <h2 className="heading-sm mb-3">5. Contact Us</h2>
              <p className="text-muted">
                If you have questions about our privacy practices, please contact us at hello@pt-rizki-ai.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
