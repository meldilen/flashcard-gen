import './PolicyPage.css';

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-page">
      <div className="policy-card">
        <h1>Privacy Policy</h1>
        
        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly when you register, including:</p>
          <ul>
            <li>Email address</li>
            <li>Username</li>
            <li>Documents you upload for flashcard generation</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>Your data is used to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Generate personalized flashcards</li>
            <li>Communicate with you about your account</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Security</h2>
          <p>We implement security measures including:</p>
          <ul>
            <li>Encryption of sensitive data</li>
            <li>Secure server infrastructure</li>
            <li>Regular security audits</li>
          </ul>
        </section>

        <section>
          <h2>4. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of communications</li>
          </ul>
        </section>

        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}