import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database-sqlite';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { fiscalCode, paymentIntentId } = await req.json();

    if (!fiscalCode || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Codice fiscale e ID pagamento richiesti' },
        { status: 400 }
      );
    }

    // Genera token sicuro per il recupero
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ore

    // Trova l'utente e l'abbonamento
    const [userRows] = await pool.execute(
      'SELECT id, unique_code FROM users WHERE fiscal_code = ?',
      [fiscalCode]
    );

    if (!Array.isArray(userRows) || userRows.length === 0) {
      return NextResponse.json(
        { error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    const user = userRows[0] as any;

    // Verifica che l'utente abbia un pagamento con questo payment intent
    const [subscriptionRows] = await pool.execute(
      'SELECT id FROM subscriptions WHERE user_id = ? AND stripe_payment_intent_id = ? AND status = ?',
      [user.id, paymentIntentId, 'active']
    );

    if (!Array.isArray(subscriptionRows) || subscriptionRows.length === 0) {
      return NextResponse.json(
        { error: 'Pagamento non trovato o non valido' },
        { status: 404 }
      );
    }

    // Inserisci token di recupero nel database
    await pool.execute(
      `INSERT INTO recovery_tokens (user_id, token, payment_intent_id, expires_at)
       VALUES (?, ?, ?, ?)`,
      [user.id, recoveryToken, paymentIntentId, expirationTime.toISOString()]
    );

    return NextResponse.json({
      recoveryToken,
      expiresAt: expirationTime.toISOString(),
      message: 'Token di recupero generato con successo'
    });

  } catch (error) {
    console.error('Errore generazione token recupero:', error);
    return NextResponse.json(
      { error: 'Errore interno server' },
      { status: 500 }
    );
  }
}