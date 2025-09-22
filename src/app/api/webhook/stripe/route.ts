import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../../lib/stripe';
import { pool } from '../../../../../lib/database';
import { setUserAsFounder, removeFounderStatus } from '../../../../../lib/auth';
import { emailService } from '../../../../../lib/emailService';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Manca signature Stripe' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Signature non valida' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Evento non gestito: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Errore webhook:', error);
    return NextResponse.json(
      { error: 'Errore processamento webhook' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const planType = session.metadata?.plan_type;

  if (!userId || !planType) {
    console.error('Metadata mancanti nella sessione:', session.id);
    return;
  }

  // Calcola data di fine abbonamento per SQLite
  const endDateInterval = planType === 'monthly' ? '+1 month' : '+1 year';

  // Aggiorna abbonamento a 'active'
  await pool.execute(
    `UPDATE subscriptions
     SET stripe_subscription_id = ?,
         stripe_customer_id = ?,
         stripe_payment_intent_id = ?,
         status = 'active',
         subscription_start = date('now'),
         subscription_end = date('now', ?)
     WHERE user_id = ? AND status = 'pending'`,
    [session.subscription, session.customer, session.payment_intent, endDateInterval, userId]
  );

  // Assegna badge fondatore all'utente
  try {
    await setUserAsFounder(parseInt(userId));
    console.log(`Badge fondatore assegnato all'utente ${userId}`);
  } catch (error) {
    console.error(`Errore assegnazione badge fondatore per utente ${userId}:`, error);
  }

  // Ottieni informazioni utente per l'email
  try {
    const [userRows] = await pool.execute(
      'SELECT email, first_name, last_name FROM users WHERE id = ?',
      [userId]
    );

    const user = (userRows as any[])[0];
    if (user) {
      // Formatta l'importo
      const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00';
      const subscriptionTypeLabel = planType === 'monthly' ? 'Mensile' : 'Annuale';

      // Invia email ricevuta
      const emailSent = await emailService.sendSubscriptionReceiptEmail(
        user.email,
        user.first_name,
        subscriptionTypeLabel,
        `€${amount}`,
        session.customer as string,
        new Date().toLocaleDateString('it-IT')
      );

      if (emailSent) {
        console.log(`Email ricevuta inviata a ${user.email}`);
      } else {
        console.error(`Errore invio email ricevuta a ${user.email}`);
      }
    }
  } catch (error) {
    console.error(`Errore invio email ricevuta per utente ${userId}:`, error);
  }

  console.log(`Abbonamento attivato per utente ${userId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if ((invoice as any).subscription) {
    // Rinnovo abbonamento
    const subscriptionId = (invoice as any).subscription as string;

    await pool.execute(
      'UPDATE subscriptions SET status = ? WHERE stripe_subscription_id = ?',
      ['active', subscriptionId]
    );

    console.log(`Abbonamento rinnovato: ${subscriptionId}`);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const status = subscription.status === 'active' ? 'active' :
                subscription.status === 'canceled' ? 'canceled' : 'pending';

  await pool.execute(
    'UPDATE subscriptions SET status = ? WHERE stripe_subscription_id = ?',
    [status, subscription.id]
  );

  // Se l'abbonamento è stato cancellato, rimuovi il badge fondatore
  if (status === 'canceled') {
    try {
      const [subscriptionRows] = await pool.execute(
        'SELECT user_id FROM subscriptions WHERE stripe_subscription_id = ?',
        [subscription.id]
      );

      const subscriptionData = (subscriptionRows as any[])[0];
      if (subscriptionData) {
        await removeFounderStatus(subscriptionData.user_id);
        console.log(`Badge fondatore rimosso per utente ${subscriptionData.user_id}`);
      }
    } catch (error) {
      console.error(`Errore rimozione badge fondatore:`, error);
    }
  }

  console.log(`Abbonamento aggiornato: ${subscription.id} -> ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await pool.execute(
    'UPDATE subscriptions SET status = ? WHERE stripe_subscription_id = ?',
    ['canceled', subscription.id]
  );

  // Rimuovi badge fondatore quando l'abbonamento viene eliminato
  try {
    const [subscriptionRows] = await pool.execute(
      'SELECT user_id FROM subscriptions WHERE stripe_subscription_id = ?',
      [subscription.id]
    );

    const subscriptionData = (subscriptionRows as any[])[0];
    if (subscriptionData) {
      await removeFounderStatus(subscriptionData.user_id);
      console.log(`Badge fondatore rimosso per utente ${subscriptionData.user_id} - abbonamento eliminato`);
    }
  } catch (error) {
    console.error(`Errore rimozione badge fondatore:`, error);
  }

  console.log(`Abbonamento cancellato: ${subscription.id}`);
}