import { useAssignmentStore } from '../assignmentStore';
import type { Assignment } from '@/types/teacher-dashboard';

describe('assignmentStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAssignmentStore.getState().reset();
  });

  describe('createAssignment', () => {
    it('creates a new assignment with required fields', async () => {
      const result = await useAssignmentStore.getState().createAssignment({
        title: 'Test Assignment',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 3,
      });

      expect(result.title).toBe('Test Assignment');
      expect(result.classId).toBe('class-1');
      expect(result.gameIds).toEqual(['game-1']);
      expect(result.difficultyTier).toBe('medium');
      expect(result.maxAttempts).toBe(3);
      expect(result.status).toBe('active');
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('creates assignment with optional dueDate', async () => {
      const dueDate = new Date('2024-12-31');
      const result = await useAssignmentStore.getState().createAssignment({
        title: 'Test Assignment',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        dueDate,
        maxAttempts: 1,
      });

      expect(result.dueDate).toEqual(dueDate);
    });

    it('trims whitespace from title', async () => {
      const result = await useAssignmentStore.getState().createAssignment({
        title: '  Test Assignment  ',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 1,
      });

      expect(result.title).toBe('Test Assignment');
    });

    it('throws error when title is empty', async () => {
      await expect(
        useAssignmentStore.getState().createAssignment({
          title: '',
          classId: 'class-1',
          gameIds: ['game-1'],
          packIds: [],
          difficultyTier: 'medium',
          maxAttempts: 1,
        })
      ).rejects.toThrow('Assignment title is required');
    });

    it('throws error when classId is empty', async () => {
      await expect(
        useAssignmentStore.getState().createAssignment({
          title: 'Test',
          classId: '',
          gameIds: ['game-1'],
          packIds: [],
          difficultyTier: 'medium',
          maxAttempts: 1,
        })
      ).rejects.toThrow('Class ID is required');
    });

    it('throws error when no games selected', async () => {
      await expect(
        useAssignmentStore.getState().createAssignment({
          title: 'Test',
          classId: 'class-1',
          gameIds: [],
          packIds: [],
          difficultyTier: 'medium',
          maxAttempts: 1,
        })
      ).rejects.toThrow('At least one game must be selected');
    });

    it('throws error when difficulty tier is empty', async () => {
      await expect(
        useAssignmentStore.getState().createAssignment({
          title: 'Test',
          classId: 'class-1',
          gameIds: ['game-1'],
          packIds: [],
          difficultyTier: '',
          maxAttempts: 1,
        })
      ).rejects.toThrow('Difficulty tier is required');
    });

    it('defaults maxAttempts to 1 when not provided', async () => {
      const result = await useAssignmentStore.getState().createAssignment({
        title: 'Test',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: undefined as unknown as number,
      });

      expect(result.maxAttempts).toBe(1);
    });
  });

  describe('getAssignment', () => {
    it('returns assignment by id', async () => {
      const created = await useAssignmentStore.getState().createAssignment({
        title: 'Test',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 1,
      });

      const found = useAssignmentStore.getState().getAssignment(created.id);
      expect(found).toBeDefined();
      expect(found?.title).toBe('Test');
    });

    it('returns undefined for non-existent id', () => {
      const found = useAssignmentStore.getState().getAssignment('non-existent');
      expect(found).toBeUndefined();
    });
  });

  describe('listByClass', () => {
    it('returns assignments for specific class', async () => {
      await useAssignmentStore.getState().createAssignment({
        title: 'Class 1 Assignment',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 1,
      });

      await useAssignmentStore.getState().createAssignment({
        title: 'Class 2 Assignment',
        classId: 'class-2',
        gameIds: ['game-2'],
        packIds: [],
        difficultyTier: 'hard',
        maxAttempts: 1,
      });

      const class1Assignments = useAssignmentStore.getState().listByClass('class-1');
      expect(class1Assignments).toHaveLength(1);
      expect(class1Assignments[0].title).toBe('Class 1 Assignment');
    });

    it('excludes completed assignments', async () => {
      const created = await useAssignmentStore.getState().createAssignment({
        title: 'Test',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 1,
      });

      await useAssignmentStore.getState().updateAssignment(created.id, {
        status: 'completed',
      });

      const assignments = useAssignmentStore.getState().listByClass('class-1');
      expect(assignments).toHaveLength(0);
    });
  });

  describe('listByStudent', () => {
    beforeEach(() => {
      useAssignmentStore.getState().reset();
    });

    it('returns active assignments for student', async () => {
      await useAssignmentStore.getState().createAssignment({
        title: 'Test',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 1,
      });

      const assignments = useAssignmentStore.getState().listByStudent('student-1');
      expect(assignments).toHaveLength(1);
    });
  });

  describe('updateAssignment', () => {
    it('updates assignment fields', async () => {
      const created = await useAssignmentStore.getState().createAssignment({
        title: 'Original Title',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 1,
      });

      const updated = await useAssignmentStore.getState().updateAssignment(created.id, {
        title: 'Updated Title',
        difficultyTier: 'hard',
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.difficultyTier).toBe('hard');
    });

    it('returns undefined for non-existent assignment', async () => {
      const result = await useAssignmentStore.getState().updateAssignment('non-existent', {
        title: 'Updated',
      });

      expect(result).toBeUndefined();
    });
  });

  describe('deleteAssignment', () => {
    it('deletes assignment by id', async () => {
      const created = await useAssignmentStore.getState().createAssignment({
        title: 'To Delete',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 1,
      });

      const deleted = await useAssignmentStore.getState().deleteAssignment(created.id);
      expect(deleted).toBe(true);

      const found = useAssignmentStore.getState().getAssignment(created.id);
      expect(found).toBeUndefined();
    });

    it('returns false for non-existent assignment', async () => {
      const result = await useAssignmentStore.getState().deleteAssignment('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('duplicateAssignment', () => {
    it('duplicates assignment to target classes', async () => {
      const original = await useAssignmentStore.getState().createAssignment({
        title: 'Original',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 1,
      });

      const duplicated = await useAssignmentStore.getState().duplicateAssignment(original.id, [
        'class-2',
        'class-3',
      ]);

      expect(duplicated).toHaveLength(2);
      expect(duplicated[0].title).toBe('Original');
      expect(duplicated[0].classId).toBe('class-2');
      expect(duplicated[1].classId).toBe('class-3');
      expect(duplicated[0].id).not.toBe(original.id);
    });

    it('throws error when targetClassIds is empty', async () => {
      await expect(
        useAssignmentStore.getState().duplicateAssignment('some-id', [])
      ).rejects.toThrow('Target class IDs are required');
    });

    it('throws error when source assignment not found', async () => {
      await expect(
        useAssignmentStore.getState().duplicateAssignment('non-existent', ['class-2'])
      ).rejects.toThrow('Source assignment not found');
    });
  });

  describe('persistence', () => {
    it('persists assignments to localStorage', async () => {
      await useAssignmentStore.getState().createAssignment({
        title: 'Persisted',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 1,
      });

      const stored = localStorage.getItem('teacher_dashboard_assignments');
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.assignments).toHaveLength(1);
      expect(parsed.assignments[0].title).toBe('Persisted');
    });

    it('loads assignments from localStorage on reset', async () => {
      const assignment: Assignment = {
        id: 'test-id',
        title: 'Stored',
        classId: 'class-1',
        gameIds: ['game-1'],
        packIds: [],
        difficultyTier: 'medium',
        maxAttempts: 1,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorage.setItem('teacher_dashboard_assignments', JSON.stringify({
        assignments: [assignment],
      }));

      useAssignmentStore.getState().reset();

      const found = useAssignmentStore.getState().getAssignment('test-id');
      expect(found).toBeDefined();
      expect(found?.title).toBe('Stored');
    });
  });

  describe('error handling', () => {
    it('sets error state on failed creation', async () => {
      try {
        await useAssignmentStore.getState().createAssignment({
          title: '',
          classId: 'class-1',
          gameIds: ['game-1'],
          packIds: [],
          difficultyTier: 'medium',
          maxAttempts: 1,
        });
      } catch {
        // Expected
      }

      expect(useAssignmentStore.getState().error).toBe('Assignment title is required');
    });

    it('clears error state', () => {
      useAssignmentStore.setState({ error: 'Some error' });
      useAssignmentStore.getState().clearError();
      expect(useAssignmentStore.getState().error).toBeNull();
    });
  });
});
