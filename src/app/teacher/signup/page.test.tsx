import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeacherSignupPage from './page';
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

describe('TeacherSignupPage', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    useAuthStore.getState().clearError();
  });

  it('renders signup form', () => {
    render(<TeacherSignupPage />);
    
    expect(screen.getByText('Teacher Sign Up')).toBeInTheDocument();
    expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('shows link to login page', () => {
    render(<TeacherSignupPage />);
    
    const loginLink = screen.getByText('Sign in');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/teacher/login');
  });

  it('handles form submission', async () => {
    render(<TeacherSignupPage />);
    
    fireEvent.change(screen.getByLabelText('Display Name'), { target: { value: 'Test Teacher' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  it('displays error message on signup failure', async () => {
    render(<TeacherSignupPage />);
    
    fireEvent.change(screen.getByLabelText('Display Name'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '' } });
    
    // Manually trigger the form submit to bypass HTML validation
    const form = screen.getByRole('button', { name: /Sign Up/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
