import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Verify admin session from JWT token in request cookie
 * Returns true only if the token is valid and not expired
 */
export function verifyAdminSession(request: NextRequest): boolean {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken) {
      return false;
    }

    // Verify JWT
    jwt.verify(
      sessionToken,
      process.env.JWT_SECRET || 'sow-2026-dev-jwt-secret-key'
    );

    return true;
  } catch (error) {
    return false;
  }
}
