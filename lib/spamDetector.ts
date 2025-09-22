// Sistema di rilevamento spam avanzato

interface SpamCheckResult {
  isSpam: boolean;
  score: number;
  reasons: string[];
}

export class SpamDetector {
  // Lista di domini email temporanei/sospetti più comuni
  private suspiciousEmailDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'tempmail.org',
    'throwaway.email',
    'temp-mail.org',
    'yopmail.com',
    '0-mail.com',
    '33mail.com',
    'maildrop.cc',
    'getnada.com',
    'sharklasers.com'
  ];

  // Parole comuni nello spam
  private spamKeywords = [
    'bitcoin', 'crypto', 'investment', 'money', 'earn', 'profit', 'rich',
    'free', 'win', 'winner', 'congratulations', 'click', 'urgent',
    'viagra', 'casino', 'loan', 'mortgage', 'insurance', 'pharmacy'
  ];

  // Pattern sospetti nei nomi
  private suspiciousNamePatterns = [
    /^[a-z]+[0-9]+$/i,     // nome seguito da numeri (es: john123)
    /^[a-z]{1,3}[0-9]+$/i, // poche lettere + numeri (es: ab123)
    /^(test|user|admin)/i,  // nomi generici
    /[0-9]{3,}/,           // molti numeri consecutivi
    /^[a-z]$/i             // singola lettera
  ];

  checkRegistrationSpam(data: {
    email: string;
    first_name: string;
    last_name: string;
    fiscal_code?: string;
  }): SpamCheckResult {
    let score = 0;
    const reasons: string[] = [];

    // 1. Controllo dominio email
    const emailDomain = data.email.split('@')[1]?.toLowerCase();
    if (emailDomain && this.suspiciousEmailDomains.includes(emailDomain)) {
      score += 30;
      reasons.push('Email temporanea/sospetta');
    }

    // 2. Controllo pattern email
    if (this.hasSuspiciousEmailPattern(data.email)) {
      score += 20;
      reasons.push('Pattern email sospetto');
    }

    // 3. Controllo nomi
    if (this.hasSuspiciousName(data.first_name)) {
      score += 25;
      reasons.push('Nome sospetto');
    }

    if (this.hasSuspiciousName(data.last_name)) {
      score += 25;
      reasons.push('Cognome sospetto');
    }

    // 4. Controllo nomi identici
    if (data.first_name.toLowerCase() === data.last_name.toLowerCase()) {
      score += 15;
      reasons.push('Nome e cognome identici');
    }

    // 5. Controllo lunghezza nomi
    if (data.first_name.length < 2 || data.last_name.length < 2) {
      score += 20;
      reasons.push('Nomi troppo corti');
    }

    // 6. Controllo caratteri speciali nei nomi
    if (this.hasSpecialCharsInName(data.first_name) || this.hasSpecialCharsInName(data.last_name)) {
      score += 15;
      reasons.push('Caratteri speciali nei nomi');
    }

    // 7. Controllo codice fiscale se presente
    if (data.fiscal_code && !this.isValidItalianFiscalCode(data.fiscal_code)) {
      score += 10;
      reasons.push('Codice fiscale non valido');
    }

    // 8. Controllo se email e nomi contengono spam keywords
    const allText = `${data.email} ${data.first_name} ${data.last_name}`.toLowerCase();
    const foundSpamWords = this.spamKeywords.filter(keyword => allText.includes(keyword));
    if (foundSpamWords.length > 0) {
      score += foundSpamWords.length * 10;
      reasons.push(`Parole spam: ${foundSpamWords.join(', ')}`);
    }

    return {
      isSpam: score >= 50, // Soglia configurabile
      score,
      reasons
    };
  }

  private hasSuspiciousEmailPattern(email: string): boolean {
    const localPart = email.split('@')[0];

    // Pattern sospetti nella parte locale dell'email
    return (
      /^[a-z]+[0-9]{3,}$/.test(localPart) ||    // molti numeri alla fine
      /^[0-9]{5,}/.test(localPart) ||           // inizia con molti numeri
      localPart.length < 3 ||                   // troppo corta
      localPart.length > 50 ||                  // troppo lunga
      (localPart.match(/[0-9]/g) || []).length > localPart.length * 0.7 // troppi numeri
    );
  }

  private hasSuspiciousName(name: string): boolean {
    return this.suspiciousNamePatterns.some(pattern => pattern.test(name));
  }

  private hasSpecialCharsInName(name: string): boolean {
    // Permetti solo lettere, spazi, apostrofi, trattini
    return !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name);
  }

  private isValidItalianFiscalCode(fiscalCode: string): boolean {
    // Controllo base formato codice fiscale italiano
    const fiscalCodePattern = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
    return fiscalCodePattern.test(fiscalCode.toUpperCase());
  }

  // Controllo velocità di registrazione (troppo veloce = bot)
  checkRegistrationSpeed(startTime: number): { tooFast: boolean; timeSpent: number } {
    const timeSpent = Date.now() - startTime;
    const minTimeExpected = 10000; // 10 secondi minimo per compilare form

    return {
      tooFast: timeSpent < minTimeExpected,
      timeSpent
    };
  }

  // Controllo per rilevare pattern bot nelle request
  checkRequestHeaders(headers: Headers): { suspicious: boolean; reasons: string[] } {
    const reasons: string[] = [];

    const userAgent = headers.get('user-agent') || '';
    const acceptLanguage = headers.get('accept-language') || '';
    const accept = headers.get('accept') || '';

    // User-Agent sospetti
    if (!userAgent || userAgent.length < 20) {
      reasons.push('User-Agent mancante o troppo corto');
    }

    if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent.includes('spider')) {
      reasons.push('User-Agent contiene parole bot');
    }

    // Accept-Language mancante (browser normali lo inviano sempre)
    if (!acceptLanguage) {
      reasons.push('Accept-Language mancante');
    }

    // Accept header sospetto
    if (!accept || (!accept.includes('text/html') && !accept.includes('application/json'))) {
      reasons.push('Accept header sospetto');
    }

    return {
      suspicious: reasons.length > 0,
      reasons
    };
  }
}

export const spamDetector = new SpamDetector();