'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const InteractiveMapWrapper = dynamic(() => import('@/components/InteractiveMapWrapper'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Caricamento mappa interattiva...</p>
      </div>
    </div>
  )
});

// Sistema di Gamification Completo
const gamificationLevels = [
  { level: 1, name: "Novizio Civico", minPoints: 0, badge: "🌱", color: "bg-green-100 text-green-700" },
  { level: 2, name: "Cittadino Attivo", minPoints: 100, badge: "👤", color: "bg-blue-100 text-blue-700" },
  { level: 3, name: "Promotore", minPoints: 500, badge: "📢", color: "bg-yellow-100 text-yellow-700" },
  { level: 4, name: "Influencer Civico", minPoints: 1000, badge: "⭐", color: "bg-orange-100 text-orange-700" },
  { level: 5, name: "Leader Comunitario", minPoints: 2000, badge: "👑", color: "bg-purple-100 text-purple-700" },
  { level: 6, name: "Coordinatore", minPoints: 3500, badge: "🎯", color: "bg-red-100 text-red-700" },
  { level: 7, name: "Ambasciatore", minPoints: 5000, badge: "🌟", color: "bg-indigo-100 text-indigo-700" },
  { level: 8, name: "Maestro Democratico", minPoints: 7500, badge: "🏆", color: "bg-pink-100 text-pink-700" }
];

const badges = [
  { id: 'first_announcement', name: 'Primo Annuncio', icon: '📣', description: 'Ha creato il primo annuncio' },
  { id: 'manifesto_creator', name: 'Creatore di Manifesti', icon: '📋', description: 'Ha trasformato un annuncio in manifesto' },
  { id: 'coalition_founder', name: 'Fondatore Coalizione', icon: '🤝', description: 'Ha fondato una coalizione' },
  { id: 'petition_master', name: 'Maestro delle Petizioni', icon: '✍️', description: 'Ha creato 5+ petizioni' },
  { id: 'vote_champion', name: 'Campione del Voto', icon: '🗳️', description: 'Ha partecipato a 10+ votazioni' },
  { id: 'id_verified', name: 'Identità Verificata', icon: '🆔', description: 'Identità digitale confermata' },
  { id: 'discussion_leader', name: 'Leader delle Discussioni', icon: '💬', description: 'Partecipazione attiva nelle discussioni' }
];

