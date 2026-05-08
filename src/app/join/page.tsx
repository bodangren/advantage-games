'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClassStore } from '@/store/classStore';
import { useAuthStore } from '@/store/authStore';

export default function JoinClassPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { enrollStudent, isLoading, error, clearError } = useClassStore();
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    try {
      // For MVP, use a mock student ID if not authenticated
      // In production, this would use the actual student ID from auth
      const studentId = user?.id || `student-${Date.now()}`;
      
      await enrollStudent(enrollmentCode.trim().toUpperCase(), studentId);
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Join a Class</CardTitle>
          <CardDescription>
              Enter your teacher&apos;s enrollment code to join their class
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Success!</h3>
              <p className="text-muted-foreground">
                You&apos;ve successfully joined the class.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Redirecting to home...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="enrollmentCode" className="text-sm font-medium">
                  Enrollment Code
                </label>
                <Input
                  id="enrollmentCode"
                  type="text"
                  placeholder="e.g., ABC12345"
                  value={enrollmentCode}
                  onChange={(e) => setEnrollmentCode(e.target.value.toUpperCase())}
                  required
                  disabled={isLoading}
                  maxLength={8}
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 8-character code provided by your teacher
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500" role="alert">{error}</p>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Joining...' : 'Join Class'}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
