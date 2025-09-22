// Live counters service for real-time updates across the application

export interface LiveCounters {
  citizens: number;
  petitions: number;
  coalitions: number;
  subscribers: number;
  totalRaised: number;
}

class LiveCountersService {
  private listeners: Array<(counters: LiveCounters) => void> = [];
  private counters: LiveCounters = {
    citizens: 1230,
    petitions: 1203,
    coalitions: 89,
    subscribers: 64,
    totalRaised: 100000 // Base iniziale, verrà aggiornata con dati reali
  };

  constructor() {
    this.startUpdates();
    this.fetchRealSubscriberData(); // Fetch real data on initialization
  }

  private async fetchRealSubscriberData() {
    try {
      const response = await fetch('/api/stats/subscribers');
      if (response.ok) {
        const data = await response.json();
        this.counters = {
          ...this.counters,
          subscribers: data.totalSupporters,
          totalRaised: data.totalRevenue // Usa il totale reale da Stripe + base
        };
        // Notify all listeners of the real data
        this.listeners.forEach(listener => listener(this.counters));
      }
    } catch (error) {
      console.error('Errore nel caricamento dati sostenitori reali:', error);
    }
  }

  private startUpdates() {
    // Simulate real-time updates for non-subscription data every 30-45 seconds
    setInterval(() => {
      const citizenIncrease = Math.floor(Math.random() * 3);

      this.counters = {
        ...this.counters,
        citizens: this.counters.citizens + citizenIncrease,
      };

      // Refresh real subscriber data periodically
      this.fetchRealSubscriberData();

      // Notify all listeners
      this.listeners.forEach(listener => listener(this.counters));
    }, Math.random() * 15000 + 30000); // 30-45 seconds
  }

  subscribe(callback: (counters: LiveCounters) => void) {
    this.listeners.push(callback);
    // Immediately call with current values
    callback(this.counters);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  getCounters(): LiveCounters {
    return { ...this.counters };
  }

  // Simulate manual updates (e.g., when someone subscribes)
  incrementSubscribers(amount: number = 1) {
    // Invece di simulare, aggiorna i dati reali da Stripe
    this.fetchRealSubscriberData();
  }
}

export const liveCountersService = new LiveCountersService();