// Regioni con emoji tipiche e caratteristiche regionali
const italianRegions = [
  {
    name: "Lombardia",
    emoji: "🏭", // Industria milanese
    population: "10.1M",
    petitions: 156,
    signatures: 45782,
    capital: "Milano",
    provinces: ["Milano", "Bergamo", "Brescia", "Como", "Cremona", "Mantova", "Pavia", "Sondrio", "Varese", "Lecco", "Lodi", "Monza e Brianza"],
    specialty: "Centro economico d'Italia",
    trending: "+18%"
  },
  {
    name: "Lazio",
    emoji: "🏛️", // Roma capitale
    population: "5.9M",
    petitions: 134,
    signatures: 38945,
    capital: "Roma",
    provinces: ["Roma", "Frosinone", "Latina", "Rieti", "Viterbo"],
    specialty: "Sede delle istituzioni",
    trending: "+25%"
  },
  {
    name: "Campania",
    emoji: "🍕", // Pizza napoletana
    population: "5.8M",
    petitions: 128,
    signatures: 35672,
    capital: "Napoli",
    provinces: ["Napoli", "Avellino", "Benevento", "Caserta", "Salerno"],
    specialty: "Patrimonio UNESCO",
    trending: "+22%"
  },
  {
    name: "Veneto",
    emoji: "🎭", // Carnevale di Venezia
    population: "4.9M",
    petitions: 112,
    signatures: 32154,
    capital: "Venezia",
    provinces: ["Venezia", "Belluno", "Padova", "Rovigo", "Treviso", "Verona", "Vicenza"],
    specialty: "Arte e cultura",
    trending: "+15%"
  },
  {
    name: "Sicilia",
    emoji: "🍋", // Limoni siciliani
    population: "5.0M",
    petitions: 98,
    signatures: 28734,
    capital: "Palermo",
    provinces: ["Palermo", "Agrigento", "Caltanissetta", "Catania", "Enna", "Messina", "Ragusa", "Siracusa", "Trapani"],
    specialty: "Isola del sole",
    trending: "+28%"
  },
  {
    name: "Emilia-Romagna",
    emoji: "🧀", // Parmigiano Reggiano
    population: "4.5M",
    petitions: 89,
    signatures: 26891,
    capital: "Bologna",
    provinces: ["Bologna", "Ferrara", "Forlì-Cesena", "Modena", "Parma", "Piacenza", "Ravenna", "Reggio nell'Emilia", "Rimini"],
    specialty: "Terra della buona tavola",
    trending: "+12%"
  },
  {
    name: "Piemonte",
    emoji: "🍾", // Vini piemontesi
    population: "4.4M",
    petitions: 87,
    signatures: 25634,
    capital: "Torino",
    provinces: ["Torino", "Alessandria", "Asti", "Biella", "Cuneo", "Novara", "Verbano-Cusio-Ossola", "Vercelli"],
    specialty: "Vini pregiati",
    trending: "+9%"
  },
  {
    name: "Puglia",
    emoji: "🫒", // Ulivi pugliesi
    population: "4.0M",
    petitions: 76,
    signatures: 22156,
    capital: "Bari",
    provinces: ["Bari", "Barletta-Andria-Trani", "Brindisi", "Foggia", "Lecce", "Taranto"],
    specialty: "Olio d'oliva DOP",
    trending: "+31%"
  },
  {
    name: "Toscana",
    emoji: "🍷", // Chianti
    population: "3.7M",
    petitions: 72,
    signatures: 21847,
    capital: "Firenze",
    provinces: ["Firenze", "Arezzo", "Grosseto", "Livorno", "Lucca", "Massa-Carrara", "Pisa", "Pistoia", "Prato", "Siena"],
    specialty: "Culla del Rinascimento",
    trending: "+14%"
  },
  {
    name: "Calabria",
    emoji: "🌶️", // Peperoncino calabrese
    population: "1.9M",
    petitions: 45,
    signatures: 12456,
    capital: "Catanzaro",
    provinces: ["Catanzaro", "Cosenza", "Crotone", "Reggio Calabria", "Vibo Valentia"],
    specialty: "Terra del peperoncino",
    trending: "+41%"
  },
  {
    name: "Sardegna",
    emoji: "🏖️", // Spiagge paradisiache
    population: "1.6M",
    petitions: 38,
    signatures: 11234,
    capital: "Cagliari",
    provinces: ["Cagliari", "Nuoro", "Oristano", "Sassari", "Sud Sardegna"],
    specialty: "Spiagge da sogno",
    trending: "+35%"
  },
  {
    name: "Liguria",
    emoji: "🌿", // Pesto genovese
    population: "1.5M",
    petitions: 34,
    signatures: 9876,
    capital: "Genova",
    provinces: ["Genova", "Imperia", "La Spezia", "Savona"],
    specialty: "Pesto e focaccia",
    trending: "+16%"
  },
  {
    name: "Marche",
    emoji: "👞", // Calzature marchigiane
    population: "1.5M",
    petitions: 32,
    signatures: 9234,
    capital: "Ancona",
    provinces: ["Ancona", "Ascoli Piceno", "Fermo", "Macerata", "Pesaro e Urbino"],
    specialty: "Artigianato di qualità",
    trending: "+8%"
  },
  {
    name: "Abruzzo",
    emoji: "🐻", // Orso marsicano
    population: "1.3M",
    petitions: 29,
    signatures: 8567,
    capital: "L'Aquila",
    provinces: ["L'Aquila", "Chieti", "Pescara", "Teramo"],
    specialty: "Parchi naturali",
    trending: "+19%"
  },
  {
    name: "Friuli-Venezia Giulia",
    emoji: "🥖", // Prosciutto San Daniele
    population: "1.2M",
    petitions: 26,
    signatures: 7891,
    capital: "Trieste",
    provinces: ["Gorizia", "Pordenone", "Trieste", "Udine"],
    specialty: "Prosciutto San Daniele",
    trending: "+11%"
  },
  {
    name: "Trentino-Alto Adige",
    emoji: "🎿", // Sci alpino
    population: "1.1M",
    petitions: 24,
    signatures: 7234,
    capital: "Trento",
    provinces: ["Bolzano", "Trento"],
    specialty: "Turismo montano",
    trending: "+6%"
  },
  {
    name: "Umbria",
    emoji: "🕊️", // San Francesco
    population: "0.9M",
    petitions: 21,
    signatures: 6456,
    capital: "Perugia",
    provinces: ["Perugia", "Terni"],
    specialty: "Spiritualità e pace",
    trending: "+13%"
  },
  {
    name: "Basilicata",
    emoji: "🏛️", // Sassi di Matera
    population: "0.6M",
    petitions: 15,
    signatures: 4123,
    capital: "Potenza",
    provinces: ["Matera", "Potenza"],
    specialty: "Sassi di Matera",
    trending: "+44%"
  },
  {
    name: "Molise",
    emoji: "🌾", // Grano duro
    population: "0.3M",
    petitions: 8,
    signatures: 2456,
    capital: "Campobasso",
    provinces: ["Campobasso", "Isernia"],
    specialty: "Tradizioni rurali",
    trending: "+27%"
  },
  {
    name: "Valle d'Aosta",
    emoji: "⛰️", // Monte Bianco
    population: "0.1M",
    petitions: 5,
    signatures: 1234,
    capital: "Aosta",
    provinces: ["Aosta"],
    specialty: "Vette alpine",
    trending: "+5%"
  }
];

