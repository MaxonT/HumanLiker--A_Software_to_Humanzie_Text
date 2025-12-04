import { setupLogger } from '../utils/logger.js';
import { getDb } from '../index.js';
import { modelConfigs } from '../schema.js';
import { eq, and } from 'drizzle-orm';

const logger = setupLogger();

/**
 * Model Configuration Manager
 * Handles loading and managing model configurations
 */
export class ModelConfigManager {
  constructor() {
    this.configs = [];
    this.engines = new Map(); // Cache for initialized engines
  }

  /**
   * Load model configurations from database
   */
  async loadConfigs() {
    try {
      const db = getDb();
      const activeConfigs = await db
        .select()
        .from(modelConfigs)
        .where(eq(modelConfigs.isActive, true))
        .orderBy(modelConfigs.priority);

      this.configs = activeConfigs;
      logger.info('Loaded model configurations', { count: this.configs.length });
      return this.configs;
    } catch (error) {
      logger.error('Failed to load model configurations', { error: error.message });
      // Return default configs if database fails
      return this.getDefaultConfigs();
    }
  }

  /**
   * Get default model configurations (if database is empty)
   */
  getDefaultConfigs() {
    return [
      {
        id: 'local-ollama',
        name: 'Ollama (Local)',
        provider: 'local',
        type: 'plus',
        endpoint: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        apiKey: null,
        parameters: { temperature: 0.7 },
        isActive: true,
        priority: 1
      }
    ];
  }

  /**
   * Get model engine instance for a configuration
   */
  async getEngine(config) {
    const cacheKey = config.id || `${config.provider}-${config.type}`;

    if (this.engines.has(cacheKey)) {
      return this.engines.get(cacheKey);
    }

    let engine;
    const { LocalModelEngine } = await import('../engines/LocalModelEngine.js');
    const { OpenAIModelEngine } = await import('../engines/OpenAIModelEngine.js');

    switch (config.provider) {
      case 'local':
        engine = new LocalModelEngine({
          baseUrl: config.endpoint,
          provider: config.endpoint?.includes('1234') ? 'lmstudio' : 'ollama',
          modelName: config.modelName || 'llama2'
        });
        break;
      case 'openai':
        engine = new OpenAIModelEngine({
          apiKey: config.apiKey || process.env.OPENAI_API_KEY,
          modelName: config.modelName || 'gpt-3.5-turbo'
        });
        break;
      default:
        throw new Error(`Unsupported model provider: ${config.provider}`);
    }

    this.engines.set(cacheKey, engine);
    return engine;
  }

  /**
   * Select best available model based on priority
   */
  async selectModel(preference = null) {
    await this.loadConfigs();

    // If preference is specified, try that first
    if (preference) {
      const preferred = this.configs.find(c => c.id === preference || c.name === preference);
      if (preferred) {
        const engine = await this.getEngine(preferred);
        if (await engine.isAvailable()) {
          return { config: preferred, engine };
        }
      }
    }

    // Try models in priority order
    for (const config of this.configs) {
      try {
        const engine = await this.getEngine(config);
        if (await engine.isAvailable()) {
          logger.info('Selected model', { model: config.name, provider: config.provider });
          return { config, engine };
        }
      } catch (error) {
        logger.debug('Model not available', { model: config.name, error: error.message });
        continue;
      }
    }

    // No available models
    throw new Error('No available model engines found. Please check your model configuration.');
  }
}

// Singleton instance
export const modelConfigManager = new ModelConfigManager();

export default modelConfigManager;

