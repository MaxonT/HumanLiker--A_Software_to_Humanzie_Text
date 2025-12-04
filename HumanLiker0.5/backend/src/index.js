import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import * as schema from './schema.js';
import { setupLogger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = setupLogger();

// Database file path
const dbPath = process.env.DATABASE_URL || join(__dirname, '../../db/humanliker.db');
const dbDir = join(__dirname, '../../db');

// Database instance (initialized in initializeDatabase)
let sqlite;
let db;

// Initialize tables
export async function initializeDatabase() {
  try {
    // Ensure db directory exists
    if (!existsSync(dbDir)) {
      await mkdir(dbDir, { recursive: true });
      logger.info(`Created database directory: ${dbDir}`);
    }

    // Initialize database connection
    sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL'); // Write-Ahead Logging for better concurrency

    // Create Drizzle instance
    db = drizzle(sqlite, { schema });

    // Create tables if they don't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        name TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS text_samples (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        input_text TEXT NOT NULL,
        output_text TEXT NOT NULL,
        tone TEXT NOT NULL,
        formality TEXT NOT NULL,
        model_used TEXT NOT NULL,
        scores TEXT NOT NULL,
        metadata TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS presets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        tone TEXT NOT NULL,
        formality TEXT NOT NULL,
        model_preference TEXT,
        is_default INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );

      CREATE TABLE IF NOT EXISTS model_configs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        type TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        api_key TEXT,
        parameters TEXT,
        is_active INTEGER DEFAULT 1,
        priority INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );

      CREATE INDEX IF NOT EXISTS idx_text_samples_session_id ON text_samples(session_id);
      CREATE INDEX IF NOT EXISTS idx_text_samples_created_at ON text_samples(created_at);
      CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
    `);

    logger.info('Database initialized successfully', { dbPath });
  } catch (error) {
    logger.error('Failed to initialize database', { error: error.message });
    throw error;
  }
}

// Get database instance (lazy initialization if needed)
export function getDb() {
  if (!db) {
    sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    db = drizzle(sqlite, { schema });
  }
  return db;
}

export { db };
export default getDb;
