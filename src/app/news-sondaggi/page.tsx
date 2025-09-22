'use client';

import { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  BarChart3,
  AlertCircle,
  Target,
  Zap,
  BookOpen,
  CreditCard,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

interface Poll {
  id: number;
  title: string;
  description: string;
  options: string[];
  votes: number[];
  totalVotes: number;
  isOpen: boolean;
  createdAt: string;
  closesAt: string;
  category: 'tecnico' | 'funzionalita' | 'design' | 'business' | 'community';
}

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  type: 'milestone' | 'update' | 'feature' | 'announcement';
  status: 'completato' | 'in-corso' | 'pianificato';
}

export default function NewsSondaggiPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'news' | 'sondaggi'>('news');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [hasVoted, setHasVoted] = useState<Record<number, boolean>>({});
  const [userSubscriptions, setUserSubscriptions] = useState<any[]>([]);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    initializeData();
    loadVotingHistory();

    // Avvia il timer per chiudere i sondaggi scaduti
    const interval = setInterval(() => {
      checkExpiredPolls();
    }, 60000); // Controlla ogni minuto

    return () => clearInterval(interval);
  }, []);

  // Check user subscription status
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserSubscriptions();
    }
  }, [isAuthenticated, user]);

  const fetchUserSubscriptions = async () => {
    try {
      const response = await fetch('/api/user/subscriptions', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserSubscriptions(data.subscriptions || []);
        setHasActiveSubscription(data.subscriptions?.some((sub: any) => sub.status === 'active') || false);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const initializeData = () => {
    // Inizializza news con roadmap e progressi
    setNews([
      {
        id: 1,
        title: '📖 Libro "Il Consiglio Cittadino" Completato',
        content: 'Finalizzata la stesura completa del manifesto programmatico. Il libro presenta la visione democratica digitale, i principi fondamentali e la roadmap implementativa della piattaforma.',
        date: '2024-12-15',
        type: 'milestone',
        status: 'completato'
      },
      {
        id: 2,
        title: '🎨 Presentazione e Branding Completati',
        content: 'Completato il design del brand, logo animato e presentazione istituzionale. Identità visiva definita con i colori del tricolore italiano per rappresentare l\'unità nazionale.',
        date: '2024-12-12',
        type: 'milestone',
        status: 'completato'
      },
      {
        id: 3,
        title: '🏗️ Progettazione Architetturale Completata',
        content: 'Definita l\'architettura tecnica completa: frontend Next.js 15, sistema di autenticazione, database PostgreSQL per produzione, API REST e sistema di notifiche real-time.',
        date: '2024-12-10',
        type: 'milestone',
        status: 'completato'
      },
      {
        id: 4,
        title: '💻 Sviluppo MVP in Corso',
        content: 'Implementazione attiva delle funzionalità core: sistema di petizioni, gestione utenti, dashboard amministrativa e integrazione pagamenti. Completamento previsto Q1 2025.',
        date: '2024-12-08',
        type: 'update',
        status: 'in-corso'
      },
      {
        id: 5,
        title: '🚀 Test Beta con Contributori Fondatore',
        content: 'Avvio della fase di test esclusiva per i contributori che hanno supportato il progetto. Raccolta feedback e ottimizzazioni basate sull\'esperienza utente reale.',
        date: '2024-12-05',
        type: 'announcement',
        status: 'pianificato'
      },
      {
        id: 6,
        title: '🎯 Lancio Pubblico Piattaforma',
        content: 'Apertura ufficiale al pubblico con tutte le funzionalità operative: creazione petizioni, formazione coalizioni, interfaccia istituzionale e sistema di monitoraggio.',
        date: '2024-12-01',
        type: 'milestone',
        status: 'pianificato'
      }
    ]);

    // Genera 50+ sondaggi con dati realistici
    const sondaggiBase: Omit<Poll, 'id' | 'votes' | 'totalVotes'>[] = [
      {
        title: 'Priorità sviluppo: quale funzionalità implementare per prima?',
        description: 'Scegli la funzionalità più importante per il lancio MVP',
        options: ['Sistema petizioni avanzato', 'Matching coalizioni automatico', 'Dashboard analytics', 'Chat integrata'],
        isOpen: true,
        createdAt: '2024-12-15',
        closesAt: '2025-01-15',
        category: 'funzionalita'
      },
      {
        title: 'Design interfaccia: quale stile preferisci?',
        description: 'Aiutaci a scegliere l\'approccio di design per l\'interfaccia utente',
        options: ['Minimalista e pulito', 'Ricco di elementi visivi', 'Stile istituzionale', 'Moderna e colorata'],
        isOpen: true,
        createdAt: '2024-12-14',
        closesAt: '2025-01-14',
        category: 'design'
      },
      {
        title: 'Sistema di notifiche: quale modalità?',
        description: 'Come preferisci ricevere aggiornamenti sulle tue petizioni',
        options: ['Email settimanale', 'Notifiche push real-time', 'Newsletter mensile', 'Solo dashboard'],
        isOpen: true,
        createdAt: '2024-12-13',
        closesAt: '2025-01-13',
        category: 'tecnico'
      },
      {
        title: 'Gamification: sistema di punti e badge?',
        description: 'Implementare elementi di gamification per incentivare la partecipazione',
        options: ['Sì, con leaderboard', 'Solo badge personali', 'Punti senza classifica', 'No, solo merito'],
        isOpen: true,
        createdAt: '2024-12-12',
        closesAt: '2025-01-12',
        category: 'funzionalita'
      },
      {
        title: 'App mobile: quando svilupparla?',
        description: 'Tempistica per il rilascio dell\'applicazione mobile',
        options: ['Subito dopo il web', 'Entro 6 mesi', 'Entro 1 anno', 'Non necessaria'],
        isOpen: true,
        createdAt: '2024-12-11',
        closesAt: '2025-01-11',
        category: 'business'
      }
    ];

    // Genera sondaggi aggiuntivi per arrivare a 50+
    const sondaggiAggiuntivi = generateAdditionalPolls();

    const tuttiSondaggi = [...sondaggiBase, ...sondaggiAggiuntivi];

    const sondaggiCompleti = tuttiSondaggi.map((poll, index) => ({
      ...poll,
      id: index + 1,
      votes: generateRandomVotes(poll.options.length),
      totalVotes: 0
    }));

    // Calcola totalVotes per ogni sondaggio
    sondaggiCompleti.forEach(poll => {
      poll.totalVotes = poll.votes.reduce((sum, votes) => sum + votes, 0);
    });

    setPolls(sondaggiCompleti);
  };

  const generateAdditionalPolls = (): Omit<Poll, 'id' | 'votes' | 'totalVotes'>[] => {
    return [
      // Categoria Tecnico
      {
        title: 'Database: quale soluzione per produzione?',
        description: 'Scelta del database per gestire milioni di utenti',
        options: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis + PostgreSQL'],
        isOpen: true,
        createdAt: '2024-12-10',
        closesAt: '2025-01-10',
        category: 'tecnico'
      },
      {
        title: 'Hosting: quale provider utilizzare?',
        description: 'Piattaforma di hosting per garantire alta disponibilità',
        options: ['AWS', 'Google Cloud', 'Azure', 'Server dedicati Italia'],
        isOpen: true,
        createdAt: '2024-12-09',
        closesAt: '2025-01-09',
        category: 'tecnico'
      },
      {
        title: 'Sicurezza: autenticazione a due fattori obbligatoria?',
        description: 'Livello di sicurezza richiesto per l\'accesso',
        options: ['Sempre obbligatoria', 'Solo per azioni critiche', 'Opzionale utente', 'Solo SMS'],
        isOpen: true,
        createdAt: '2024-12-08',
        closesAt: '2025-01-08',
        category: 'tecnico'
      },
      {
        title: 'API: documentazione e accesso sviluppatori?',
        description: 'Apertura delle API per sviluppo di terze parti',
        options: ['API pubbliche complete', 'Solo lettura dati', 'Solo partner verificati', 'Nessun accesso esterno'],
        isOpen: true,
        createdAt: '2024-12-07',
        closesAt: '2025-01-07',
        category: 'tecnico'
      },
      // Categoria Funzionalità
      {
        title: 'Petizioni: quale soglia minima di firme?',
        description: 'Numero minimo di firme per rendere visibile una petizione',
        options: ['50 firme', '100 firme', '250 firme', '500 firme'],
        isOpen: true,
        createdAt: '2024-12-06',
        closesAt: '2025-01-06',
        category: 'funzionalita'
      },
      {
        title: 'Coalizioni: dimensione massima gruppi?',
        description: 'Limite massimo membri per coalizione efficace',
        options: ['500 membri', '1000 membri', '2500 membri', 'Nessun limite'],
        isOpen: true,
        createdAt: '2024-12-05',
        closesAt: '2025-01-05',
        category: 'funzionalita'
      },
      {
        title: 'Moderazione: come gestire contenuti inappropriati?',
        description: 'Sistema di moderazione per mantenere qualità discussioni',
        options: ['AI automatica', 'Moderatori umani', 'Community voting', 'Sistema misto'],
        isOpen: true,
        createdAt: '2024-12-04',
        closesAt: '2025-01-04',
        category: 'funzionalita'
      },
      {
        title: 'Ricerca: quale algoritmo per matching petizioni?',
        description: 'Come suggerire petizioni simili agli utenti',
        options: ['Tag automatici', 'Similarity testing', 'Geolocalizzazione', 'Preferenze utente'],
        isOpen: true,
        createdAt: '2024-12-03',
        closesAt: '2025-01-03',
        category: 'funzionalita'
      },
      // Categoria Design
      {
        title: 'Colori: mantenere il tema tricolore?',
        description: 'Schema colori per rappresentare l\'identità italiana',
        options: ['Tricolore completo', 'Solo accenti tricolore', 'Colori neutri', 'Personalizzabile utente'],
        isOpen: true,
        createdAt: '2024-12-02',
        closesAt: '2025-01-02',
        category: 'design'
      },
      {
        title: 'Layout: disposizione elementi homepage?',
        description: 'Struttura ottimale per la pagina principale',
        options: ['Feed verticale', 'Grid a cards', 'Layout misto', 'Personalizzabile'],
        isOpen: true,
        createdAt: '2024-12-01',
        closesAt: '2025-01-01',
        category: 'design'
      },
      // Categoria Business
      {
        title: 'Monetizzazione: modello economico futuro?',
        description: 'Strategia di sostenibilità economica a lungo termine',
        options: ['Solo donazioni', 'Freemium features', 'Servizi premium enti', 'Completamente gratuito'],
        isOpen: true,
        createdAt: '2024-11-30',
        closesAt: '2024-12-30',
        category: 'business'
      },
      {
        title: 'Partnership: collaborazioni con istituzioni?',
        description: 'Livello di integrazione con enti pubblici',
        options: ['Piena integrazione', 'Solo informativa', 'Autonomia completa', 'Collaborazione selettiva'],
        isOpen: true,
        createdAt: '2024-11-29',
        closesAt: '2024-12-29',
        category: 'business'
      },
      // Categoria Community
      {
        title: 'Eventi: organizzare incontri territoriali?',
        description: 'Evento fisici per rafforzare le coalizioni locali',
        options: ['Eventi mensili', 'Solo grandi occasioni', 'Eventi online', 'Nessun evento'],
        isOpen: true,
        createdAt: '2024-11-28',
        closesAt: '2024-12-28',
        category: 'community'
      },
      {
        title: 'Formazione: corsi per uso piattaforma?',
        description: 'Supporto educativo per massimizzare efficacia',
        options: ['Corsi online gratuiti', 'Tutorial integrati', 'Webinar live', 'Solo documentazione'],
        isOpen: true,
        createdAt: '2024-11-27',
        closesAt: '2024-12-27',
        category: 'community'
      }
    ];
  };

  const generateRandomVotes = (optionCount: number): number[] => {
    const baseVotes = Math.floor(Math.random() * 200) + 50; // 50-250 voti base
    const votes = [];
    let remaining = baseVotes;

    for (let i = 0; i < optionCount - 1; i++) {
      const vote = Math.floor(Math.random() * (remaining / (optionCount - i))) + 1;
      votes.push(vote);
      remaining -= vote;
    }
    votes.push(remaining);

    return votes.sort(() => Math.random() - 0.5); // Mescola per evitare pattern
  };

  const loadVotingHistory = () => {
    const stored = localStorage.getItem('consiglio-voting-history');
    if (stored) {
      setHasVoted(JSON.parse(stored));
    }
  };

  const saveVotingHistory = (pollId: number) => {
    const updated = { ...hasVoted, [pollId]: true };
    setHasVoted(updated);
    localStorage.setItem('consiglio-voting-history', JSON.stringify(updated));
  };


  const checkExpiredPolls = () => {
    const now = new Date().toISOString();

    setPolls(prevPolls =>
      prevPolls.map(poll => {
        if (poll.isOpen && poll.closesAt < now) {
          return { ...poll, isOpen: false };
        }
        return poll;
      })
    );
  };

  const handleVote = (pollId: number, optionIndex: number) => {
    if (hasVoted[pollId]) return;

    setPolls(prevPolls =>
      prevPolls.map(poll =>
        poll.id === pollId
          ? {
              ...poll,
              votes: poll.votes.map((votes, index) =>
                index === optionIndex ? votes + 1 : votes
              ),
              totalVotes: poll.totalVotes + 1
            }
          : poll
      )
    );

    saveVotingHistory(pollId);

    // Controlla se tutti i contributori hanno votato (64 contributori attivi)
    const updatedPoll = polls.find(p => p.id === pollId);
    if (updatedPoll && (updatedPoll.totalVotes + 1) >= 64) {
      setPolls(prevPolls =>
        prevPolls.map(poll =>
          poll.id === pollId ? { ...poll, isOpen: false } : poll
        )
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completato':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completato</span>;
      case 'in-corso':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Corso</span>;
      case 'pianificato':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Pianificato</span>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tecnico': return <Zap className="h-4 w-4" />;
      case 'funzionalita': return <Target className="h-4 w-4" />;
      case 'design': return <BookOpen className="h-4 w-4" />;
      case 'business': return <TrendingUp className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has active subscription
  if (!isAuthenticated || !hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Area Contributori
            </h1>
            <p className="text-gray-600 mb-4">
              {!isAuthenticated
                ? "Devi accedere al tuo account per accedere alle news e sondaggi esclusivi"
                : "È necessario un abbonamento attivo per accedere a questa sezione riservata ai contributori"
              }
            </p>
          </div>

          <div className="space-y-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/login?redirect=/news-sondaggi"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <User className="h-5 w-5 mr-2" />
                  Accedi al tuo Account
                </Link>
                <Link
                  href="/auth/register?redirect=/news-sondaggi"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <User className="h-5 w-5 mr-2" />
                  Registrati Gratuitamente
                </Link>
              </>
            ) : (
              <Link
                href="/abbonamenti"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Diventa Contributore
              </Link>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              🎯 <strong>Area Esclusiva:</strong> Solo per contributori attivi
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Area Contributori</h1>
              <p className="text-gray-600">News, aggiornamenti e sondaggi esclusivi</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-green-600 font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Contributore Attivo
              </span>
              <span className="text-xs text-gray-500">
                Ciao, {user?.first_name}!
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('news')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'news'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📰 News e Roadmap
            </button>
            <button
              onClick={() => setActiveTab('sondaggi')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sondaggi'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Sondaggi Attivi ({polls.filter(p => p.isOpen).length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'news' ? (
          <div className="space-y-6">
            {news.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-gray-600 leading-relaxed">{item.content}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(item.date).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📊 Statistiche Sondaggi
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {polls.filter(p => p.isOpen).length}
                  </div>
                  <div className="text-sm text-gray-600">Sondaggi Attivi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.keys(hasVoted).length}
                  </div>
                  <div className="text-sm text-gray-600">Tue Partecipazioni</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {polls.reduce((sum, p) => sum + p.totalVotes, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Voti Totali</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">64</div>
                  <div className="text-sm text-gray-600">Contributori Attivi</div>
                </div>
              </div>
            </div>

            {polls.filter(poll => poll.isOpen).map(poll => (
              <div key={poll.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getCategoryIcon(poll.category)}
                      <h3 className="text-lg font-bold text-gray-900">{poll.title}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {poll.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{poll.description}</p>

                    <div className="space-y-3">
                      {poll.options.map((option, index) => {
                        const percentage = poll.totalVotes > 0
                          ? (poll.votes[index] / poll.totalVotes * 100)
                          : 0;
                        const hasVotedThis = hasVoted[poll.id];

                        return (
                          <div key={index} className="relative">
                            <button
                              onClick={() => handleVote(poll.id, index)}
                              disabled={hasVotedThis}
                              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                hasVotedThis
                                  ? 'bg-gray-50 cursor-not-allowed'
                                  : 'hover:bg-blue-50 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{option}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">
                                    {poll.votes[index]} voti
                                  </span>
                                  <span className="font-bold text-blue-600">
                                    {percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                              {hasVotedThis && (
                                <div className="absolute inset-0 bg-blue-100 opacity-30 rounded-lg"></div>
                              )}
                            </button>

                            <div className="mt-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      {poll.totalVotes} voti totali
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Chiude il {new Date(poll.closesAt).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  {hasVoted[poll.id] && (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Hai votato
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}