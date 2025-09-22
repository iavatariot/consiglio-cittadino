import { NextResponse } from 'next/server';
import { pool } from '../../../../../lib/database';
import { stripe } from '../../../../../lib/stripe';

// Funzione per recuperare dati reali da Stripe
async function getStripeData() {
  try {
    // Recupera tutte le subscription attive da Stripe
    const subscriptions = await stripe.subscriptions.list({
      status: 'active',
      limit: 100, // Stripe default, possiamo aumentare se necessario
      expand: ['data.items.data.price']
    });

    let totalRevenue = 0;
    let activeSubscriptionsCount = subscriptions.data.length;

    // Calcola il totale delle entrate
    for (const subscription of subscriptions.data) {
      for (const item of subscription.items.data) {
        if (item.price && item.price.unit_amount) {
          // Stripe restituisce importi in centesimi
          const amount = item.price.unit_amount / 100;

          // Per abbonamenti mensili, moltiplica per i mesi attivi
          // Per abbonamenti annuali, prendi l'importo totale
          if (item.price.recurring?.interval === 'month') {
            // Calcola quanti mesi sono passati dalla creazione
            const monthsActive = Math.max(1, Math.floor((Date.now() - subscription.created * 1000) / (30 * 24 * 60 * 60 * 1000)));
            totalRevenue += amount * monthsActive;
          } else {
            // Abbonamento annuale
            totalRevenue += amount;
          }
        }
      }
    }

    return {
      activeSubscriptions: activeSubscriptionsCount,
      totalRevenue: Math.round(totalRevenue * 100) / 100 // Arrotonda a 2 decimali
    };

  } catch (error) {
    console.error('Errore nel recupero dati da Stripe:', error);
    return {
      activeSubscriptions: 0,
      totalRevenue: 0
    };
  }
}

export async function GET() {
  try {
    // Recupera dati reali da Stripe
    const stripeData = await getStripeData();

    // Dati fissi di base
    const baseSupporters = 64;
    const baseRevenue = 100000; // €100,000 come base fissa

    // Calcola totali combinati
    const totalSupporters = baseSupporters + stripeData.activeSubscriptions;
    const totalRevenue = baseRevenue + stripeData.totalRevenue;

    // Calcola la percentuale per l'obiettivo di €100k
    const targetAmount = 100000;
    const progressPercentage = Math.min(100, Math.round((totalRevenue / targetAmount) * 100));

    return NextResponse.json({
      // Dati per la compatibilità esistente
      activeSubscriptions: stripeData.activeSubscriptions,
      baseSupporters: baseSupporters,
      totalSupporters: totalSupporters,

      // Nuovi dati finanziari
      stripeRevenue: stripeData.totalRevenue,
      baseRevenue: baseRevenue,
      totalRevenue: totalRevenue,

      // Dati per la progress bar
      progressPercentage: progressPercentage,
      targetAmount: targetAmount,

      // Statistiche dettagliate
      stats: {
        supporters: {
          base: baseSupporters,
          stripe: stripeData.activeSubscriptions,
          total: totalSupporters
        },
        revenue: {
          base: baseRevenue,
          stripe: stripeData.totalRevenue,
          total: totalRevenue,
          formatted: {
            base: `€${baseRevenue.toLocaleString('it-IT')}`,
            stripe: `€${stripeData.totalRevenue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            total: `€${totalRevenue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          }
        }
      }
    });

  } catch (error) {
    console.error('Errore nel recupero statistiche:', error);
    return NextResponse.json(
      { error: 'Errore interno server' },
      { status: 500 }
    );
  }
}