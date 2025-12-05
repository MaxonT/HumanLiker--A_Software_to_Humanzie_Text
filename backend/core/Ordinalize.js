/**
 * Ordinalize - Convert numbers to ordinal strings
 * 
 * Examples:
 * - 1 → 1st
 * - 2 → 2nd
 * - 21 → 21st
 * - 100 → 100th
 */

const NumberToWords = require('./NumberToWords');

class Ordinalize {
  /**
   * Convert a number to its ordinal string representation (1st, 2nd, etc.)
   * @param {number} num - The number to ordinalize
   * @returns {string} - The ordinalized number
   */
  static ordinalize(num) {
    return NumberToWords.toOrdinal(num);
  }

  /**
   * Convert a number to its ordinal word representation (first, second, etc.)
   * @param {number} num - The number to convert
   * @returns {string} - The ordinal in words
   */
  static ordinalizeWords(num) {
    return NumberToWords.toOrdinalWords(num);
  }
}

module.exports = Ordinalize;
