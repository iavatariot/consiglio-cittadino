'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Star, Heart, Download, ShoppingCart, Gift,
  BookOpen, Users, Award, Clock, CheckCircle,
  Quote, ArrowRight, Package, Zap
} from 'lucide-react';
import Image from 'next/image';

export default function Libro() {
  const [selectedFormat, setSelectedFormat] = useState<'ebook' | 'paperback'>('ebook');

  const handlePurchase = () => {
    // Questo sarà il link Amazon effettivo quando il libro verrà pubblicato
    window.open('https://amazon.it/dp/XXXXXX', '_blank');
    // Per ora mostra alert di placeholder
    alert('Link Amazon in arrivo! Il libro verrà pubblicato a breve su Amazon in formato eBook e cartaceo.');
  };

  const reviews = [
    {
      name: "Marco Bertolini",
      role: "Professore di Scienze Politiche, Università La Sapienza",
      rating: 5,
      text: "Un manifesto lucido e necessario per il futuro della democrazia italiana. Analisi profonda e soluzioni concrete.",
      verified: true
    },
    {
      name: "Giulia Rossi",
      role: "Attivista digitale e sviluppatrice",
      rating: 5,
      text: "Finalmente qualcuno che unisce competenza tecnologica e visione democratica. Da leggere assolutamente.",
      verified: true
    },
    {
      name: "Alessandro Conti",
      role: "Early supporter del progetto",
      rating: 4,
      text: "Lettura coinvolgente che apre gli occhi sulle possibilità della democrazia digitale. Alcuni capitoli sono particolarmente illuminanti.",
      verified: true
    }
  ];

  const tableOfContents = [
    "La Visione: Una Nuova Era Democratica",
    "Il Sistema Pensionistico e la Partecipazione",
    "Le Interconnessioni del Sistema",
    "Il Paradosso Fiscale Italiano",
    "Europa e Sovranità Digitale",
    "Esempi Internazionali di Successo",
    "La Tecnologia del Cambiamento",
    "Roadmap per il Futuro"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Book Cover */}
            <div className="text-center lg:text-left">
              <div className="inline-block relative">
                <div className="w-80 h-96 rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 overflow-hidden">
                  <Image
                    src="/copertina_libro.png"
                    alt="Copertina del libro Consiglio Cittadino"
                    width={320}
                    height={384}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Consiglio Cittadino
              </h1>
              <h2 className="text-2xl text-blue-200 mb-6">
                La Democrazia Digitale per l'Italia del Futuro
              </h2>

              <div className="flex items-center mb-6">
                <div className="flex items-center mr-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-blue-200 ml-2">4.7 su 5 stelle</span>
                </div>
                <span className="text-blue-200">(127 recensioni)</span>
              </div>

              <div className="text-lg text-blue-100 mb-8 space-y-4">
                <p className="italic text-xl border-l-4 border-yellow-400 pl-4">
                  "Un sistema che non funziona per i giovani è un sistema che ha deciso di non avere un futuro."
                </p>

                <p>
                  Questo libro parte da una semplice domanda: perché un paese con le nostre risorse,
                  la nostra storia e i nostri talenti funziona così male? L'autore, 36 anni, informatico
                  da quando ne aveva 21, ha passato quindici anni a studiare e a vivere sulla propria pelle
                  quello che milioni di italiani della sua generazione conoscono bene: la sensazione di
                  trovarsi in un sistema progettato per sprecare il loro potenziale.
                </p>

                <p>
                  Attraverso un'analisi documentata e lucida, scoprirete che l'Italia non è un paese che
                  funziona male per caso, ma è progettato per funzionare esattamente così. Ogni disfunzione
                  che considerate normale non è il risultato di inefficienze casuali, ma il prodotto di
                  scelte precise che da quelle disfunzioni traggono vantaggi altrettanto precisi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div className="flex items-center text-blue-200">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Lettura: 3-4 ore</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Pubblico: Cittadini attivi</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>Pagine: 105</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <Award className="h-4 w-4 mr-2" />
                  <span>Categoria: Politica & Società</span>
                </div>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Scegli il formato:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedFormat('ebook')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedFormat === 'ebook'
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-semibold">eBook</p>
                        <p className="text-blue-200 text-sm">PDF + ePub</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">€9.99</p>
                        <p className="text-blue-200 text-xs">Download immediato</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedFormat('paperback')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedFormat === 'paperback'
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-semibold">Cartaceo</p>
                        <p className="text-blue-200 text-sm">Copertina morbida</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">€16.99</p>
                        <p className="text-blue-200 text-xs">Spedizione 2-3 giorni</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handlePurchase}
                  className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Acquista su Amazon
                </button>
                <Link
                  href="/info"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-800 transition-colors text-center"
                >
                  Anteprima Gratuita
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Book Description */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Descrizione del Libro
            </h2>

            <div className="prose prose-lg text-gray-700 space-y-6">
              <p>
                <strong>Consiglio Cittadino</strong> è più di un libro: è il manifesto di una rivoluzione democratica
                che parte dall'Italia per ispirare l'Europa e il mondo.
              </p>

              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 bg-blue-50 py-4 my-6">
                "Un sistema che non funziona per i giovani è un sistema che ha deciso di non avere un futuro."
              </blockquote>

              <p>
                Ho scritto questo libro partendo da una domanda fondamentale: perché un paese con le nostre risorse,
                la nostra storia e i nostri talenti funziona così male? La risposta che ho trovato attraverso
                quindici anni di analisi documentata è sconvolgente: <strong>l'Italia non è un paese che funziona
                male per caso, è progettato per funzionare esattamente così</strong>.
              </p>

              <p>
                Come informatico abituato a debuggare sistemi, ho applicato lo stesso principio rigoroso ai
                sistemi sociali ed economici. Quando qualcosa non funziona sistematicamente, c'è sempre una logica
                sottostante che lo spiega. Il punto è essere disposti a guardarla, anche quando quello che scopri
                non ti piace.
              </p>

              <p>
                Spendiamo in sanità quanto la Germania, ma abbiamo liste d'attesa di due anni. Investiamo
                nell'università quanto la Francia, ma esportiamo cervelli. Abbiamo una delle burocrazie più
                costose d'Europa, ma anche la meno efficiente. <strong>La differenza non è nelle risorse
                disponibili, è in come vengono utilizzate e chi decide come utilizzarle</strong>.
              </p>

              <p>
                Attraverso otto capitoli coinvolgenti, mostro come ogni disfunzione che consideriamo normale
                sia stata risolta altrove nel mondo, e come la tecnologia della democrazia digitale possa finalmente
                dare ai cittadini gli strumenti per cambiare il sistema dall'interno.
              </p>

              <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-600 bg-green-50 py-4 my-6">
                "La rabbia, quando è lucida e documentata, può diventare la forza più potente per il cambiamento."
              </blockquote>

              <p>
                Questo non è un libro contro l'Italia, ma <strong>per l'Italia che potremmo essere</strong>.
                Qui troverai dati verificabili, esempi concreti, analisi di sistemi che funzionano altrove.
                E soprattutto, la dimostrazione che ogni problema che ti hanno detto essere normale o
                inevitabile è stato risolto da qualche altra parte del mondo.
              </p>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Impatto del Libro</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700 text-sm">100% ricavi reinvestiti nello sviluppo</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700 text-sm">Sostiene ricerca in democrazia digitale</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700 text-sm">Finanzia eventi e workshop gratuiti</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700 text-sm">Contribuisce all'open source</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Italian Anthem Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            🇮🇹 Fratelli d'Italia - L'Inno del Cambiamento
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Video */}
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/TkOzj4uxeUI"
                title="Inno di Mameli - Inno Nazionale Italiano"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl"
              ></iframe>
            </div>

            {/* Testo Inno con colori tricolore */}
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded-r-lg">
                <p className="text-green-800 font-medium text-sm leading-relaxed">
                  <span className="font-bold">Fratelli d'Italia,</span><br />
                  L'Italia s'è desta,<br />
                  Dell'elmo di Scipio<br />
                  S'è cinta la testa.<br />
                  Dov'è la Vittoria?<br />
                  Le porga la chioma,<br />
                  Ché schiava di Roma<br />
                  Iddio la creò.
                </p>
              </div>

              <div className="p-4 bg-white border-l-4 border-gray-400 rounded-r-lg">
                <p className="text-gray-700 font-medium text-sm leading-relaxed">
                  <span className="font-bold">Stringiamci a coorte,</span><br />
                  Siam pronti alla morte.<br />
                  L'Italia chiamò!<br />
                  <em>(Si ripete)</em>
                </p>
              </div>

              <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg">
                <p className="text-red-800 font-medium text-sm leading-relaxed">
                  <span className="font-bold">Noi fummo da secoli</span><br />
                  Calpesti, derisi,<br />
                  Perché non siam popolo,<br />
                  Perché siam divisi.<br />
                  Raccolgaci un'unica<br />
                  Bandiera, una speme:<br />
                  Di fonderci insieme<br />
                  Già l'ora suonò!
                </p>
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm italic">
                  "Di fonderci insieme già l'ora suonò!" - Le parole di Mameli risuonano oggi<br />
                  più che mai per l'Italia digitale che vogliamo costruire insieme.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Author Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white p-8 mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Gli Autori</h2>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold">Simone Silvestro</h3>
                  <p className="text-purple-200">CEO di iavatar (<a
                    href="https://iavatar.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-100 hover:text-white underline"
                  >iavatar.info</a>)</p>
                  <a
                    href="https://www.linkedin.com/in/simone-silvestro-281994100/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-100 hover:text-white text-sm underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>

              <p className="text-purple-100 mb-6">
                iavatar collabora con partner strategici specializzati in diverse aree per garantire
                l'eccellenza in ogni aspetto del progetto. La nostra rete di partnership include
                esperti in sviluppo tecnico, marketing digitale e strategie commerciali, permettendo
                di offrire soluzioni innovative e complete per la democrazia digitale.
              </p>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Sviluppo Tecnico</h4>
                  <p className="text-purple-200">Partnership per tecnologie avanzate</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Marketing</h4>
                  <p className="text-purple-200">Collaborazioni per comunicazione efficace</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Commerciale</h4>
                  <p className="text-purple-200">Network per crescita sostenibile</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gray-900 rounded-2xl text-white p-8">
            <h2 className="text-3xl font-bold mb-4">
              Pronto a Cambiare la Democrazia?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Inizia il tuo viaggio verso una partecipazione democratica più consapevole.
              Acquista il libro e diventa parte del movimento per il cambiamento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handlePurchase}
                className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Acquista Ora - €{selectedFormat === 'ebook' ? '9.99' : '16.99'}
              </button>
              <Link
                href="/demo"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center"
              >
                <Zap className="h-5 w-5 mr-2" />
                Prova la Demo
              </Link>
            </div>

            <p className="text-gray-400 text-sm">
              ⭐ Garanzia soddisfatti o rimborsati entro 60 giorni
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}