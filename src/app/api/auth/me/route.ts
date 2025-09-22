import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '../../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Get session and user
    const sessionWithUser = await getSessionByToken(sessionToken);
    if (!sessionWithUser) {
      return NextResponse.json(
        { error: 'Sessione non valida o scaduta' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: sessionWithUser.user
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}