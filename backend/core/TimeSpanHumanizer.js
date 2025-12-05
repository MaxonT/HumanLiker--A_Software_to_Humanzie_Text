/**
 * TimeSpanHumanizer - Humanize time durations
 * 
 * Examples:
 * - 3661000 ms → "1 hour, 1 minute, 1 second"
 * - 120000 ms → "2 minutes"
 * - 86400000 ms → "1 day"
 */

class TimeSpanHumanizer {
  /**
   * Humanize a time span in milliseconds
   * @param {number} milliseconds - The time span in milliseconds
   * @param {Object} options - Options for formatting
   * @param {number} options.maxUnits - Maximum number of units to display (default: 2)
   * @param {boolean} options.verbose - Use verbose format (default: false)
   * @returns {string} - The humanized time span
   */
  static humanize(milliseconds, options = {}) {
    if (milliseconds === undefined || milliseconds === null || isNaN(milliseconds)) {
      return '';
    }

    const { maxUnits = 2, verbose = false } = options;
    const absMs = Math.abs(milliseconds);
    const isNegative = milliseconds < 0;

    const units = [
      { ms: 31536000000, name: 'year', short: 'y' },
      { ms: 2592000000, name: 'month', short: 'mo' },
      { ms: 86400000, name: 'day', short: 'd' },
      { ms: 3600000, name: 'hour', short: 'h' },
      { ms: 60000, name: 'minute', short: 'm' },
      { ms: 1000, name: 'second', short: 's' },
      { ms: 1, name: 'millisecond', short: 'ms' }
    ];

    const parts = [];
    let remaining = absMs;

    for (const unit of units) {
      if (remaining >= unit.ms) {
        const value = Math.floor(remaining / unit.ms);
        remaining %= unit.ms;

        if (verbose) {
          const unitName = value === 1 ? unit.name : unit.name + 's';
          parts.push(`${value} ${unitName}`);
        } else {
          parts.push(`${value}${unit.short}`);
        }

        if (parts.length >= maxUnits) {
          break;
        }
      }
    }

    if (parts.length === 0) {
      return verbose ? '0 milliseconds' : '0ms';
    }

    const result = verbose ? parts.join(', ') : parts.join(' ');
    return isNegative ? `-${result}` : result;
  }

  /**
   * Convert time span to a specific unit
   * @param {number} milliseconds - The time span in milliseconds
   * @param {string} unit - The unit to convert to ('seconds', 'minutes', 'hours', 'days')
   * @param {number} decimals - Number of decimal places (default: 2)
   * @returns {string} - The converted value with unit
   */
  static toUnit(milliseconds, unit = 'seconds', decimals = 2) {
    if (milliseconds === undefined || milliseconds === null || isNaN(milliseconds)) {
      return '';
    }

    const conversions = {
      milliseconds: 1,
      seconds: 1000,
      minutes: 60000,
      hours: 3600000,
      days: 86400000
    };

    const divisor = conversions[unit];
    if (!divisor) {
      return '';
    }

    const value = (milliseconds / divisor).toFixed(decimals);
    return `${value} ${unit}`;
  }

  /**
   * Parse a humanized time span back to milliseconds
   * @param {string} str - The time span string (e.g., "1h 30m", "2 days")
   * @returns {number} - The time span in milliseconds
   */
  static parse(str) {
    if (!str || typeof str !== 'string') {
      return 0;
    }

    const units = {
      ms: 1,
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
      mo: 2592000000,
      y: 31536000000,
      second: 1000,
      seconds: 1000,
      minute: 60000,
      minutes: 60000,
      hour: 3600000,
      hours: 3600000,
      day: 86400000,
      days: 86400000,
      month: 2592000000,
      months: 2592000000,
      year: 31536000000,
      years: 31536000000
    };

    let total = 0;
    const regex = /(\d+(?:\.\d+)?)\s*([a-z]+)/gi;
    let match;

    while ((match = regex.exec(str)) !== null) {
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      
      if (units[unit]) {
        total += value * units[unit];
      }
    }

    return total;
  }
}

module.exports = TimeSpanHumanizer;
