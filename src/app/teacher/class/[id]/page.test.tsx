import { render, screen, waitFor, act } from '@testing-library/react';
import ClassDetailPage from './page';
import { useAuthStore } from '@/store/authStore';
import { useClassStore } from '@/store/classStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  const Link = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  Link.displayName = 'Link';
  return Link;
});

describe('ClassDetailPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    useAuthStore.getState().logout();
    useClassStore.getState().reset();
    localStorage.clear();
    
    const { useRouter } = jest.requireMock('next/navigation');
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects unauthenticated users', () => {
    render(<ClassDetailPage params={Promise.resolve({ id: 'class-1' })} />);
    expect(pushMock).toHaveBeenCalledWith('/teacher/login');
  });

  it('redirects if class not found', async () => {
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

    render(<ClassDetailPage params={Promise.resolve({ id: 'non-existent' })} />);
    
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/teacher/dashboard');
    });
  });

  it('renders class details for teacher owner', async () => {
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
        name: 'Test Class Detail',
        teacherId: 'teacher-1',
      });
    });

    render(<ClassDetailPage params={Promise.resolve({ id: createdClass.id })} />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Class Detail' })).toBeInTheDocument();
    });
    
    expect(screen.getAllByText('Class Info').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Students').length).toBeGreaterThan(0);
    expect(screen.getByText('0')).toBeInTheDocument(); // Student count
    expect(screen.getByText(/No students enrolled yet/)).toBeInTheDocument();
  });

  it('redirects if teacher does not own the class', async () => {
    act(() => {
      useAuthStore.setState({
        user: {
          id: 'teacher-2',
          email: 'teacher2@example.com',
          displayName: 'Other Teacher',
          role: 'teacher',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    // Create a class for teacher-1
    let createdClass: any;
    await act(async () => {
      createdClass = await useClassStore.getState().createClass({
        name: 'Not My Class',
        teacherId: 'teacher-1',
      });
    });

    render(<ClassDetailPage params={Promise.resolve({ id: createdClass.id })} />);
    
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/teacher/dashboard');
    });
  });
});
