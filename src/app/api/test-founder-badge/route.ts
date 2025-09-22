import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { verifySession, setUserAsFounder } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify user session
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Autenticazione richiesta' },
        { status: 401 }
      );
    }

    // Manually assign founder badge for testing
    await setUserAsFounder(user.id);

    console.log(`Badge fondatore assegnato manualmente all'utente ${user.id} (${user.email})`);

    return NextResponse.json({
      success: true,
      message: 'Badge fondatore assegnato con successo',
      userId: user.id
    });

  } catch (error) {
    console.error('Error assigning founder badge:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}