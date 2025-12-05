/**
 * TimeSpanModule - Client-side API wrapper for timespan processing
 */

const TimeSpanModule = {
  /**
   * Process a timespan using the backend API
   * @param {Object} options - Processing options
   * @param {number|string} options.input - The timespan in milliseconds or string
   * @param {string} options.operation - Operation type ('humanize', 'toUnit', 'parse')
   * @param {number} options.maxUnits - Maximum units to display (optional)
   * @param {boolean} options.verbose - Use verbose format (optional)
   * @param {string} options.unit - Unit to convert to (optional)
   * @param {number} options.decimals - Decimal places (optional)
   * @returns {Promise<Object>} - Response with { success, output }
   */
  async processTimeSpan({ input, operation, maxUnits, verbose, unit, decimals }) {
    try {
      const response = await fetch('/api/timespan/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          operation,
          maxUnits,
          verbose,
          unit,
          decimals
        })
      });
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error processing timespan:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimeSpanModule;
}
