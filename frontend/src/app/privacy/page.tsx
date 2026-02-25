'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              TodoApp
            </Link>
            <button
              onClick={() => router.back()}
              className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: February 24, 2026</p>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">1. Information We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Account information (name, email address, password)</li>
              <li>Task data (titles, descriptions, due dates, priorities)</li>
              <li>Usage information (how you interact with our service)</li>
              <li>Device information (browser type, IP address, operating system)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">3. Information Sharing</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              We do not share your personal information with third parties except in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in our operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">4. Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We take reasonable measures to protect your information from unauthorized access, alteration, disclosure, or destruction. We use industry-standard encryption for data transmission and storage. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">5. Data Retention</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We retain your information for as long as your account is active or as needed to provide you services. You can request deletion of your account and data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">6. Your Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">7. Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">8. Children's Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">9. Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">10. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-indigo-600 dark:text-indigo-400 mt-2">
              privacy@todoapp.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
