import { Scale, FileText, CreditCard, AlertTriangle, Shield, Users } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Scale className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Termini di Servizio
            </h1>
            <p className="text-gray-600">
              Consiglio Cittadino - Condizioni d'uso della piattaforma
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ultimo aggiornamento: 16 settembre 2025
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Accettazione dei Termini
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Benvenuto su Consiglio Cittadino ("Piattaforma"), gestita da iavatar.info
                ("noi", "nostro"). Utilizzando i nostri servizi, accetti integralmente questi
                Termini di Servizio ("Termini"). Se non accetti questi termini, non utilizzare
                la piattaforma.
              </p>
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-blue-800 text-sm">
                  <strong>Importante:</strong> Questi termini costituiscono un accordo legale
                  vincolante tra te e iavatar.info. Leggili attentamente.
                </p>
              </div>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              Descrizione del Servizio
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Cosa Offriamo
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Piattaforma per creazione petizioni digitali</li>
                  <li>Sistema di coalizioni e movimenti civici</li>
                  <li>Interfaccia con istituzioni pubbliche</li>
                  <li>Strumenti di partecipazione democratica</li>
                  <li>Community di cittadini attivi</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Natura del Servizio
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li><strong>Beta pubblica:</strong> Servizio in fase di sviluppo</li>
                  <li><strong>Gratuito:</strong> Funzionalità base sempre gratuite</li>
                  <li><strong>Open Source:</strong> Codice rilasciato sotto licenza MIT</li>
                  <li><strong>Non-profit:</strong> Finalità democratiche e sociali</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-600" />
              Responsabilità Utenti
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-red-700">
                  Contenuti Vietati
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Contenuti illegali:</strong> Violazione leggi italiane/UE</li>
                  <li><strong>Diffamazione:</strong> Attacchi personali, calunnie</li>
                  <li><strong>Discriminazione:</strong> Razzismo, xenofobia, omofobia</li>
                  <li><strong>Violenza:</strong> Incitamento all'odio o alla violenza</li>
                  <li><strong>Spam:</strong> Contenuti promozionali non autorizzati</li>
                  <li><strong>Disinformazione:</strong> False informazioni deliberate</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-orange-700">
                  Comportamenti Vietati
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Manipolazione:</strong> Firme false, bot, account multipli</li>
                  <li><strong>Hacking:</strong> Tentativi accesso non autorizzato</li>
                  <li><strong>Rate Limiting:</strong> Superamento limiti API</li>
                  <li><strong>Reverse Engineering:</strong> Salvo diritti open source</li>
                  <li><strong>Interferenza:</strong> Disturbo operazioni piattaforma</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-green-700">
                  Obblighi Utente
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Veridicità:</strong> Informazioni accurate e aggiornate</li>
                  <li><strong>Identificazione:</strong> Un account per persona fisica</li>
                  <li><strong>Sicurezza:</strong> Protezione credenziali di accesso</li>
                  <li><strong>Rispetto:</strong> Comportamento civile e costruttivo</li>
                  <li><strong>Normative:</strong> Rispetto leggi e regolamenti vigenti</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content Ownership */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Proprietà Intellettuale
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  I Tuoi Contenuti
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                  <li><strong>Proprietà:</strong> Rimangono di tua proprietà</li>
                  <li><strong>Licenza:</strong> Ci concedi licenza non esclusiva per pubblicazione</li>
                  <li><strong>Durata:</strong> Fino a cancellazione account o contenuto</li>
                  <li><strong>Ambito:</strong> Solo per funzionamento piattaforma</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Nostri Contenuti
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                  <li><strong>Codice:</strong> Rilasciato sotto licenza MIT</li>
                  <li><strong>Marchi:</strong> "Consiglio Cittadino" riservato</li>
                  <li><strong>Design:</strong> UI/UX elementi protetti</li>
                  <li><strong>Dati:</strong> Database aggregati riservati</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Copyright e DMCA</h4>
              <p className="text-gray-700 text-sm">
                Rispettiamo i diritti di proprietà intellettuale. Per segnalare violazioni
                copyright, contatta <strong>copyright@ilconsigliocittadino.it</strong> con:
                identificazione dell'opera, prova di titolarità, localizzazione della violazione.
              </p>
            </div>
          </section>

          {/* Financial Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
              Termini Economici
            </h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Abbonamento Contributore (€50/anno)
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cosa Include</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Badge "Fondatore" visibile al lancio</li>
                      <li>Accesso area News & Sondaggi</li>
                      <li>Report dettagliati sviluppo</li>
                      <li>Partecipazione decisioni prodotto</li>
                      <li>Supporto prioritario</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Condizioni</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li><strong>Pagamento:</strong> Annuale anticipato</li>
                      <li><strong>Rinnovo:</strong> Automatico se non cancellato</li>
                      <li><strong>Cancellazione:</strong> Effetto fine periodo</li>
                      <li><strong>Rimborso:</strong> 60 giorni senza domande</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Diritti del Consumatore (D.Lgs. 206/2005)
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Recesso:</strong> 14 giorni dalla sottoscrizione</li>
                  <li><strong>Rimborso completo:</strong> Se recesso entro 14 giorni</li>
                  <li><strong>Modalità rimborso:</strong> Stesso metodo di pagamento</li>
                  <li><strong>Tempi:</strong> Rimborso entro 14 giorni dalla richiesta</li>
                  <li><strong>Eccezioni:</strong> Nessuna per servizi digitali iniziati</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>Nota importante:</strong> L'abbonamento sostiene lo sviluppo della
                  piattaforma e non costituisce acquisto di servizi commerciali. È un contributo
                  volontario che garantisce accesso a funzionalità esclusive.
                </p>
              </div>
            </div>
          </section>

          {/* Platform Rules */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Moderazione e Sanzioni
            </h2>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-red-800 mb-3">
                  Sistema di Moderazione
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Automatica:</strong> Filtri AI per contenuti inappropriati</li>
                  <li><strong>Community:</strong> Segnalazioni utenti verificate</li>
                  <li><strong>Umana:</strong> Team moderatori per casi complessi</li>
                  <li><strong>Trasparente:</strong> Notifica decisioni con motivazioni</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-yellow-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-yellow-800 mb-2">🟡 Avviso</h4>
                  <p className="text-yellow-700 text-sm">Prima violazione minore</p>
                </div>

                <div className="bg-orange-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-orange-800 mb-2">🟠 Sospensione</h4>
                  <p className="text-orange-700 text-sm">7-30 giorni per violazioni ripetute</p>
                </div>

                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-red-800 mb-2">🔴 Ban Permanente</h4>
                  <p className="text-red-700 text-sm">Violazioni gravi o persistenti</p>
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2 text-amber-600" />
              Limitazioni di Responsabilità
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Servizio "Come È"
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Beta:</strong> Servizio in sviluppo, possibili interruzioni</li>
                  <li><strong>Disponibilità:</strong> Non garantiamo uptime 100%</li>
                  <li><strong>Funzionalità:</strong> Possono cambiare senza preavviso</li>
                  <li><strong>Risultati:</strong> Non garantiamo successo petizioni</li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">
                  Esclusioni di Garanzia
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Nei limiti di legge, escludiamo responsabilità per: perdite economiche indirette,
                  mancati guadagni, perdita di dati, interruzioni di servizio, azioni di terze parti,
                  uso improprio della piattaforma. La nostra responsabilità è limitata all'importo
                  pagato negli ultimi 12 mesi.
                </p>
              </div>
            </div>
          </section>

          {/* Blockchain Notice */}
          <section className="mb-8 bg-indigo-50 p-6 rounded-xl border border-indigo-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-indigo-800">
              Tecnologia Blockchain
            </h2>
            <div className="text-gray-700 space-y-3">
              <p className="font-medium">
                Alcune funzionalità critiche utilizzano tecnologia blockchain.
              </p>
              <div className="text-sm space-y-2">
                <p><strong>Cosa significa:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>I voti su decisioni cruciali sono registrati su blockchain</li>
                  <li>Questi dati sono <strong>immutabili</strong> per design</li>
                  <li>Garantiscono trasparenza e integrità democratica</li>
                  <li>Non possono essere modificati o cancellati successivamente</li>
                </ul>
                <p className="text-indigo-700 font-medium mt-3">
                  Votando su decisioni blockchain, accetti esplicitamente l'immutabilità dei dati.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cessazione del Servizio
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Cessazione da Parte Tua
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Cancellazione account in qualsiasi momento</li>
                  <li>Dati personali eliminati (salvo firme petizioni)</li>
                  <li>Abbonamenti cessano a fine periodo pagato</li>
                  <li>Contenuti rimossi dalla piattaforma</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Cessazione da Parte Nostra
                </h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>30 giorni preavviso per cessazione generale</li>
                  <li>Immediata per violazioni gravi termini</li>
                  <li>Rimborso proporzionale abbonamenti attivi</li>
                  <li>Export dati personali prima della chiusura</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Legal Jurisdiction */}
          <section className="mb-8 bg-gray-900 text-white p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">
              Legge Applicabile e Giurisdizione
            </h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Legge applicabile:</strong> Repubblica Italiana
              </p>
              <p>
                <strong>Giurisdizione:</strong> Tribunale di Milano per controversie B2C
              </p>
              <p>
                <strong>Risoluzione alternativa:</strong> Mediazione presso Camera di Commercio Milano
              </p>
              <p>
                <strong>Consumatori UE:</strong> Diritto di ricorso ai tribunali del paese di residenza
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                Per controversie di importo inferiore a €5.000, è possibile utilizzare la
                piattaforma ODR (Online Dispute Resolution) della Commissione Europea.
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Modifiche ai Termini
            </h2>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Possiamo modificare questi termini periodicamente. Le modifiche sostanziali
                saranno notificate via email almeno <strong>30 giorni prima</strong> dell'entrata
                in vigore.
              </p>
              <p className="text-blue-800 text-sm font-medium">
                Il continuato utilizzo dopo le modifiche costituisce accettazione dei nuovi termini.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mt-8 text-center">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Domande sui Termini?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Contattaci per chiarimenti o supporto legale
              </p>
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Email generale:</strong> info@ilconsigliocittadino.it</p>
                <p><strong>Questioni legali:</strong> legal@ilconsigliocittadino.it</p>
                <p><strong>Supporto utenti:</strong> support@ilconsigliocittadino.it</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}