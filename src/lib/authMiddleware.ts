import { NextRequest } from 'next/server';
import { getSessionByToken, User } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

export async function requireAuth(request: NextRequest): Promise<{ user: User } | { error: string; status: number }> {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return { error: 'Token di sessione mancante', status: 401 };
    }

    const sessionWithUser = await getSessionByToken(sessionToken);
    if (!sessionWithUser) {
      return { error: 'Sessione non valida o scaduta', status: 401 };
    }

    return { user: sessionWithUser.user };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return { error: 'Errore interno del server', status: 500 };
  }
}

export async function optionalAuth(request: NextRequest): Promise<{ user?: User }> {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return {};
    }

    const sessionWithUser = await getSessionByToken(sessionToken);
    if (!sessionWithUser) {
      return {};
    }

    return { user: sessionWithUser.user };

  } catch (error) {
    console.error('Optional auth middleware error:', error);
    return {};
  }
}