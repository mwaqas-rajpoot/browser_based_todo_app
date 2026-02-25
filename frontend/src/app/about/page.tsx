'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
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
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">About TodoApp</h1>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            TodoApp was created with a simple mission: to help people organize their tasks and boost productivity.
            We believe that everyone deserves access to powerful, intuitive task management tools that make life easier.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Our platform combines simplicity with powerful features, ensuring that whether you're managing personal tasks
            or coordinating team projects, you have everything you need at your fingertips.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Our Story</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Founded in 2026, TodoApp emerged from the need for a better way to manage daily tasks. Our team of developers
            and productivity enthusiasts came together to build a solution that addresses real-world challenges.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Today, TodoApp serves thousands of users worldwide, helping them stay organized, meet deadlines, and achieve
            their goals. We're constantly evolving based on user feedback and the latest technology trends.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Our Values</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-3">•</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Simplicity</h3>
                <p className="text-gray-700 dark:text-gray-300">We believe in keeping things simple and intuitive.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-3">•</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Privacy</h3>
                <p className="text-gray-700 dark:text-gray-300">Your data is yours. We prioritize security and privacy.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-3">•</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Innovation</h3>
                <p className="text-gray-700 dark:text-gray-300">We continuously improve and adapt to user needs.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-3">•</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Accessibility</h3>
                <p className="text-gray-700 dark:text-gray-300">Everyone should have access to great productivity tools.</p>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
