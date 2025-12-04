-- HumanLiker Database Schema
-- SQLite compatible schema definition

-- Sessions table: 用户工作会话
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  metadata TEXT
);

-- Text samples table: 文本改写记录
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

-- Presets table: 预设配置
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

-- Model configs table: 模型配置
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

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_text_samples_session_id ON text_samples(session_id);
CREATE INDEX IF NOT EXISTS idx_text_samples_created_at ON text_samples(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_presets_is_default ON presets(is_default);
CREATE INDEX IF NOT EXISTS idx_model_configs_is_active ON model_configs(is_active);

