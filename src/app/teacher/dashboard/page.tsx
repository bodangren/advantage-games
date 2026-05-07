'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useClassStore } from '@/store/classStore';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { classes, listClasses, archiveClass } = useClassStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/teacher/login');
    }
  }, [isAuthenticated, router]);

  const teacherClasses = user ? listClasses(user.id) : [];

  const handleArchive = async (classId: string) => {
    if (window.confirm('Are you sure you want to archive this class?')) {
      await archiveClass(classId);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.displayName || 'Teacher'}
            </p>
          </div>
          <Button asChild>
            <Link href="/teacher/class/new">Create New Class</Link>
          </Button>
        </div>

        {teacherClasses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't created any classes yet.
              </p>
              <Button asChild>
                <Link href="/teacher/class/new">Create Your First Class</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {teacherClasses.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>
                    {cls.students.length} student{cls.students.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Enrollment Code:</span>{' '}
                      <code className="bg-muted px-2 py-1 rounded">{cls.enrollmentCode}</code>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/class/${cls.id}`}>View Details</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleArchive(cls.id)}
                    >
                      Archive
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
