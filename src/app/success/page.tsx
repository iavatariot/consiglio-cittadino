'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Check, Copy, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const uniqueCode = searchParams.get('code');
  const subscriptionsCount = searchParams.get('subscriptions');

  // Auto-sync subscription when user arrives at success page
  useEffect(() => {
    if (isAuthenticated && user) {
      syncSubscriptionStatus();
    }
  }, [isAuthenticated, user]);

  const syncSubscriptionStatus = async () => {
    setSyncStatus('syncing');
    try {
      // Use new comprehensive sync endpoint
      const response = await fetch('/api/sync-subscription', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Risultato sincronizzazione:', data);
        setSyncStatus('success');
      } else {
        console.error('Errore sincronizzazione:', await response.text());
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Errore sincronizzazione abbonamento:', error);
      setSyncStatus('error');
    }
  };

  const copyToClipboard = async () => {
    if (uniqueCode) {
      await navigator.clipboard.writeText(uniqueCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadCode = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uniqueCode,
          subscriptionsCount
        })
      });

      if (!response.ok) {
        throw new Error('Errore nella generazione del PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      element.download = `certificato-consiglio-cittadino-${uniqueCode}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Errore download PDF:', error);
      alert('Errore nel download del certificato PDF. Riprova più tardi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento Completato!
          </h1>

          <p className="text-gray-600 text-lg mb-4">
            Grazie per aver sostenuto il progetto Consiglio Cittadino
          </p>

          {/* Sync Status */}
          {isAuthenticated && (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              syncStatus === 'syncing' ? 'bg-yellow-100 text-yellow-800' :
              syncStatus === 'success' ? 'bg-green-100 text-green-800' :
              syncStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {syncStatus === 'syncing' && '🔄 Sincronizzazione in corso...'}
              {syncStatus === 'success' && '✅ Badge fondatore attivato!'}
              {syncStatus === 'error' && '⚠️ Errore sincronizzazione'}
              {syncStatus === 'idle' && '⏳ Preparazione...'}
            </div>
          )}
        </div>

        {uniqueCode && (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                🎉 Il tuo codice univoco è:
              </h2>

              <div className="bg-white border-2 border-blue-300 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2 font-mono">
                    {uniqueCode}
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copiato!' : 'Copia'}
                    </button>

                    <button
                      onClick={downloadCode}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Scarica Certificato
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-blue-800">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Questo codice è unico e personale
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Ti servirà per accedere alla piattaforma quando sarà pronta
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Conservalo in un posto sicuro (puoi anche scaricarlo)
                </p>
              </div>
            </div>

            {subscriptionsCount && parseInt(subscriptionsCount) > 1 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-center">
                  <strong>✨ Founder Plus!</strong> Hai ora {subscriptionsCount} abbonamenti attivi.
                  Questo dimostra il tuo forte impegno nel progetto!
                </p>
              </div>
            )}
          </>
        )}

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Cosa succede ora?
            </h3>

            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Accesso immediato</h4>
                  <p className="text-gray-600 text-sm">
                    Puoi già visitare la pagina News e Sondaggi per seguire gli aggiornamenti dello sviluppo
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Report mensili</h4>
                  <p className="text-gray-600 text-sm">
                    Riceverai aggiornamenti dettagliati sui progressi tecnici e le decisioni di sviluppo
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Badge Fondatore</h4>
                  <p className="text-gray-600 text-sm">
                    Al lancio della piattaforma avrai il badge "Fondatore" che attesta il tuo sostegno dall'inizio
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/news-sondaggi"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
            >
              Vai a News e Sondaggi
            </Link>

            {syncStatus === 'error' && (
              <button
                onClick={syncSubscriptionStatus}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors"
              >
                🔄 Riprova Sincronizzazione
              </button>
            )}

            <Link
              href="/"
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Home
            </Link>
          </div>

          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-2">
              Hai perso il codice? <Link href="/recovery" className="text-blue-600 hover:underline">Recuperalo qui</Link>
            </p>
            <p className="text-gray-600 text-sm">
              Hai domande? <Link href="/contatti" className="text-blue-600 hover:underline">Contattaci</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}