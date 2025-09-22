'use client';

import { useState } from 'react';
import { Shield, RefreshCw, CheckCircle, AlertCircle, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default function RecoveryPage() {
  const [step, setStep] = useState<'form' | 'recovered'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fiscalCode: '',
    paymentIntentId: ''
  });

  const [recoveredData, setRecoveredData] = useState({
    uniqueCode: '',
    subscriptionsCount: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.toUpperCase()
    }));
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Generate recovery token
      const generateResponse = await fetch('/api/recovery/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Errore nella generazione del token');
      }

      const { recoveryToken } = await generateResponse.json();

      // Step 2: Verify token immediately (simulates secure verification)
      const verifyResponse = await fetch('/api/recovery/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recoveryToken,
          fiscalCode: formData.fiscalCode
        })
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Errore nel recupero del codice');
      }

      const recoveryData = await verifyResponse.json();
      setRecoveredData({
        uniqueCode: recoveryData.uniqueCode,
        subscriptionsCount: recoveryData.subscriptionsCount
      });

      setStep('recovered');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Errore nel recupero del codice');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (recoveredData.uniqueCode) {
      await navigator.clipboard.writeText(recoveredData.uniqueCode);
    }
  };

  const downloadPdf = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uniqueCode: recoveredData.uniqueCode,
          subscriptionsCount: recoveredData.subscriptionsCount
        })
      });

      if (!response.ok) {
        throw new Error('Errore nella generazione del PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      element.download = `certificato-consiglio-cittadino-${recoveredData.uniqueCode}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Errore download PDF:', error);
      alert('Errore nel download del certificato PDF. Riprova più tardi.');
    }
  };

  if (step === 'recovered') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Codice Recuperato!
            </h1>

            <p className="text-gray-600 text-lg">
              Il tuo codice univoco è stato recuperato con successo
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-900">Il Tuo Codice Univoco</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Copia
                </button>
                <button
                  onClick={downloadPdf}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 font-mono text-2xl text-center font-bold text-blue-900 border-2 border-blue-300">
              {recoveredData.uniqueCode}
            </div>

            {recoveredData.subscriptionsCount > 1 && (
              <p className="text-blue-700 text-sm mt-2">
                Hai {recoveredData.subscriptionsCount} abbonamenti attivi con questo codice
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Importante</h3>
                <p className="text-yellow-700 text-sm">
                  Salva questo codice in un luogo sicuro. Ti servirà per accedere alla piattaforma quando sarà disponibile.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/abbonamenti"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Torna agli Abbonamenti
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Recupera il Tuo Codice
          </h1>

          <p className="text-gray-600">
            Inserisci i tuoi dati per recuperare il codice univoco in modo sicuro
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold">Errore</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleRecover} className="space-y-6">
          <div>
            <label htmlFor="fiscalCode" className="block text-sm font-medium text-gray-700 mb-2">
              Codice Fiscale *
            </label>
            <input
              type="text"
              id="fiscalCode"
              name="fiscalCode"
              value={formData.fiscalCode}
              onChange={handleInputChange}
              maxLength={16}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
              placeholder="RSSMRA80A01H501X"
              required
            />
          </div>

          <div>
            <label htmlFor="paymentIntentId" className="block text-sm font-medium text-gray-700 mb-2">
              ID Transazione Stripe *
            </label>
            <input
              type="text"
              id="paymentIntentId"
              name="paymentIntentId"
              value={formData.paymentIntentId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="pi_1234567890abcdef"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Puoi trovare questo ID nell'email di conferma di Stripe o nella tua dashboard Stripe
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Recupero in corso...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Recupera Codice
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/abbonamenti"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna agli Abbonamenti
          </Link>
        </div>
      </div>
    </div>
  );
}