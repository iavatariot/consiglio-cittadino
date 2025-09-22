import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '../../../../../lib/rateLimiter';

export async function GET(request: NextRequest) {
  try {
    // In un'applicazione reale, dovresti aggiungere autenticazione admin qui
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const stats = rateLimiter.getStats();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      rateLimiter: stats,
      info: {
        message: 'Sistema antispam attivo',
        protections: [
          'Rate limiting (3 registrazioni/15min per IP)',
          'Honeypot per bot detection',
          'Spam content detection',
          'Header analysis',
          'Email domain filtering',
          'Name pattern analysis'
        ]
      }
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}