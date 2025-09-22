import { NextRequest, NextResponse } from 'next/server';
import { confirmEmailVerification, getUserByVerificationToken } from '../../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token di verifica mancante' },
        { status: 400 }
      );
    }

    // Verify the token and get user info
    const user = await getUserByVerificationToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Token di verifica non valido o scaduto' },
        { status: 400 }
      );
    }

    // If already verified, just return success
    if (user.email_verified) {
      return NextResponse.json({
        message: 'Email già verificata',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          email_verified: user.email_verified
        }
      });
    }

    // Confirm verification
    const success = await confirmEmailVerification(token);

    if (!success) {
      return NextResponse.json(
        { error: 'Errore durante la verifica dell\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Email verificata con successo! Ora puoi effettuare il login.',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        email_verified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// Also support POST requests for form submissions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token di verifica mancante' },
        { status: 400 }
      );
    }

    // Verify the token and get user info
    const user = await getUserByVerificationToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Token di verifica non valido o scaduto' },
        { status: 400 }
      );
    }

    // If already verified, just return success
    if (user.email_verified) {
      return NextResponse.json({
        message: 'Email già verificata',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          email_verified: user.email_verified
        }
      });
    }

    // Confirm verification
    const success = await confirmEmailVerification(token);

    if (!success) {
      return NextResponse.json(
        { error: 'Errore durante la verifica dell\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Email verificata con successo! Ora puoi effettuare il login.',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        email_verified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}