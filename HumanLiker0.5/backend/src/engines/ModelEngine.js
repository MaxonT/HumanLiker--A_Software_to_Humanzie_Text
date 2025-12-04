/**
 * Base Model Engine Interface
 * All model engines must implement this interface
 */

export class ModelEngine {
  constructor(name) {
    this.name = name;
  }

  /**
   * Transform text using AI model
   * @param {string} text - Input text to transform
   * @param {Object} options - Transformation options
   * @param {string} options.tone - Tone: 'friendly' | 'concise' | 'confident' | 'neutral'
   * @param {string} options.formality - Formality: 'casual' | 'balanced' | 'formal'
   * @param {Object} options.parameters - Additional model parameters
   * @returns {Promise<TransformResult>}
   */
  async transform(text, options = {}) {
    throw new Error('transform() method must be implemented');
  }

  /**
   * Score text for human-likeness and tone accuracy
   * @param {string} text - Text to score
   * @param {Object} criteria - Scoring criteria
   * @returns {Promise<ScoreResult>}
   */
  async score(text, criteria = {}) {
    throw new Error('score() method must be implemented');
  }

  /**
   * Check if the model engine is available
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    throw new Error('isAvailable() method must be implemented');
  }
}

/**
 * Transform Result
 * @typedef {Object} TransformResult
 * @property {string} outputText - Transformed text
 * @property {Object} tokensUsed - Token usage { input: number, output: number }
 * @property {number} processingTime - Processing time in milliseconds
 * @property {Object} metadata - Additional metadata
 */

/**
 * Score Result
 * @typedef {Object} ScoreResult
 * @property {number} humanLikeness - Score from 0-10
 * @property {number} toneAccuracy - Score from 0-100
 */

export default ModelEngine;


