'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_verified'>('loading');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token di verifica mancante');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${verificationToken}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user?.email_verified && data.message?.includes('già verificata')) {
          setStatus('already_verified');
        } else {
          setStatus('success');
        }
        setMessage(data.message);
        setUserInfo(data.user);
      } else {
        setStatus('error');
        setMessage(data.error || 'Errore durante la verifica');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Errore di connessione');
    }
  };

  const handleResendVerification = async () => {
    if (!userInfo?.email) return;

    setResendLoading(true);
    setResendMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage('Email di verifica inviata con successo!');
      } else {
        setResendMessage(data.error || 'Errore durante l\'invio');
      }
    } catch (error) {
      setResendMessage('Errore di connessione');
    }

    setResendLoading(false);
  };

  const goToLogin = () => {
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <RefreshCw className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Verifica in corso...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Stiamo verificando il tuo account.
              </p>
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
            {status === 'success' && (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  Email Verificata!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {message}
                </p>
                {userInfo && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      <strong>Benvenuto/a {userInfo.first_name}!</strong><br />
                      Il tuo account ({userInfo.email}) è ora verificato.
                    </p>
                  </div>
                )}
                <button
                  onClick={goToLogin}
                  className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Vai al Login
                </button>
              </>
            )}

            {status === 'already_verified' && (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-blue-500" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  Account già verificato
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {message}
                </p>
                {userInfo && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      Il tuo account ({userInfo.email}) è già stato verificato.
                    </p>
                  </div>
                )}
                <button
                  onClick={goToLogin}
                  className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Vai al Login
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="mx-auto h-12 w-12 text-red-500" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  Errore di Verifica
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {message}
                </p>

                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex">
                      <Mail className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                          Hai bisogno di una nuova email di verifica?
                        </h3>
                        <p className="mt-1 text-sm text-yellow-700">
                          Se il link è scaduto, puoi richiedere una nuova email.
                        </p>
                      </div>
                    </div>
                  </div>

                  {userInfo?.email && (
                    <div>
                      <button
                        onClick={handleResendVerification}
                        disabled={resendLoading}
                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resendLoading ? 'Invio in corso...' : 'Invia nuova email'}
                      </button>

                      {resendMessage && (
                        <p className={`mt-2 text-sm ${resendMessage.includes('successo') ? 'text-green-600' : 'text-red-600'}`}>
                          {resendMessage}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={goToLogin}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Torna alla Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}