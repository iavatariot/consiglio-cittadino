import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { mkdirSync, existsSync } from 'fs';

const dbPath = join(process.cwd(), 'database', 'consiglio.db');
let db: Database.Database;

function initializeDatabase() {
  try {
    // Create database directory if it doesn't exist
    const dbDir = dirname(dbPath);
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(dbPath);

    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    // Create tables
    createTables();

    console.log('✅ SQLite database initialized at:', dbPath);
    return db;
  } catch (error) {
    console.error('❌ Failed to initialize SQLite database:', error);
    throw error;
  }
}

function createTables() {
  // Create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password_hash TEXT,
      fiscal_code TEXT UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      birth_date TEXT,
      gender TEXT CHECK(gender IN ('M', 'F')),
      birth_place TEXT,
      unique_code TEXT UNIQUE NOT NULL,
      email_verified BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      deletion_requested_at TEXT NULL,
      deletion_confirmed_at TEXT NULL,
      deletion_reason TEXT NULL,
      is_founder BOOLEAN DEFAULT FALSE,
      founder_since TEXT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create subscriptions table
  const createSubscriptionsTable = `
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT UNIQUE,
      stripe_payment_intent_id TEXT,
      product_type TEXT NOT NULL CHECK (product_type IN ('monthly', 'yearly')),
      amount DECIMAL(10,2) NOT NULL,
      currency TEXT DEFAULT 'EUR',
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'canceled', 'failed')),
      subscription_start TEXT,
      subscription_end TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  // Create generated_codes table for tracking
  const createGeneratedCodesTable = `
    CREATE TABLE IF NOT EXISTS generated_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unique_code TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create recovery_tokens table for secure code recovery
  const createRecoveryTokensTable = `
    CREATE TABLE IF NOT EXISTS recovery_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      payment_intent_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  // Create sessions table for authentication
  const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  // Create email_verification_tokens table
  const createEmailVerificationTable = `
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  // Create account_deletion_tokens table
  const createAccountDeletionTokensTable = `
    CREATE TABLE IF NOT EXISTS account_deletion_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  // Create indexes
  const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_fiscal_code ON users(fiscal_code);',
    'CREATE INDEX IF NOT EXISTS idx_users_unique_code ON users(unique_code);',
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
    'CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);',
    'CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);',
    'CREATE INDEX IF NOT EXISTS idx_generated_codes_code ON generated_codes(unique_code);',
    'CREATE INDEX IF NOT EXISTS idx_recovery_tokens_token ON recovery_tokens(token);',
    'CREATE INDEX IF NOT EXISTS idx_recovery_tokens_user_id ON recovery_tokens(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);',
    'CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_email_verification_token ON email_verification_tokens(token);',
    'CREATE INDEX IF NOT EXISTS idx_email_verification_user_id ON email_verification_tokens(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_deletion_tokens_token ON account_deletion_tokens(token);',
    'CREATE INDEX IF NOT EXISTS idx_deletion_tokens_user_id ON account_deletion_tokens(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_users_deletion_requested ON users(deletion_requested_at);'
  ];

  // Execute table creation
  db.exec(createUsersTable);
  db.exec(createSubscriptionsTable);
  db.exec(createGeneratedCodesTable);
  db.exec(createRecoveryTokensTable);
  db.exec(createSessionsTable);
  db.exec(createEmailVerificationTable);
  db.exec(createAccountDeletionTokensTable);

  // Execute index creation
  createIndexes.forEach(index => db.exec(index));
}

// Initialize database
if (!db) {
  initializeDatabase();
}

// Pool-like interface to match MySQL interface
export const pool = {
  execute: async (query: string, params: any[] = []) => {
    try {
      // Convert MySQL syntax to SQLite where needed
      let sqliteQuery = query
        .replace(/CURDATE\(\)/g, "date('now')")
        .replace(/DATE_ADD\(CURDATE\(\), INTERVAL (\d+) (MONTH|YEAR)\)/g, "date('now', '+$1 $2')")
        .replace(/CURRENT_TIMESTAMP/g, "datetime('now')");

      if (sqliteQuery.toLowerCase().includes('select')) {
        // SELECT query
        const stmt = db.prepare(sqliteQuery);
        const rows = stmt.all(params);
        return [rows, []];
      } else {
        // INSERT/UPDATE/DELETE query
        const stmt = db.prepare(sqliteQuery);
        const result = stmt.run(params);
        return [{ insertId: result.lastInsertRowid, affectedRows: result.changes, lastInsertRowid: result.lastInsertRowid }, []];
      }
    } catch (error) {
      console.error('SQLite Query Error:', error);
      console.error('Query:', query);
      console.error('Params:', params);
      throw error;
    }
  }
};

export { db };