export default function DemoPage() {
  const [selectedRegion, setSelectedRegion] = useState("Lombardia");
  const [userStats, setUserStats] = useState({
    name: "Alessandro Rossi",
    points: 2847,
    level: 6,
    petitionsSigned: 23,
    proposalsCreated: 4,
    coalitionsJoined: 2,
    announcementsCreated: 3,
    manifestosCreated: 1,
    votesParticipated: 12,
    badges: ['first_announcement', 'manifesto_creator', 'spid_verified'],
    spidVerified: true
  });
  const [liveActivity, setLiveActivity] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reactions, setReactions] = useState<{[key: string]: number}>({
    '👍': 127, '❤️': 89, '🚀': 56, '🔥': 203, '🎆': 34
  });
  const [showToast, setShowToast] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning';
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([
    {
      id: '1',
      type: 'success',
      message: '🎉 Il tuo annuncio "Trasporti Sostenibili" ha ricevuto 50+ consensi! Può diventare un manifesto.',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '2',
      type: 'info',
      message: '🗳️ Nuova votazione nella coalizione "Ambiente Verde" per il ruolo di Coordinatore.',
      timestamp: new Date(Date.now() - 7200000),
      read: false
    }
  ]);
  const [activeTab, setActiveTab] = useState<'announcements' | 'manifestos' | 'coalitions' | 'petitions'>('announcements');
  const [showCreateModal, setShowCreateModal] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [aiGuidance, setAiGuidance] = useState({
    isActive: false,
    step: 0,
    suggestions: [] as string[]
  });
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Simulazione attività live
  useEffect(() => {
    const activities = [
      "📢 Marco R. ha creato un nuovo annuncio: 'Bike Sharing Urbano'",
      "📋 Annuncio 'Energia Rinnovabile' trasformato in manifesto",
      "🤝 Coalizione 'Smart City' ha raggiunto 500 membri",
      "✍️ Petizione 'Parchi Verdi' ha superato 1000 firme",
      "🗳️ Elezioni interne in 'Coalizione Ambiente' - 89% partecipazione digitale",
      "🎯 Giulia S. è stata eletta Coordinatrice con 234 voti verificati",
      "🌟 Alessandro R. ha raggiunto il livello Coordinatore!",
      "🔥 Manifesto 'Smart City 2030' ha ricevuto 300+ endorsement",
      "🚀 Nuova coalizione 'Innovazione Digitale' fondata da Tech Lorenzo",
      "💬 Discussione accesa su 'Educazione Digitale' - 156 partecipanti"
    ];

    const interval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLiveActivity(prev => [randomActivity, ...prev.slice(0, 9)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Tour guidato steps
  const tourSteps = [
    {
      target: '.user-dashboard',
      title: '👋 Benvenuto nel tuo Dashboard!',
      description: 'Qui puoi vedere il tuo livello, punti e badge conquistati. Ogni azione ti fa guadagnare punti per salire di livello!'
    },
    {
      target: '.flow-navigation',
      title: '🗳️ Il Flusso Democratico',
      description: 'Questo è il cuore della piattaforma: Annuncio → Manifesto → Coalizione → Petizione. Ogni fase ha requisiti specifici!'
    },
    {
      target: '.live-activity',
      title: '⚡ Attività Live',
      description: 'Qui vedi in tempo reale cosa succede nella community. Ogni aggiornamento rappresenta azioni reali di altri utenti!'
    },
    {
      target: '.map-section',
      title: '🇮🇹 Mappa Partecipazione',
      description: 'Esplora la partecipazione nelle diverse regioni italiane. Clicca su una regione per vedere i dettagli!'
    }
  ];

  const handleAction = (action: string, points: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setUserStats(prev => {
        const newPoints = prev.points + points;
        const currentLevel = gamificationLevels.find(l => newPoints >= l.minPoints &&
          (gamificationLevels[gamificationLevels.indexOf(l) + 1]?.minPoints || Infinity) > newPoints);

        return {
          ...prev,
          points: newPoints,
          level: currentLevel?.level || prev.level,
          petitionsSigned: action.includes('Firma') ? prev.petitionsSigned + 1 : prev.petitionsSigned,
          proposalsCreated: action.includes('Crea') ? prev.proposalsCreated + 1 : prev.proposalsCreated,
          announcementsCreated: action.includes('Annuncio') ? prev.announcementsCreated + 1 : prev.announcementsCreated,
          manifestosCreated: action.includes('Manifesto') ? prev.manifestosCreated + 1 : prev.manifestosCreated,
          votesParticipated: action.includes('Vota') ? prev.votesParticipated + 1 : prev.votesParticipated
        };
      });
      setLiveActivity(prev => [`🎯 ${userStats.name}: ${action}`, ...prev.slice(0, 4)]);
      setShowToast(`✨ +${points} punti! ${action}`);
      setIsLoading(false);

      // Auto-hide toast
      setTimeout(() => setShowToast(null), 3000);
    }, 1000);
  };

  const handleReaction = (emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: prev[emoji] + 1
    }));
    setShowToast(`${emoji} Reazione aggiunta!`);
    setTimeout(() => setShowToast(null), 2000);
  };

  const startCreationFlow = (type: string) => {
    setShowCreateModal(type);
    setAiGuidance({
      isActive: true,
      step: 0,
      suggestions: type === 'announcement' ? [
        "💡 Scegli un titolo chiaro e coinvolgente per il tuo annuncio",
        "🎯 Descrivi il problema che vuoi risolvere in modo specifico",
        "📊 Aggiungi dati o esempi per rendere la proposta più convincente",
        "🤝 Invita altri cittadini a partecipare e dare il loro consenso"
      ] : []
    });
  };

  const handleTourNext = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setShowTour(false);
      setTourStep(0);
    }
  };

  const currentUserLevel = gamificationLevels.find(level =>
    userStats.points >= level.minPoints &&
    (gamificationLevels[gamificationLevels.indexOf(level) + 1]?.minPoints || Infinity) > userStats.points
  ) || gamificationLevels[0];

  const nextLevel = gamificationLevels[gamificationLevels.indexOf(currentUserLevel) + 1];
  const progressToNext = nextLevel ?
    ((userStats.points - currentUserLevel.minPoints) / (nextLevel.minPoints - currentUserLevel.minPoints)) * 100 : 100;

  const selectedRegionData = italianRegions.find(r => r.name === selectedRegion) || italianRegions[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header professionale */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center text-white">
            <div>
              <h1 className="text-4xl font-bold mb-2">Consiglio Cittadino</h1>
              <p className="text-blue-100">Piattaforma Demo Interattiva • Simulazione Completa</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Tour Button */}
              <button
                onClick={() => setShowTour(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium shadow-lg"
              >
                <span>🎯</span>
                <span>Tour Guidato</span>
              </button>

              {/* Notifiche */}
              <div className="relative">
                <button className="relative p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                  <span className="text-xl">🔔</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Attività Live */}
        <div className="w-80 min-h-screen bg-white shadow-lg live-activity">
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 px-4 py-6 text-white">
            <h3 className="text-xl font-bold flex items-center">
              ⚡ Attività Live
            </h3>
            <p className="text-blue-100 text-sm mt-1">Aggiornamenti in tempo reale</p>
          </div>

          <div className="p-4">
            <div className="space-y-3 h-screen overflow-y-auto">
              {liveActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`bg-blue-50 border-l-4 border-blue-400 rounded-lg p-3 text-sm transition-all duration-500 ${
                    index === 0 ? 'animate-pulse bg-blue-100' : ''
                  }`}
                >
                  {activity}
                  <div className="text-xs text-gray-500 mt-1">
                    {index === 0 ? 'Ora' : `${index + 1} min fa`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenuto Principale */}
        <div className="flex-1 container mx-auto px-4 py-8">
          {/* Dashboard Utente Avanzato */}
          <div className="max-w-6xl mx-auto mb-8 user-dashboard">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl">
                        {currentUserLevel.badge}
                      </div>
                      {userStats.spidVerified && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs">🔐</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{userStats.name}</h2>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentUserLevel.color} bg-white`}>
                        {currentUserLevel.badge} {currentUserLevel.name} • Livello {userStats.level}
                      </div>
                      <div className="text-blue-100 font-semibold mt-1">
                        {userStats.points.toLocaleString('it-IT')} punti
                        {userStats.spidVerified && <span className="ml-2">• ID Verificato ✅</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-lg">Prossimo Livello</div>
                    {nextLevel ? (
                      <>
                        <div className="text-2xl font-bold text-blue-100">{nextLevel.name}</div>
                        <div className="text-sm text-blue-200">
                          {nextLevel.minPoints - userStats.points} punti mancanti
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-yellow-200">🏆 Livello Massimo!</div>
                    )}
                  </div>
                </div>

                {/* Barra Progresso */}
                {nextLevel && (
                  <div className="mt-4">
                    <div className="w-full bg-blue-700 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                        style={{width: `${progressToNext}%`}}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-6 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{userStats.announcementsCreated}</div>
                    <div className="text-gray-600">Annunci</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{userStats.manifestosCreated}</div>
                    <div className="text-gray-600">Manifesti</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{userStats.coalitionsJoined}</div>
                    <div className="text-gray-600">Coalizioni</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{userStats.petitionsSigned}</div>
                    <div className="text-gray-600">Petizioni</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{userStats.votesParticipated}</div>
                    <div className="text-gray-600">Voti Digitali</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{userStats.badges.length}</div>
                    <div className="text-gray-600">Badge</div>
                  </div>
                </div>

                {/* Badge Utente */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">🏆 I Tuoi Badge</h4>
                  <div className="flex flex-wrap gap-3">
                    {userStats.badges.map(badgeId => {
                      const badge = badges.find(b => b.id === badgeId);
                      return badge ? (
                        <div key={badgeId} className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full text-sm">
                          <span className="mr-2">{badge.icon}</span>
                          {badge.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifiche Sistema */}
          {notifications.filter(n => !n.read).length > 0 && (
            <div className="max-w-6xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  🔔 Notifiche Importanti ({notifications.filter(n => !n.read).length})
                </h3>
                <div className="space-y-3">
                  {notifications.filter(n => !n.read).slice(0, 2).map(notification => (
                    <div key={notification.id} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-400">
                      <p className="text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.timestamp.toLocaleString('it-IT')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigazione Flusso Democratico */}
          <div className="max-w-6xl mx-auto mb-8 flow-navigation">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🗳️ Flusso Democratico Digitale
              </h2>

              {/* Flow Chart */}
              <div className="flex justify-center items-center space-x-4 mb-6 overflow-x-auto">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === 'announcements' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    📢 Annunci
                  </button>
                  <div className="text-gray-400">→</div>
                  <button
                    onClick={() => setActiveTab('manifestos')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === 'manifestos' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    📋 Manifesti
                  </button>
                  <div className="text-gray-400">→</div>
                  <button
                    onClick={() => setActiveTab('coalitions')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === 'coalitions' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    🤝 Coalizioni
                  </button>
                  <div className="text-gray-400">→</div>
                  <button
                    onClick={() => setActiveTab('petitions')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === 'petitions' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ✍️ Petizioni
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'announcements' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">📢 Annunci della Community</h3>
                    <button
                      onClick={() => startCreationFlow('announcement')}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      ✨ Crea Annuncio con Assistente Democratico
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      className={`border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer ${expandedItem === 'bike-sharing' ? 'shadow-lg border-blue-300 bg-blue-50' : ''}`}
                      onClick={() => setExpandedItem(expandedItem === 'bike-sharing' ? null : 'bike-sharing')}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">🚲 Bike Sharing Cittadino</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">52 consensi</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Proposta per implementare un sistema di bike sharing comunale</p>

                      {expandedItem === 'bike-sharing' && (
                        <div className="mt-4 pt-4 border-t border-blue-200 animate-pulse">
                          <h5 className="font-semibold text-gray-800 mb-2">📋 Dettagli completi:</h5>
                          <p className="text-gray-700 text-sm mb-3">
                            Il progetto prevede l'installazione di 50 stazioni di bike sharing distribuite in città,
                            con biciclette elettriche e tradizionali. Budget stimato: €250.000.
                            Riduzione CO2 prevista: 15% entro 2 anni.
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="w-20 text-gray-600">📍 Zone:</span>
                              <span>Centro, Università, Stazione</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-20 text-gray-600">⏱️ Tempi:</span>
                              <span>18 mesi dall'approvazione</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-20 text-gray-600">👥 Firme:</span>
                              <span>287 cittadini sostengono</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">da Marco R. • 2h fa</span>
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleAction("Consenso annuncio bike sharing", 5)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                          >
                            👍 Consenso (+5pt)
                          </button>
                          <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                            💬 Discuti
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-yellow-600 font-medium">
                        🎯 A 48 consensi può diventare un manifesto!
                      </div>
                    </div>

                    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">⚡ Energia Rinnovabile</h4>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">PRONTO!</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Transizione energetica per edifici pubblici</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">da Elena T. • 1d fa</span>
                        <button
                          onClick={() => handleAction("Trasforma in manifesto", 50)}
                          className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
                        >
                          📋 Trasforma in Manifesto (+50pt)
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-green-600 font-medium">
                        ✨ 127 consensi raggiunti! Può diventare manifesto.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'manifestos' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">📋 Manifesti Strutturati</h3>
                    <button
                      onClick={() => startCreationFlow('manifesto')}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      ✨ Crea Manifesto con Assistente Democratico
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">🏙️ Smart City 2030</h4>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">234 endorsement</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Piano strategico per la digitalizzazione urbana</p>
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Discussioni: 89 • Partecipazione: 78%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Creato da Anna V.</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAction("Endorsa manifesto Smart City", 25)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                          >
                            👍 Endorsa (+25pt)
                          </button>
                          <button
                            onClick={() => startCreationFlow('coalition')}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                          >
                            🤝 Crea Coalizione
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-green-600 font-medium">
                        🎯 Consenso alto! Pronto per diventare coalizione.
                      </div>
                    </div>

                    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">🎓 Educazione Digitale</h4>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">IN DISCUSSIONE</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Riforma del sistema educativo con tecnologie</p>
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Discussioni: 156 • Partecipazione: 92%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Creato da Prof. Bianchi</span>
                        <button className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition-colors">
                          💬 Partecipa Discussione
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'coalitions' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">🤝 Coalizioni Attive</h3>
                    <button
                      onClick={() => startCreationFlow('coalition')}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      ✨ Fondi Coalizione con Assistente Democratico
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">🌱 Ambiente Verde</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">TU SEI MEMBRO</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Coalizione per la sostenibilità ambientale</p>
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span>👥 548 membri</span>
                          <span>📋 12 progetti</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          👑 Coordinatrice: Maria Eco • 🎯 Vice: Luca Green
                        </div>
                      </div>

                      {/* Elezioni Interne */}
                      <div className="bg-white rounded-lg p-3 mb-3 border">
                        <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                          🗳️ Elezioni in Corso - Nuovo Tesoriere
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <span>📄</span>
                              <div>
                                <div className="font-medium">Andrea Finance</div>
                                <div className="text-xs text-gray-500">CPA, 10 anni esperienza</div>
                              </div>
                            </div>
                            <span className="text-blue-600 font-medium">89 voti</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <span>📄</span>
                              <div>
                                <div className="font-medium">Sara Budget</div>
                                <div className="text-xs text-gray-500">Economista, esperta bilanci</div>
                              </div>
                            </div>
                            <span className="text-blue-600 font-medium">67 voti</span>
                          </div>
                          <button
                            onClick={() => handleAction("Voto digitale per tesoriere", 20)}
                            className="w-full bg-green-500 text-white py-2 rounded text-sm hover:bg-green-600 transition-colors"
                          >
                            🗳️ Vota Digitale (+20pt)
                          </button>
                          <div className="text-xs text-center text-gray-500">
                            ⏰ Chiusura votazioni: 2 giorni • 234/548 membri hanno già votato
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => startCreationFlow('petition')}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✍️ Crea Petizione Coalizione (+75pt)
                      </button>
                    </div>

                    <div className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">🏙️ Smart City Italia</h4>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">APERTA</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Digitalizzazione delle città italiane</p>
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span>👥 1,234 membri</span>
                          <span>📋 8 progetti</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          👑 Coordinatore: Tech Lorenzo • 🎯 Vice: Digital Anna
                        </div>
                      </div>
                      <button
                        onClick={() => handleAction("Unisciti coalizione Smart City", 30)}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        🤝 Unisciti alla Coalizione (+30pt)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'petitions' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">✍️ Petizioni Pubbliche</h3>
                    <span className="text-sm text-gray-600">📋 Firme digitali certificate</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      className={`border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer ${expandedItem === 'trasporti-gratuiti' ? 'shadow-lg border-blue-300 bg-blue-50' : ''}`}
                      onClick={() => setExpandedItem(expandedItem === 'trasporti-gratuiti' ? null : 'trasporti-gratuiti')}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">🚌 Trasporti Pubblici Gratuiti</h4>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">HOT 🔥</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Trasporti pubblici gratuiti per studenti e over 65</p>

                      {expandedItem === 'trasporti-gratuiti' && (
                        <div className="mt-4 pt-4 border-t border-blue-200 animate-pulse">
                          <h5 className="font-semibold text-gray-800 mb-2">📋 Proposta dettagliata:</h5>
                          <p className="text-gray-700 text-sm mb-3">
                            Gratuità completa dei mezzi pubblici urbani per studenti under 26 e cittadini over 65.
                            Finanziamento attraverso tassa sulle auto private nei centri urbani.
                            Riduzione traffico stimata: 30%.
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="w-24 text-gray-600">💰 Budget:</span>
                              <span>€2.1M annui (autofinanziato)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-24 text-gray-600">🎯 Target:</span>
                              <span>45.000 studenti + 23.000 anziani</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-24 text-gray-600">📅 Inizio:</span>
                              <span>Settembre 2025 (anno scolastico)</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>8,456 / 10,000 firme digitali</span>
                          <span className="text-blue-600 font-semibold">85%</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-3">
                          <div className="bg-blue-500 h-3 rounded-full transition-all" style={{width: '85%'}}></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        🏛️ Creata da: Coalizione "Ambiente Verde" • ⏰ Scadenza: 15 giorni
                      </div>
                      <button
                        onClick={() => handleAction("Firma petizione trasporti digitale", 15)}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        ✍️ Firma Digitale (+15pt)
                      </button>
                    </div>

                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">🏥 Sanità Digitale</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">SUCCESSO!</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Digitalizzazione completa servizi sanitari</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>12,847 / 10,000 firme digitali</span>
                          <span className="text-green-600 font-semibold">128%</span>
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-3">
                          <div className="bg-green-500 h-3 rounded-full" style={{width: '100%'}}></div>
                        </div>
                      </div>
                      <div className="text-xs text-green-600 mb-3 font-medium">
                        ✅ Obiettivo raggiunto! In valutazione parlamentare.
                      </div>
                      <button disabled className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed">
                        ✅ Petizione Completata
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mappa Italia Interattiva */}
          <div className="max-w-6xl mx-auto mb-8 map-section">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              🇮🇹 Partecipazione Nazionale
            </h2>

            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
              <InteractiveMapWrapper
                selectedRegion={selectedRegion}
                onRegionSelect={setSelectedRegion}
                italianRegions={italianRegions}
              />

              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3 animate-bounce">{selectedRegionData.emoji}</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedRegionData.name}
                  </h3>
                  <div className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    📈 {selectedRegionData.trending} partecipazione
                  </div>
                  <p className="text-gray-600 mt-2 italic">{selectedRegionData.specialty}</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="font-bold text-blue-600">{selectedRegionData.capital}</div>
                    <div className="text-sm text-gray-600">Capoluogo</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-blue-600">{selectedRegionData.population}</div>
                    <div className="text-sm text-gray-600">Abitanti</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-blue-600">{selectedRegionData.petitions}</div>
                    <div className="text-sm text-gray-600">Petizioni Attive</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-blue-600">{selectedRegionData.signatures.toLocaleString('it-IT')}</div>
                    <div className="text-sm text-gray-600">Firme Digitali</div>
                  </div>
                </div>

                {/* Sezione Reazioni */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                    😍 Cosa ne pensi della {selectedRegionData.name}?
                  </h4>
                  <div className="flex justify-center space-x-4">
                    {Object.entries(reactions).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="flex flex-col items-center p-2 rounded-lg hover:bg-blue-50 transition-colors transform hover:scale-110"
                      >
                        <span className="text-2xl mb-1">{emoji}</span>
                        <span className="text-xs text-gray-600 font-semibold">{count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-12 shadow-xl">
              <h3 className="text-4xl font-bold mb-6">
                🗳️ Trasforma le Tue Idee in Realtà
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Con identità digitale sicura, ogni voto conta davvero. Partecipa al cambiamento democratico dell'Italia.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link
                  href="/abbonamenti"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg inline-block"
                >
                  🚀 Inizia il Tuo Percorso
                </Link>
                <Link
                  href="/info"
                  className="bg-blue-500 bg-opacity-50 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-70 transition-all border-2 border-white border-opacity-30 inline-block"
                >
                  📖 Manifesto Consiglio Cittadino
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center shadow-2xl transform scale-110">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-xl font-semibold text-gray-800">Elaborazione in corso...</div>
            <div className="text-sm text-gray-500 mt-2">Un momento, stiamo processando la tua azione</div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {showToast}
        </div>
      )}

      {/* Tour Guidato */}
      {showTour && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                {tourSteps[tourStep].title}
              </h3>
              <p className="text-gray-600 mb-6">
                {tourSteps[tourStep].description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {tourStep + 1} di {tourSteps.length}
                </span>
                <div className="space-x-3">
                  {tourStep > 0 && (
                    <button
                      onClick={() => setTourStep(tourStep - 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Indietro
                    </button>
                  )}
                  <button
                    onClick={handleTourNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {tourStep < tourSteps.length - 1 ? 'Avanti' : 'Completa Tour'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal per creazione contenuti con Assistente Democratico */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 shadow-2xl">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
              <h3 className="text-2xl font-bold flex items-center">
                {showCreateModal === 'announcement' && '📢 Crea Nuovo Annuncio'}
                {showCreateModal === 'manifesto' && '📋 Crea Nuovo Manifesto'}
                {showCreateModal === 'coalition' && '🤝 Fondi Nuova Coalizione'}
                {showCreateModal === 'petition' && '✍️ Crea Nuova Petizione'}
              </h3>
              <p className="text-blue-100 mt-2">Gracco, il nostro Assistente Democratico, ti guiderà passo passo nella creazione</p>
            </div>

            {/* Assistente Democratico Gracco */}
            <div className="p-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🤖</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Gracco • Assistente Democratico</div>
                    <div className="text-sm text-gray-600">Ti guido nella creazione ottimale</div>
                  </div>
                  <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
                </div>

                {aiGuidance.isActive && (
                  <div className="space-y-3">
                    {aiGuidance.suggestions.map((suggestion, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 text-sm border border-purple-100">
                        <span className="text-purple-600">💡</span> {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form simulato */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {showCreateModal === 'announcement' && 'Titolo del tuo annuncio'}
                    {showCreateModal === 'manifesto' && 'Nome del manifesto'}
                    {showCreateModal === 'coalition' && 'Nome della coalizione'}
                    {showCreateModal === 'petition' && 'Titolo della petizione'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={showCreateModal === 'announcement' ? "es. Bike Sharing per Tutti" : "Nome..."}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                    placeholder="Descrivi la tua proposta..."
                  />
                </div>
                {showCreateModal === 'petition' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Obiettivo firme</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="es. 10000"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(null);
                    setAiGuidance({ isActive: false, step: 0, suggestions: [] });
                  }}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={() => {
                    const points = showCreateModal === 'announcement' ? 30 :
                                 showCreateModal === 'manifesto' ? 75 :
                                 showCreateModal === 'coalition' ? 100 : 50;
                    const actionName = showCreateModal === 'announcement' ? 'Crea nuovo annuncio' :
                                      showCreateModal === 'manifesto' ? 'Crea nuovo manifesto' :
                                      showCreateModal === 'coalition' ? 'Fondi nuova coalizione' : 'Crea nuova petizione';

                    handleAction(actionName, points);
                    setShowCreateModal(null);
                    setAiGuidance({ isActive: false, step: 0, suggestions: [] });
                    setShowToast(`🎉 ${actionName} creato con successo! Gracco ha ottimizzato il contenuto.`);
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <span>✨</span>
                  <span>Crea con Assistente Democratico (+{showCreateModal === 'announcement' ? 30 : showCreateModal === 'manifesto' ? 75 : showCreateModal === 'coalition' ? 100 : 50}pt)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}