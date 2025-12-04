import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { setupLogger } from '../utils/logger.js';
import { sessions, textSamples, presets, modelConfigs } from './schema.js';

const logger = setupLogger();

let db = null;
let sqlite = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Initialize database connection and create tables
 */
export async function initializeDatabase() {
  try {
    // Determine database path
    const dbPath = process.env.DATABASE_PATH || join(__dirname, '..', '..', 'data', 'humanliker.db');
    const dbDir = dirname(dbPath);

    // Ensure data directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      logger.info('Created database directory', { path: dbDir });
    }

    // Create SQLite connection
    sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL'); // Write-Ahead Logging for better performance

    // Create Drizzle instance
    db = drizzle(sqlite);

    // Create tables if they don't exist
    await createTables();

    logger.info('Database initialized successfully', { path: dbPath });
    
    return db;
  } catch (error) {
    logger.error('Failed to initialize database', { error: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Create database tables
 * Using raw SQL for bootstrapping to avoid requiring migration files.
 * The schema.js file provides type definitions for Drizzle ORM queries.
 */
async function createTables() {
  try {
    // Create sessions table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        metadata TEXT
      )
    `);

    // Create text_samples table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS text_samples (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        input_text TEXT NOT NULL,
        output_text TEXT NOT NULL,
        tone TEXT NOT NULL,
        formality TEXT NOT NULL,
        model_used TEXT NOT NULL,
        scores TEXT,
        metadata TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
      )
    `);

    // Create presets table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS presets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        tone TEXT NOT NULL,
        formality TEXT NOT NULL,
        model_preference TEXT,
        is_default INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `);

    // Create model_configs table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS model_configs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        type TEXT NOT NULL,
        endpoint TEXT,
        api_key TEXT,
        model_name TEXT,
        parameters TEXT,
        is_active INTEGER DEFAULT 1,
        priority INTEGER DEFAULT 100,
        created_at INTEGER NOT NULL
      )
    `);

    // Create indexes for better query performance
    sqlite.exec(`
      CREATE INDEX IF NOT EXISTS idx_text_samples_session_id ON text_samples(session_id);
      CREATE INDEX IF NOT EXISTS idx_text_samples_created_at ON text_samples(created_at);
      CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON sessions(updated_at);
      CREATE INDEX IF NOT EXISTS idx_model_configs_active_priority ON model_configs(is_active, priority);
    `);

    logger.info('Database tables created successfully');
  } catch (error) {
    logger.error('Failed to create database tables', { error: error.message });
    throw error;
  }
}

/**
 * Get database instance
 */
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 */
export function closeDatabase() {
  if (sqlite) {
    sqlite.close();
    db = null;
    sqlite = null;
    logger.info('Database connection closed');
  }
}

export default {
  initializeDatabase,
  getDb,
  closeDatabase
};
