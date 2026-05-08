import { create } from 'zustand';
import type { Assignment, AssignmentStatus } from '@/types/teacher-dashboard';

export interface AssignmentState {
  assignments: Assignment[];
  isLoading: boolean;
  error: string | null;
  createAssignment: (data: {
    title: string;
    classId: string;
    gameIds: string[];
    packIds: string[];
    difficultyTier: string;
    dueDate?: Date;
    maxAttempts: number;
  }) => Promise<Assignment>;
  getAssignment: (id: string) => Assignment | undefined;
  listByClass: (classId: string) => Assignment[];
  listByStudent: (studentId: string) => Assignment[];
  updateAssignment: (id: string, data: Partial<Pick<Assignment, 'title' | 'gameIds' | 'packIds' | 'difficultyTier' | 'dueDate' | 'maxAttempts' | 'status'>>) => Promise<Assignment | undefined>;
  deleteAssignment: (id: string) => Promise<boolean>;
  duplicateAssignment: (id: string, targetClassIds: string[]) => Promise<Assignment[]>;
  reset: () => void;
  clearError: () => void;
}

const ASSIGNMENT_STORAGE_KEY = 'teacher_dashboard_assignments';

function loadStoredAssignments(): Assignment[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ASSIGNMENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return (parsed.assignments || []).map((a: Assignment) => ({
        ...a,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
        dueDate: a.dueDate ? new Date(a.dueDate) : undefined,
      }));
    }
  } catch {
    // Invalid stored data
  }
  return [];
}

function saveAssignments(assignments: Assignment[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ASSIGNMENT_STORAGE_KEY, JSON.stringify({ assignments }));
}

export const useAssignmentStore = create<AssignmentState>((set, get) => {
  const storedAssignments = loadStoredAssignments();

  return {
    assignments: storedAssignments,
    isLoading: false,
    error: null,

    createAssignment: async ({
      title,
      classId,
      gameIds,
      packIds,
      difficultyTier,
      dueDate,
      maxAttempts,
    }) => {
      set({ isLoading: true, error: null });

      try {
        if (!title || title.trim().length === 0) {
          throw new Error('Assignment title is required');
        }

        if (!classId || classId.trim().length === 0) {
          throw new Error('Class ID is required');
        }

        if (!gameIds || gameIds.length === 0) {
          throw new Error('At least one game must be selected');
        }

        if (!difficultyTier || difficultyTier.trim().length === 0) {
          throw new Error('Difficulty tier is required');
        }

        const newAssignment: Assignment = {
          id: `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: title.trim(),
          classId,
          gameIds: [...gameIds],
          packIds: packIds || [],
          difficultyTier,
          dueDate,
          maxAttempts: maxAttempts || 1,
          status: 'active' as AssignmentStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const updatedAssignments = [...get().assignments, newAssignment];
        saveAssignments(updatedAssignments);
        set({ assignments: updatedAssignments, isLoading: false });

        return newAssignment;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create assignment';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    getAssignment: (id: string) => {
      return get().assignments.find(a => a.id === id);
    },

    listByClass: (classId: string) => {
      return get().assignments.filter(
        a => a.classId === classId && a.status === 'active'
      );
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    listByStudent: (studentId: string) => {
      // For MVP, return all active assignments since we don't track per-student assignment data yet
      return get().assignments.filter(a => a.status === 'active');
    },

    updateAssignment: async (id: string, data) => {
      set({ isLoading: true, error: null });

      try {
        const state = get();
        const assignmentIndex = state.assignments.findIndex(a => a.id === id);

        if (assignmentIndex === -1) {
          set({ isLoading: false });
          return undefined;
        }

        const existingAssignment = state.assignments[assignmentIndex];

        const updatedAssignment: Assignment = {
          ...existingAssignment,
          ...data,
          updatedAt: new Date(),
        };

        const updatedAssignments = [...state.assignments];
        updatedAssignments[assignmentIndex] = updatedAssignment;

        saveAssignments(updatedAssignments);
        set({ assignments: updatedAssignments, isLoading: false });

        return updatedAssignment;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update assignment';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    deleteAssignment: async (id: string) => {
      set({ isLoading: true, error: null });

      try {
        const state = get();
        const assignmentIndex = state.assignments.findIndex(a => a.id === id);

        if (assignmentIndex === -1) {
          set({ isLoading: false });
          return false;
        }

        const updatedAssignments = state.assignments.filter(a => a.id !== id);

        saveAssignments(updatedAssignments);
        set({ assignments: updatedAssignments, isLoading: false });

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete assignment';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    duplicateAssignment: async (id: string, targetClassIds: string[]) => {
      set({ isLoading: true, error: null });

      try {
        if (!targetClassIds || targetClassIds.length === 0) {
          throw new Error('Target class IDs are required');
        }

        const state = get();
        const sourceAssignment = state.assignments.find(a => a.id === id);

        if (!sourceAssignment) {
          throw new Error('Source assignment not found');
        }

        const duplicatedAssignments: Assignment[] = targetClassIds.map(classId => ({
          ...sourceAssignment,
          id: `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          classId,
          status: 'active' as AssignmentStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        const updatedAssignments = [...state.assignments, ...duplicatedAssignments];
        saveAssignments(updatedAssignments);
        set({ assignments: updatedAssignments, isLoading: false });

        return duplicatedAssignments;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate assignment';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    reset: () => {
      const stored = loadStoredAssignments();
      set({ assignments: stored, isLoading: false, error: null });
    },

    clearError: () => {
      set({ error: null });
    },
  };
});
