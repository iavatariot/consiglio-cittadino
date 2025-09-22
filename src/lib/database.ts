// Usa SQLite per persistenza locale (perfetto per sviluppo e deploy semplici)
import { pool } from '../src/lib/database-sqlite';
export { pool };

// Configurazione MySQL per produzione (opzionale per il futuro)
/*
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'consiglio_abbonamenti',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

export { pool };
*/