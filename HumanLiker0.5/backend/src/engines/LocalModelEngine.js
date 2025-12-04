import ModelEngine from './ModelEngine.js';
import { ModelError } from '../utils/errors.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();

/**
 * Local Model Engine - supports Ollama and LM Studio
 */
export class LocalModelEngine extends ModelEngine {
  constructor(config = {}) {
    super('local');
    this.baseUrl = config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.provider = config.provider || 'ollama'; // 'ollama' or 'lmstudio'
    this.modelName = config.modelName || 'llama2';
    this.timeout = config.timeout || 30000; // 30 seconds
  }

  async isAvailable() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for availability check

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.warn('Model availability check timed out', { baseUrl: this.baseUrl });
      } else {
        logger.debug('Model engine not available', { baseUrl: this.baseUrl, error: error.message });
      }
      return false;
    }
  }

  async transform(text, options = {}) {
    const startTime = Date.now();
    const { tone, formality, parameters = {} } = options;

    if (!await this.isAvailable()) {
      throw new ModelError('Local model service is not available. Please ensure Ollama or LM Studio is running.', {
        provider: this.provider,
        baseUrl: this.baseUrl
      });
    }

    try {
      const prompt = this.buildTransformPrompt(text, tone, formality);
      
      let result;
      if (this.provider === 'ollama') {
        result = await this.transformWithOllama(prompt, parameters);
      } else {
        result = await this.transformWithLMStudio(prompt, parameters);
      }

      const processingTime = Date.now() - startTime;

      return {
        outputText: result.text,
        tokensUsed: {
          input: result.inputTokens || 0,
          output: result.outputTokens || 0
        },
        processingTime,
        metadata: {
          model: this.modelName,
          provider: this.provider
        }
      };
    } catch (error) {
      logger.error('Transform failed', { error: error.message, provider: this.provider });
      throw new ModelError(`Transform failed: ${error.message}`, {
        provider: this.provider,
        originalError: error.message
      });
    }
  }

  async transformWithOllama(prompt, parameters) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          prompt: prompt,
          stream: false,
          options: {
            temperature: parameters.temperature || 0.7,
            ...parameters
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return {
        text: data.response || '',
        inputTokens: data.eval_count || 0,
        outputTokens: data.prompt_eval_count || 0
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - model is taking too long to respond');
      }
      throw error;
    }
  }

  async transformWithLMStudio(prompt, parameters) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: parameters.temperature || 0.7,
          max_tokens: parameters.max_tokens || 2000,
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LM Studio API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      return {
        text: content,
        inputTokens: data.usage?.prompt_tokens || 0,
        outputTokens: data.usage?.completion_tokens || 0
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - model is taking too long to respond');
      }
      throw error;
    }
  }

  buildTransformPrompt(text, tone, formality) {
    return `You are an expert at rewriting AI-generated text to sound more natural and human-like.

Input text:
${text}

Requirements:
- Tone: ${tone}
- Formality level: ${formality}
- Make it sound natural and conversational
- Preserve the core meaning and information
- Remove AI-typical patterns (like "Certainly!", "I'd be happy to...", etc.)
- Use natural transitions and flow

Rewritten text:`;
  }

  async score(text, criteria = {}) {
    // TODO: Implement scoring (can use model for this too)
    // For now, return mock scores
    return {
      humanLikeness: Math.round((Math.random() * 2 + 8) * 10) / 10, // 8-10
      toneAccuracy: Math.round((Math.random() * 20 + 75) * 10) / 10 // 75-95
    };
  }
}

export default LocalModelEngine;

