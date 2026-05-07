import { useAuthStore } from '../authStore';
import { act } from '@testing-library/react';

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useAuthStore.getState();
    store.logout();
    store.clearError();
  });

  describe('initial state', () => {
    it('should have initial unauthenticated state', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('login', () => {
    it('should login a teacher successfully', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.login('teacher@example.com', 'password123');
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).not.toBeNull();
      expect(state.user?.role).toBe('teacher');
      expect(state.error).toBeNull();
    });

    it('should fail with empty credentials', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.login('', '');
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Email and password are required');
    });

    it('should fail with short password', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.login('teacher@example.com', '123');
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Invalid credentials');
    });

    it('should set loading state during login', async () => {
      const store = useAuthStore.getState();
      
      const promise = act(async () => {
        await store.login('teacher@example.com', 'password123');
      });

      expect(useAuthStore.getState().isLoading).toBe(true);
      await promise;
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('signup', () => {
    it('should signup a teacher successfully', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.signup('newteacher@example.com', 'password123', 'New Teacher', 'teacher');
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.role).toBe('teacher');
      expect(state.user?.displayName).toBe('New Teacher');
    });

    it('should signup a student successfully', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.signup('student@example.com', 'password123', 'Student Name', 'student');
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.role).toBe('student');
    });

    it('should fail with missing fields', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.signup('', 'password123', 'Name', 'teacher');
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('All fields are required');
    });

    it('should fail with short password', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.signup('teacher@example.com', '123', 'Name', 'teacher');
      });

      const state = useAuthStore.getState();
      expect(state.error).toBe('Password must be at least 6 characters');
    });

    it('should fail with invalid email', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.signup('invalid-email', 'password123', 'Name', 'teacher');
      });

      const state = useAuthStore.getState();
      expect(state.error).toBe('Invalid email format');
    });
  });

  describe('logout', () => {
    it('should clear auth state on logout', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.login('teacher@example.com', 'password123');
      });

      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      act(() => {
        store.logout();
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.login('teacher@example.com', 'password123');
      });

      const user = store.getCurrentUser();
      expect(user).not.toBeNull();
      expect(user?.email).toBe('teacher@example.com');
    });

    it('should return null when not authenticated', () => {
      const store = useAuthStore.getState();
      const user = store.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      const store = useAuthStore.getState();
      
      await act(async () => {
        await store.login('', '');
      });

      expect(useAuthStore.getState().error).not.toBeNull();

      act(() => {
        store.clearError();
      });

      expect(useAuthStore.getState().error).toBeNull();
    });
  });
});
