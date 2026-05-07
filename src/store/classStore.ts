import { create } from 'zustand';
import type { Class, ClassStatus } from '@/types/teacher-dashboard';

export interface ClassState {
  classes: Class[];
  isLoading: boolean;
  error: string | null;
  createClass: (data: { name: string; teacherId: string }) => Promise<Class>;
  getClass: (id: string) => Class | undefined;
  listClasses: (teacherId: string) => Class[];
  updateClass: (id: string, data: Partial<Pick<Class, 'name'>>) => Promise<Class | undefined>;
  archiveClass: (id: string) => Promise<Class | undefined>;
  enrollStudent: (enrollmentCode: string, studentId: string) => Promise<Class | undefined>;
  reset: () => void;
  clearError: () => void;
}

const CLASS_STORAGE_KEY = 'teacher_dashboard_classes';

function loadStoredClasses(): Class[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CLASS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return (parsed.classes || []).map((c: Class) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        archivedAt: c.archivedAt ? new Date(c.archivedAt) : undefined,
      }));
    }
  } catch {
    // Invalid stored data
  }
  return [];
}

function saveClasses(classes: Class[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify({ classes }));
}

function generateEnrollmentCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateUniqueEnrollmentCode(existingClasses: Class[]): string {
  let code: string;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    code = generateEnrollmentCode();
    attempts++;
  } while (existingClasses.some(c => c.enrollmentCode === code) && attempts < maxAttempts);
  
  if (attempts >= maxAttempts) {
    throw new Error('Unable to generate unique enrollment code');
  }
  
  return code;
}

export const useClassStore = create<ClassState>((set, get) => {
  const storedClasses = loadStoredClasses();
  
  return {
    classes: storedClasses,
    isLoading: false,
    error: null,

    createClass: async ({ name, teacherId }: { name: string; teacherId: string }) => {
      set({ isLoading: true, error: null });
      
      try {
        if (!name || name.trim().length === 0) {
          throw new Error('Class name is required');
        }
        
        if (!teacherId || teacherId.trim().length === 0) {
          throw new Error('Teacher ID is required');
        }

        const trimmedName = name.trim();
        const state = get();
        const enrollmentCode = generateUniqueEnrollmentCode(state.classes);
        
        const newClass: Class = {
          id: `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: trimmedName,
          teacherId,
          enrollmentCode,
          students: [],
          status: 'active' as ClassStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const updatedClasses = [...state.classes, newClass];
        saveClasses(updatedClasses);
        set({ classes: updatedClasses, isLoading: false });
        
        return newClass;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create class';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    getClass: (id: string) => {
      return get().classes.find(c => c.id === id);
    },

    listClasses: (teacherId: string) => {
      return get().classes.filter(
        c => c.teacherId === teacherId && c.status === 'active'
      );
    },

    updateClass: async (id: string, data: Partial<Pick<Class, 'name'>>) => {
      set({ isLoading: true, error: null });
      
      try {
        const state = get();
        const classIndex = state.classes.findIndex(c => c.id === id);
        
        if (classIndex === -1) {
          set({ isLoading: false });
          return undefined;
        }

        const existingClass = state.classes[classIndex];
        
        if (existingClass.status === 'archived') {
          throw new Error('Cannot update archived class');
        }

        const updatedClass: Class = {
          ...existingClass,
          ...data,
          updatedAt: new Date(),
        };

        const updatedClasses = [...state.classes];
        updatedClasses[classIndex] = updatedClass;
        
        saveClasses(updatedClasses);
        set({ classes: updatedClasses, isLoading: false });
        
        return updatedClass;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update class';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    enrollStudent: async (enrollmentCode: string, studentId: string) => {
      set({ isLoading: true, error: null });
      
      try {
        if (!enrollmentCode || !studentId) {
          throw new Error('Enrollment code and student ID are required');
        }

        const state = get();
        const classIndex = state.classes.findIndex(
          c => c.enrollmentCode === enrollmentCode.toUpperCase()
        );
        
        if (classIndex === -1) {
          throw new Error('Invalid enrollment code');
        }

        const existingClass = state.classes[classIndex];
        
        if (existingClass.status !== 'active') {
          throw new Error('Class is not active');
        }

        if (existingClass.students.includes(studentId)) {
          throw new Error('Student already enrolled');
        }

        const updatedClass: Class = {
          ...existingClass,
          students: [...existingClass.students, studentId],
          updatedAt: new Date(),
        };

        const updatedClasses = [...state.classes];
        updatedClasses[classIndex] = updatedClass;
        
        saveClasses(updatedClasses);
        set({ classes: updatedClasses, isLoading: false });
        
        return updatedClass;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to enroll student';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    archiveClass: async (id: string) => {
      set({ isLoading: true, error: null });
      
      try {
        const state = get();
        const classIndex = state.classes.findIndex(c => c.id === id);
        
        if (classIndex === -1) {
          set({ isLoading: false });
          return undefined;
        }

        const existingClass = state.classes[classIndex];
        
        const archivedClass: Class = {
          ...existingClass,
          status: 'archived' as ClassStatus,
          archivedAt: new Date(),
          updatedAt: new Date(),
        };

        const updatedClasses = [...state.classes];
        updatedClasses[classIndex] = archivedClass;
        
        saveClasses(updatedClasses);
        set({ classes: updatedClasses, isLoading: false });
        
        return archivedClass;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to archive class';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    reset: () => {
      const stored = loadStoredClasses();
      set({ classes: stored, isLoading: false, error: null });
    },

    clearError: () => {
      set({ error: null });
    },
  };
});
