'use client';

import Link from 'next/link';
import { Users, FileText, Target, ArrowRight, Play, TrendingUp, CheckCircle } from 'lucide-react';
import { useLiveCounters } from '@/hooks/useLiveCounters';

export default function Home() {
  const counters = useLiveCounters();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              La Democrazia Digitale che{' '}
              <span className="text-yellow-400">l'Italia stava aspettando</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Trasforma le tue idee in petizioni, le petizioni in movimenti,
              i movimenti in cambiamento reale
            </p>

            {/* Video Demo */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto"
                  poster="/Creazione_Logo_Animato_Consiglio_Cittadino.mp4"
                >
                  <source src="/Creazione_Logo_Animato_Consiglio_Cittadino.mp4" type="video/mp4" />
                  <div className="bg-black/50 rounded-lg p-8 border-2 border-white/20">
                    <div className="flex items-center justify-center space-x-4">
                      <Play className="h-16 w-16 text-white" />
                      <div className="text-left">
                        <p className="text-lg font-semibold">Logo Animato Consiglio Cittadino</p>
                        <p className="text-blue-200">Il tuo browser non supporta i video HTML5</p>
                      </div>
                    </div>
                  </div>
                </video>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/demo"
                className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors flex items-center"
              >
                Prova la Demo Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/abbonamenti"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-800 transition-colors"
              >
                Sostieni il Progetto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {counters.citizens.toLocaleString('it-IT')}
              </div>
              <div className="text-gray-600">cittadini coinvolti</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                {counters.petitions.toLocaleString('it-IT')}
              </div>
              <div className="text-gray-600">petizioni simulate in test</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                {counters.coalitions}
              </div>
              <div className="text-gray-600">coalizioni testate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
                {counters.subscribers}
              </div>
              <div className="text-gray-600">abbonamenti attivi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              L'Italia ha Bisogno di Cambiare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I dati parlano chiaro: la disaffezione democratica cresce,
              ma la tecnologia può riavvicinare i cittadini alle istituzioni
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-8 rounded-xl border border-red-200">
              <div className="text-4xl font-bold text-red-600 mb-4">67%</div>
              <p className="text-gray-700">
                <strong>dei giovani italiani</strong> non si sente rappresentato dalle istituzioni
                <span className="block text-sm text-gray-500 mt-2">Fonte: ISTAT 2023</span>
              </p>
            </div>
            <div className="bg-yellow-50 p-8 rounded-xl border border-yellow-200">
              <div className="text-4xl font-bold text-yellow-600 mb-4">23%</div>
              <p className="text-gray-700">
                <strong>di partecipazione</strong> alle elezioni europee tra i 18-25 anni
                <span className="block text-sm text-gray-500 mt-2">Fonte: Ministero dell'Interno</span>
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-4">8/10</div>
              <p className="text-gray-700">
                <strong>cittadini</strong> vorrebbero più voce nelle decisioni politiche
                <span className="block text-sm text-gray-500 mt-2">Fonte: CENSIS 2023</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Preview */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Come Consiglio Cittadino Cambia le Cose
            </h2>
            <p className="text-xl text-gray-600">
              Un percorso democratico in tre fasi per trasformare le idee in realtà
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Dalle Idee alle Petizioni
              </h3>
              <p className="text-gray-600 mb-4">
                Sistema di validazione democratica che trasforma le idee dei cittadini
                in petizioni strutturate con supporto legale e procedurale.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Template guidati per petizioni efficaci
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Controllo automatico conformità normativa
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Suggerimenti miglioramento testo
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Dalle Petizioni ai Movimenti
              </h3>
              <p className="text-gray-600 mb-4">
                Formazione di coalizioni territoriali e tematiche con sistema
                di leadership democratica e coordinamento strategico.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Matching automatico affinità tematiche
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Elezioni democratiche leadership
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Strumenti coordinamento campagne
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Dai Movimenti al Cambiamento
              </h3>
              <p className="text-gray-600 mb-4">
                Interface diretta con istituzioni per presentazione formale
                delle proposte e monitoraggio trasparente dell'iter legislativo.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  Protocolli istituzionali automatizzati
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  Tracking tempo reale iter normativo
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  Dashboard trasparenza decisionale
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/demo"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Esplora la Demo Completa
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Unisciti alla Rivoluzione Democratica
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Diventa parte del cambiamento. Sostieni lo sviluppo della piattaforma
            che ridurrà la distanza tra cittadini e istituzioni.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/abbonamenti"
              className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors"
            >
              Sostieni con €50/anno
            </Link>
            <Link
              href="/info"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-800 transition-colors"
            >
              Leggi il Manifesto
            </Link>
          </div>

          <div className="mt-8 text-sm text-blue-200">
            <TrendingUp className="inline h-4 w-4 mr-1" />
            Totale raccolto: €{(counters.subscribers * 50).toLocaleString('it-IT')}
            <span className="mx-2">•</span>
            Obiettivo: €500.000 per lancio completo (10.000 cittadini attivi)
          </div>
        </div>
      </section>
    </div>
  );
}