/**
 * DateTimeHumanizer - Convert dates to human-readable relative time strings
 * Example: "2 hours ago", "in 3 days"
 */

/**
 * Humanize a date relative to now
 * @param {Date|string|number} date - The date to humanize
 * @param {Date|string|number} [now=new Date()] - The reference date (defaults to current time)
 * @returns {string} Human-readable time difference
 */
function humanize(date, now = new Date()) {
  // Parse input dates
  const targetDate = parseDate(date);
  const referenceDate = parseDate(now);

  if (!targetDate || !referenceDate) {
    throw new TypeError('Invalid date provided');
  }

  // Calculate difference in milliseconds
  const diffMs = targetDate - referenceDate;
  const absDiffMs = Math.abs(diffMs);
  const isPast = diffMs < 0;

  // Define time units in milliseconds
  const units = [
    { name: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
    { name: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
    { name: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
    { name: 'day', ms: 24 * 60 * 60 * 1000 },
    { name: 'hour', ms: 60 * 60 * 1000 },
    { name: 'minute', ms: 60 * 1000 },
    { name: 'second', ms: 1000 }
  ];

  // Find the appropriate unit
  for (const unit of units) {
    const value = Math.floor(absDiffMs / unit.ms);
    
    if (value >= 1) {
      const plural = value > 1 ? 's' : '';
      const timeStr = `${value} ${unit.name}${plural}`;
      
      return isPast ? `${timeStr} ago` : `in ${timeStr}`;
    }
  }

  // If less than a second
  return 'just now';
}

/**
 * Parse various date formats into Date object
 * @param {Date|string|number} input - The date input
 * @returns {Date|null} Parsed Date object or null if invalid
 */
function parseDate(input) {
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  if (typeof input === 'number') {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof input === 'string') {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export default {
  humanize
};
