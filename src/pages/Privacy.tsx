import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="prose prose-blue max-w-none">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us when you:</p>
          <ul>
            <li>Create an account</li>
            <li>Use our services</li>
            <li>Contact us for support</li>
            <li>Subscribe to our newsletters</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Communicate with you about products, services, and events</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>We do not share your personal information with third parties except:</p>
          <ul>
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
          </ul>

          <h2>Data Security</h2>
          <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.</p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
          </ul>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at support@bedtimey.com</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}