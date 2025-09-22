'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Calendar, MapPin, CreditCard } from 'lucide-react';
import { verificaCodiceFiscale, getComuniSupportati } from '@/lib/codiceFiscale';

function RegisterPageContent() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    data_nascita: '',
    sesso: 'M' as 'M' | 'F',
    luogo_nascita: '',
    codice_fiscale: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cfValidation, setCfValidation] = useState<{
    valido: boolean;
    generato: string;
    corrispondenza: boolean;
    errori: string[];
  } | null>(null);
  const [comuni] = useState(getComuniSupportati());

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, searchParams]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Valida il codice fiscale prima di inviare
    if (!cfValidation || !cfValidation.valido || !cfValidation.corrispondenza) {
      setError('Il codice fiscale non è valido o non corrisponde ai dati inseriti');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);

      if (result.success) {
        setSuccess('Account creato con successo! Controlla la tua email per verificare l\'account.');
        // Reset form
        setFormData({
          email: '', password: '', first_name: '', last_name: '',
          data_nascita: '', sesso: 'M', luogo_nascita: '', codice_fiscale: ''
        });
      } else {
        setError(result.error || 'Errore durante la registrazione');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crea il tuo account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hai già un account?{' '}
          <Link
            href={`/auth/login${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Accedi qui
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <div className="mt-1 relative">
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Mario"
                  />
                  <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Cognome
                </label>
                <div className="mt-1">
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Rossi"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="mario.rossi@email.com"
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Data di nascita e sesso */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label htmlFor="data_nascita" className="block text-sm font-medium text-gray-700">
                  Data di nascita
                </label>
                <div className="mt-1 relative">
                  <input
                    id="data_nascita"
                    name="data_nascita"
                    type="date"
                    required
                    value={formData.data_nascita}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label htmlFor="sesso" className="block text-sm font-medium text-gray-700">
                  Sesso
                </label>
                <div className="mt-1">
                  <select
                    id="sesso"
                    name="sesso"
                    required
                    value={formData.sesso}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="M">Maschio</option>
                    <option value="F">Femmina</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Luogo di nascita */}
            <div>
              <label htmlFor="luogo_nascita" className="block text-sm font-medium text-gray-700">
                Luogo di nascita
              </label>
              <div className="mt-1 relative">
                <select
                  id="luogo_nascita"
                  name="luogo_nascita"
                  required
                  value={formData.luogo_nascita}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Seleziona il comune di nascita</option>
                  {comuni.map(comune => (
                    <option key={comune} value={comune}>{comune}</option>
                  ))}
                </select>
                <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Codice Fiscale */}
            <div>
              <label htmlFor="codice_fiscale" className="block text-sm font-medium text-gray-700">
                Codice Fiscale
              </label>
              <div className="mt-1 relative">
                <input
                  id="codice_fiscale"
                  name="codice_fiscale"
                  type="text"
                  required
                  maxLength={16}
                  value={formData.codice_fiscale}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase"
                  placeholder="RSSMRA80A01H501X"
                />
                <CreditCard className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Almeno 8 caratteri"
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{success}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrazione in corso...' : 'Registrati'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Torna alla homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
