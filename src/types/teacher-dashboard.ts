export type UserRole = 'teacher' | 'student';

export interface Teacher {
  id: string;
  email: string;
  displayName: string;
  role: 'teacher';
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  displayName: string;
  firstName: string;
  lastName?: string;
  dateOfBirth?: Date;
  role: 'student';
  enrollmentCode?: string;
  parentEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ClassStatus = 'active' | 'archived';

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  enrollmentCode: string;
  students: string[];
  status: ClassStatus;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

export type AssignmentStatus = 'draft' | 'active' | 'completed';

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  gameIds: string[];
  packIds: string[];
  difficultyTier: string;
  dueDate?: Date;
  maxAttempts: number;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProgress {
  studentId: string;
  assignmentId?: string;
  gamesPlayed: number;
  totalAccuracy: number;
  totalTimeSpent: number;
  totalXpEarned: number;
  wordsMastered: string[];
  sessions: GameSession[];
  lastPlayedAt?: Date;
}

export interface GameSession {
  gameId: string;
  assignmentId?: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  xpEarned: number;
  wordsEncountered: string[];
  wordsCorrect: string[];
  completedAt: Date;
}

export function isCoppaCompliant(student: Student): boolean {
  if (!student.dateOfBirth) return false;
  const age = calculateAge(student.dateOfBirth);
  if (age < 13) {
    return !student.lastName && !student.parentEmail;
  }
  return true;
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function generateEnrollmentCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
