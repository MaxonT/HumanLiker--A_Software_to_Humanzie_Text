/**
 * ByteSizeModule - Client-side API wrapper for bytesize processing
 */

const ByteSizeModule = {
  /**
   * Process a byte size using the backend API
   * @param {Object} options - Processing options
   * @param {number|string} options.input - The bytes or string to process
   * @param {string} options.operation - Operation type ('humanize', 'parse')
   * @param {number} options.decimals - Decimal places (optional, for humanize)
   * @returns {Promise<Object>} - Response with { success, output }
   */
  async processByteSize({ input, operation, decimals }) {
    try {
      const response = await fetch('/api/bytesize/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          operation,
          decimals
        })
      });
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error processing bytesize:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ByteSizeModule;
}
