"""
Frontend Component Tests
Tests for React components using Jest and React Testing Library
"""

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HomePage from '@/app/page';
import LoginPage from '@/app/login/page';
import RegisterPage from '@/app/register/page';
import DashboardPage from '@/app/dashboard/page';
import ThemeToggle from '@/app/components/ThemeToggle';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock auth utilities
jest.mock('@/utils/auth', () => ({
  isAuthenticated: jest.fn(),
  getToken: jest.fn(),
  setToken: jest.fn(),
  removeToken: jest.fn(),
}));

describe('HomePage Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders home page with hero section', () => {
    render(<HomePage />);
    expect(screen.getByText(/Organize Your Life with/i)).toBeInTheDocument();
    expect(screen.getByText(/TodoApp/i)).toBeInTheDocument();
  });

  test('displays Get Started and Sign In buttons', () => {
    render(<HomePage />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('shows features section', () => {
    render(<HomePage />);
    expect(screen.getByText('Powerful Features')).toBeInTheDocument();
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('Filter & Sort')).toBeInTheDocument();
    expect(screen.getByText('Secure & Private')).toBeInTheDocument();
  });

  test('displays footer with social media links', () => {
    render(<HomePage />);
    const linkedInLink = screen.getByLabelText('LinkedIn');
    const facebookLink = screen.getByLabelText('Facebook');
    const githubLink = screen.getByLabelText('GitHub');
    const twitterLink = screen.getByLabelText('Twitter');

    expect(linkedInLink).toBeInTheDocument();
    expect(facebookLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
  });

  test('mobile menu toggles correctly', () => {
    render(<HomePage />);
    const menuButton = screen.getByRole('button', { name: /menu/i });

    fireEvent.click(menuButton);
    // Mobile menu should be visible
    expect(screen.getAllByText('Home').length).toBeGreaterThan(1);
  });
});

describe('LoginPage Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('validates empty form submission', async () => {
    render(<LoginPage />);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
  });

  test('handles successful login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test-token' }),
      })
    ) as jest.Mock;

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});

describe('RegisterPage Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('validates email format', async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  test('validates password strength', async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
    });
  });
});

describe('DashboardPage Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with task list', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, title: 'Test Task 1', status: 'pending' },
          { id: 2, title: 'Test Task 2', status: 'completed' },
        ]),
      })
    ) as jest.Mock;

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('allows creating new task', async () => {
    render(<DashboardPage />);

    const addButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(addButton);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  test('filters tasks by status', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, title: 'Pending Task', status: 'pending' },
        ]),
      })
    ) as jest.Mock;

    render(<DashboardPage />);

    const filterSelect = screen.getByLabelText(/filter by status/i);
    fireEvent.change(filterSelect, { target: { value: 'pending' } });

    await waitFor(() => {
      expect(screen.getByText('Pending Task')).toBeInTheDocument();
    });
  });
});

describe('ThemeToggle Component', () => {
  test('renders theme toggle button', () => {
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  test('toggles between light and dark mode', () => {
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole('button');

    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

describe('Animation Tests', () => {
  test('hero section has fade-in animation', () => {
    render(<HomePage />);
    const heroTitle = screen.getByText(/Organize Your Life with/i);
    expect(heroTitle).toHaveClass('animate-fadeIn');
  });

  test('feature cards have scale-in animation', () => {
    render(<HomePage />);
    const featureCards = screen.getAllByText(/Task Management|Filter & Sort|Secure & Private/i);
    featureCards.forEach(card => {
      expect(card.closest('div')).toHaveClass('animate-scaleIn');
    });
  });

  test('buttons have hover effects', () => {
    render(<HomePage />);
    const getStartedButton = screen.getByText('Get Started');
    expect(getStartedButton).toHaveClass('hover:scale-105');
  });
});
