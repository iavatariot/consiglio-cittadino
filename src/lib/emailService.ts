// Servizio per l'invio di email di verifica
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor(config?: EmailConfig) {
    // Se non è presente una configurazione, usa un transporter di test
    if (!config && !process.env.EMAIL_HOST) {
      // Per lo sviluppo locale, creiamo un account di test
      this.createTestTransporter();
    } else {
      this.transporter = nodemailer.createTransport({
        host: config?.host || process.env.EMAIL_HOST,
        port: config?.port || parseInt(process.env.EMAIL_PORT || '587'),
        secure: config?.secure || false,
        auth: {
          user: config?.auth.user || process.env.EMAIL_USER,
          pass: config?.auth.pass || process.env.EMAIL_PASS,
        },
      });
    }
  }

  private async createTestTransporter() {
    try {
      // Fallback: log email to console in development mode
      this.transporter = {
        sendMail: async (mailOptions: any) => {
          console.log('📧 EMAIL (Development Mode):', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html
          });
          return { messageId: 'dev-' + Date.now() };
        }
      } as any;
      console.log('📧 Using console email transport for development');
    } catch (error) {
      console.error('Error creating test email account:', error);
      // Same fallback
      this.transporter = {
        sendMail: async (mailOptions: any) => {
          console.log('📧 EMAIL (Development Mode):', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html
          });
          return { messageId: 'dev-' + Date.now() };
        }
      } as any;
    }
  }

  async sendVerificationEmail(email: string, token: string, name: string): Promise<boolean> {
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@consigliocittadino.it',
        to: email,
        subject: 'Verifica il tuo account - Consiglio Cittadino',
        text: `
Ciao ${name},

Grazie per esserti registrato a Consiglio Cittadino!

Per completare la registrazione e verificare il tuo account, clicca sul seguente link:
${verificationUrl}

Questo link è valido per 24 ore.

Se non hai richiesto questa registrazione, puoi ignorare questa email.

Grazie,
Il team di Consiglio Cittadino
        `.trim(),
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verifica Account</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏛️ Consiglio Cittadino</h1>
    </div>
    <div class="content">
        <h2>Ciao ${name}!</h2>
        <p>Grazie per esserti registrato a <strong>Consiglio Cittadino</strong>!</p>
        <p>Per completare la registrazione e verificare il tuo account, clicca sul pulsante qui sotto:</p>
        <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verifica Account</a>
        </p>
        <p><small>Oppure copia e incolla questo link nel tuo browser:<br>
        <code>${verificationUrl}</code></small></p>
        <p><strong>Importante:</strong> Questo link è valido per 24 ore.</p>
        <p>Se non hai richiesto questa registrazione, puoi ignorare questa email.</p>
    </div>
    <div class="footer">
        <p>© 2024 Consiglio Cittadino - Piattaforma di Democrazia Digitale</p>
    </div>
</body>
</html>
        `.trim()
      };

      const result = await this.transporter.sendMail(mailOptions);

      // Se stiamo usando l'account di test, stampa l'URL di preview
      if (result.messageId?.startsWith('dev-')) {
        console.log('📧 Email inviata (modalità sviluppo)');
      } else if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Email inviata! Preview URL:', nodemailer.getTestMessageUrl(result));
      }

      return true;
    } catch (error) {
      console.error('Errore invio email:', error);
      return false;
    }
  }

  async sendAccountDeletionEmail(email: string, token: string, name: string, reason?: string): Promise<boolean> {
    try {
      const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/delete-account?token=${token}`;

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@consigliocittadino.it',
        to: email,
        subject: '⚠️ Conferma cancellazione account - Consiglio Cittadino',
        text: `
Ciao ${name},

Hai richiesto la cancellazione del tuo account su Consiglio Cittadino.

${reason ? `Motivo indicato: ${reason}\n\n` : ''}ATTENZIONE: Questa azione è IRREVERSIBILE!

Se confermi, il tuo account verrà definitivamente cancellato con:
- Eliminazione di tutti i tuoi dati personali
- Cancellazione delle tue sessioni attive
- Perdita di eventuali abbonamenti attivi

Se vuoi procedere, clicca sul seguente link:
${confirmUrl}

Questo link è valido per 2 ore.

Se non hai richiesto la cancellazione del tuo account, ignora questa email o contatta immediatamente il nostro supporto.

Il team di Consiglio Cittadino
        `.trim(),
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Conferma Cancellazione Account</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #fef2f2; padding: 30px; border-radius: 0 0 8px 8px; border: 2px solid #fecaca; }
        .warning { background: #fee2e2; border: 2px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .reason { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚠️ Cancellazione Account</h1>
    </div>
    <div class="content">
        <h2>Ciao ${name}!</h2>
        <p>Hai richiesto la <strong>cancellazione definitiva</strong> del tuo account su Consiglio Cittadino.</p>

        ${reason ? `<div class="reason"><strong>Motivo indicato:</strong><br>${reason}</div>` : ''}

        <div class="warning">
            <h3>⚠️ ATTENZIONE: Questa azione è IRREVERSIBILE!</h3>
            <p>Se confermi, il tuo account verrà definitivamente cancellato con:</p>
            <ul>
                <li>Eliminazione di tutti i tuoi dati personali</li>
                <li>Cancellazione delle tue sessioni attive</li>
                <li>Perdita di eventuali abbonamenti attivi</li>
                <li>Impossibilità di recuperare l'account</li>
            </ul>
        </div>

        <p>Se sei sicuro di voler procedere, clicca sul pulsante qui sotto:</p>
        <p style="text-align: center;">
            <a href="${confirmUrl}" class="button">CONFERMA CANCELLAZIONE</a>
        </p>
        <p><small>Oppure copia e incolla questo link nel tuo browser:<br>
        <code>${confirmUrl}</code></small></p>
        <p><strong>Importante:</strong> Questo link è valido per 2 ore.</p>

        <div style="background: #dbeafe; border: 2px solid #93c5fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Hai cambiato idea?</strong><br>
            Se non hai richiesto questa cancellazione, ignora questa email o accedi al tuo account per annullare la richiesta.</p>
        </div>
    </div>
    <div class="footer">
        <p>© 2024 Consiglio Cittadino - Piattaforma di Democrazia Digitale</p>
    </div>
</body>
</html>
        `.trim()
      };

      const result = await this.transporter.sendMail(mailOptions);

      if (result.messageId?.startsWith('dev-')) {
        console.log('📧 Email cancellazione account inviata (modalità sviluppo)');
      } else if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Email cancellazione account inviata! Preview URL:', nodemailer.getTestMessageUrl(result));
      }

      return true;
    } catch (error) {
      console.error('Errore invio email cancellazione account:', error);
      return false;
    }
  }

  async sendSubscriptionReceiptEmail(
    email: string,
    name: string,
    subscriptionType: string,
    amount: string,
    stripeCustomerId: string,
    paymentDate: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@consigliocittadino.it',
        to: email,
        subject: '🎉 Benvenuto tra i Fondatori - Ricevuta Abbonamento',
        text: `
Ciao ${name},

🎉 Benvenuto tra i fondatori di Consiglio Cittadino!

Il tuo abbonamento è stato confermato con successo:
- Piano: ${subscriptionType}
- Importo: €${amount}
- Data pagamento: ${paymentDate}
- Cliente ID: ${stripeCustomerId}

🏆 HAI OTTENUTO IL BADGE FONDATORE!
Come riconoscimento per il tuo supporto iniziale, hai ricevuto il prestigioso badge FONDATORE che rimarrà per sempre sul tuo profilo.

Ora puoi accedere a:
- Tutte le funzionalità premium
- Supporto prioritario
- Badge fondatore permanente
- Accesso anticipato alle nuove funzionalità

Grazie per credere nel nostro progetto di democrazia digitale!

Il team di Consiglio Cittadino
        `.trim(),
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ricevuta Abbonamento - Badge Fondatore</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .founder-badge { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; padding: 12px 24px; border-radius: 50px; font-weight: bold; display: inline-block; margin: 10px 0; }
        .content { background: #fffbeb; padding: 30px; border-radius: 0 0 8px 8px; border: 2px solid #fbbf24; }
        .receipt-box { background: white; border: 2px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .amount { font-size: 24px; font-weight: bold; color: #059669; }
        .benefits { background: #f0f9ff; border: 2px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Benvenuto tra i Fondatori!</h1>
        <div class="founder-badge">🏆 BADGE FONDATORE OTTENUTO</div>
    </div>
    <div class="content">
        <h2>Ciao ${name}!</h2>
        <p>🎉 <strong>Congratulazioni!</strong> Il tuo abbonamento è stato confermato con successo e hai ottenuto il prestigioso <span class="highlight">Badge Fondatore</span>!</p>

        <div class="receipt-box">
            <h3>📋 Dettagli dell'abbonamento:</h3>
            <ul>
                <li><strong>Piano:</strong> ${subscriptionType}</li>
                <li><strong>Importo:</strong> <span class="amount">€${amount}</span></li>
                <li><strong>Data pagamento:</strong> ${paymentDate}</li>
                <li><strong>Cliente ID:</strong> ${stripeCustomerId}</li>
            </ul>
        </div>

        <div class="benefits">
            <h3>🚀 I tuoi benefici da Fondatore:</h3>
            <ul>
                <li>✅ <strong>Badge Fondatore permanente</strong> - Riconoscimento per sempre</li>
                <li>✅ <strong>Accesso a tutte le funzionalità premium</strong></li>
                <li>✅ <strong>Supporto prioritario</strong> dal nostro team</li>
                <li>✅ <strong>Accesso anticipato</strong> alle nuove funzionalità</li>
                <li>✅ <strong>Voce privilegiata</strong> nelle decisioni future</li>
            </ul>
        </div>

        <p><strong>Grazie per credere nel nostro progetto di democrazia digitale!</strong> Il tuo supporto ci aiuta a costruire una piattaforma migliore per tutti i cittadini.</p>

        <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accedi alla Dashboard</a>
        </p>
    </div>
    <div class="footer">
        <p>© 2024 Consiglio Cittadino - Piattaforma di Democrazia Digitale</p>
        <p>Questa è una ricevuta automatica. Conservala per i tuoi archivi.</p>
    </div>
</body>
</html>
        `.trim()
      };

      const result = await this.transporter.sendMail(mailOptions);

      if (result.messageId?.startsWith('dev-')) {
        console.log('📧 Email ricevuta abbonamento inviata (modalità sviluppo)');
      } else if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Email ricevuta abbonamento inviata! Preview URL:', nodemailer.getTestMessageUrl(result));
      }

      return true;
    } catch (error) {
      console.error('Errore invio email ricevuta abbonamento:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, token: string, name: string): Promise<boolean> {
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@consigliocittadino.it',
        to: email,
        subject: 'Ripristina la tua password - Consiglio Cittadino',
        text: `
Ciao ${name},

Hai richiesto il ripristino della tua password per Consiglio Cittadino.

Clicca sul seguente link per impostare una nuova password:
${resetUrl}

Questo link è valido per 1 ora.

Se non hai richiesto il ripristino della password, puoi ignorare questa email.

Grazie,
Il team di Consiglio Cittadino
        `.trim(),
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ripristina Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 Ripristina Password</h1>
    </div>
    <div class="content">
        <h2>Ciao ${name}!</h2>
        <p>Hai richiesto il ripristino della tua password per <strong>Consiglio Cittadino</strong>.</p>
        <p>Clicca sul pulsante qui sotto per impostare una nuova password:</p>
        <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Ripristina Password</a>
        </p>
        <p><small>Oppure copia e incolla questo link nel tuo browser:<br>
        <code>${resetUrl}</code></small></p>
        <p><strong>Importante:</strong> Questo link è valido per 1 ora.</p>
        <p>Se non hai richiesto il ripristino della password, puoi ignorare questa email.</p>
    </div>
    <div class="footer">
        <p>© 2024 Consiglio Cittadino - Piattaforma di Democrazia Digitale</p>
    </div>
</body>
</html>
        `.trim()
      };

      const result = await this.transporter.sendMail(mailOptions);

      if (result.messageId?.startsWith('dev-')) {
        console.log('📧 Email reset password inviata (modalità sviluppo)');
      } else if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Email reset password inviata! Preview URL:', nodemailer.getTestMessageUrl(result));
      }

      return true;
    } catch (error) {
      console.error('Errore invio email reset password:', error);
      return false;
    }
  }
}

// Token utilities
export function generateEmailVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Export singleton instance
export const emailService = new EmailService();
