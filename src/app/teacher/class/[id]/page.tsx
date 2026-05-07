'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useClassStore } from '@/store/classStore';
import type { Class } from '@/types/teacher-dashboard';

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { getClass, archiveClass } = useClassStore();
  const [classData, setClassData] = useState<Class | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/teacher/login');
      return;
    }

    const data = getClass(params.id);
    if (!data) {
      router.push('/teacher/dashboard');
      return;
    }

    // Verify teacher owns this class
    if (data.teacherId !== user?.id) {
      router.push('/teacher/dashboard');
      return;
    }

    setClassData(data);
  }, [isAuthenticated, params.id, getClass, router, user?.id]);

  const handleArchive = async () => {
    if (window.confirm('Are you sure you want to archive this class?')) {
      await archiveClass(params.id);
      router.push('/teacher/dashboard');
    }
  };

  if (!isAuthenticated || !classData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/teacher/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground mb-2 block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">{classData.name}</h1>
          </div>
          <Button variant="destructive" onClick={handleArchive}>
            Archive Class
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Class Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Enrollment Code</p>
                <code className="bg-muted px-2 py-1 rounded text-lg">{classData.enrollmentCode}</code>
              </div>
              <div>
                <p className="text-sm font-medium">Students</p>
                <p className="text-2xl font-bold">{classData.students.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-muted-foreground">
                  {new Date(classData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                Students enrolled in this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classData.students.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No students enrolled yet.
                  <br />
                  Share the enrollment code with your students.
                </p>
              ) : (
                <ul className="space-y-2">
                  {classData.students.map((studentId) => (
                    <li
                      key={studentId}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <span>Student {studentId}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
