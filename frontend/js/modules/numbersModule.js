/**
 * NumbersModule - Client-side API wrapper for number processing
 */

const NumbersModule = {
  /**
   * Process a number using the backend API
   * @param {Object} options - Processing options
   * @param {number|string} options.input - The number or string to process
   * @param {string} options.operation - Operation type ('toWords', 'toOrdinal', 'toOrdinalWords', 'toRoman', 'fromRoman', 'toMetric', 'fromMetric')
   * @param {number} options.decimals - Decimal places (optional, for toMetric)
   * @returns {Promise<Object>} - Response with { success, output }
   */
  async processNumber({ input, operation, decimals }) {
    try {
      const response = await fetch('/api/numbers/process', {
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
      console.error('Error processing number:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NumbersModule;
}
