import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">🪞 Financial Mirror AI</Link>
          <Link to="/" className="text-gray-700 hover:text-blue-600">Back to Home</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: April 2026</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Financial Mirror AI, you accept and agree to be bound by these Terms of Service. 
              If you do not agree, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Financial Mirror AI provides personal finance tracking, budgeting, goal setting, and financial insights. 
              We offer:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Transaction tracking and categorization</li>
              <li>Budget management and monitoring</li>
              <li>Savings goal tracking</li>
              <li>Financial reports and analytics</li>
              <li>CSV data import</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not use the service for illegal purposes</li>
              <li>Not attempt to gain unauthorized access to the system</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Financial Data Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              Financial Mirror AI is a tracking and analysis tool, not a financial advisor. 
              We do not provide financial advice, and our insights should not be considered 
              professional financial guidance. Always consult a qualified financial advisor 
              before making financial decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The service, including all content, features, and functionality, is owned by 
              Financial Mirror AI and is protected by intellectual property laws. You may not 
              reproduce, distribute, or create derivative works without our express consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend or terminate your access to the service at our 
              sole discretion, without notice, for conduct that we believe violates these Terms 
              or is harmful to other users or us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Financial Mirror AI shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use or inability to use 
              the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. We will notify users 
              of material changes via email or through the service. Continued use after 
              changes constitutes acceptance of new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700">
              For questions about these Terms, contact us at: 
              <a href="mailto:support@financialmirror.ai" className="text-blue-600 hover:underline"> support@financialmirror.ai</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
