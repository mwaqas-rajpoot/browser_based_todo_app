'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CareersPage() {
  const router = useRouter();

  const openPositions = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our engineering team to build the next generation of productivity tools.'
    },
    {
      id: 2,
      title: 'Product Designer',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help us create beautiful, intuitive user experiences that delight our users.'
    },
    {
      id: 3,
      title: 'Customer Success Manager',
      location: 'Remote',
      type: 'Full-time',
      description: 'Be the voice of our customers and help them succeed with TodoApp.'
    },
    {
      id: 4,
      title: 'Marketing Specialist',
      location: 'Remote',
      type: 'Part-time',
      description: 'Drive growth and help more people discover the power of TodoApp.'
    }
  ];

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
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Help us build the future of productivity</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Why Work at TodoApp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🌍 Remote First</h3>
              <p className="text-gray-700 dark:text-gray-300">Work from anywhere in the world with flexible hours.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">💰 Competitive Pay</h3>
              <p className="text-gray-700 dark:text-gray-300">Fair compensation and equity options for all team members.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🚀 Growth Opportunities</h3>
              <p className="text-gray-700 dark:text-gray-300">Learn new skills and advance your career with us.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🏥 Health Benefits</h3>
              <p className="text-gray-700 dark:text-gray-300">Comprehensive health, dental, and vision coverage.</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position) => (
              <div key={position.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{position.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{position.description}</p>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>📍 {position.location}</span>
                      <span>⏰ {position.type}</span>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-center"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Don't see a perfect fit?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We're always looking for talented people. Send us your resume and tell us how you can contribute.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Get in Touch
          </Link>
        </div>
      </main>
    </div>
  );
}
