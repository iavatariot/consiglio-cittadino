'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail, MessageSquare, Globe, Github, Twitter, Linkedin,
  Send, CheckCircle, Users, Code, Heart, Target, Lightbulb,
  Clock, Shield, Zap
} from 'lucide-react';

export default function Contatti() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      alert('Demo: Messaggio inviato! Nell\'app reale riceveresti una conferma via email.');
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const categories = [
    { value: 'partnership', label: 'Partnership e Collaborazioni' },
    { value: 'press', label: 'Media e Stampa' },
    { value: 'support', label: 'Supporto Tecnico Demo' },
    { value: 'investment', label: 'Opportunità di Investimento' },
    { value: 'feedback', label: 'Feedback sul Progetto' },
    { value: 'other', label: 'Altro' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Contattiamo il Futuro
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Hai un'idea per migliorare la democrazia digitale? Vuoi collaborare con noi?
            Crediamo che le migliori innovazioni nascano dal dialogo e dalla collaborazione.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Scrivici
            </h2>

            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Messaggio Inviato!
                </h3>
                <p className="text-gray-600">
                  Ti risponderemo entro 24 ore. Grazie per averci contattato!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome e Cognome *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Il tuo nome completo"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="la-tua-email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleziona una categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Oggetto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Oggetto del messaggio"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Messaggio *
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descrivi la tua richiesta, idea o proposta..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Invia Messaggio
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Informazioni di Contatto
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email Principale</p>
                    <a
                      href="mailto:info@iavatar.info"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      info@iavatar.info
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Risposta entro 24 ore
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Community</p>
                    <p className="text-gray-600 text-sm">Discord & Telegram</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Presto disponibili
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sede Legale</p>
                    <p className="text-gray-600 text-sm">Italia</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Dettagli su richiesta
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Tempi di Risposta
              </h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Partnership & Collaborazioni</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">24-48h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Media & Stampa</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Stesso giorno</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Supporto Tecnico</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">2-3 giorni</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Feedback Progetto</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">1 settimana</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Seguici Online
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Github className="h-5 w-5 text-gray-600 group-hover:text-black mr-2" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-black">GitHub</span>
                </a>

                <a
                  href="#"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Twitter className="h-5 w-5 text-gray-600 group-hover:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-400">Twitter</span>
                </a>

                <a
                  href="#"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Linkedin className="h-5 w-5 text-gray-600 group-hover:text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">LinkedIn</span>
                </a>

                <a
                  href="#"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <MessageSquare className="h-5 w-5 text-gray-600 group-hover:text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-500">Forum</span>
                </a>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Newsletter</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Aggiornamenti sui progressi del progetto e sullo sviluppo della piattaforma.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="la-tua-email@example.com"
                    className="flex-1 px-3 py-2 border border-blue-200 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors text-sm">
                    Iscriviti
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* iavatar.info Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-2xl text-white p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold">iavatar.info</h2>
                  <p className="text-purple-200 text-lg">Tecnologia per il bene comune</p>
                </div>
              </div>

              <p className="text-blue-100 max-w-4xl mx-auto text-lg leading-relaxed">
                Siamo un'organizzazione dedicata allo sviluppo di soluzioni tecnologiche innovative
                per migliorare la partecipazione democratica e il coinvolgimento civico.
                Il nostro team combina competenze tecniche avanzate, esperienza in design UX
                e una profonda passione per l'innovazione sociale.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-300" />
                </div>
                <h3 className="font-bold text-lg mb-2">Mission-Driven</h3>
                <p className="text-blue-200 text-sm">
                  Ogni progetto è guidato dall'obiettivo di creare impatto sociale positivo
                  e migliorare la vita dei cittadini.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-300" />
                </div>
                <h3 className="font-bold text-lg mb-2">Team Multidisciplinare</h3>
                <p className="text-blue-200 text-sm">
                  Sviluppatori, designer, ricercatori e attivisti digitali
                  lavorano insieme per creare soluzioni complete.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-300" />
                </div>
                <h3 className="font-bold text-lg mb-2">Open Source</h3>
                <p className="text-blue-200 text-sm">
                  Crediamo nella trasparenza e nella condivisione della conoscenza
                  per accelerare l'innovazione sociale.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <h3 className="font-bold text-xl mb-4">Opportunità di Collaborazione</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Shield className="h-5 w-5 text-green-300 mr-2" />
                    <span className="font-semibold">Partnership Istituzionali</span>
                  </div>
                  <p className="text-blue-200 text-sm">
                    Collaboriamo con università, ONG e istituzioni per sviluppare
                    progetti di civic technology e democrazia partecipativa.
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Zap className="h-5 w-5 text-yellow-300 mr-2" />
                    <span className="font-semibold">Consulenza Tecnica</span>
                  </div>
                  <p className="text-blue-200 text-sm">
                    Offriamo consulenza su progetti di civic tech, democrazia digitale
                    e sviluppo di piattaforme di partecipazione cittadina.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8">
            <h2 className="text-2xl font-bold mb-4">
              Vuoi Sostenere il Progetto?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Il modo migliore per supportarci è sottoscrivere un abbonamento.
              Ogni contributo ci aiuta a sviluppare una piattaforma sempre migliore per la democrazia digitale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/abbonamenti"
                className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
              >
                Sostieni con €50/anno
              </Link>
              <Link
                href="/demo"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-800 transition-colors"
              >
                Prova la Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}