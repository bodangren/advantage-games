import { create } from 'zustand';
import type { Teacher, Student, UserRole } from '@/types/teacher-dashboard';

export interface AuthState {
  user: Teacher | Student | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Teacher | Student | null;
  clearError: () => void;
}

const AUTH_STORAGE_KEY = 'teacher_dashboard_auth';

function loadStoredAuth(): { user: Teacher | Student | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { user: parsed.user || null, token: parsed.token || null };
    }
  } catch {
    // Invalid stored data
  }
  return { user: null, token: null };
}

function saveAuth(user: Teacher | Student | null, token: string | null): void {
  if (typeof window === 'undefined') return;
  if (user && token) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export const useAuthStore = create<AuthState>((set, get) => {
  const stored = loadStoredAuth();
  
  return {
    user: stored.user,
    token: stored.token,
    isAuthenticated: !!stored.user && !!stored.token,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        // Mock API call - will be replaced with real API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        if (password.length < 6) {
          throw new Error('Invalid credentials');
        }

        const mockToken = `mock-jwt-token-${Date.now()}`;
        const mockUser: Teacher = {
          id: `teacher-${Date.now()}`,
          email,
          displayName: email.split('@')[0],
          role: 'teacher',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        saveAuth(mockUser, mockToken);
        set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
      } catch (err) {
        set({ 
          error: err instanceof Error ? err.message : 'Login failed', 
          isLoading: false 
        });
      }
    },

    signup: async (email: string, password: string, displayName: string, role: UserRole) => {
      set({ isLoading: true, error: null });
      try {
        // Mock API call - will be replaced with real API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!email || !password || !displayName) {
          throw new Error('All fields are required');
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        if (!email.includes('@')) {
          throw new Error('Invalid email format');
        }

        const mockToken = `mock-jwt-token-${Date.now()}`;
        
        if (role === 'teacher') {
          const mockUser: Teacher = {
            id: `teacher-${Date.now()}`,
            email,
            displayName,
            role: 'teacher',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          saveAuth(mockUser, mockToken);
          set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
        } else {
          const mockUser: Student = {
            id: `student-${Date.now()}`,
            displayName,
            firstName: displayName,
            role: 'student',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          saveAuth(mockUser, mockToken);
          set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
        }
      } catch (err) {
        set({ 
          error: err instanceof Error ? err.message : 'Signup failed', 
          isLoading: false 
        });
      }
    },

    logout: () => {
      saveAuth(null, null);
      set({ user: null, token: null, isAuthenticated: false, error: null });
    },

    getCurrentUser: () => {
      return get().user;
    },

    clearError: () => {
      set({ error: null });
    },
  };
});
