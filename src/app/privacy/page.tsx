import { Shield, Lock, Eye, Database, Globe, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-gray-600">
              Consiglio Cittadino - Come proteggiamo i tuoi dati
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ultimo aggiornamento: 16 settembre 2025
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="h-6 w-6 mr-2 text-blue-600" />
              Introduzione
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Consiglio Cittadino ("noi", "nostro" o "la piattaforma") gestito da iavatar.info,
                è impegnato nella protezione della privacy e dei dati personali degli utenti.
                Questa Privacy Policy spiega come raccogliamo, utilizziamo, conserviamo e
                proteggiamo le informazioni personali in conformità al Regolamento Generale
                sulla Protezione dei Dati (GDPR) e alla normativa italiana sulla privacy.
              </p>
            </div>
          </section>

          {/* Data Controller */}
          <section className="mb-8 bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Titolare del Trattamento
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>iavatar.info</strong></p>
              <p>Email: info@ilconsigliocittadino.it</p>
              <p>Per questioni relative alla privacy: privacy@ilconsigliocittadino.it</p>
            </div>
          </section>

          {/* Data We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="h-6 w-6 mr-2 text-blue-600" />
              Dati che Raccogliamo
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Dati Personali Essenziali
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Email:</strong> Per registrazione, autenticazione e comunicazioni</li>
                  <li><strong>Nome e Cognome:</strong> Per identificazione pubblica nelle petizioni</li>
                  <li><strong>Comune di residenza:</strong> Per targeting geografico delle petizioni</li>
                  <li><strong>Regione:</strong> Per visualizzazione mappa e contenuti localizzati</li>
                </ul>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Dati Opzionali/Funzionali
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Codice Fiscale/SPID:</strong> Solo per verifica identità avanzata (fase successiva)</li>
                  <li><strong>Cookie di Tracking:</strong> PostHog per analytics, Stripe per pagamenti</li>
                  <li><strong>Dati Comportamentali:</strong> Interazioni piattaforma, tempo sessione, engagement</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Nota:</strong> Non raccogliamo dati di localizzazione precisi,
                  solo il comune dichiarato volontariamente dall'utente.
                </p>
              </div>
            </div>
          </section>

          {/* Purpose of Processing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="h-6 w-6 mr-2 text-blue-600" />
              Finalità del Trattamento
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Funzionamento Piattaforma
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Gestione account utente</li>
                  <li>Creazione e gestione petizioni</li>
                  <li>Formazione coalizioni</li>
                  <li>Sistema di voto e firme</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Marketing Limitato
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Newsletter progetto (opt-in)</li>
                  <li>Aggiornamenti sviluppo</li>
                  <li>Comunicazioni importanti</li>
                  <li>Inviti eventi community</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Analytics e Miglioramenti
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Miglioramento UX</li>
                  <li>Ottimizzazione performance</li>
                  <li>Rilevazione bug e problemi</li>
                  <li>Statistiche di utilizzo</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Condivisione Istituzionale
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Petizioni che raggiungono soglie</li>
                  <li>Dati aggregati anonimi</li>
                  <li>Solo per finalità democratiche</li>
                  <li>Senza identificazione personale</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Legal Basis */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Base Giuridica del Trattamento
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Consenso Esplicito</h4>
                  <p className="text-gray-700 text-sm">
                    Per petizioni, firme e newsletter. Revocabile in qualsiasi momento.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">€</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Necessità Contrattuale</h4>
                  <p className="text-gray-700 text-sm">
                    Per gestione abbonamenti e pagamenti tramite Stripe.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Legittimo Interesse</h4>
                  <p className="text-gray-700 text-sm">
                    Per analytics e miglioramento del servizio tramite PostHog.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Storage */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="h-6 w-6 mr-2 text-blue-600" />
              Conservazione e Hosting
            </h2>

            <div className="bg-indigo-50 p-6 rounded-xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Durata Conservazione</h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li><strong>Account attivi:</strong> Conservati indefinitamente</li>
                    <li><strong>Cancellazione:</strong> Su richiesta dell'utente</li>
                    <li><strong>Firme petizioni:</strong> Mantenute per integrità democratica</li>
                    <li><strong>Dati blockchain:</strong> Immutabili per design</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Hosting e Sicurezza</h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li><strong>Server primari:</strong> Unione Europea (Supabase/Vercel)</li>
                    <li><strong>Pagamenti:</strong> Stripe (adequacy decision UE)</li>
                    <li><strong>Crittografia:</strong> HTTPS/SSL end-to-end</li>
                    <li><strong>Backup:</strong> Crittografati in UE</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              I Tuoi Diritti GDPR
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Accesso', desc: 'Richiedere copia dei tuoi dati', icon: '👁️' },
                { title: 'Rettifica', desc: 'Correggere dati inesatti', icon: '✏️' },
                { title: 'Cancellazione', desc: 'Eliminare i tuoi dati*', icon: '🗑️' },
                { title: 'Portabilità', desc: 'Trasferire i tuoi dati', icon: '📤' },
                { title: 'Limitazione', desc: 'Limitare il trattamento', icon: '⏸️' },
                { title: 'Opposizione', desc: 'Opporti al trattamento', icon: '🛑' },
              ].map((right, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">{right.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{right.title}</h4>
                  <p className="text-gray-600 text-sm">{right.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>*Nota importante:</strong> Le firme delle petizioni non possono essere
                cancellate per preservare l'integrità democratica del processo, come previsto
                dalla normativa elettorale italiana.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cookie e Tecnologie di Tracciamento
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Cookie Essenziali</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Necessari per il funzionamento della piattaforma (sessione, autenticazione).
                </p>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Sempre attivi</span>
              </div>

              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Cookie Analytics (PostHog)</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Per analisi utilizzo e miglioramento UX. Dati aggregati anonimi.
                </p>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Legittimo interesse</span>
              </div>

              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Cookie Pagamenti (Stripe)</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Per elaborazione sicura dei pagamenti e prevenzione frodi.
                </p>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Necessità contrattuale</span>
              </div>
            </div>
          </section>

          {/* Minors */}
          <section className="mb-8 bg-red-50 p-6 rounded-xl border border-red-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-red-800">
              Protezione dei Minori
            </h2>
            <div className="text-gray-700">
              <p className="mb-2">
                <strong>Il servizio è vietato ai minori di 16 anni.</strong>
              </p>
              <p className="text-sm">
                Per utenti tra 16-18 anni è richiesto il consenso dei genitori per il trattamento
                dei dati personali. Se veniamo a conoscenza di dati raccolti da minori senza
                consenso, procederemo immediatamente alla loro cancellazione.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-8 bg-gray-900 text-white p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Mail className="h-6 w-6 mr-2" />
              Contatti Privacy
            </h2>
            <div className="space-y-2 text-sm">
              <p><strong>Data Protection Officer:</strong> privacy@ilconsigliocittadino.it</p>
              <p><strong>Richieste GDPR:</strong> gdpr@ilconsigliocittadino.it</p>
              <p><strong>Segnalazione violazioni:</strong> security@ilconsigliocittadino.it</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                Hai anche il diritto di presentare reclamo al Garante per la Protezione
                dei Dati Personali (www.gpdp.it) se ritieni che il trattamento dei tuoi
                dati violi la normativa sulla privacy.
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Aggiornamenti della Privacy Policy
            </h2>
            <p className="text-gray-700 text-sm">
              Questa Privacy Policy può essere aggiornata periodicamente per riflettere
              modifiche ai nostri servizi o alla normativa. Gli utenti saranno notificati
              via email di eventuali modifiche sostanziali almeno 30 giorni prima della
              loro entrata in vigore.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}