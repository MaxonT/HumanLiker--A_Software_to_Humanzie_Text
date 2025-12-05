/**
 * CollectionModule - Client-side API wrapper for collection processing
 */

const CollectionModule = {
  /**
   * Process a collection using the backend API
   * @param {Object} options - Processing options
   * @param {Array} options.input - The array to process
   * @param {string} options.operation - Operation type ('humanize', 'humanizeOr', 'humanizeOxford')
   * @param {string} options.separator - Custom separator (optional)
   * @param {string} options.lastSeparator - Custom last separator (optional)
   * @returns {Promise<Object>} - Response with { success, output }
   */
  async processCollection({ input, operation, separator, lastSeparator }) {
    try {
      const response = await fetch('/api/collection/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          operation,
          separator,
          lastSeparator
        })
      });
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error processing collection:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CollectionModule;
}
