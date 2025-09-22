import Database from 'better-sqlite3';
import { join } from 'path';

interface PollVote {
  id?: number;
  pollId: number;
  optionIndex: number;
  timestamp: number;
  userCode: string;
}

interface PollResult {
  pollId: number;
  optionIndex: number;
  voteCount: number;
}

class PollStorage {
  private db: Database.Database | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      // Crea il database nella cartella del progetto
      const dbPath = join(process.cwd(), 'data', 'polls.db');

      // Assicurati che la cartella data esista
      const fs = require('fs');
      const path = require('path');
      const dataDir = path.dirname(dbPath);

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = new Database(dbPath);

      // Crea le tabelle se non esistono
      this.createTables();
    } catch (error) {
      console.error('Errore inizializzazione database:', error);
      // Fallback a localStorage per sviluppo
      this.db = null;
    }
  }

  private createTables() {
    if (!this.db) return;

    // Tabella per i voti
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS poll_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        poll_id INTEGER NOT NULL,
        option_index INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        user_code TEXT NOT NULL,
        UNIQUE(poll_id, user_code)
      );
    `);

    // Tabella per i risultati aggregati (per performance)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS poll_results (
        poll_id INTEGER NOT NULL,
        option_index INTEGER NOT NULL,
        vote_count INTEGER DEFAULT 0,
        PRIMARY KEY (poll_id, option_index)
      );
    `);

    // Indici per performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
      CREATE INDEX IF NOT EXISTS idx_poll_votes_user_code ON poll_votes(user_code);
      CREATE INDEX IF NOT EXISTS idx_poll_results_poll_id ON poll_results(poll_id);
    `);
  }

  // Registra un voto
  submitVote(pollId: number, optionIndex: number, userCode: string): boolean {
    if (!this.db) {
      // Fallback a localStorage
      return this.submitVoteLocalStorage(pollId, optionIndex, userCode);
    }

    try {
      const transaction = this.db.transaction(() => {
        // Inserisci il voto
        const insertVote = this.db!.prepare(`
          INSERT INTO poll_votes (poll_id, option_index, timestamp, user_code)
          VALUES (?, ?, ?, ?)
        `);

        insertVote.run(pollId, optionIndex, Date.now(), userCode);

        // Aggiorna i risultati aggregati
        const updateResult = this.db!.prepare(`
          INSERT INTO poll_results (poll_id, option_index, vote_count)
          VALUES (?, ?, 1)
          ON CONFLICT(poll_id, option_index) DO UPDATE SET
          vote_count = vote_count + 1
        `);

        updateResult.run(pollId, optionIndex);
      });

      transaction();
      return true;
    } catch (error) {
      console.error('Errore salvataggio voto:', error);
      return false;
    }
  }

  // Ottieni i risultati di un sondaggio
  getPollResults(pollId: number): number[] {
    if (!this.db) {
      return this.getPollResultsLocalStorage(pollId);
    }

    try {
      const stmt = this.db.prepare(`
        SELECT option_index, vote_count
        FROM poll_results
        WHERE poll_id = ?
        ORDER BY option_index
      `);

      const results = stmt.all(pollId) as PollResult[];

      // Trova il numero massimo di opzioni per questo sondaggio
      const maxOptionStmt = this.db.prepare(`
        SELECT MAX(option_index) as max_option
        FROM poll_votes
        WHERE poll_id = ?
      `);

      const maxResult = maxOptionStmt.get(pollId) as { max_option: number } | undefined;
      const maxOptions = maxResult?.max_option ?? 3; // Default 4 opzioni (0-3)

      // Crea array con tutti i risultati, anche quelli a 0
      const voteCounts: number[] = [];
      for (let i = 0; i <= maxOptions; i++) {
        const result = results.find(r => r.optionIndex === i);
        voteCounts.push(result?.voteCount ?? 0);
      }

      return voteCounts;
    } catch (error) {
      console.error('Errore recupero risultati:', error);
      return [];
    }
  }

  // Verifica se un utente ha già votato
  hasUserVoted(pollId: number, userCode: string): boolean {
    if (!this.db) {
      return this.hasUserVotedLocalStorage(pollId, userCode);
    }

    try {
      const stmt = this.db.prepare(`
        SELECT COUNT(*) as count
        FROM poll_votes
        WHERE poll_id = ? AND user_code = ?
      `);

      const result = stmt.get(pollId, userCode) as { count: number };
      return result.count > 0;
    } catch (error) {
      console.error('Errore verifica voto:', error);
      return false;
    }
  }

  // Ottieni statistiche generali
  getStats() {
    if (!this.db) {
      return this.getStatsLocalStorage();
    }

    try {
      const totalVotesStmt = this.db.prepare(`
        SELECT COUNT(*) as total_votes FROM poll_votes
      `);

      const uniqueVotersStmt = this.db.prepare(`
        SELECT COUNT(DISTINCT user_code) as unique_voters FROM poll_votes
      `);

      const activePollsStmt = this.db.prepare(`
        SELECT COUNT(DISTINCT poll_id) as active_polls FROM poll_votes
      `);

      const totalVotes = totalVotesStmt.get() as { total_votes: number };
      const uniqueVoters = uniqueVotersStmt.get() as { unique_voters: number };
      const activePolls = activePollsStmt.get() as { active_polls: number };

      return {
        totalVotes: totalVotes.total_votes,
        uniqueVoters: uniqueVoters.unique_voters,
        activePolls: activePolls.active_polls
      };
    } catch (error) {
      console.error('Errore recupero statistiche:', error);
      return { totalVotes: 0, uniqueVoters: 0, activePolls: 0 };
    }
  }

  // Fallback methods usando localStorage (per sviluppo/testing)
  private submitVoteLocalStorage(pollId: number, optionIndex: number, userCode: string): boolean {
    try {
      const key = `poll_vote_${pollId}_${userCode}`;
      const votesKey = `poll_results_${pollId}`;

      // Verifica se ha già votato
      if (localStorage.getItem(key)) {
        return false;
      }

      // Salva il voto
      localStorage.setItem(key, JSON.stringify({
        optionIndex,
        timestamp: Date.now()
      }));

      // Aggiorna i risultati
      const existingResults = localStorage.getItem(votesKey);
      const results = existingResults ? JSON.parse(existingResults) : [];

      // Assicurati che l'array abbia abbastanza elementi
      while (results.length <= optionIndex) {
        results.push(0);
      }

      results[optionIndex]++;
      localStorage.setItem(votesKey, JSON.stringify(results));

      return true;
    } catch (error) {
      console.error('Errore localStorage voto:', error);
      return false;
    }
  }

  private getPollResultsLocalStorage(pollId: number): number[] {
    try {
      const votesKey = `poll_results_${pollId}`;
      const results = localStorage.getItem(votesKey);
      return results ? JSON.parse(results) : [0, 0, 0, 0];
    } catch (error) {
      return [0, 0, 0, 0];
    }
  }

  private hasUserVotedLocalStorage(pollId: number, userCode: string): boolean {
    try {
      const key = `poll_vote_${pollId}_${userCode}`;
      return localStorage.getItem(key) !== null;
    } catch (error) {
      return false;
    }
  }

  private getStatsLocalStorage() {
    try {
      let totalVotes = 0;
      const voters = new Set<string>();
      const polls = new Set<number>();

      // Scansiona tutto localStorage per i voti
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('poll_vote_')) {
          totalVotes++;
          const parts = key.split('_');
          if (parts.length >= 4) {
            const pollId = parseInt(parts[2]);
            const userCode = parts.slice(3).join('_');
            polls.add(pollId);
            voters.add(userCode);
          }
        }
      }

      return {
        totalVotes,
        uniqueVoters: voters.size,
        activePolls: polls.size
      };
    } catch (error) {
      return { totalVotes: 0, uniqueVoters: 0, activePolls: 0 };
    }
  }

  // Chiudi connessione database
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

// Singleton instance
export const pollStorage = new PollStorage();

// Cleanup alla chiusura del processo
if (typeof process !== 'undefined') {
  process.on('exit', () => {
    pollStorage.close();
  });

  process.on('SIGINT', () => {
    pollStorage.close();
    process.exit(0);
  });
}