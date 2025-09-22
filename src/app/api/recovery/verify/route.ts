import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database-sqlite';

export async function POST(req: NextRequest) {
  try {
    const { recoveryToken, fiscalCode } = await req.json();

    if (!recoveryToken || !fiscalCode) {
      return NextResponse.json(
        { error: 'Token e codice fiscale richiesti' },
        { status: 400 }
      );
    }

    // Trova il token di recupero valido
    const [tokenRows] = await pool.execute(
      `SELECT rt.user_id, rt.expires_at, u.unique_code, u.fiscal_code,
              COUNT(s.id) as active_subscriptions
       FROM recovery_tokens rt
       JOIN users u ON rt.user_id = u.id
       LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
       WHERE rt.token = ? AND u.fiscal_code = ?
       GROUP BY rt.user_id, rt.expires_at, u.unique_code, u.fiscal_code`,
      [recoveryToken, fiscalCode]
    );

    if (!Array.isArray(tokenRows) || tokenRows.length === 0) {
      return NextResponse.json(
        { error: 'Token di recupero non valido o scaduto' },
        { status: 404 }
      );
    }

    const tokenData = tokenRows[0] as any;

    // Controlla se il token è scaduto
    const now = new Date();
    const expirationDate = new Date(tokenData.expires_at);

    if (now > expirationDate) {
      // Elimina il token scaduto
      await pool.execute(
        'DELETE FROM recovery_tokens WHERE token = ?',
        [recoveryToken]
      );

      return NextResponse.json(
        { error: 'Token di recupero scaduto' },
        { status: 410 }
      );
    }

    // Elimina il token usato (single use)
    await pool.execute(
      'DELETE FROM recovery_tokens WHERE token = ?',
      [recoveryToken]
    );

    return NextResponse.json({
      uniqueCode: tokenData.unique_code,
      subscriptionsCount: tokenData.active_subscriptions,
      message: 'Codice recuperato con successo'
    });

  } catch (error) {
    console.error('Errore verifica token recupero:', error);
    return NextResponse.json(
      { error: 'Errore interno server' },
      { status: 500 }
    );
  }
}