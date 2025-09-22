'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Book, ChevronLeft, ChevronRight, Bookmark, Share2,
  Search, Download, Eye, Clock, ArrowRight, Users, Target,
  Zap, Shield, TrendingUp, Code, Heart, Lightbulb, CheckCircle,
  BarChart3, Globe, Database, Lock
} from 'lucide-react';

export default function Info() {
  const [currentSection, setCurrentSection] = useState(1);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const sections = [
    {
      id: 1,
      title: "Un Sistema Progettato per Non Funzionare",
      readingTime: 8,
      icon: Target,
      gradient: "from-gray-600 to-gray-700",
      content: `"Un sistema che non funziona per i giovani è un sistema che ha deciso di non avere un futuro."

Questo manifesto parte da una domanda semplice ma scomoda: perché un paese con le nostre risorse, la nostra storia e i nostri talenti funziona così male? Non è retorica. È la domanda che mi sono fatto ogni giorno negli ultimi quindici anni, come informatico che ha vissuto sulla propria pelle quello che milioni di italiani della mia generazione conoscono bene: la sensazione di trovarsi in un sistema progettato per sprecare il loro potenziale.

Ho 36 anni, lavoro nell'informatica da quando ne avevo 21, e ho passato praticamente tutta la vita a studiare. Non solo informatica: economia, storia, politiche pubbliche, sistemi organizzativi. Non per hobby intellettuale, ma per una necessità quasi fisica di capire perché tutto intorno a me sembrava funzionare al contrario.

La scoperta che ha cambiato tutto è stata questa: l'Italia non è un paese che funziona male per caso. È un paese progettato per funzionare esattamente così. Ogni disfunzione che considerate normale, dalla sanità al lavoro, dalla scuola alla burocrazia, non è il risultato di inefficienze casuali. È il prodotto di scelte precise, fatte da persone precise, che da quelle disfunzioni traggono vantaggi altrettanto precisi.

I numeri parlano chiaro: spendiamo in sanità quanto la Germania, ma abbiamo liste d'attesa di due anni. Investiamo nell'università quanto la Francia, ma esportiamo cervelli invece di trattenerli. Abbiamo una delle burocrazie più costose d'Europa, ma anche la meno efficiente. La differenza non è nelle risorse disponibili. È in come vengono utilizzate e chi decide come utilizzarle.`
    },
    {
      id: 2,
      title: "Perché la Politica Tradizionale Non Può Cambiare",
      readingTime: 6,
      icon: Shield,
      gradient: "from-gray-200 to-green-300",
      content: `Il sistema attuale non può riformarsi dall'interno. Non è questione di cattiva volontà o incompetenza dei singoli. È questione di incentivi strutturali che premiano chi mantiene lo status quo.

Un politico che volesse davvero semplificare la burocrazia dovrebbe scontrarsi con migliaia di burocrati che perderebbero potere e stipendio. Un amministratore che volesse tagliare gli sprechi dovrebbe combattere contro fornitori, consulenti, intermediari che ci guadagnano. Un parlamentare che volesse ridurre i privilegi della politica dovrebbe convincere colleghi che quegli stessi privilegi li hanno portati dove sono.

Il problema non sono le persone. Il problema è che il sistema seleziona e premia chi è bravo a navigarlo, non chi è bravo a migliorarlo. Chi arriva ai vertici è chi ha imparato a giocare secondo le regole esistenti, non chi vuole cambiarle.

Mentre la politica italiana discute ancora se aprire un profilo Facebook istituzionale, nel mondo le piattaforme digitali hanno già rivoluzionato il modo in cui le persone si organizzano, decidono, agiscono insieme. Estonia ha digitalizzato completamente il rapporto tra cittadini e Stato. Taiwan usa l'intelligenza collettiva per risolvere conflitti sociali complessi. L'Irlanda convoca assemblee di cittadini per decidere su questioni controverse.

La tecnologia per farlo esiste. L'esperienza per implementarla anche. Manca solo la volontà di provarci.`
    },
    {
      id: 3,
      title: "Consiglio Cittadino: L'Infrastruttura della Democrazia",
      readingTime: 12,
      icon: Zap,
      gradient: "from-green-300 to-green-500",
      content: `Il progetto che propongo nasce da una considerazione semplice: se Amazon può gestire miliardi di transazioni al giorno con affidabilità assoluta, possiamo costruire una piattaforma che gestisca milioni di decisioni democratiche con la stessa efficienza.

Non si tratta di sostituire la democrazia rappresentativa, ma di integrarla con strumenti di democrazia diretta. Non di abolire il Parlamento, ma di dargli input più chiari su cosa vogliono davvero i cittadini.

**Accesso Universale e Verificato**
Ogni cittadino maggiorenne può registrarsi usando SPID o Carta d'Identità Elettronica. L'identificazione forte garantisce "una persona, un voto" e previene manipolazioni. Il sistema conosce automaticamente il comune di residenza per abilitare la partecipazione a decisioni locali, regionali e nazionali.

**Dal Problema alla Soluzione: Il Flusso Democratico**
Il percorso inizia con gli "Annunci": chiunque può proporre un tema in 500 caratteri. Gli annunci che superano il 51% di approvazione con almeno 100 voti possono evolvere in "Manifesti" programmatici o "Petizioni" operative.

**Il Sistema delle Coalizioni Democratiche**
I manifesti che raccolgono 1.000 endorsement generano "Coalizioni" - gruppi organizzati di cittadini che condividono obiettivi. Ogni coalizione ha struttura democratica: assemblea generale, consiglio direttivo eletto, coordinatori tematici.

**Petizioni e Referendum Automatizzati**
Le petizioni che raggiungono soglie prestabilite (5.000 firme per questioni comunali, 25.000 per regionali, 50.000 per nazionali) vengono trasmesse automaticamente alle istituzioni con obbligo di risposta pubblica entro 60 giorni.`
    },
    {
      id: 4,
      title: "Crescita Democratica e Qualità",
      readingTime: 9,
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      content: `**Livelli di Partecipazione Progressiva**
Il sistema premia la partecipazione costruttiva attraverso livelli che sbloccano gradualmente nuove funzionalità. Si inizia firmando petizioni e commentando, si progredisce creando contenuti di qualità, si arriva a fondare coalizioni e proporre referendum.

Non è meritocrazia basata su titoli di studio o censo, ma su contributo effettivo alla discussione pubblica. Un operaio che propone soluzioni concrete ai problemi del trasporto pubblico può raggiungere livelli di influenza superiori a un professore universitario che non partecipa attivamente.

**Qualità e Controllo: La Peer Review Democratica**
Ogni contenuto viene sottoposto a revisione da parte di utenti di livello pari o superiore. I criteri sono pubblici: fattibilità, chiarezza, rilevanza, rispetto delle regole. I contenuti insufficienti vengono respinti con feedback costruttivo.

Questo garantisce qualità senza censura: non si valutano le idee politiche, ma la loro presentazione e sostenibilità. Una proposta di sinistra ben argomentata passa la revisione come una di destra altrettanto solida.

**Trasparenza Assoluta e Sicurezza Crittografica**
Ogni azione sulla piattaforma è tracciabile e pubblica. Chi vota cosa, quando, perché. Ogni decisione importante viene registrata su blockchain per garantire immutabilità. Gli algoritmi sono open source e verificabili.

Questa trasparenza è impossibile nella politica tradizionale, ma normale nell'era digitale. Quando sai che ogni tua azione è pubblica, ti comporti in modo più responsabile.`
    },
    {
      id: 5,
      title: "Roadmap di Implementazione",
      readingTime: 8,
      icon: Code,
      gradient: "from-green-600 to-red-400",
      content: `Questo non è un progetto teorico. È il risultato di quindici anni di esperienza nella progettazione e gestione di sistemi informatici complessi. Conosco le sfide tecniche e le soluzioni disponibili.

**Fase 1 (18 mesi): MVP Funzionale**
Sviluppo delle funzionalità base con team core di 8-10 sviluppatori specializzati. Registrazione sicura, sistema di annunci e votazioni, meccanismo di livelli semplificato. Budget: €800.000.

**Fase 2 (12 mesi): Funzionalità Avanzate**
Sistema di coalizioni, petizioni automatizzate, integrazione blockchain, interfacce per istituzioni. Team esteso a 15 persone con competenze in crittografia e sistemi distribuiti. Budget: €600.000.

**Fase 3 (continua): Intelligenza Artificiale**
IA per moderazione automatica, sistemi di raccomandazione personalizzati, analytics per impact assessment. Team stabile di 20+ persone per sviluppo e manutenzione continua.

**Modello di Sostenibilità**
Contributo volontario di 50 euro annui per partecipazione attiva. Con 10.000 sostenitori: 500.000 euro annui. Sufficienti per:
- Sviluppo e manutenzione: 300K€
- Sicurezza e audit: 75K€
- Moderazione e supporto: 50K€
- Comunicazione: 50K€
- Riserva operativa: 25K€

**Governance Democratica**
La piattaforma sarà governata secondo i principi che promuove. Codice open source, decisioni strategiche prese dalla community, proprietà collettiva di chi contribuisce tempo, competenze o risorse.`
    },
    {
      id: 6,
      title: "Il Futuro che Possiamo Costruire",
      readingTime: 10,
      icon: Heart,
      gradient: "from-red-400 to-red-600",
      content: `Immaginate un'Italia dove ogni grande decisione di spesa pubblica viene discussa e votata da chi la finanzia. Dove i 13,5 miliardi del Ponte sullo Stretto vengono destinati a università, ricerca, infrastrutture digitali perché lo decidono direttamente i cittadini.

Un paese dove le leggi vengono scritte in collaborazione tra chi le deve approvare e chi le deve rispettare. Dove i servizi pubblici migliorano perché chi li progetta riceve feedback continuo da chi li usa.

Un paese dove la corruzione diventa impossibile perché ogni decisione è trasparente, dove gli sprechi si riducono perché ogni spesa è sotto controllo popolare, dove l'innovazione accelera perché le buone idee possono emergere da qualsiasi cittadino.

Non è utopia. È quello che succede quando si combinano le possibilità della tecnologia moderna con i principi della democrazia classica. È quello che altri paesi stanno già sperimentando con successo.

**La Chiamata Finale**
Abbiamo due strade davanti. Continuare a subire un sistema che non funziona, lamentandoci ma senza fare nulla per cambiarlo. Oppure costruire insieme l'alternativa.

La prima strada è più facile nel breve termine, ma ci condanna al declino. La seconda richiede impegno, ma ci apre un futuro di possibilità.

Il futuro non è qualcosa che ci capita. È qualcosa che costruiamo. Insieme.

Se vale la pena provarci, allora è il momento di passare dalle parole ai fatti. Di smettere di criticare e iniziare a costruire. Di trasformare la frustrazione in energia, l'indignazione in azione, la protesta in proposta.`
    }
  ];

  const currentSectionData = sections.find(s => s.id === currentSection) || sections[0];

  const toggleBookmark = (sectionId: number) => {
    if (bookmarks.includes(sectionId)) {
      setBookmarks(bookmarks.filter(id => id !== sectionId));
    } else {
      setBookmarks([...bookmarks, sectionId]);
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20">
              <Book className="h-4 w-4 mr-2" />
              Manifesto per la Democrazia Digitale
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
              Consiglio Cittadino
              <span className="block text-2xl sm:text-3xl font-normal text-blue-200 mt-4">
                Il Sistema che L'Italia Merita
              </span>
            </h1>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              L'analisi di un informatico sui problemi strutturali dell'Italia
              e la proposta concreta per risolverli attraverso la tecnologia democratica
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => setCurrentSection(1)}
                className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  Inizia la Lettura
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <Link
                href="/demo"
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
              >
                <span className="flex items-center justify-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Prova la Demo
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Modern Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Navigation */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Indice</h3>

                <nav className="space-y-3">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setCurrentSection(section.id)}
                        className={`group w-full text-left p-4 rounded-xl transition-all duration-300 ${
                          currentSection === section.id
                            ? `bg-gradient-to-r ${section.gradient} text-white shadow-lg scale-105`
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 p-2 rounded-lg ${
                            currentSection === section.id
                              ? 'bg-white/20'
                              : 'bg-gray-100 group-hover:bg-gray-200'
                          }`}>
                            <IconComponent className={`h-4 w-4 ${
                              currentSection === section.id ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              currentSection === section.id ? 'text-white' : 'text-gray-900'
                            }`}>
                              {section.id}. {section.title}
                            </p>
                            <div className="flex items-center mt-2 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {section.readingTime} min
                              {bookmarks.includes(section.id) && (
                                <Bookmark className="h-3 w-3 ml-2 text-yellow-400 fill-current" />
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Progress */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-700">Progresso di Lettura</span>
                  <span className="text-lg font-bold text-gray-900">
                    {Math.round((currentSection / sections.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${currentSectionData.gradient}`}
                    style={{ width: `${(currentSection / sections.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Sezione {currentSection} di {sections.length}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Section Header */}
              <div className={`bg-gradient-to-r ${currentSectionData.gradient} text-white px-8 py-8`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <currentSectionData.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        {currentSectionData.title}
                      </h2>
                      <div className="flex items-center text-sm text-white/80">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{currentSectionData.readingTime} minuti di lettura</span>
                        <Eye className="h-4 w-4 ml-4 mr-2" />
                        <span>Sezione {currentSection} di {sections.length}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBookmark(currentSectionData.id)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      bookmarks.includes(currentSectionData.id)
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Bookmark className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Section Content */}
              <div className="px-8 py-12">
                <div className="prose prose-lg prose-gray max-w-none">
                  <div className="text-gray-800 leading-relaxed space-y-8 text-lg">
                    {currentSectionData.content.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <h3 key={index} className="text-2xl font-bold text-gray-900 mt-10 mb-6 first:mt-0">
                            {paragraph.replace(/\*\*/g, '')}
                          </h3>
                        );
                      }

                      if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
                        return (
                          <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-xl my-8 italic text-xl font-medium text-blue-900">
                            {paragraph}
                          </blockquote>
                        );
                      }

                      return (
                        <p key={index} className="mb-6 leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="border-t border-gray-200 px-8 py-6 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={prevSection}
                    disabled={currentSection === 1}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      currentSection === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Precedente
                  </button>

                  <div className="flex items-center space-x-3">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setCurrentSection(section.id)}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                          currentSection === section.id
                            ? `bg-gradient-to-r ${section.gradient} scale-125`
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSection}
                    disabled={currentSection === sections.length}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      currentSection === sections.length
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
                    }`}
                  >
                    Successivo
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-2xl text-white p-10 text-center shadow-2xl">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-3xl font-bold mb-6">
                  Trasforma l'Indignazione in Azione
                </h3>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                  Smetti di subire un sistema che non funziona. Costruiamo insieme
                  l'infrastruttura tecnologica per una democrazia che funziona davvero.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/abbonamenti"
                    className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span className="flex items-center justify-center">
                      <Heart className="mr-2 h-5 w-5" />
                      Sostieni il Progetto
                    </span>
                  </Link>
                  <Link
                    href="/demo"
                    className="group bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                  >
                    <span className="flex items-center justify-center">
                      <Zap className="mr-2 h-5 w-5" />
                      Esplora la Demo
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}