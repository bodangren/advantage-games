import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import NewAssignmentClient from './NewAssignmentClient';
import { useAuthStore } from '@/store/authStore';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useClassStore } from '@/store/classStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the stores
jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/store/assignmentStore', () => ({
  useAssignmentStore: jest.fn(),
}));

jest.mock('@/store/classStore', () => ({
  useClassStore: jest.fn(),
}));

describe('NewAssignmentClient', () => {
  const mockPush = jest.fn();
  const mockCreateAssignment = jest.fn();
  const mockGetClass = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: 'teacher-1', displayName: 'Test Teacher' },
      isAuthenticated: true,
    });
    
    (useAssignmentStore as unknown as jest.Mock).mockReturnValue({
      createAssignment: mockCreateAssignment,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    });
    
    (useClassStore as unknown as jest.Mock).mockReturnValue({
      getClass: mockGetClass,
    });
  });

  it('renders the assignment creation form', async () => {
    mockGetClass.mockReturnValue({
      id: 'class-1',
      name: 'Test Class',
      teacherId: 'teacher-1',
    });

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create Assignment' })).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('for Test Class')).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Assignment Title/)).toBeInTheDocument();
    expect(screen.getByText(/Select Games/)).toBeInTheDocument();
    expect(screen.getByText(/Difficulty Tier/)).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    expect(mockPush).toHaveBeenCalledWith('/teacher/login');
  });

  it('redirects if class not found', async () => {
    mockGetClass.mockReturnValue(undefined);

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/teacher/dashboard');
    });
  });

  it('redirects if teacher does not own the class', async () => {
    mockGetClass.mockReturnValue({
      id: 'class-1',
      name: 'Test Class',
      teacherId: 'other-teacher',
    });

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/teacher/dashboard');
    });
  });

  it('allows selecting games', async () => {
    mockGetClass.mockReturnValue({
      id: 'class-1',
      name: 'Test Class',
      teacherId: 'teacher-1',
    });

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create Assignment' })).toBeInTheDocument();
    });

    const gameCheckbox = screen.getByLabelText('Castle Defense');
    fireEvent.click(gameCheckbox);
    
    expect(gameCheckbox).toBeChecked();
  });

  it('allows selecting difficulty tier', async () => {
    mockGetClass.mockReturnValue({
      id: 'class-1',
      name: 'Test Class',
      teacherId: 'teacher-1',
    });

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create Assignment' })).toBeInTheDocument();
    });

    const hardRadio = screen.getByRole('radio', { name: /Hard/ });
    fireEvent.click(hardRadio);
    
    expect(hardRadio).toBeChecked();
  });

  it('submits form with correct data', async () => {
    mockGetClass.mockReturnValue({
      id: 'class-1',
      name: 'Test Class',
      teacherId: 'teacher-1',
    });

    mockCreateAssignment.mockResolvedValue({
      id: 'assignment-1',
      title: 'Test Assignment',
    });

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create Assignment' })).toBeInTheDocument();
    });

    // Fill in title
    fireEvent.change(screen.getByLabelText(/Assignment Title/), {
      target: { value: 'Test Assignment' },
    });

    // Select a game
    const gameCheckbox = screen.getByLabelText('Castle Defense');
    fireEvent.click(gameCheckbox);

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Create Assignment/ }));

    await waitFor(() => {
      expect(mockCreateAssignment).toHaveBeenCalledWith({
        title: 'Test Assignment',
        classId: 'class-1',
        gameIds: ['castle-defense'],
        packIds: [],
        difficultyTier: 'medium',
        dueDate: undefined,
        maxAttempts: 1,
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/teacher/class/class-1');
  });

  it('disables submit when no games selected', async () => {
    mockGetClass.mockReturnValue({
      id: 'class-1',
      name: 'Test Class',
      teacherId: 'teacher-1',
    });

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create Assignment' })).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /Create Assignment/ });
    expect(submitButton).toBeDisabled();
  });

  it('shows loading state', async () => {
    mockGetClass.mockReturnValue({
      id: 'class-1',
      name: 'Test Class',
      teacherId: 'teacher-1',
    });

    (useAssignmentStore as unknown as jest.Mock).mockReturnValue({
      createAssignment: mockCreateAssignment,
      isLoading: true,
      error: null,
      clearError: mockClearError,
    });

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    await waitFor(() => {
      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });
  });

  it('displays error message', async () => {
    mockGetClass.mockReturnValue({
      id: 'class-1',
      name: 'Test Class',
      teacherId: 'teacher-1',
    });

    (useAssignmentStore as unknown as jest.Mock).mockReturnValue({
      createAssignment: mockCreateAssignment,
      isLoading: false,
      error: 'Failed to create assignment',
      clearError: mockClearError,
    });

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to create assignment');
    });
  });

  it('filters games by search', async () => {
    mockGetClass.mockReturnValue({
      id: 'class-1',
      name: 'Test Class',
      teacherId: 'teacher-1',
    });

    render(
      <NewAssignmentClient params={Promise.resolve({ id: 'class-1' })} />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create Assignment' })).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search games...');
    fireEvent.change(searchInput, { target: { value: 'dragon' } });

    expect(screen.getByLabelText('Dragon Flight')).toBeInTheDocument();
    expect(screen.getByLabelText('Dragon Rider')).toBeInTheDocument();
    expect(screen.queryByLabelText('Castle Defense')).not.toBeInTheDocument();
  });
});
