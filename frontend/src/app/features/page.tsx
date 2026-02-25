'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FeaturesPage() {
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
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">Features</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Task Management</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Create, update, and organize your tasks with ease. Set due dates, priorities, and track status to stay on top of your work.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Smart Filtering</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Filter and sort tasks by status, priority, and due date. Focus on what matters most with our intelligent filtering system.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Dark Mode</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Switch between light and dark themes for comfortable viewing in any environment. Your preference is saved automatically.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Secure Authentication</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Your data is protected with secure JWT-based authentication. Admin controls ensure proper access management.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Responsive Design</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Access your tasks from any device. Our responsive design works seamlessly on desktop, tablet, and mobile.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Real-time Updates</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Changes are reflected instantly. Add, edit, or delete tasks and see updates in real-time across your dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
