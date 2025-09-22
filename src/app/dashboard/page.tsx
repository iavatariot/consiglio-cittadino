'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Calendar, CreditCard, Shield, Trash2, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleDeleteAccount = async () => {
    if (!deleteReason.trim()) {
      setDeleteMessage('Per favore, specifica il motivo della cancellazione');
      return;
    }

    setIsDeleting(true);
    setDeleteMessage('');

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: deleteReason,
          action: 'delete'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDeleteMessage('Richiesta di cancellazione inviata! Controlla la tua email per confermare.');
        setShowDeleteModal(false);
        setDeleteReason('');
      } else {
        setDeleteMessage(data.error || 'Errore durante la richiesta di cancellazione');
      }
    } catch (error) {
      setDeleteMessage('Errore di connessione. Riprova più tardi.');
    }

    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accesso Richiesto</h1>
          <p className="text-gray-600">Devi essere autenticato per accedere a questa pagina.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Benvenuto, {user.first_name}!
              </h1>
              <p className="text-gray-600">
                Questa è la tua dashboard personale di Consiglio Cittadino
              </p>
            </div>
            {user.is_founder && (
              <div className="flex flex-col items-end">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center">
                  🏆 FONDATORE
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Dal {new Date(user.founder_since!).toLocaleDateString('it-IT')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Account Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Statistiche Account
            </h2>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Account creato</p>
                    <p className="text-lg font-bold text-blue-900">
                      {new Date(user.created_at).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <div className="text-blue-400">
                    <Calendar size={32} />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Stato Account</p>
                    <p className="text-lg font-bold text-green-900">
                      {user.is_active ? 'Attivo' : 'Sospeso'}
                    </p>
                  </div>
                  <div className="text-green-400">
                    <Shield size={32} />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Livello Accesso</p>
                    <p className="text-lg font-bold text-yellow-900">
                      Cittadino Registrato
                    </p>
                  </div>
                  <div className="text-yellow-400">
                    <User size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Azioni Rapide
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="text-blue-600 mb-2">
                <User size={24} />
              </div>
              <h3 className="font-medium text-gray-900">Modifica Profilo</h3>
              <p className="text-sm text-gray-500">Aggiorna le tue informazioni</p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="text-green-600 mb-2">
                <Shield size={24} />
              </div>
              <h3 className="font-medium text-gray-900">Sicurezza</h3>
              <p className="text-sm text-gray-500">Gestisci password e accessi</p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="text-purple-600 mb-2">
                <Mail size={24} />
              </div>
              <h3 className="font-medium text-gray-900">Notifiche</h3>
              <p className="text-sm text-gray-500">Configura le tue preferenze</p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="text-orange-600 mb-2">
                <CreditCard size={24} />
              </div>
              <h3 className="font-medium text-gray-900">Abbonamenti</h3>
              <p className="text-sm text-gray-500">Gestisci i tuoi piani</p>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-md border-2 border-red-200 p-6 mt-8">
          <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            Zona Pericolosa
          </h2>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 mb-2">
              <strong>Attenzione:</strong> Le azioni in questa sezione sono irreversibili.
            </p>
            <p className="text-sm text-red-700">
              La cancellazione dell'account comporta la perdita definitiva di tutti i tuoi dati.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            <Trash2 className="mr-2" size={16} />
            Cancella Account
          </button>

          {deleteMessage && (
            <div className={`mt-4 p-3 rounded-lg ${
              deleteMessage.includes('inviata') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {deleteMessage}
            </div>
          )}
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-red-500 mr-3" size={24} />
                <h3 className="text-lg font-bold text-gray-900">
                  Conferma Cancellazione Account
                </h3>
              </div>

              <div className="mb-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    ⚠️ Questa azione è IRREVERSIBILE!
                  </p>
                  <p className="text-sm text-red-700 mb-2">La cancellazione comporterà:</p>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    <li>Eliminazione definitiva di tutti i tuoi dati</li>
                    <li>Cancellazione di tutte le tue sessioni attive</li>
                    <li>Perdita di eventuali abbonamenti attivi</li>
                    <li>Impossibilità di recuperare l'account</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <label htmlFor="delete-reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo della cancellazione (richiesto):
                  </label>
                  <textarea
                    id="delete-reason"
                    rows={3}
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Spiegaci brevemente il motivo della cancellazione..."
                  />
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Ti invieremo una email di conferma per completare la cancellazione del tuo account.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteReason('');
                    setDeleteMessage('');
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || !deleteReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeleting ? 'Invio in corso...' : 'Conferma Cancellazione'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}