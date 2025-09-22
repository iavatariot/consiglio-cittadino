// Rate limiter in-memory per protezione antispam
// In produzione, usa Redis o database persistente

interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  blocked: boolean;
  blockUntil?: number;
}

class InMemoryRateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup ogni 5 minuti
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      // Rimuovi entry più vecchie di 1 ora
      if (now - entry.lastAttempt > 60 * 60 * 1000) {
        this.storage.delete(key);
      }
    }
  }

  private getKey(ip: string, type: string): string {
    return `${type}:${ip}`;
  }

  // Rate limiting per registrazioni: max 3 tentativi per IP in 15 minuti
  checkRegistrationLimit(ip: string): { allowed: boolean; retryAfter?: number; message?: string } {
    const key = this.getKey(ip, 'register');
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry) {
      // Prima registrazione da questo IP
      this.storage.set(key, {
        attempts: 1,
        lastAttempt: now,
        blocked: false
      });
      return { allowed: true };
    }

    // Controlla se il blocco è ancora attivo
    if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
      const retryAfter = Math.ceil((entry.blockUntil - now) / 1000);
      return {
        allowed: false,
        retryAfter,
        message: `Troppi tentativi di registrazione. Riprova tra ${Math.ceil(retryAfter / 60)} minuti.`
      };
    }

    const timeDiff = now - entry.lastAttempt;
    const resetTime = 15 * 60 * 1000; // 15 minuti

    if (timeDiff > resetTime) {
      // Reset del contatore dopo 15 minuti
      entry.attempts = 1;
      entry.lastAttempt = now;
      entry.blocked = false;
      entry.blockUntil = undefined;
      return { allowed: true };
    }

    // Incrementa tentativi
    entry.attempts++;
    entry.lastAttempt = now;

    if (entry.attempts > 3) {
      // Blocca per 1 ora dopo 3 tentativi
      entry.blocked = true;
      entry.blockUntil = now + (60 * 60 * 1000); // 1 ora
      const retryAfter = 60 * 60; // 1 ora in secondi

      return {
        allowed: false,
        retryAfter,
        message: 'Troppi tentativi di registrazione. Account temporaneamente bloccato per 1 ora.'
      };
    }

    return { allowed: true };
  }

  // Rate limiting per login: max 5 tentativi per IP in 15 minuti
  checkLoginLimit(ip: string): { allowed: boolean; retryAfter?: number; message?: string } {
    const key = this.getKey(ip, 'login');
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry) {
      this.storage.set(key, {
        attempts: 1,
        lastAttempt: now,
        blocked: false
      });
      return { allowed: true };
    }

    if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
      const retryAfter = Math.ceil((entry.blockUntil - now) / 1000);
      return {
        allowed: false,
        retryAfter,
        message: `Troppi tentativi di login. Riprova tra ${Math.ceil(retryAfter / 60)} minuti.`
      };
    }

    const timeDiff = now - entry.lastAttempt;
    const resetTime = 15 * 60 * 1000; // 15 minuti

    if (timeDiff > resetTime) {
      entry.attempts = 1;
      entry.lastAttempt = now;
      entry.blocked = false;
      entry.blockUntil = undefined;
      return { allowed: true };
    }

    entry.attempts++;
    entry.lastAttempt = now;

    if (entry.attempts > 5) {
      entry.blocked = true;
      entry.blockUntil = now + (30 * 60 * 1000); // 30 minuti
      const retryAfter = 30 * 60;

      return {
        allowed: false,
        retryAfter,
        message: 'Troppi tentativi di login. Account temporaneamente bloccato per 30 minuti.'
      };
    }

    return { allowed: true };
  }

  // Rate limiting generico per API
  checkGenericLimit(ip: string, maxAttempts: number = 10, windowMs: number = 60000): { allowed: boolean; retryAfter?: number } {
    const key = this.getKey(ip, 'generic');
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry) {
      this.storage.set(key, {
        attempts: 1,
        lastAttempt: now,
        blocked: false
      });
      return { allowed: true };
    }

    const timeDiff = now - entry.lastAttempt;

    if (timeDiff > windowMs) {
      entry.attempts = 1;
      entry.lastAttempt = now;
      entry.blocked = false;
      return { allowed: true };
    }

    entry.attempts++;
    entry.lastAttempt = now;

    if (entry.attempts > maxAttempts) {
      const retryAfter = Math.ceil((windowMs - timeDiff) / 1000);
      return {
        allowed: false,
        retryAfter
      };
    }

    return { allowed: true };
  }

  // Reset manuale per IP specifico (per amministratori)
  resetIP(ip: string, type?: string) {
    if (type) {
      const key = this.getKey(ip, type);
      this.storage.delete(key);
    } else {
      // Reset tutti i tipi per questo IP
      const keysToDelete = Array.from(this.storage.keys()).filter(key => key.endsWith(`:${ip}`));
      keysToDelete.forEach(key => this.storage.delete(key));
    }
  }

  // Ottieni statistiche (per debugging/monitoraggio)
  getStats(): { totalEntries: number; blockedIPs: number } {
    const now = Date.now();
    let blockedIPs = 0;

    for (const entry of this.storage.values()) {
      if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
        blockedIPs++;
      }
    }

    return {
      totalEntries: this.storage.size,
      blockedIPs
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.storage.clear();
  }
}

// Singleton instance
export const rateLimiter = new InMemoryRateLimiter();

// Helper per estrarre IP dalla richiesta
export function getClientIP(request: Request): string {
  // Cerca in vari header per supportare proxy/CDN
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback per sviluppo locale
  return '127.0.0.1';
}