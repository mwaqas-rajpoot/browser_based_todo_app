'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function IntegrationsPage() {
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Integrations</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Connect TodoApp with your favorite tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-gray-100">Email</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Receive task notifications and reminders directly in your inbox. Stay updated on important deadlines.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-gray-100">Calendar</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Sync your tasks with Google Calendar, Outlook, and other calendar apps for better time management.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-gray-100">Slack</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Get task updates in your Slack channels. Create and manage tasks without leaving your workspace.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Push notifications to your mobile device. Never miss an important task or deadline again.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-gray-100">API Access</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Build custom integrations with our REST API. Connect TodoApp to your existing workflow tools.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-gray-100">Analytics</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Track your productivity with detailed analytics. Export data to your favorite reporting tools.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Need a custom integration?</p>
          <Link href="/contact" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
            Contact Us
          </Link>
        </div>
      </main>
    </div>
  );
}
