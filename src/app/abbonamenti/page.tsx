'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Check, CreditCard, Shield, RefreshCw, TrendingUp,
  Users, Target, AlertCircle,
  Heart, ChevronRight, User, LogIn
} from 'lucide-react';
import { useLiveCounters } from '@/hooks/useLiveCounters';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Abbonamenti() {
  const { subscribers, totalRaised } = useLiveCounters();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [userSubscriptions, setUserSubscriptions] = useState<any[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [subscriptionTypes, setSubscriptionTypes] = useState<any>(null);

  // Fetch user's subscription status if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserSubscriptions();
    }
  }, [isAuthenticated, user]);

  // Fetch subscription types data
  useEffect(() => {
    fetchSubscriptionTypes();
  }, []);

  const fetchSubscriptionTypes = async () => {
    try {
      const response = await fetch('/api/stats/subscription-types');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionTypes(data);
      }
    } catch (error) {
      console.error('Error fetching subscription types:', error);
    }
  };

  const fetchUserSubscriptions = async () => {
    try {
      const response = await fetch('/api/user/subscriptions', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handlePlanSelect = (planType: 'monthly' | 'yearly') => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setSelectedPlan(planType);
    handleSubscribe(planType);
  };

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    if (!isAuthenticated || !user) {
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);
    setSelectedPlan(planType);

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore nella creazione dell\'abbonamento');
      }

      // Reindirizza a Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error('Errore Stripe:', error);
          alert('Errore nel reindirizzamento al pagamento');
        }
      }

    } catch (error) {
      console.error('Errore:', error);
      alert(error instanceof Error ? error.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  // Calcolo basato sui dati reali dei sostenitori (inclusi quelli da Stripe)
  const currentSupporters = subscribers;
  // Calcolo percentuale: 3,2% fisso + percentuale dei contributi Stripe rispetto all'obiettivo €100k
  const targetAmount = 100000; // €100,000 obiettivo MVP
  const stripeAmount = totalRaised - 100000; // Solo la parte Stripe (totalRaised include base + Stripe)
  const stripePercentage = (stripeAmount / targetAmount) * 100; // Percentuale Stripe rispetto all'obiettivo
  const progressPercentage = Math.min(3.2 + stripePercentage, 100); // 3,2% fisso + % Stripe

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Sostieni la Democrazia Digitale
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Il tuo contributo è fondamentale per sviluppare una piattaforma che darà
            voce ai cittadini e trasformerà la partecipazione democratica in Italia
          </p>

          {/* Roadmap Progress */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2">{currentSupporters}</div>
              <div className="text-blue-200 text-lg">Sostenitori Attivi</div>
            </div>

            {/* Roadmap Steps */}
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                <div className="text-green-300 text-2xl font-bold mb-1">€100.000</div>
                <div className="text-green-200 text-sm font-medium mb-2">MVP Funzionale</div>
                <div className="text-green-300 text-xs">✓ In Corso</div>
              </div>

              <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                <div className="text-blue-200 text-2xl font-bold mb-1">€500.000</div>
                <div className="text-blue-200 text-sm font-medium mb-2">Sistema Completo</div>
                <div className="text-blue-300 text-xs">Prossimo Obiettivo</div>
              </div>

              <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
                <div className="text-purple-200 text-2xl font-bold mb-1">€1.000.000</div>
                <div className="text-purple-200 text-sm font-medium mb-2">Espansione Nazionale</div>
                <div className="text-purple-300 text-xs">Futuro</div>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
                <div className="text-yellow-200 text-2xl font-bold mb-1">€2.000.000</div>
                <div className="text-yellow-200 text-sm font-medium mb-2">Integrazione Istituzionale</div>
                <div className="text-yellow-300 text-xs">Obiettivo Finale</div>
              </div>
            </div>
          </div>

          {/* Progress Bar - MVP Phase */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-200">Progresso MVP Funzionale (€{(3200 + stripeAmount).toLocaleString('it-IT')}/€100.000 raccolti)</span>
              <span className="text-white font-semibold">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${Math.max(progressPercentage, 5)}%` }}
              >
                {progressPercentage > 10 && (
                  <span className="text-white text-xs font-bold">MVP</span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-xs text-blue-300 mt-1">
              <span>Inizio</span>
              <span>€100k - MVP Pronto</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Subscription Types Stats */}
        {subscriptionTypes && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {/* Yearly Subscriptions */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Abbonamenti Annuali</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {subscriptionTypes.breakdown.yearlyPercentage}%
                </div>
                <p className="text-blue-700 text-sm">
                  {subscriptionTypes.yearly.count} contributori annuali
                </p>
              </div>
            </div>

            {/* Monthly Subscriptions */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Abbonamenti Mensili</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {subscriptionTypes.breakdown.monthlyPercentage}%
                </div>
                <p className="text-green-700 text-sm">
                  {subscriptionTypes.monthly.count} contributori mensili
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Finanzia lo Sviluppo della Piattaforma
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Contribuisci alla costruzione dell'infrastruttura per la democrazia digitale italiana
          </p>
        </div>


        {/* Authentication Status */}
        {!isLoading && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {isAuthenticated ? (
                    <User className="w-6 h-6 text-blue-600" />
                  ) : (
                    <LogIn className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </div>
              <div className="text-left">
                {isAuthenticated ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Ciao, {user?.first_name}! 👋
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Grazie per far parte della community di Consiglio Cittadino. Con il tuo abbonamento riceverai:
                    </p>
                    <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                      <li>Badge "Fondatore" permanente sul tuo profilo</li>
                      <li>Accesso prioritario a funzionalità beta</li>
                      <li>Influenza diretta sulle decisioni di sviluppo</li>
                      <li>Aggiornamenti esclusivi sui progressi</li>
                    </ul>
                    {userSubscriptions.some(sub => sub.status === 'active') && (
                      <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-green-800 text-sm font-medium">
                          🎉 Hai già un abbonamento attivo! Sei un vero fondatore.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Accedi per Abbonarti
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Per sostenere il progetto e ricevere il badge fondatore, devi prima creare un account o accedere:
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Link
                        href="/auth/login?redirect=/abbonamenti"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Accedi
                      </Link>
                      <Link
                        href="/auth/register?redirect=/abbonamenti"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Registrati
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 max-w-4xl mx-auto mb-16 md:grid-cols-2">
          {/* Yearly Plan - Recommended */}
          <div className="relative bg-white rounded-2xl shadow-lg border-2 border-blue-500 p-8">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                🏆 Raccomandato
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Contributore Fondatore</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                €50
                <span className="text-lg text-gray-500 font-normal">/anno</span>
              </div>
              <p className="text-gray-600">Investimento nello sviluppo (€4.17/mese)</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm font-medium mb-2">
                💡 <strong>Importante:</strong> Stai finanziando la creazione dell'app
              </p>
              <p className="text-blue-700 text-sm">
                Il tuo contributo serve a sviluppare la piattaforma. Stai dimostrando di credere nel progetto
                e questo ti darà accesso immediato a sondaggi, aggiornamenti di sviluppo e decisioni sulla roadmap.
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Badge "Fondatore" visibile e codice univoco personale',
                'Accesso immediato a sondaggi sulle decisioni dell\'app',
                'Pagina News e Sondaggi dedicata ai contributori',
                'Influenza diretta sulla roadmap di sviluppo',
                'Report mensili dettagliati sui progressi tecnici',
                'Garanzia rimborso totale entro 60 giorni'
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanSelect('yearly')}
              disabled={loading || (isAuthenticated && userSubscriptions.some(sub => sub.status === 'active'))}
              className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 ${
                loading && selectedPlan === 'yearly'
                  ? 'bg-blue-700 text-white'
                  : isAuthenticated && userSubscriptions.some(sub => sub.status === 'active')
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading && selectedPlan === 'yearly' ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                  Elaborando...
                </div>
              ) : isAuthenticated && userSubscriptions.some(sub => sub.status === 'active') ? (
                <>
                  <Check className="inline h-5 w-5 mr-2" />
                  Abbonamento Attivo
                </>
              ) : (
                <>
                  <CreditCard className="inline h-5 w-5 mr-2" />
                  {isAuthenticated ? 'Abbonati - €50/anno' : 'Accedi per Abbonarti'}
                </>
              )}
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Contributore Mensile</h3>
              <div className="text-4xl font-bold text-gray-700 mb-2">
                €5
                <span className="text-lg text-gray-500 font-normal">/mese</span>
              </div>
              <p className="text-gray-600">Contributo flessibile allo sviluppo</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800 text-sm font-medium mb-2">
                💰 <strong>Modalità Flessibile:</strong> Sostieni quando puoi
              </p>
              <p className="text-orange-700 text-sm">
                Contribuisci al progetto con pagamenti mensili. Riceverai lo stesso badge "Fondatore"
                e accesso immediato a sondaggi e decisioni sullo sviluppo dell'app.
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Stesso badge "Fondatore" e codice univoco del piano annuale',
                'Accesso immediato a sondaggi e pagina News dedicata',
                'Massima flessibilità - cancella quando vuoi',
                'Partecipazione attiva alle decisioni di sviluppo',
                'Report mensili e aggiornamenti tecnici esclusivi'
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanSelect('monthly')}
              disabled={loading || (isAuthenticated && userSubscriptions.some(sub => sub.status === 'active'))}
              className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 ${
                loading && selectedPlan === 'monthly'
                  ? 'bg-gray-700 text-white'
                  : isAuthenticated && userSubscriptions.some(sub => sub.status === 'active')
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {loading && selectedPlan === 'monthly' ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                  Elaborando...
                </div>
              ) : isAuthenticated && userSubscriptions.some(sub => sub.status === 'active') ? (
                <>
                  <Check className="inline h-5 w-5 mr-2" />
                  Abbonamento Attivo
                </>
              ) : (
                <>
                  <CreditCard className="inline h-5 w-5 mr-2" />
                  {isAuthenticated ? 'Abbonati - €5/mese' : 'Accedi per Abbonarti'}
                </>
              )}
            </button>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Domande Frequenti
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Cosa succede se il progetto non raggiunge l'obiettivo?",
                answer: "Garantiamo il rimborso completo se non raggiungiamo i milestone dichiarati entro le tempistiche. La trasparenza è la nostra priorità."
              },
              {
                question: "Posso cancellare l'abbonamento in qualsiasi momento?",
                answer: "Assolutamente sì. Puoi cancellare quando vuoi dal tuo pannello di controllo. Per i piani annuali, offriamo anche rimborso proporzionale."
              },
              {
                question: "Come garantite la sicurezza dei pagamenti?",
                answer: "Usiamo Stripe per tutti i pagamenti, lo stesso sistema utilizzato da milioni di aziende. I tuoi dati non vengono mai memorizzati sui nostri server."
              },
              {
                question: "Quando sarà disponibile la piattaforma completa?",
                answer: "L'MVP è previsto per Q2 2024. I sostenitori avranno accesso beta prioritario e potranno influenzare lo sviluppo delle funzionalità."
              }
            ].map((faq, index) => (
              <details key={index} className="bg-white rounded-lg shadow-md">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <LogIn className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Accesso Richiesto
              </h3>
              <p className="text-gray-600">
                Per abbonarti e ricevere il badge fondatore, devi prima accedere al tuo account o registrarti.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/auth/login?redirect=/abbonamenti"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
              >
                Accedi al tuo Account
              </Link>
              <Link
                href="/auth/register?redirect=/abbonamenti"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors"
              >
                Registrati Gratuitamente
              </Link>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating CTA */}
      {!isLoading && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => handlePlanSelect('yearly')}
            disabled={isAuthenticated && userSubscriptions.some(sub => sub.status === 'active')}
            className={`px-6 py-3 rounded-full font-bold shadow-lg transition-colors flex items-center ${
              isAuthenticated && userSubscriptions.some(sub => sub.status === 'active')
                ? 'bg-green-400 text-green-900 cursor-not-allowed'
                : 'bg-yellow-400 text-blue-900 hover:bg-yellow-300'
            }`}
          >
            {isAuthenticated && userSubscriptions.some(sub => sub.status === 'active') ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Fondatore Attivo
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Sostieni €50/anno
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}