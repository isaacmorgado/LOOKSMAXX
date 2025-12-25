export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="prose prose-invert prose-neutral max-w-none space-y-6 text-neutral-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you use LOOKSMAXX, we collect the following types of information:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Account Information:</strong> Email address, username, and password (hashed)</li>
              <li><strong>Photos:</strong> Facial photos you upload for analysis</li>
              <li><strong>Analysis Data:</strong> Facial measurements and scores generated from your photos</li>
              <li><strong>Usage Data:</strong> How you interact with our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide facial analysis services</li>
              <li>Display your score on the leaderboard (using your chosen username)</li>
              <li>Improve our analysis algorithms</li>
              <li>Communicate with you about your account</li>
              <li>Process payments for premium features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Photo Storage & Processing</h2>
            <p>
              Your photos are processed to extract facial landmarks and generate analysis scores.
              We store photos securely and use them only for the purposes of providing our service.
              Photos may be displayed on the leaderboard alongside your score unless you opt out.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Leaderboard Visibility</h2>
            <p>
              By creating an account, you consent to having your analysis score and username
              displayed on our public leaderboard. Your face photo may also be visible to other
              users. You can manage your privacy settings in your account dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Sharing</h2>
            <p>We do not sell your personal data to third parties. We may share data with:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Service Providers:</strong> Companies that help us operate (e.g., hosting, payment processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Payment Information</h2>
            <p>
              Payment processing is handled by Stripe. We do not store your full credit card
              information. Stripe&apos;s privacy policy governs how they handle your payment data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure password hashing</li>
              <li>Access controls and authentication</li>
              <li>Regular security reviews</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. You may request
              deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Cookies</h2>
            <p>
              We use essential cookies to maintain your session and preferences. We do not use
              third-party tracking cookies for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of
              significant changes by email or through the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Contact</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact us at:
              support@looksmaxx.app
            </p>
          </section>

          <p className="text-neutral-500 text-sm mt-8">
            Last updated: December 2024
          </p>
        </div>
      </div>
    </div>
  );
}
