import { NextRequest, NextResponse } from 'next/server';
import {
  getSessionByToken,
  requestAccountDeletion,
  cancelAccountDeletion,
  confirmAccountDeletion,
  verifyDeletionToken
} from '../../../../../lib/auth';
import { emailService } from '../../../../../lib/emailService';
import { rateLimiter, getClientIP } from '../../../../../lib/rateLimiter';

// POST - Request account deletion
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimiter.checkRegistrationLimit(clientIP); // Limite stringente

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

    // Verifica autenticazione
    const sessionToken = request.cookies.get('session_token')?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const sessionData = await getSessionByToken(sessionToken);
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Sessione non valida' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reason, action } = body;

    if (action === 'cancel') {
      // Cancella richiesta di eliminazione
      const cancelled = await cancelAccountDeletion(sessionData.user.id);

      if (!cancelled) {
        return NextResponse.json(
          { error: 'Errore durante l\'annullamento della richiesta' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Richiesta di cancellazione annullata con successo'
      });
    }

    // Richiesta di cancellazione account
    const deletionToken = await requestAccountDeletion(sessionData.user.id, reason);

    // Invia email di conferma
    const emailSent = await emailService.sendAccountDeletionEmail(
      sessionData.user.email,
      deletionToken,
      sessionData.user.first_name,
      reason
    );

    if (!emailSent) {
      console.error('Failed to send deletion email to:', sessionData.user.email);
      return NextResponse.json(
        { error: 'Errore durante l\'invio dell\'email di conferma' },
        { status: 500 }
      );
    }

    console.log(`⚠️ Account deletion requested for user: ${sessionData.user.email}`);

    return NextResponse.json({
      message: 'Richiesta di cancellazione inviata. Controlla la tua email per confermare.',
      expiresIn: '2 ore'
    });

  } catch (error) {
    console.error('Delete account request error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// GET - Confirm account deletion via email token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token di cancellazione mancante' },
        { status: 400 }
      );
    }

    // Verifica il token
    const verification = await verifyDeletionToken(token);

    if (!verification.valid || !verification.user) {
      return NextResponse.json(
        { error: 'Token di cancellazione non valido o scaduto' },
        { status: 400 }
      );
    }

    // Conferma la cancellazione
    const deleted = await confirmAccountDeletion(token);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Errore durante la cancellazione dell\'account' },
        { status: 500 }
      );
    }

    console.log(`🗑️ Account deleted successfully: ${verification.user.email}`);

    // Rimuovi cookie di sessione
    const response = NextResponse.json({
      message: 'Account cancellato con successo. Ci dispiace vederti andare via.',
      user: {
        first_name: verification.user.first_name,
        email: verification.user.email
      }
    });

    response.cookies.delete('session_token');

    return response;

  } catch (error) {
    console.error('Delete account confirmation error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}