/**
 * MetricNumeral - Format numbers with metric prefixes
 * 
 * Examples:
 * - 1000 → 1K
 * - 1500 → 1.5K
 * - 1000000 → 1M
 * - 1200000000 → 1.2B
 */

class MetricNumeral {
  static units = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' }
  ];

  /**
   * Format a number with metric prefix
   * @param {number} num - The number to format
   * @param {number} decimals - Number of decimal places (default: 1)
   * @returns {string} - The formatted number
   */
  static format(num, decimals = 1) {
    if (num === undefined || num === null || isNaN(num)) {
      return '';
    }

    if (num === 0) {
      return '0';
    }

    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    for (const { value, suffix } of this.units) {
      if (absNum >= value) {
        const formatted = (absNum / value).toFixed(decimals);
        return `${sign}${formatted}${suffix}`;
      }
    }

    return num.toString();
  }

  /**
   * Parse a metric formatted string back to a number
   * @param {string} str - The metric string (e.g., "1.5K")
   * @returns {number} - The parsed number
   */
  static parse(str) {
    if (!str || typeof str !== 'string') {
      return 0;
    }

    const match = str.trim().match(/^(-?\d+(?:\.\d+)?)([KMBT])?$/i);
    if (!match) {
      return parseFloat(str) || 0;
    }

    const value = parseFloat(match[1]);
    const suffix = match[2] ? match[2].toUpperCase() : '';

    const multipliers = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
    const multiplier = multipliers[suffix] || 1;

    return value * multiplier;
  }
}

module.exports = MetricNumeral;
