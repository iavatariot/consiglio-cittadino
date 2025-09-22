'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Settings, X, Check } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made cookie choice
    const cookieChoice = localStorage.getItem('cookie-consent');
    if (!cookieChoice) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(cookieChoice);
        setPreferences(saved);
      } catch {
        // If parsing fails, show banner again
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };

    savePreferences(allAccepted);
    setPreferences(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectOptional = () => {
    const minimal: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };

    savePreferences(minimal);
    setPreferences(minimal);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());

    // Here you would integrate with your analytics services
    if (prefs.analytics) {
      // Initialize PostHog or other analytics
      console.log('Analytics cookies accepted - Initialize PostHog');
    } else {
      // Disable analytics
      console.log('Analytics cookies rejected - Disable tracking');
    }

    if (prefs.marketing) {
      // Initialize marketing cookies
      console.log('Marketing cookies accepted');
    } else {
      // Disable marketing
      console.log('Marketing cookies rejected');
    }
  };

  const togglePreference = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies

    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start space-x-4 flex-1">
              <Cookie className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  🍪 Utilizziamo i Cookie
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Consiglio Cittadino utilizza cookie essenziali per il funzionamento e cookie
                  opzionali per analytics (PostHog) e pagamenti sicuri (Stripe).
                  I cookie essenziali sono necessari per l'autenticazione e le funzionalità base.
                </p>
                <div className="mt-2 space-x-4">
                  <Link
                    href="/cookies"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Informativa Cookie
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Termini di Servizio
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Settings className="h-4 w-4 mr-2" />
                Personalizza
              </button>

              <button
                onClick={handleRejectOptional}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Solo Necessari
              </button>

              <button
                onClick={handleAcceptAll}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold"
              >
                <Check className="h-4 w-4 mr-2" />
                Accetta Tutti
              </button>
            </div>
          </div>

          {/* Cookie Settings Panel */}
          {showSettings && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Necessary Cookies */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Cookie Necessari</h4>
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    Essenziali per autenticazione, sessione utente e funzionalità base.
                    Non possono essere disabilitati.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Sessione di login</li>
                    <li>• Token di autenticazione</li>
                    <li>• Preferenze interfaccia</li>
                    <li>• Sicurezza CSRF</li>
                  </ul>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Cookie Analytics</h4>
                    <button
                      onClick={() => togglePreference('analytics')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    PostHog per analisi utilizzo, miglioramento UX e rilevazione problemi.
                    Dati aggregati anonimi.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Pagine visitate</li>
                    <li>• Tempo di sessione</li>
                    <li>• Interazioni utente</li>
                    <li>• Performance sito</li>
                  </ul>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Cookie Marketing</h4>
                    <button
                      onClick={() => togglePreference('marketing')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.marketing ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    Per personalizzazione contenuti e comunicazioni progetto.
                    Newsletter e aggiornamenti mirati.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Preferenze contenuti</li>
                    <li>• Segmentazione newsletter</li>
                    <li>• Personalizzazione comunicazioni</li>
                    <li>• Inviti eventi targetizzati</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleAcceptSelected}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Salva Preferenze
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {showBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
      )}
    </>
  );
}

// Export hook for checking cookie consent
export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const cookieChoice = localStorage.getItem('cookie-consent');
    if (cookieChoice) {
      try {
        setPreferences(JSON.parse(cookieChoice));
      } catch {
        setPreferences(null);
      }
    }
  }, []);

  return preferences;
}