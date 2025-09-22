import { Cookie, Settings, Shield, BarChart3, Mail } from 'lucide-react';
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Cookie className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Informativa Cookie
            </h1>
            <p className="text-gray-600">
              Come utilizziamo i cookie su Consiglio Cittadino
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ultimo aggiornamento: 16 settembre 2025
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cosa sono i Cookie
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                I cookie sono piccoli file di testo memorizzati sul tuo dispositivo quando
                visiti un sito web. Ci aiutano a ricordare le tue preferenze, migliorare
                la tua esperienza di navigazione e analizzare l'uso del sito per fornire
                un servizio migliore.
              </p>
            </div>
          </section>

          {/* Cookie Categories */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tipologie di Cookie Utilizzate
            </h2>

            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Cookie Necessari (Sempre Attivi)
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Essenziali per il funzionamento base della piattaforma. Non possono essere
                  disabilitati senza compromettere l'esperienza utente.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Finalità:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Gestione sessione di login</li>
                      <li>Autenticazione sicura</li>
                      <li>Preferenze interfaccia utente</li>
                      <li>Prevenzione attacchi CSRF</li>
                      <li>Funzionalità carrello/form</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Esempi:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li><code>session_token</code> - Sessione utente</li>
                      <li><code>auth_token</code> - Token autenticazione</li>
                      <li><code>csrf_token</code> - Protezione sicurezza</li>
                      <li><code>ui_preferences</code> - Preferenze tema</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    ⚖️ Base giuridica: Interesse legittimo (Art. 6 GDPR) -
                    Necessari per l'erogazione del servizio richiesto
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Cookie Analytics (PostHog)
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Per analizzare l'utilizzo del sito, migliorare l'esperienza utente e
                  identificare problemi tecnici. Tutti i dati sono aggregati e anonimi.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Finalità:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Statistiche di utilizzo</li>
                      <li>Miglioramento UX/UI</li>
                      <li>Rilevazione errori</li>
                      <li>Performance monitoring</li>
                      <li>A/B testing funzionalità</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dati raccolti:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Pagine visitate</li>
                      <li>Tempo permanenza</li>
                      <li>Interazioni utente</li>
                      <li>Dispositivo/browser (anonimo)</li>
                      <li>Percorsi di navigazione</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">
                    ⚖️ Base giuridica: Interesse legittimo - Miglioramento servizio
                    <br />
                    🕐 Durata: 12 mesi | 🌍 Provider: PostHog (UE)
                  </p>
                </div>
              </div>

              {/* Payment Cookies */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Cookie Pagamenti (Stripe)
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Per elaborare pagamenti sicuri, prevenire frodi e garantire conformità
                  PCI DSS. Utilizzati solo durante il processo di pagamento.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Finalità:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Elaborazione pagamenti</li>
                      <li>Prevenzione frodi</li>
                      <li>Conformità normative</li>
                      <li>Gestione rimborsi</li>
                      <li>Audit transazioni</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Caratteristiche:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Crittografati end-to-end</li>
                      <li>PCI DSS Level 1</li>
                      <li>Solo durante pagamento</li>
                      <li>Nessun dato carta salvato localmente</li>
                      <li>Conformità 3D Secure</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                  <p className="text-purple-800 text-sm font-medium">
                    ⚖️ Base giuridica: Necessità contrattuale - Esecuzione abbonamento
                    <br />
                    🕐 Durata: Sessione | 🌍 Provider: Stripe (adequacy decision UE)
                  </p>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                <div className="flex items-center mb-4">
                  <Mail className="h-6 w-6 text-orange-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Cookie Marketing (Opzionali)
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Per personalizzare comunicazioni e contenuti in base ai tuoi interessi.
                  Utilizzati solo per newsletter e aggiornamenti progetto.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Finalità:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Personalizzazione newsletter</li>
                      <li>Segmentazione comunicazioni</li>
                      <li>Inviti eventi mirati</li>
                      <li>Contenuti rilevanti</li>
                      <li>Frequenza comunicazioni ottimale</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Utilizzo:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Aree geografiche interesse</li>
                      <li>Tipologie petizioni seguite</li>
                      <li>Livello coinvolgimento</li>
                      <li>Preferenze tematiche</li>
                      <li>Timing ottimale invii</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                  <p className="text-orange-800 text-sm font-medium">
                    ⚖️ Base giuridica: Consenso esplicito (revocabile)
                    <br />
                    🕐 Durata: 24 mesi | 🔄 Gestione: Puoi revocare in qualsiasi momento
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Management */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Settings className="h-6 w-6 mr-2 text-blue-600" />
              Gestione Cookie
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Gestione Tramite Banner
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                  <li><strong>Al primo accesso:</strong> Banner cookie automatico</li>
                  <li><strong>Personalizza:</strong> Scegli tipologie specifiche</li>
                  <li><strong>Accetta tutti:</strong> Abilita tutte le funzionalità</li>
                  <li><strong>Solo necessari:</strong> Funzionalità base minime</li>
                  <li><strong>Salva preferenze:</strong> Ricordate per 12 mesi</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Gestione Tramite Browser
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                  <li><strong>Chrome:</strong> Impostazioni → Privacy → Cookie</li>
                  <li><strong>Firefox:</strong> Opzioni → Privacy → Cookie</li>
                  <li><strong>Safari:</strong> Preferenze → Privacy → Cookie</li>
                  <li><strong>Edge:</strong> Impostazioni → Cookie e autorizzazioni</li>
                  <li><strong>Elimina:</strong> Cancella cookie esistenti</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>⚠️ Attenzione:</strong> Disabilitare i cookie necessari può compromettere
                il funzionamento della piattaforma (login, salvataggio preferenze, sicurezza).
              </p>
            </div>
          </section>

          {/* Third Party Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Servizi di Terze Parti
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                  PostHog Analytics
                </h4>
                <div className="text-gray-700 text-sm space-y-1">
                  <p><strong>Finalità:</strong> Analytics e miglioramento UX</p>
                  <p><strong>Dati:</strong> Aggregati anonimi, nessun dato personale</p>
                  <p><strong>Ubicazione:</strong> Server UE (GDPR compliant)</p>
                  <p><strong>Privacy Policy:</strong> <a href="https://posthog.com/privacy" target="_blank" className="text-blue-600 hover:underline">posthog.com/privacy</a></p>
                </div>
              </div>

              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-purple-600" />
                  Stripe Payments
                </h4>
                <div className="text-gray-700 text-sm space-y-1">
                  <p><strong>Finalità:</strong> Elaborazione pagamenti sicuri</p>
                  <p><strong>Certificazioni:</strong> PCI DSS Level 1, SOC 2</p>
                  <p><strong>Ubicazione:</strong> UE/USA (adequacy decision)</p>
                  <p><strong>Privacy Policy:</strong> <a href="https://stripe.com/privacy" target="_blank" className="text-blue-600 hover:underline">stripe.com/privacy</a></p>
                </div>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="mb-8 bg-indigo-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-indigo-800">
              I Tuoi Diritti
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Consenso:</strong> Revocabile in qualsiasi momento</li>
                <li><strong>Accesso:</strong> Richiesta dati cookie memorizzati</li>
                <li><strong>Rettifica:</strong> Correzione preferenze cookie</li>
                <li><strong>Cancellazione:</strong> Eliminazione cookie non necessari</li>
              </ul>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Portabilità:</strong> Esportazione preferenze</li>
                <li><strong>Limitazione:</strong> Controllo tipologie utilizzate</li>
                <li><strong>Opposizione:</strong> Rifiuto cookie marketing</li>
                <li><strong>Reclamo:</strong> Segnalazione al Garante Privacy</li>
              </ul>
            </div>
          </section>

          {/* Contact and Links */}
          <section className="bg-gray-900 text-white p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">
              Contatti e Riferimenti
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Contatti Cookie</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>📧 <strong>Generale:</strong> info@ilconsigliocittadino.it</li>
                  <li>🍪 <strong>Cookie:</strong> privacy@ilconsigliocittadino.it</li>
                  <li>🛡️ <strong>DPO:</strong> gdpr@ilconsigliocittadino.it</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Link Utili</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>📋 <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link></li>
                  <li>⚖️ <Link href="/terms" className="text-blue-400 hover:underline">Termini di Servizio</Link></li>
                  <li>🏛️ <a href="https://www.gpdp.it" target="_blank" className="text-blue-400 hover:underline">Garante Privacy</a></li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}