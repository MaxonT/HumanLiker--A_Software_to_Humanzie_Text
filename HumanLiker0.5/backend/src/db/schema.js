import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Sessions table
 * Stores user sessions for organizing transformation history
 */
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  metadata: text('metadata') // JSON string
});

/**
 * Text samples table
 * Stores transformation history records
 */
export const textSamples = sqliteTable('text_samples', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  inputText: text('input_text').notNull(),
  outputText: text('output_text').notNull(),
  tone: text('tone').notNull(),
  formality: text('formality').notNull(),
  modelUsed: text('model_used').notNull(),
  scores: text('scores'), // JSON string for quality scores
  metadata: text('metadata'), // JSON string for additional metadata
  createdAt: integer('created_at').notNull()
});

/**
 * Presets table
 * Stores user-defined transformation presets
 */
export const presets = sqliteTable('presets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  tone: text('tone').notNull(),
  formality: text('formality').notNull(),
  modelPreference: text('model_preference'),
  isDefault: integer('is_default').default(0),
  createdAt: integer('created_at').notNull()
});

/**
 * Model configurations table
 * Stores LLM model configuration settings
 */
export const modelConfigs = sqliteTable('model_configs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  provider: text('provider').notNull(), // 'local', 'openai', etc.
  type: text('type').notNull(), // 'free', 'plus', 'premium'
  endpoint: text('endpoint'),
  apiKey: text('api_key'),
  modelName: text('model_name'),
  parameters: text('parameters'), // JSON string
  isActive: integer('is_active').default(1),
  priority: integer('priority').default(100),
  createdAt: integer('created_at').notNull()
});
