import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createEmailVerificationToken } from '../../../../../lib/auth';
import { emailService } from '../../../../../lib/emailService';
import { rateLimiter, getClientIP } from '../../../../../lib/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check per resend verification
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimiter.checkRegistrationLimit(clientIP); // Riusiamo lo stesso limite

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
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email è obbligatoria' },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await getUserByEmail(email);

    if (!user) {
      // Non rivelare se l'utente esiste o meno per sicurezza
      return NextResponse.json({
        message: 'Se l\'email è registrata, riceverai un\'email di verifica.'
      });
    }

    // If already verified, inform user
    if (user.email_verified) {
      return NextResponse.json({
        message: 'L\'email è già verificata. Puoi effettuare il login.'
      });
    }

    // Create new verification token
    const verificationToken = await createEmailVerificationToken(user.id);

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.first_name
    );

    if (!emailSent) {
      console.error('Failed to send verification email to:', user.email);
      return NextResponse.json(
        { error: 'Errore durante l\'invio dell\'email' },
        { status: 500 }
      );
    }

    console.log(`✅ Verification email resent to: ${user.email}`);

    return NextResponse.json({
      message: 'Email di verifica inviata. Controlla la tua casella di posta.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}