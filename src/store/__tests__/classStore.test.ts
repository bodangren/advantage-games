import { act } from '@testing-library/react';
import { useClassStore } from '../classStore';
import type { Class } from '@/types/teacher-dashboard';

describe('classStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useClassStore.getState().reset();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('createClass', () => {
    it('creates a class with required fields', async () => {
      const result = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Test Class',
          teacherId: 'teacher-1',
        });
      });

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Class');
      expect(result.teacherId).toBe('teacher-1');
      expect(result.enrollmentCode).toBeDefined();
      expect(result.enrollmentCode).toHaveLength(8);
      expect(result.status).toBe('active');
      expect(result.students).toEqual([]);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('generates unique enrollment codes', async () => {
      const class1 = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Class 1',
          teacherId: 'teacher-1',
        });
      });

      const class2 = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Class 2',
          teacherId: 'teacher-1',
        });
      });

      expect(class1.enrollmentCode).not.toBe(class2.enrollmentCode);
    });

    it('persists to localStorage', async () => {
      await act(async () => {
        await useClassStore.getState().createClass({
          name: 'Persisted Class',
          teacherId: 'teacher-1',
        });
      });

      const stored = localStorage.getItem('teacher_dashboard_classes');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.classes).toHaveLength(1);
      expect(parsed.classes[0].name).toBe('Persisted Class');
    });

    it('rejects empty class name', async () => {
      await expect(
        act(async () => {
          return useClassStore.getState().createClass({
            name: '',
            teacherId: 'teacher-1',
          });
        })
      ).rejects.toThrow('Class name is required');
    });

    it('rejects empty teacher ID', async () => {
      await expect(
        act(async () => {
          return useClassStore.getState().createClass({
            name: 'Test Class',
            teacherId: '',
          });
        })
      ).rejects.toThrow('Teacher ID is required');
    });
  });

  describe('getClass', () => {
    it('returns class by id', async () => {
      const created = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Test Class',
          teacherId: 'teacher-1',
        });
      });

      const found = useClassStore.getState().getClass(created.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Test Class');
    });

    it('returns undefined for non-existent id', () => {
      const found = useClassStore.getState().getClass('non-existent');
      expect(found).toBeUndefined();
    });
  });

  describe('listClasses', () => {
    it('returns only active classes for a teacher', async () => {
      await act(async () => {
        await useClassStore.getState().createClass({
          name: 'Active Class',
          teacherId: 'teacher-1',
        });
      });

      await act(async () => {
        const created = await useClassStore.getState().createClass({
          name: 'To Archive',
          teacherId: 'teacher-1',
        });
        await useClassStore.getState().archiveClass(created.id);
      });

      await act(async () => {
        await useClassStore.getState().createClass({
          name: 'Other Teacher',
          teacherId: 'teacher-2',
        });
      });

      const classes = useClassStore.getState().listClasses('teacher-1');
      expect(classes).toHaveLength(1);
      expect(classes[0].name).toBe('Active Class');
    });

    it('returns empty array when no classes exist', () => {
      const classes = useClassStore.getState().listClasses('teacher-1');
      expect(classes).toEqual([]);
    });
  });

  describe('updateClass', () => {
    it('updates class name', async () => {
      const created = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Original Name',
          teacherId: 'teacher-1',
        });
      });

      const updated = await act(async () => {
        return useClassStore.getState().updateClass(created.id, {
          name: 'Updated Name',
        });
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.id).toBe(created.id);
    });

    it('rejects update to archived class', async () => {
      const created = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Test Class',
          teacherId: 'teacher-1',
        });
      });

      await act(async () => {
        await useClassStore.getState().archiveClass(created.id);
      });

      await expect(
        act(async () => {
          return useClassStore.getState().updateClass(created.id, {
            name: 'New Name',
          });
        })
      ).rejects.toThrow('Cannot update archived class');
    });

    it('returns undefined for non-existent id', async () => {
      const updated = await act(async () => {
        return useClassStore.getState().updateClass('non-existent', {
          name: 'New Name',
        });
      });

      expect(updated).toBeUndefined();
    });
  });

  describe('archiveClass', () => {
    it('soft deletes class with timestamp', async () => {
      const created = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Test Class',
          teacherId: 'teacher-1',
        });
      });

      const archived = await act(async () => {
        return useClassStore.getState().archiveClass(created.id);
      });

      expect(archived.status).toBe('archived');
      expect(archived.archivedAt).toBeInstanceOf(Date);
      expect(useClassStore.getState().listClasses('teacher-1')).toHaveLength(0);
    });

    it('returns undefined for non-existent id', async () => {
      const archived = await act(async () => {
        return useClassStore.getState().archiveClass('non-existent');
      });

      expect(archived).toBeUndefined();
    });
  });

  describe('enrollment code generation', () => {
    it('generates 8-character alphanumeric codes', async () => {
      const created = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Test Class',
          teacherId: 'teacher-1',
        });
      });

      expect(created.enrollmentCode).toMatch(/^[A-Z0-9]{8}$/);
    });

    it('checks for collisions', async () => {
      // Create multiple classes to trigger collision handling
      const codes = new Set<string>();
      
      for (let i = 0; i < 10; i++) {
        const created = await act(async () => {
          return useClassStore.getState().createClass({
            name: `Class ${i}`,
            teacherId: 'teacher-1',
          });
        });
        codes.add(created.enrollmentCode);
      }

      expect(codes.size).toBe(10);
    });
  });

  describe('enrollStudent', () => {
    it('adds student to class by enrollment code', async () => {
      const created = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Test Class',
          teacherId: 'teacher-1',
        });
      });

      const enrolled = await act(async () => {
        return useClassStore.getState().enrollStudent(created.enrollmentCode, 'student-1');
      });

      expect(enrolled).toBeDefined();
      expect(enrolled?.students).toContain('student-1');
    });

    it('rejects invalid enrollment code', async () => {
      await expect(
        act(async () => {
          return useClassStore.getState().enrollStudent('INVALID', 'student-1');
        })
      ).rejects.toThrow('Invalid enrollment code');
    });

    it('rejects duplicate enrollment', async () => {
      const created = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Test Class',
          teacherId: 'teacher-1',
        });
      });

      await act(async () => {
        await useClassStore.getState().enrollStudent(created.enrollmentCode, 'student-1');
      });

      await expect(
        act(async () => {
          return useClassStore.getState().enrollStudent(created.enrollmentCode, 'student-1');
        })
      ).rejects.toThrow('Student already enrolled');
    });

    it('rejects enrollment in archived class', async () => {
      const created = await act(async () => {
        return useClassStore.getState().createClass({
          name: 'Test Class',
          teacherId: 'teacher-1',
        });
      });

      await act(async () => {
        await useClassStore.getState().archiveClass(created.id);
      });

      await expect(
        act(async () => {
          return useClassStore.getState().enrollStudent(created.enrollmentCode, 'student-1');
        })
      ).rejects.toThrow('Class is not active');
    });
  });

  describe('localStorage persistence', () => {
    it('loads classes from localStorage on init', async () => {
      // Pre-populate localStorage
      const mockClass: Class = {
        id: 'class-1',
        name: 'Loaded Class',
        teacherId: 'teacher-1',
        enrollmentCode: 'ABC12345',
        students: [],
        status: 'active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      localStorage.setItem('teacher_dashboard_classes', JSON.stringify({
        classes: [mockClass],
      }));

      // Reset store to trigger re-init
      useClassStore.getState().reset();

      const loaded = useClassStore.getState().getClass('class-1');
      expect(loaded).toBeDefined();
      expect(loaded?.name).toBe('Loaded Class');
    });
  });
});
