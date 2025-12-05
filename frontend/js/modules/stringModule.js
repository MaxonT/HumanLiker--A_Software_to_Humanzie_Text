/**
 * StringModule - Client-side API wrapper for string processing
 */

const StringModule = {
  /**
   * Process a string using the backend API
   * @param {Object} options - Processing options
   * @param {string} options.input - The string to process
   * @param {string} options.operation - Operation type ('humanize', 'dehumanize', 'truncate')
   * @param {string} options.casing - Casing option (optional, for humanize)
   * @param {number} options.length - Length parameter (optional, for truncate)
   * @param {string} options.truncator - Truncation strategy (optional, for truncate)
   * @param {string} options.from - Truncation direction (optional, for truncate)
   * @returns {Promise<Object>} - Response with { success, output }
   */
  async processString({ input, operation, casing, length, truncator, from }) {
    try {
      const response = await fetch('/api/string/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          operation,
          casing,
          length,
          truncator,
          from
        })
      });
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error processing string:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StringModule;
}
