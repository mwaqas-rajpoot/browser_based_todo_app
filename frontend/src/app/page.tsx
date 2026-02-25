'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, removeToken } from '../utils/auth';
import ThemeToggle from './components/ThemeToggle';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogout = () => {
    removeToken();
    setAuthenticated(false);
    router.push('/');
  };

  if (!mounted) return null;

  // Unauthenticated user sees the full home page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">TodoApp</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              <div className="flex items-baseline space-x-4">
                <Link href="/" className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                {!authenticated ? (
                  <>
                    <Link href="/login" className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                      Login
                    </Link>
                    <Link href="/register" className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                      Register
                    </Link>
                    <Link href="/admin" className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                      Admin
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link href="/admin" className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                      Admin
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
              <ThemeToggle />
            </nav>
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/"
                className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {!authenticated ? (
                <>
                  <Link
                    href="/login"
                    className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link
                    href="/admin"
                    className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin"
                    className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl animate-fadeIn">
              <span className="block">Organize Your Life with</span>
              <span className="block text-indigo-600 dark:text-indigo-400 mt-2">TodoApp</span>
            </h1>
            <p className="mt-4 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-6 md:text-xl md:max-w-3xl animate-fadeIn animation-delay-200">
              A modern, intuitive task management application designed to help you stay organized and boost productivity.
              Manage your tasks efficiently and achieve your goals.
            </p>
            <div className="mt-10 flex justify-center gap-4 animate-fadeIn animation-delay-400">
              <Link
                href="/register"
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-200 hover:bg-indigo-300 md:py-4 md:text-lg md:px-10 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl animate-fadeIn">
                Powerful Features
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 animate-fadeIn animation-delay-200">
                Everything you need to manage your tasks effectively
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover-lift animate-scaleIn">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white animate-bounce-slow">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Task Management</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Create, update, and organize your tasks with due dates, priorities, and status tracking.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover-lift animate-scaleIn animation-delay-200">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white animate-bounce-slow">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Filter & Sort</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Easily filter and sort your tasks by status, priority, and due date to focus on what matters most.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover-lift animate-scaleIn animation-delay-400">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white animate-bounce-slow">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Secure & Private</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Your data is protected with secure authentication and privacy-focused practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">TodoApp</h3>
              <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
                The best way to organize your tasks and boost productivity.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/features" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Features</Link></li>
                <li><Link href="/pricing" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Pricing</Link></li>
                <li><Link href="/integrations" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/about" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">About</Link></li>
                <li><Link href="/blog" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Blog</Link></li>
                <li><Link href="/careers" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/help" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Help Center</Link></li>
                <li><Link href="/contact" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {/* Social Media Links */}
              <a href="https://www.linkedin.com/in/muhammad-waqas-8a486a267?" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors duration-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/share/1GNrHkrDx3/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] dark:hover:text-[#1877F2] transition-colors duration-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://github.com/mwaqas-rajpoot" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#181717] dark:hover:text-white transition-colors duration-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
              <a href="https://twitter.com/muhammad%20waqas" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1DA1F2] dark:hover:text-[#1DA1F2] transition-colors duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2026 TodoApp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}