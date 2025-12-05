/**
 * DateTimeModule - Client-side API wrapper for datetime processing
 */

const DateTimeModule = {
  /**
   * Process a date using the backend API
   * @param {Object} options - Processing options
   * @param {string|number|Date} options.input - The date to process
   * @param {string} options.operation - Operation type ('humanize', 'format')
   * @param {string} options.formatType - Format type (optional, for format operation)
   * @returns {Promise<Object>} - Response with { success, output }
   */
  async processDateTime({ input, operation, formatType }) {
    try {
      const response = await fetch('/api/datetime/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          operation,
          formatType
        })
      });
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error processing datetime:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DateTimeModule;
}
