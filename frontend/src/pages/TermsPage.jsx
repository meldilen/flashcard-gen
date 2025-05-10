import './PolicyPage.css';

export default function TermsPage() {
  return (
    <div className="policy-page">
      <div className="policy-card">
        <h1>Terms of Service</h1>
        
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By using Flashcards Generator, you agree to these terms and our Privacy Policy.</p>
        </section>

        <section>
          <h2>2. Service Description</h2>
          <p>We provide an AI-powered tool to generate flashcards from your study materials.</p>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Upload copyrighted materials without permission</li>
            <li>Use the service for illegal purposes</li>
            <li>Attempt to disrupt the service</li>
          </ul>
        </section>

        <section>
          <h2>4. Limitation of Liability</h2>
          <p>Flashcards Generator is not responsible for:</p>
          <ul>
            <li>Accuracy of generated content</li>
            <li>Technical issues beyond our control</li>
            <li>Third-party services</li>
          </ul>
        </section>

        <section>
          <h2>5. Changes to Terms</h2>
          <p>We may update these terms periodically. Continued use constitutes acceptance.</p>
        </section>

        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}