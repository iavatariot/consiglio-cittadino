import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, isValidEmail, isValidPassword, createEmailVerificationToken } from '@/lib/auth';
import { rateLimiter, getClientIP } from '@/lib/rateLimiter';
import { spamDetector } from '@/lib/spamDetector';
import { emailService } from '@/lib/emailService';
import { verificaCodiceFiscale } from '@/lib/codiceFiscale';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimiter.checkRegistrationLimit(clientIP);

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
    const {
      email, password, first_name, last_name,
      data_nascita, sesso, luogo_nascita, codice_fiscale,
      honeypot
    } = body;

    // Normalize email to lowercase to avoid case sensitivity issues
    const normalizedEmail = email.toLowerCase().trim();

    // Honeypot check - se compilato è un bot
    if (honeypot && honeypot.trim() !== '') {
      console.log(`🤖 Bot detected from IP ${clientIP}: honeypot filled`);
      return NextResponse.json(
        { error: 'Registrazione non valida' },
        { status: 400 }
      );
    }

    // Controllo headers sospetti
    const headerCheck = spamDetector.checkRequestHeaders(request.headers);
    if (headerCheck.suspicious) {
      console.log(`🚨 Suspicious headers from IP ${clientIP}:`, headerCheck.reasons);
    }

    // Controllo spam nel contenuto
    const spamCheck = spamDetector.checkRegistrationSpam({
      email,
      first_name,
      last_name,
      fiscal_code: codice_fiscale
    });

    if (spamCheck.isSpam) {
      console.log(`🚫 Spam registration blocked from IP ${clientIP}:`, {
        score: spamCheck.score,
        reasons: spamCheck.reasons,
        data: { email, first_name, last_name }
      });

      return NextResponse.json(
        {
          error: 'Registrazione non valida. Verifica i dati inseriti.',
          details: spamCheck.reasons // In produzione potresti voler rimuovere i dettagli
        },
        { status: 400 }
      );
    }

    // Log registrazioni sospette ma non bloccate
    if (spamCheck.score > 25) {
      console.log(`⚠️ Suspicious registration from IP ${clientIP}:`, {
        score: spamCheck.score,
        reasons: spamCheck.reasons,
        email
      });
    }

    // Validation
    if (!email || !password || !first_name || !last_name ||
        !data_nascita || !sesso || !luogo_nascita || !codice_fiscale) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    // Validate codice fiscale
    const cfValidation = verificaCodiceFiscale(codice_fiscale, {
      nome: first_name,
      cognome: last_name,
      dataNascita: data_nascita,
      sesso: sesso as 'M' | 'F',
      luogoNascita: luogo_nascita
    });

    if (!cfValidation.valido || !cfValidation.corrispondenza) {
      return NextResponse.json(
        {
          error: 'Il codice fiscale non è valido o non corrisponde ai dati inseriti',
          details: cfValidation.errori
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Formato email non valido' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password non valida', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utente con questa email esiste già' },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser({
      email: normalizedEmail,
      password,
      first_name,
      last_name,
      fiscal_code: codice_fiscale,
      birth_date: data_nascita,
      gender: sesso,
      birth_place: luogo_nascita
    });

    // Create email verification token and send email
    try {
      const verificationToken = await createEmailVerificationToken(user.id);

      const emailSent = await emailService.sendVerificationEmail(
        user.email,
        verificationToken,
        user.first_name
      );

      if (!emailSent) {
        console.error('Failed to send verification email to:', user.email);
      } else {
        console.log(`✅ Verification email sent to: ${user.email}`);
      }
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Non blocchiamo la registrazione se l'email fallisce
    }

    // Remove sensitive information from response
    const { ...safeUser } = user;

    return NextResponse.json({
      message: 'Utente creato con successo! Controlla la tua email per verificare l\'account.',
      user: safeUser,
      emailSent: true
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
