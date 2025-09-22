import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    // Recupera tutte le subscription attive da Stripe
    const subscriptions = await stripe.subscriptions.list({
      status: 'active',
      limit: 100,
      expand: ['data.items.data.price']
    });

    let yearlySubscriptions = 0;
    let monthlySubscriptions = 0;

    // Conta le subscription per tipo
    for (const subscription of subscriptions.data) {
      for (const item of subscription.items.data) {
        if (item.price && item.price.recurring) {
          if (item.price.recurring.interval === 'year') {
            yearlySubscriptions++;
          } else if (item.price.recurring.interval === 'month') {
            monthlySubscriptions++;
          }
        }
      }
    }

    // Aggiungi 64 abbonamenti annuali fissi
    const totalYearly = yearlySubscriptions + 64;
    const totalMonthly = monthlySubscriptions;
    const totalSubscriptions = totalYearly + totalMonthly;

    // Calcola percentuali
    const yearlyPercentage = totalSubscriptions > 0 ? (totalYearly / totalSubscriptions) * 100 : 0;
    const monthlyPercentage = totalSubscriptions > 0 ? (totalMonthly / totalSubscriptions) * 100 : 0;

    return NextResponse.json({
      yearly: {
        count: totalYearly,
        stripe: yearlySubscriptions,
        fixed: 64,
        percentage: yearlyPercentage
      },
      monthly: {
        count: totalMonthly,
        stripe: monthlySubscriptions,
        fixed: 0,
        percentage: monthlyPercentage
      },
      total: totalSubscriptions,
      breakdown: {
        yearlyPercentage: Math.round(yearlyPercentage * 10) / 10,
        monthlyPercentage: Math.round(monthlyPercentage * 10) / 10
      }
    });

  } catch (error) {
    console.error('Errore nel recupero tipi abbonamenti:', error);
    return NextResponse.json(
      { error: 'Errore interno server' },
      { status: 500 }
    );
  }
}