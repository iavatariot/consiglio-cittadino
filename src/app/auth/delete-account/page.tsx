'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';

function DeleteAccountPageContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'confirm'>('loading');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token di cancellazione mancante');
      return;
    }

    // Mostra prima la schermata di conferma
    setStatus('confirm');
  }, [token]);

  const handleConfirmDeletion = async () => {
    if (!token) return;

    setConfirming(true);

    try {
      const response = await fetch(`/api/auth/delete-account?token=${token}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setUserInfo(data.user);
      } else {
        setStatus('error');
        setMessage(data.error || 'Errore durante la cancellazione');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Errore di connessione');
    }

    setConfirming(false);
  };

  const goToHome = () => {
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Caricamento...
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'confirm') {
    return (
      <div className="min-h-screen bg-red-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg border-2 border-red-200 sm:rounded-lg sm:px-10">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-4 text-2xl font-bold text-red-900">
                ⚠️ ATTENZIONE
              </h2>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">
                Conferma Cancellazione Account
              </h3>

              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800 mb-3">
                  Stai per cancellare <strong>DEFINITIVAMENTE</strong> il tuo account.
                </p>
                <div className="text-left text-sm text-red-700">
                  <p className="font-semibold mb-2">Questa azione comporterà:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Eliminazione di tutti i tuoi dati personali</li>
                    <li>Cancellazione di tutte le tue sessioni attive</li>
                    <li>Perdita di eventuali abbonamenti attivi</li>
                    <li>Impossibilità di recuperare l'account</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Sei sicuro di voler procedere? Questa azione <strong>NON</strong> può essere annullata.
                </p>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleConfirmDeletion}
                    disabled={confirming}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {confirming ? 'Cancellazione in corso...' : '🗑️ SÌ, CANCELLA IL MIO ACCOUNT'}
                  </button>

                  <button
                    onClick={goToHome}
                    disabled={confirming}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                  >
                    <ArrowLeft className="inline h-4 w-4 mr-2" />
                    Annulla e torna alla home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Account Cancellato
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {message}
              </p>
              {userInfo && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Ciao {userInfo.first_name}</strong><br />
                    Il tuo account ({userInfo.email}) è stato cancellato definitivamente.
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Grazie per il feedback
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Ci dispiace vederti andare via. Il tuo feedback ci aiuta a migliorare Consiglio Cittadino per tutti i cittadini.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={goToHome}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Vai alla Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Errore di Cancellazione
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>

            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-red-800">
                    Possibili cause:
                  </h3>
                  <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                    <li>Token scaduto (valido solo 2 ore)</li>
                    <li>Link già utilizzato</li>
                    <li>Account già cancellato</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={goToHome}
              className="mt-6 w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Torna alla Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeleteAccountPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <DeleteAccountPageContent />
    </Suspense>
  );
}