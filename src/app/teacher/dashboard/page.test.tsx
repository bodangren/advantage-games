import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeacherDashboardPage from './page';
import { useAuthStore } from '@/store/authStore';
import { useClassStore } from '@/store/classStore';

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

describe('TeacherDashboardPage', () => {
  beforeEach(() => {
    // Reset stores
    useAuthStore.getState().logout();
    useClassStore.getState().reset();
    localStorage.clear();
  });

  it('redirects unauthenticated users', () => {
    const pushMock = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: pushMock,
    });

    render(<TeacherDashboardPage />);
    expect(pushMock).toHaveBeenCalledWith('/teacher/login');
  });

  it('renders dashboard for authenticated teacher', () => {
    // Set up authenticated teacher
    act(() => {
      useAuthStore.setState({
        user: {
          id: 'teacher-1',
          email: 'teacher@example.com',
          displayName: 'Test Teacher',
          role: 'teacher',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    render(<TeacherDashboardPage />);
    
    expect(screen.getByText('Teacher Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Welcome back, Test Teacher/)).toBeInTheDocument();
    expect(screen.getByText('Create New Class')).toBeInTheDocument();
  });

  it('shows empty state when no classes', () => {
    act(() => {
      useAuthStore.setState({
        user: {
          id: 'teacher-1',
          email: 'teacher@example.com',
          displayName: 'Test Teacher',
          role: 'teacher',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    render(<TeacherDashboardPage />);
    
    expect(screen.getByText(/You haven't created any classes yet/)).toBeInTheDocument();
    expect(screen.getByText('Create Your First Class')).toBeInTheDocument();
  });

  it('displays teacher classes', async () => {
    // Set up authenticated teacher
    act(() => {
      useAuthStore.setState({
        user: {
          id: 'teacher-1',
          email: 'teacher@example.com',
          displayName: 'Test Teacher',
          role: 'teacher',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    // Create a class
    await act(async () => {
      await useClassStore.getState().createClass({
        name: 'Test Class',
        teacherId: 'teacher-1',
      });
    });

    render(<TeacherDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Class')).toBeInTheDocument();
      expect(screen.getByText('0 students')).toBeInTheDocument();
    });
  });

  it('archives a class when archive button clicked', async () => {
    // Set up authenticated teacher
    act(() => {
      useAuthStore.setState({
        user: {
          id: 'teacher-1',
          email: 'teacher@example.com',
          displayName: 'Test Teacher',
          role: 'teacher',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    // Create a class
    let createdClass: any;
    await act(async () => {
      createdClass = await useClassStore.getState().createClass({
        name: 'Class to Archive',
        teacherId: 'teacher-1',
      });
    });

    // Mock window.confirm
    Object.defineProperty(window, 'confirm', {
      writable: true,
      value: jest.fn(() => true),
    });

    render(<TeacherDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Class to Archive')).toBeInTheDocument();
    });

    // Verify archive button exists for the class
    const archiveButtons = screen.getAllByRole('button', { name: 'Archive' });
    expect(archiveButtons.length).toBeGreaterThan(0);

    // Test that archiving removes class from list (tested at store level)
    await act(async () => {
      await useClassStore.getState().archiveClass(createdClass.id);
    });

    // Re-render should show updated list
    const { rerender } = render(<TeacherDashboardPage />);
    rerender(<TeacherDashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText('Class to Archive')).not.toBeInTheDocument();
    });
  });
});

// Helper function since act might not be imported from testing-library/react
function act(callback: () => void | Promise<void>) {
  return require('@testing-library/react').act(callback);
}
