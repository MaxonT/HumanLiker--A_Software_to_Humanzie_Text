/**
 * InflectorModule - Client-side API wrapper for inflector processing
 */

const InflectorModule = {
  /**
   * Process a word/text using the inflector backend API
   * @param {Object} options - Processing options
   * @param {string} options.input - The word/text to process
   * @param {string} options.operation - Operation type ('pluralize', 'singularize', 'pascalize', 'camelize', 'underscore', 'dasherize', 'kebaberize', 'titleize', 'toQuantity')
   * @param {number} options.quantity - Quantity for toQuantity operation (optional)
   * @param {string} options.showQuantityAs - 'Numeric' or 'Words' (optional)
   * @returns {Promise<Object>} - Response with { success, output }
   */
  async processInflector({ input, operation, quantity, showQuantityAs }) {
    try {
      const response = await fetch('/api/inflector/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          operation,
          quantity,
          showQuantityAs
        })
      });
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error processing inflector:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InflectorModule;
}
