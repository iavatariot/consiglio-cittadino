import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';
import { pool } from '../../../../lib/database';
import { verifySession } from '../../../../lib/auth';

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

    const { planType } = await request.json();

    if (!planType || !['monthly', 'yearly'].includes(planType)) {
      return NextResponse.json(
        { error: 'Tipo di piano non valido' },
        { status: 400 }
      );
    }

    // Check if user already has an active subscription
    const [existingSubscriptions] = await pool.execute(
      'SELECT * FROM subscriptions WHERE user_id = ? AND status = ?',
      [user.id, 'active']
    );

    if ((existingSubscriptions as any[]).length > 0) {
      return NextResponse.json(
        { error: 'Hai già un abbonamento attivo' },
        { status: 409 }
      );
    }

    // Define pricing
    const pricing = {
      monthly: {
        amount: 500, // €5.00 in cents
        intervalDescription: '€5/mese'
      },
      yearly: {
        amount: 5000, // €50.00 in cents
        intervalDescription: '€50/anno'
      }
    };

    const plan = pricing[planType];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: plan.amount,
            product_data: {
              name: planType === 'monthly' ? 'Contributore Mensile' : 'Contributore Fondatore',
              description: `Abbonamento ${plan.intervalDescription} per sostenere lo sviluppo di Consiglio Cittadino`
            },
            recurring: {
              interval: planType === 'monthly' ? 'month' : 'year'
            }
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/abbonamenti?canceled=true`,
      customer_email: user.email,
      metadata: {
        user_id: user.id.toString(),
        plan_type: planType,
        user_email: user.email,
        user_name: `${user.first_name} ${user.last_name}`
      },
    });

    // Create pending subscription record
    await pool.execute(
      `INSERT INTO subscriptions (
        user_id, product_type, amount, currency, status, created_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [user.id, planType, plan.amount / 100, 'EUR', 'pending']
    );

    return NextResponse.json({
      sessionId: session.id,
      message: 'Sessione di pagamento creata con successo'
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}