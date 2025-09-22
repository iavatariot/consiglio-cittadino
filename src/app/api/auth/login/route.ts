import { NextRequest, NextResponse } from 'next/server';
import { getUserWithPasswordByEmail, verifyPassword, createSession } from '../../../../../lib/auth';
import { rateLimiter, getClientIP } from '../../../../../lib/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimiter.checkLoginLimit(clientIP);

    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      );

      if (rateLimitResult.retryAfter) {
        response.headers.set('Retry-After', rateLimitResult.retryAfter.toString());
        response.headers.set('X-RateLimit-Reset', (Date.now() + rateLimitResult.retryAfter * 1000).toString());
      }

      return response;
    }

    const body = await request.json();
    const { email, password } = body;

    // Normalize email to lowercase to avoid case sensitivity issues
    const normalizedEmail = email.toLowerCase().trim();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password sono obbligatori' },
        { status: 400 }
      );
    }

    // Get user with password hash using normalized email
    const user = await getUserWithPasswordByEmail(normalizedEmail);
    if (!user) {
      return NextResponse.json(
        { error: 'Credenziali non valide' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenziali non valide' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.email_verified) {
      return NextResponse.json(
        {
          error: 'Email non verificata. Controlla la tua casella di posta per il link di verifica.',
          code: 'EMAIL_NOT_VERIFIED'
        },
        { status: 403 }
      );
    }

    // Create session
    const session = await createSession(user.id);

    // Remove sensitive information from user object
    const { password_hash, ...safeUser } = user;

    // Create response with session cookie
    const response = NextResponse.json({
      message: 'Login effettuato con successo',
      user: safeUser
    });

    // Set session cookie (httpOnly for security)
    response.cookies.set('session_token', session.session_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}