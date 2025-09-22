import { pool } from './database';

export function generateUniqueCode(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // Esclude O, 0 per evitare confusione
  let code = '';

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `CC-${year}-${code}`;
}

export async function ensureUniqueCode(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    const code = generateUniqueCode();

    try {
      // Verifica se il codice esiste già
      const [rows] = await pool.execute(
        'SELECT unique_code FROM users WHERE unique_code = ? UNION SELECT unique_code FROM generated_codes WHERE unique_code = ?',
        [code, code]
      );

      if ((rows as any[]).length === 0) {
        // Codice unico, lo salva nella tabella di tracking
        await pool.execute(
          'INSERT INTO generated_codes (unique_code) VALUES (?)',
          [code]
        );
        return code;
      }
    } catch (error) {
      console.error('Errore nella generazione codice:', error);
    }

    attempts++;
  }

  throw new Error('Impossibile generare un codice univoco dopo 50 tentativi');
}

export async function getUserByFiscalCode(fiscalCode: string) {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE fiscal_code = ?',
    [fiscalCode.toUpperCase()]
  );

  return (rows as any[])[0] || null;
}

export async function getActiveSubscriptionsCount(userId: string): Promise<number> {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM subscriptions WHERE user_id = ? AND status = "active"',
    [userId]
  );

  return (rows as any[])[0].count || 0;
}