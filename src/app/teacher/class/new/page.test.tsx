import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateClassPage from './page';
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

describe('CreateClassPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    useAuthStore.getState().logout();
    useClassStore.getState().reset();
    localStorage.clear();
    
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: pushMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects unauthenticated users', () => {
    render(<CreateClassPage />);
    expect(pushMock).toHaveBeenCalledWith('/teacher/login');
  });

  it('renders create class form for authenticated teacher', () => {
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

    render(<CreateClassPage />);
    
    expect(screen.getByText('Create New Class')).toBeInTheDocument();
    expect(screen.getByLabelText('Class Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Class/i })).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('creates a class and redirects to dashboard', async () => {
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

    render(<CreateClassPage />);
    
    const nameInput = screen.getByLabelText('Class Name');
    const submitButton = screen.getByRole('button', { name: /Create Class/i });

    fireEvent.change(nameInput, { target: { value: 'New Test Class' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/teacher/dashboard');
    });

    // Verify class was created
    const classes = useClassStore.getState().listClasses('teacher-1');
    expect(classes).toHaveLength(1);
    expect(classes[0].name).toBe('New Test Class');
  });

  it('has required attribute on class name input', () => {
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

    render(<CreateClassPage />);
    
    const nameInput = screen.getByLabelText('Class Name');
    expect(nameInput).toHaveAttribute('required');
  });
});

function act(callback: () => void | Promise<void>) {
  return require('@testing-library/react').act(callback);
}
