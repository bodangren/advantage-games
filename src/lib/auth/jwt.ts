export interface JWTPayload {
  userId: string;
  email: string;
  role: 'teacher' | 'student';
  exp: number;
  iat: number;
}

export function generateJWT(payload: Omit<JWTPayload, 'iat'>): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
  };
  
  // Simple base64 encoding for mock JWT
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(fullPayload));
  const signature = btoa(`signature-${header}-${body}`);
  
  return `${header}.${body}.${signature}`;
}

export function validateJWT(token: string): JWTPayload {
  if (!token || !token.includes('.')) {
    throw new Error('Invalid token format');
  }
  
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }
  
  try {
    const payload = JSON.parse(atob(parts[1]));
    
    if (!payload.userId || !payload.role) {
      throw new Error('Invalid token payload');
    }
    
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }
    
    return payload as JWTPayload;
  } catch (err) {
    if (err instanceof Error && err.message.includes('expired')) {
      throw err;
    }
    throw new Error('Invalid token');
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = validateJWT(token);
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

export function getTokenPayload(token: string): JWTPayload | null {
  try {
    return validateJWT(token);
  } catch {
    return null;
  }
}
