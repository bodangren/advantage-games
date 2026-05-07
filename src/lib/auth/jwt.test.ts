import {
  generateJWT,
  validateJWT,
  isTokenExpired,
  getTokenPayload,
  type JWTPayload,
} from './jwt';

describe('JWT Utilities', () => {
  describe('generateJWT', () => {
    it('should generate a valid JWT token', () => {
      const payload: Omit<JWTPayload, 'iat'> = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'teacher',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const token = generateJWT(payload);
      expect(token).toContain('.');
      const parts = token.split('.');
      expect(parts).toHaveLength(3);
    });
  });

  describe('validateJWT', () => {
    it('should validate a generated token', () => {
      const payload: Omit<JWTPayload, 'iat'> = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'teacher',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const token = generateJWT(payload);
      const validated = validateJWT(token);
      
      expect(validated.userId).toBe('user-1');
      expect(validated.email).toBe('test@example.com');
      expect(validated.role).toBe('teacher');
      expect(validated.iat).toBeDefined();
    });

    it('should throw error for invalid token format', () => {
      expect(() => validateJWT('')).toThrow('Invalid token format');
      expect(() => validateJWT('invalid')).toThrow('Invalid token format');
    });

    it('should throw error for expired token', () => {
      const payload: Omit<JWTPayload, 'iat'> = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'teacher',
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      };

      const token = generateJWT(payload);
      expect(() => validateJWT(token)).toThrow('Token expired');
    });

    it('should throw error for invalid payload', () => {
      const invalidToken = 'header.eyJ1c2VySWQiOiIifQ.signature';
      expect(() => validateJWT(invalidToken)).toThrow();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const payload: Omit<JWTPayload, 'iat'> = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'teacher',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const token = generateJWT(payload);
      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const payload: Omit<JWTPayload, 'iat'> = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'teacher',
        exp: Math.floor(Date.now() / 1000) - 3600,
      };

      const token = generateJWT(payload);
      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid')).toBe(true);
    });
  });

  describe('getTokenPayload', () => {
    it('should return payload for valid token', () => {
      const payload: Omit<JWTPayload, 'iat'> = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'teacher',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const token = generateJWT(payload);
      const result = getTokenPayload(token);
      
      expect(result).not.toBeNull();
      expect(result?.userId).toBe('user-1');
    });

    it('should return null for invalid token', () => {
      const result = getTokenPayload('invalid');
      expect(result).toBeNull();
    });
  });
});
