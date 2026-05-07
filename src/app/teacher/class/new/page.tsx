'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useClassStore } from '@/store/classStore';

export default function CreateClassPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { createClass, isLoading, error, clearError } = useClassStore();
  const [className, setClassName] = useState('');

  if (!isAuthenticated) {
    router.push('/teacher/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await createClass({
        name: className,
        teacherId: user!.id,
      });
      router.push('/teacher/dashboard');
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create New Class</CardTitle>
          <CardDescription>
            Set up a new class for your students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="className" className="text-sm font-medium">Class Name</label>
              <Input
                id="className"
                type="text"
                placeholder="e.g., Grade 7 English"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                disabled={isLoading}
              />
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
                {isLoading ? 'Creating...' : 'Create Class'}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/teacher/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
