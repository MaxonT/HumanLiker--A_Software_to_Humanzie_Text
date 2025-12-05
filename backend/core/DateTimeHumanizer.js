/**
 * DateTimeHumanizer - Humanize dates and times
 * 
 * Examples:
 * - Date 2 days ago → "2 days ago"
 * - Date in 3 hours → "in 3 hours"
 * - Today → "today"
 */

class DateTimeHumanizer {
  /**
   * Humanize a date relative to now
   * @param {Date|string|number} date - The date to humanize
   * @returns {string} - The humanized date
   */
  static humanize(date) {
    const targetDate = this.parseDate(date);
    if (!targetDate || isNaN(targetDate.getTime())) {
      return '';
    }

    const now = new Date();
    const diffMs = targetDate - now;
    const absDiffMs = Math.abs(diffMs);
    const isPast = diffMs < 0;

    const seconds = Math.floor(absDiffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let result = '';

    if (seconds < 10) {
      result = 'just now';
    } else if (seconds < 60) {
      result = `${seconds} ${this.pluralize('second', seconds)}`;
    } else if (minutes < 60) {
      result = `${minutes} ${this.pluralize('minute', minutes)}`;
    } else if (hours < 24) {
      result = `${hours} ${this.pluralize('hour', hours)}`;
    } else if (days < 30) {
      result = `${days} ${this.pluralize('day', days)}`;
    } else if (months < 12) {
      result = `${months} ${this.pluralize('month', months)}`;
    } else {
      result = `${years} ${this.pluralize('year', years)}`;
    }

    if (result === 'just now') {
      return result;
    }

    return isPast ? `${result} ago` : `in ${result}`;
  }

  /**
   * Parse a date from various formats
   * @param {Date|string|number} date - The date to parse
   * @returns {Date} - The parsed date
   */
  static parseDate(date) {
    if (date instanceof Date) {
      return date;
    }
    
    if (typeof date === 'string' || typeof date === 'number') {
      return new Date(date);
    }

    return null;
  }

  /**
   * Pluralize a unit
   * @param {string} unit - The unit to pluralize
   * @param {number} count - The count
   * @returns {string} - The pluralized unit
   */
  static pluralize(unit, count) {
    return count === 1 ? unit : unit + 's';
  }

  /**
   * Format a date in a human-friendly format
   * @param {Date|string|number} date - The date to format
   * @param {string} format - The format type ('short', 'medium', 'long')
   * @returns {string} - The formatted date
   */
  static format(date, format = 'medium') {
    const targetDate = this.parseDate(date);
    if (!targetDate || isNaN(targetDate.getTime())) {
      return '';
    }

    const options = {
      short: { month: 'numeric', day: 'numeric', year: '2-digit' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    };

    return targetDate.toLocaleDateString('en-US', options[format] || options.medium);
  }
}

module.exports = DateTimeHumanizer;
