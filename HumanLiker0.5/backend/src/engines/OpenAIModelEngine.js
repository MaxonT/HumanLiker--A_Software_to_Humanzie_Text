import ModelEngine from './ModelEngine.js';
import { ModelError } from '../utils/errors.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();

/**
 * OpenAI Model Engine
 */
export class OpenAIModelEngine extends ModelEngine {
  constructor(config = {}) {
    super('openai');
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    this.modelName = config.modelName || 'gpt-3.5-turbo';
    this.timeout = config.timeout || 60000; // 60 seconds
  }

  async isAvailable() {
    if (!this.apiKey) {
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      logger.debug('OpenAI API not available', { error: error.message });
      return false;
    }
  }

  async transform(text, options = {}) {
    const startTime = Date.now();
    const { tone, formality, parameters = {} } = options;

    if (!this.apiKey) {
      throw new ModelError('OpenAI API key is not configured', {
        provider: 'openai'
      });
    }

    if (!await this.isAvailable()) {
      throw new ModelError('OpenAI API is not available. Please check your API key and network connection.', {
        provider: 'openai'
      });
    }

    try {
      const prompt = this.buildTransformPrompt(text, tone, formality);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      const processingTime = Date.now() - startTime;

      return {
        outputText: content.trim(),
        tokensUsed: {
          input: data.usage?.prompt_tokens || 0,
          output: data.usage?.completion_tokens || 0
        },
        processingTime,
        metadata: {
          model: this.modelName,
          provider: 'openai'
        }
      };
    } catch (error) {
      logger.error('OpenAI transform failed', { error: error.message });
      if (error.name === 'AbortError') {
        throw new ModelError('Request timeout - OpenAI API is taking too long to respond', {
          provider: 'openai'
        });
      }
      throw new ModelError(`Transform failed: ${error.message}`, {
        provider: 'openai',
        originalError: error.message
      });
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
    // TODO: Implement scoring using OpenAI
    // For now, return mock scores
    return {
      humanLikeness: Math.round((Math.random() * 2 + 8) * 10) / 10, // 8-10
      toneAccuracy: Math.round((Math.random() * 20 + 75) * 10) / 10 // 75-95
    };
  }
}

export default OpenAIModelEngine;

