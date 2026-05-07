import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import JoinClassPage from './page';
import { useClassStore } from '@/store/classStore';
import { useAuthStore } from '@/store/authStore';

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

// Mock qrcode.react
jest.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }: { value: string }) => <div data-testid="qr-code">{value}</div>,
}));

describe('JoinClassPage', () => {
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
    jest.useRealTimers();
  });

  it('renders join class form', () => {
    render(<JoinClassPage />);
    
    expect(screen.getByText('Join a Class')).toBeInTheDocument();
    expect(screen.getByLabelText('Enrollment Code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Join Class/i })).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('joins class with valid enrollment code', async () => {
    // Create a class first
    let createdClass: any;
    await act(async () => {
      createdClass = await useClassStore.getState().createClass({
        name: 'Test Class',
        teacherId: 'teacher-1',
      });
    });

    render(<JoinClassPage />);
    
    const codeInput = screen.getByLabelText('Enrollment Code');
    const submitButton = screen.getByRole('button', { name: /Join Class/i });

    fireEvent.change(codeInput, { target: { value: createdClass.enrollmentCode } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    // Verify student was enrolled
    const updatedClass = useClassStore.getState().getClass(createdClass.id);
    expect(updatedClass?.students.length).toBe(1);
  });

  it('shows error for invalid enrollment code', async () => {
    render(<JoinClassPage />);
    
    const codeInput = screen.getByLabelText('Enrollment Code');
    const submitButton = screen.getByRole('button', { name: /Join Class/i });

    fireEvent.change(codeInput, { target: { value: 'INVALID' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Invalid enrollment code')).toBeInTheDocument();
    });
  });

  it('shows error for duplicate enrollment', async () => {
    // Create a class and enroll a student
    let createdClass: any;
    await act(async () => {
      createdClass = await useClassStore.getState().createClass({
        name: 'Test Class',
        teacherId: 'teacher-1',
      });
      await useClassStore.getState().enrollStudent(createdClass.enrollmentCode, 'student-1');
    });

    // Set authenticated student
    act(() => {
      useAuthStore.setState({
        user: {
          id: 'student-1',
          displayName: 'Test Student',
          firstName: 'Test',
          role: 'student',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    render(<JoinClassPage />);
    
    const codeInput = screen.getByLabelText('Enrollment Code');
    const submitButton = screen.getByRole('button', { name: /Join Class/i });

    fireEvent.change(codeInput, { target: { value: createdClass.enrollmentCode } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Student already enrolled')).toBeInTheDocument();
    });
  });
});
