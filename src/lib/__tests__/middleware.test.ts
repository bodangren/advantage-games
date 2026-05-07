import { NextResponse } from 'next/server';
import { middleware } from '../../middleware';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({ type: 'next' })),
    redirect: jest.fn((url) => ({ type: 'redirect', url })),
  },
}));

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (pathname: string, cookies: Record<string, string> = {}) => ({
    nextUrl: { 
      pathname, 
      url: `http://localhost:3000${pathname}`, 
      href: `http://localhost:3000${pathname}`,
      origin: 'http://localhost:3000',
    },
    cookies: {
      get: (name: string) => cookies[name] ? { value: cookies[name] } : undefined,
    },
    url: `http://localhost:3000${pathname}`,
  });

  it('should allow access to non-teacher routes', () => {
    const request = createRequest('/student/games');
    middleware(request as any);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should redirect to login when no token on teacher routes', () => {
    const request = createRequest('/teacher/dashboard');
    middleware(request as any);
    expect(NextResponse.redirect).toHaveBeenCalled();
  });

  it('should allow access with valid teacher token', () => {
    const payload = { role: 'teacher', userId: 'teacher-1' };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    const request = createRequest('/teacher/dashboard', { 'auth-token': token });
    
    middleware(request as any);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should redirect non-teacher roles', () => {
    const payload = { role: 'student', userId: 'student-1' };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    const request = createRequest('/teacher/dashboard', { 'auth-token': token });
    
    middleware(request as any);
    expect(NextResponse.redirect).toHaveBeenCalled();
  });

  it('should redirect with invalid token format', () => {
    const request = createRequest('/teacher/dashboard', { 'auth-token': 'invalid' });
    
    middleware(request as any);
    expect(NextResponse.redirect).toHaveBeenCalled();
  });
});
