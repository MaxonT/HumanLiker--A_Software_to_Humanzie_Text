/**
 * NumberToWords - Convert numbers to their written word representation
 * 
 * Supports:
 * - Integers from 0 to 999,999,999,999,999
 * - Negative numbers
 * - Ordinal numbers (1st, 2nd, 3rd, etc.)
 */

class NumberToWords {
  static ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  static teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  static tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  static scales = ['', 'thousand', 'million', 'billion', 'trillion'];

  /**
   * Convert a number to words
   * @param {number} num - The number to convert
   * @returns {string} - The number in words
   */
  static convert(num) {
    if (num === undefined || num === null || isNaN(num)) {
      return '';
    }

    // Handle zero
    if (num === 0) {
      return 'zero';
    }

    // Handle negative numbers
    if (num < 0) {
      return 'minus ' + this.convert(-num);
    }

    // Handle large numbers (beyond trillion)
    if (num >= 1000000000000000) {
      return num.toString();
    }

    let words = '';
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkWords = this.convertChunk(chunk);
        const scale = this.scales[scaleIndex];
        words = chunkWords + (scale ? ' ' + scale : '') + (words ? ' ' + words : '');
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return words.trim();
  }

  /**
   * Convert a three-digit chunk to words
   * @param {number} num - Number from 0 to 999
   * @returns {string} - The chunk in words
   */
  static convertChunk(num) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    let words = '';

    if (hundreds > 0) {
      words = this.ones[hundreds] + ' hundred';
    }

    if (remainder > 0) {
      if (words) words += ' ';
      
      if (remainder < 10) {
        words += this.ones[remainder];
      } else if (remainder < 20) {
        words += this.teens[remainder - 10];
      } else {
        const tensDigit = Math.floor(remainder / 10);
        const onesDigit = remainder % 10;
        words += this.tens[tensDigit];
        if (onesDigit > 0) {
          words += '-' + this.ones[onesDigit];
        }
      }
    }

    return words;
  }

  /**
   * Convert a number to its ordinal form (1st, 2nd, 3rd, etc.)
   * @param {number} num - The number to convert
   * @returns {string} - The ordinal representation
   */
  static toOrdinal(num) {
    if (num === undefined || num === null || isNaN(num)) {
      return '';
    }

    const absNum = Math.abs(num);
    const lastDigit = absNum % 10;
    const lastTwoDigits = absNum % 100;

    let suffix = 'th';

    // Special cases for 11, 12, 13
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      suffix = 'th';
    } else if (lastDigit === 1) {
      suffix = 'st';
    } else if (lastDigit === 2) {
      suffix = 'nd';
    } else if (lastDigit === 3) {
      suffix = 'rd';
    }

    return num + suffix;
  }

  /**
   * Convert a number to its ordinal word form (first, second, third, etc.)
   * @param {number} num - The number to convert
   * @returns {string} - The ordinal word representation
   */
  static toOrdinalWords(num) {
    if (num === undefined || num === null || isNaN(num)) {
      return '';
    }

    // Special cases for 1-12
    const specialOrdinals = {
      1: 'first',
      2: 'second',
      3: 'third',
      4: 'fourth',
      5: 'fifth',
      6: 'sixth',
      7: 'seventh',
      8: 'eighth',
      9: 'ninth',
      10: 'tenth',
      11: 'eleventh',
      12: 'twelfth'
    };

    if (specialOrdinals[num]) {
      return specialOrdinals[num];
    }

    // For larger numbers, convert to words then change ending
    let words = this.convert(num);
    
    // Handle endings
    if (words.endsWith('y')) {
      words = words.slice(0, -1) + 'ieth';
    } else if (words.endsWith('one')) {
      words = words.slice(0, -3) + 'first';
    } else if (words.endsWith('two')) {
      words = words.slice(0, -3) + 'second';
    } else if (words.endsWith('three')) {
      words = words.slice(0, -5) + 'third';
    } else if (words.endsWith('five')) {
      words = words.slice(0, -4) + 'fifth';
    } else if (words.endsWith('eight')) {
      words = words.slice(0, -5) + 'eighth';
    } else if (words.endsWith('nine')) {
      words = words.slice(0, -4) + 'ninth';
    } else if (words.endsWith('twelve')) {
      words = words.slice(0, -6) + 'twelfth';
    } else {
      words += 'th';
    }

    return words;
  }
}

module.exports = NumberToWords;
