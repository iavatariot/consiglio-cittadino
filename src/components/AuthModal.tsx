'use client';

import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, User, Mail, Lock, Calendar, CreditCard, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { verificaCodiceFiscale, getComuniSupportati } from '@/lib/codiceFiscale';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState<string>('');

  const { login, register } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    data_nascita: '',
    sesso: 'M' as 'M' | 'F',
    luogo_nascita: '',
    codice_fiscale: '',
    honeypot: '' // Campo honeypot per rilevare bot
  });

  const [cfValidation, setCfValidation] = useState<{
    valido: boolean;
    generato: string;
    corrispondenza: boolean;
    errori: string[];
  } | null>(null);
  const [comuni] = useState(getComuniSupportati());

  // Valida il codice fiscale quando cambiano i dati
  useEffect(() => {
    if (formData.first_name && formData.last_name && formData.data_nascita &&
        formData.sesso && formData.luogo_nascita && formData.codice_fiscale) {

      const validation = verificaCodiceFiscale(formData.codice_fiscale, {
        nome: formData.first_name,
        cognome: formData.last_name,
        dataNascita: formData.data_nascita,
        sesso: formData.sesso,
        luogoNascita: formData.luogo_nascita
      });

      setCfValidation(validation);
    } else {
      setCfValidation(null);
    }
  }, [formData.first_name, formData.last_name, formData.data_nascita,
      formData.sesso, formData.luogo_nascita, formData.codice_fiscale]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      onClose();
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        data_nascita: '',
        sesso: 'M',
        luogo_nascita: '',
        codice_fiscale: '',
        honeypot: ''
      });
    } else {
      // Check if it's an email verification error
      if (result.error?.includes('Email non verificata') || (result as any).code === 'EMAIL_NOT_VERIFIED') {
        setShowResendVerification(true);
        setResendEmail(formData.email);
      }
      setError(result.error || 'Errore durante il login');
    }

    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Controllo honeypot - se è compilato, è un bot
    if (formData.honeypot) {
      setError('Registrazione non valida');
      setIsLoading(false);
      return;
    }

    // Valida il codice fiscale prima di inviare
    if (!cfValidation || !cfValidation.valido || !cfValidation.corrispondenza) {
      setError('Il codice fiscale non è valido o non corrisponde ai dati inseriti');
      setIsLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      setSuccess('Registrazione completata! Ora puoi effettuare il login.');
      setMode('login');
      setFormData({
        email: formData.email, // Keep email for login
        password: '',
        first_name: '',
        last_name: '',
        data_nascita: '',
        sesso: 'M',
        luogo_nascita: '',
        codice_fiscale: '',
        honeypot: ''
      });
    } else {
      if (result.details && result.details.length > 0) {
        setError(result.details.join(', '));
      } else {
        setError(result.error || 'Errore durante la registrazione');
      }
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    setSuccess(null);
    setShowResendVerification(false);
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      data_nascita: '',
      sesso: 'M',
      luogo_nascita: '',
      codice_fiscale: '',
      honeypot: ''
    });
  };

  const handleResendVerification = async () => {
    if (!resendEmail) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resendEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setShowResendVerification(false);
      } else {
        setError(data.error || 'Errore durante l\'invio');
      }
    } catch (error) {
      setError('Errore di connessione');
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'login' ? 'Accedi' : 'Registrati'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {showResendVerification && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Email non verificata
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Il tuo account non è ancora verificato. Controlla la tua email ({resendEmail}) per il link di verifica.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="mt-2 text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Invio...' : 'Invia nuova email di verifica'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            {/* Honeypot field - nascosto dai CSS ma visibile ai bot */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleInputChange}
              style={{ display: 'none', position: 'absolute', left: '-9999px' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="first_name"
                        required
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mario"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cognome *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="last_name"
                        required
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Rossi"
                      />
                    </div>
                  </div>
                </div>

                {/* Data di nascita e sesso */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data di Nascita *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="date"
                        name="data_nascita"
                        required
                        value={formData.data_nascita}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sesso *
                    </label>
                    <select
                      name="sesso"
                      required
                      value={formData.sesso}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="M">Maschio</option>
                      <option value="F">Femmina</option>
                    </select>
                  </div>
                </div>

                {/* Luogo di nascita */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Luogo di nascita *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      name="luogo_nascita"
                      required
                      value={formData.luogo_nascita}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleziona il comune di nascita</option>
                      {comuni.map(comune => (
                        <option key={comune} value={comune}>{comune}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Codice Fiscale */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Codice Fiscale *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="codice_fiscale"
                      required
                      maxLength={16}
                      value={formData.codice_fiscale}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                      placeholder="RSSMRA80A01H501X"
                    />
                  </div>

                  {/* Validazione codice fiscale */}
                  {cfValidation && (
                    <div className={`mt-2 text-sm ${
                      cfValidation.corrispondenza ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {cfValidation.corrispondenza ? (
                        <span>✅ Codice fiscale valido e corrispondente</span>
                      ) : (
                        <div>
                          <span>❌ Codice fiscale non valido</span>
                          {cfValidation.errori.length > 0 && (
                            <ul className="mt-1 list-disc list-inside">
                              {cfValidation.errori.map((errore, index) => (
                                <li key={index}>{errore}</li>
                              ))}
                            </ul>
                          )}
                          {cfValidation.generato && (
                            <p className="mt-1 text-blue-600">
                              Codice atteso: <span className="font-mono">{cfValidation.generato}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="mario.rossi@email.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={mode === 'register' ? 'Almeno 8 caratteri' : 'Inserisci password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="text-xs text-gray-500 mt-1">
                  Deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Attendere...' : (mode === 'login' ? 'Accedi' : 'Registrati')}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? 'Non hai un account? ' : 'Hai già un account? '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                {mode === 'login' ? 'Registrati' : 'Accedi'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}