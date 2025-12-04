import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Session (会话/项目)
 * 用户的工作会话，可以包含多个改写记录
 */
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  metadata: text('metadata', { mode: 'json' }) // 自定义标签等
});

/**
 * TextSample (改写记录)
 * 存储每次文本改写的输入、输出和评分
 */
export const textSamples = sqliteTable('text_samples', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').references(() => sessions.id, { onDelete: 'cascade' }),
  inputText: text('input_text').notNull(),
  outputText: text('output_text').notNull(),
  tone: text('tone').notNull(), // friendly|concise|confident|neutral
  formality: text('formality').notNull(), // casual|balanced|formal
  modelUsed: text('model_used').notNull(),
  scores: text('scores', { mode: 'json' }).notNull(), // { toneAccuracy, humanLikeness, tokenCost }
  metadata: text('metadata', { mode: 'json' }).notNull(), // { processingTime, tokensUsed, timestamp }
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

/**
 * Preset (预设配置)
 * 保存用户常用的 Tone 和 Formality 组合
 */
export const presets = sqliteTable('presets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  tone: text('tone').notNull(),
  formality: text('formality').notNull(),
  modelPreference: text('model_preference'), // 可选模型标识
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

/**
 * ModelConfig (模型配置)
 * 存储可用的 AI 模型配置信息
 */
export const modelConfigs = sqliteTable('model_configs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // 显示名称
  provider: text('provider').notNull(), // local|openai|anthropic|custom
  type: text('type').notNull(), // mini|plus|pro|code
  endpoint: text('endpoint').notNull(), // API 端点
  apiKey: text('api_key'), // 加密存储（暂存明文，后续加密）
  parameters: text('parameters', { mode: 'json' }), // { temperature, max_tokens 等 }
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  priority: integer('priority').default(0), // 选择优先级
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});


