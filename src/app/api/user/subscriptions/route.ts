import { NextRequest, NextResponse } from 'next/server';
import { verifySession, setUserAsFounder } from '../../../../../lib/auth';
import { stripe } from '../../../../../lib/stripe';

export async function GET(request: NextRequest) {
  try {
    // Verify user session
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Autenticazione richiesta' },
        { status: 401 }
      );
    }

    console.log(`Controllo abbonamenti per utente: ${user.email}`);

    // Check directly on Stripe for active subscriptions
    let hasActiveSubscription = false;
    let activeSubscriptions = [];
    let stripeCustomers = [];

    try {
      // Find customer on Stripe using email
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 5
      });

      console.log(`Trovati ${customers.data.length} clienti Stripe per ${user.email}`);

      for (const customer of customers.data) {
        stripeCustomers.push(customer);

        // Get active subscriptions for this customer
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'active',
          limit: 10
        });

        console.log(`Cliente ${customer.id}: ${subscriptions.data.length} abbonamenti attivi`);

        if (subscriptions.data.length > 0) {
          hasActiveSubscription = true;

          // Process each subscription
          for (const subscription of subscriptions.data) {
            const priceId = subscription.items.data[0]?.price?.id;
            const amount = subscription.items.data[0]?.price?.unit_amount || 0;
            const currency = subscription.items.data[0]?.price?.currency || 'eur';
            const interval = subscription.items.data[0]?.price?.recurring?.interval || 'month';

            activeSubscriptions.push({
              id: subscription.id,
              customer_id: customer.id,
              status: subscription.status,
              amount: amount,
              currency: currency,
              interval: interval,
              current_period_start: new Date((subscription as any).current_period_start * 1000),
              current_period_end: new Date((subscription as any).current_period_end * 1000),
              created: new Date((subscription as any).created * 1000)
            });

            console.log(`Abbonamento trovato: ${subscription.id} - ${amount/100} ${currency}/${interval}`);
          }
        }
      }

      // If user has active subscriptions, assign founder badge
      if (hasActiveSubscription) {
        await setUserAsFounder(user.id);
        console.log(`Badge fondatore assegnato all'utente ${user.id}`);
      }

    } catch (stripeError) {
      console.error('Errore controllo Stripe:', stripeError);
      // Don't fail the whole request if Stripe fails
    }

    console.log(`Risultato finale: hasActiveSubscription = ${hasActiveSubscription}`);

    return NextResponse.json({
      hasActiveSubscription,
      subscriptions: activeSubscriptions,
      count: {
        total: activeSubscriptions.length,
        active: activeSubscriptions.length,
        pending: 0,
        canceled: 0
      },
      stripeCustomers: stripeCustomers.map(c => ({ id: c.id, email: c.email }))
    });

  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}