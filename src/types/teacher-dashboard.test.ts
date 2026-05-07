import {
  type Teacher,
  type Student,
  type Class,
  type Assignment,
  type StudentProgress,
  type GameSession,
  type UserRole,
  type ClassStatus,
  type AssignmentStatus,
  isCoppaCompliant,
  generateEnrollmentCode,
} from './teacher-dashboard';

describe('Teacher Dashboard Types', () => {
  describe('Teacher', () => {
    it('should create a valid teacher object', () => {
      const teacher: Teacher = {
        id: 'teacher-1',
        email: 'teacher@example.com',
        displayName: 'Ms. Smith',
        role: 'teacher',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };
      expect(teacher.id).toBe('teacher-1');
      expect(teacher.email).toBe('teacher@example.com');
      expect(teacher.role).toBe('teacher');
    });
  });

  describe('Student', () => {
    it('should create a valid student object', () => {
      const student: Student = {
        id: 'student-1',
        displayName: 'JohnDoe',
        firstName: 'John',
        role: 'student',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };
      expect(student.id).toBe('student-1');
      expect(student.firstName).toBe('John');
      expect(student.role).toBe('student');
    });

    it('should allow optional fields', () => {
      const student: Student = {
        id: 'student-2',
        displayName: 'JaneDoe',
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        role: 'student',
        enrollmentCode: 'ABC123',
        parentEmail: 'parent@example.com',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };
      expect(student.lastName).toBe('Doe');
      expect(student.parentEmail).toBe('parent@example.com');
    });
  });

  describe('Class', () => {
    it('should create a valid class object', () => {
      const cls: Class = {
        id: 'class-1',
        name: 'Math 101',
        teacherId: 'teacher-1',
        enrollmentCode: 'ABC12345',
        students: ['student-1', 'student-2'],
        status: 'active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };
      expect(cls.name).toBe('Math 101');
      expect(cls.students).toHaveLength(2);
      expect(cls.status).toBe('active');
    });
  });

  describe('Assignment', () => {
    it('should create a valid assignment object', () => {
      const assignment: Assignment = {
        id: 'assignment-1',
        title: 'Vocabulary Practice',
        classId: 'class-1',
        gameIds: ['game-1', 'game-2'],
        packIds: ['pack-1'],
        difficultyTier: 'medium',
        maxAttempts: 3,
        status: 'active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };
      expect(assignment.title).toBe('Vocabulary Practice');
      expect(assignment.maxAttempts).toBe(3);
    });
  });

  describe('StudentProgress', () => {
    it('should create a valid progress object', () => {
      const session: GameSession = {
        gameId: 'game-1',
        score: 100,
        accuracy: 85,
        timeSpent: 300,
        xpEarned: 50,
        wordsEncountered: ['hello', 'world'],
        wordsCorrect: ['hello'],
        completedAt: new Date('2024-01-01'),
      };

      const progress: StudentProgress = {
        studentId: 'student-1',
        gamesPlayed: 5,
        totalAccuracy: 80,
        totalTimeSpent: 1500,
        totalXpEarned: 250,
        wordsMastered: ['hello'],
        sessions: [session],
      };

      expect(progress.gamesPlayed).toBe(5);
      expect(progress.sessions).toHaveLength(1);
      expect(progress.sessions[0].score).toBe(100);
    });
  });

  describe('isCoppaCompliant', () => {
    it('should return false if dateOfBirth is missing', () => {
      const student: Student = {
        id: 'student-1',
        displayName: 'Kid',
        firstName: 'Kid',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(isCoppaCompliant(student)).toBe(false);
    });

    it('should return false for under-13 with lastName', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 10);
      const student: Student = {
        id: 'student-1',
        displayName: 'Kid',
        firstName: 'Kid',
        lastName: 'Doe',
        dateOfBirth: birthDate,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(isCoppaCompliant(student)).toBe(false);
    });

    it('should return true for under-13 without lastName or email', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 10);
      const student: Student = {
        id: 'student-1',
        displayName: 'Kid',
        firstName: 'Kid',
        dateOfBirth: birthDate,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(isCoppaCompliant(student)).toBe(true);
    });

    it('should return true for over-13 regardless of lastName', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 15);
      const student: Student = {
        id: 'student-1',
        displayName: 'Teen',
        firstName: 'Teen',
        lastName: 'Doe',
        dateOfBirth: birthDate,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(isCoppaCompliant(student)).toBe(true);
    });
  });

  describe('generateEnrollmentCode', () => {
    it('should generate an 8-character code', () => {
      const code = generateEnrollmentCode();
      expect(code).toHaveLength(8);
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });

    it('should generate different codes', () => {
      const code1 = generateEnrollmentCode();
      const code2 = generateEnrollmentCode();
      expect(code1).not.toBe(code2);
    });
  });
});
