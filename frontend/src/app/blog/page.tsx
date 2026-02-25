'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
  const router = useRouter();

  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for Better Task Management',
      date: '2026-02-20',
      excerpt: 'Learn how to organize your tasks effectively and boost your productivity with these proven strategies.',
      category: 'Productivity'
    },
    {
      id: 2,
      title: 'How to Use TodoApp for Team Collaboration',
      date: '2026-02-15',
      excerpt: 'Discover how teams can leverage TodoApp to coordinate projects and stay aligned on goals.',
      category: 'Teams'
    },
    {
      id: 3,
      title: 'The Science Behind Productivity',
      date: '2026-02-10',
      excerpt: 'Understanding the psychology of task completion and how to build better habits.',
      category: 'Research'
    },
    {
      id: 4,
      title: 'New Features: Dark Mode and Filters',
      date: '2026-02-05',
      excerpt: 'We\'ve added exciting new features to make your TodoApp experience even better.',
      category: 'Updates'
    },
    {
      id: 5,
      title: 'Getting Started with TodoApp',
      date: '2026-02-01',
      excerpt: 'A beginner\'s guide to setting up your account and creating your first tasks.',
      category: 'Tutorial'
    },
    {
      id: 6,
      title: 'Time Management Techniques That Work',
      date: '2026-01-25',
      excerpt: 'Explore popular time management methods like Pomodoro, Time Blocking, and GTD.',
      category: 'Productivity'
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
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Tips, updates, and insights on productivity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">{post.category}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{post.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
