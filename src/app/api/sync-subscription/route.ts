import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../lib/database';
import { verifySession, setUserAsFounder } from '../../../../lib/auth';
import { stripe } from '../../../../lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Verify user session
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Autenticazione richiesta' },
        { status: 401 }
      );
    }

    console.log(`Sincronizzazione abbonamento per utente ${user.id} (${user.email})`);

    // Step 1: Get user's current subscriptions from database
    const [localSubs] = await pool.execute(
      'SELECT * FROM subscriptions WHERE user_id = ?',
      [user.id]
    );

    console.log(`Abbonamenti locali trovati: ${(localSubs as any[]).length}`);

    // Step 2: Get subscriptions from Stripe using email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 5
    });

    console.log(`Clienti Stripe trovati: ${customers.data.length}`);

    let hasActiveStripeSubscription = false;

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 10
      });

      console.log(`Abbonamenti attivi Stripe per cliente ${customer.id}: ${subscriptions.data.length}`);

      if (subscriptions.data.length > 0) {
        hasActiveStripeSubscription = true;

        // Sync each subscription to local database
        for (const subscription of subscriptions.data) {
          const priceId = subscription.items.data[0]?.price?.id;
          const amount = subscription.items.data[0]?.price?.unit_amount || 0;
          const currency = subscription.items.data[0]?.price?.currency || 'eur';
          const interval = subscription.items.data[0]?.price?.recurring?.interval || 'month';

          console.log(`Sincronizzando abbonamento ${subscription.id}: ${amount/100} ${currency}/${interval}`);

          // Insert or update subscription in local database
          await pool.execute(
            `INSERT OR REPLACE INTO subscriptions
             (user_id, stripe_subscription_id, stripe_customer_id, product_type, amount, currency, status, subscription_start, subscription_end, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
              user.id,
              subscription.id,
              customer.id,
              interval === 'year' ? 'yearly' : 'monthly',
              amount,
              currency,
              'active',
              new Date((subscription as any).current_period_start * 1000).toISOString(),
              new Date((subscription as any).current_period_end * 1000).toISOString()
            ]
          );
        }
      }
    }

    // Step 3: If we found active subscriptions, assign founder badge
    if (hasActiveStripeSubscription) {
      await setUserAsFounder(user.id);
      console.log(`Badge fondatore assegnato all'utente ${user.id}`);
    }

    // Step 4: Get updated subscription count
    const [updatedSubs] = await pool.execute(
      'SELECT COUNT(*) as count FROM subscriptions WHERE user_id = ? AND status = "active"',
      [user.id]
    );

    const activeCount = (updatedSubs as any[])[0].count;

    console.log(`Sincronizzazione completata. Abbonamenti attivi: ${activeCount}`);

    return NextResponse.json({
      success: true,
      hasActiveSubscription: hasActiveStripeSubscription,
      activeSubscriptions: activeCount,
      message: hasActiveStripeSubscription
        ? 'Abbonamento sincronizzato e badge fondatore assegnato'
        : 'Nessun abbonamento attivo trovato su Stripe'
    });

  } catch (error) {
    console.error('Errore sincronizzazione abbonamento:', error);
    return NextResponse.json(
      {
        error: 'Errore interno del server',
        details: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}