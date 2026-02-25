'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HelpCenterPage() {
  const router = useRouter();

  const faqs = [
    {
      id: 1,
      question: 'How do I create a new task?',
      answer: 'After logging in, go to your dashboard and click the "Add Task" button. Fill in the task details including title, description, due date, and priority, then click "Create Task".'
    },
    {
      id: 2,
      question: 'Can I edit or delete tasks?',
      answer: 'Yes! Click on any task to view its details. You\'ll see "Edit" and "Delete" buttons. You can update any field or remove the task completely.'
    },
    {
      id: 3,
      question: 'How do I filter my tasks?',
      answer: 'Use the filter options at the top of your dashboard. You can filter by status (pending, in progress, completed), priority (low, medium, high), and sort by due date or creation date.'
    },
    {
      id: 4,
      question: 'Is my data secure?',
      answer: 'Absolutely! We use industry-standard JWT authentication and encrypt all data in transit. Your tasks are private and only accessible to you.'
    },
    {
      id: 5,
      question: 'Can I use TodoApp on mobile?',
      answer: 'Yes! TodoApp is fully responsive and works great on all devices including smartphones and tablets. Just access it through your mobile browser.'
    },
    {
      id: 6,
      question: 'How do I enable dark mode?',
      answer: 'Click the theme toggle icon (sun/moon) in the header. Your preference will be saved automatically for future visits.'
    },
    {
      id: 7,
      question: 'What happens if I forget my password?',
      answer: 'Click "Forgot Password" on the login page. Enter your email address and we\'ll send you instructions to reset your password.'
    },
    {
      id: 8,
      question: 'Can I share tasks with others?',
      answer: 'Team collaboration features are available in our Pro and Enterprise plans. Upgrade your account to share tasks and collaborate with your team.'
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Find answers to common questions</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{faq.question}</h3>
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Still need help?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Contact Support
          </Link>
        </div>
      </main>
    </div>
  );
}
