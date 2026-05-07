import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeacherLoginPage from './page';
import { useAuthStore } from '@/store/authStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock next/link
jest.mock('next/link', () => {
  const Link = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  Link.displayName = 'Link';
  return Link;
});

describe('TeacherLoginPage', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    useAuthStore.getState().clearError();
  });

  it('renders login form', () => {
    render(<TeacherLoginPage />);
    
    expect(screen.getByText('Teacher Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('shows link to signup page', () => {
    render(<TeacherLoginPage />);
    
    const signupLink = screen.getByText('Sign up');
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.closest('a')).toHaveAttribute('href', '/teacher/signup');
  });

  it('handles form submission', async () => {
    render(<TeacherLoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'teacher@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  it('displays error message on login failure', async () => {
    render(<TeacherLoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
