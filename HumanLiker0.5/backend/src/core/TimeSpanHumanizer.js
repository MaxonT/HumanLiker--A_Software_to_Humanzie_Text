/**
 * TimeSpanHumanizer - Convert milliseconds to human-readable duration strings
 * Example: 3661000 -> "1 hour, 1 minute, 1 second"
 */

/**
 * Humanize a time span in milliseconds
 * @param {number} milliseconds - The time span in milliseconds
 * @param {number} [precision=2] - Number of units to include (1-7)
 * @returns {string} Human-readable duration
 */
function humanize(milliseconds, precision = 2) {
  if (typeof milliseconds !== 'number' || isNaN(milliseconds)) {
    throw new TypeError('Input must be a valid number');
  }

  if (milliseconds < 0) {
    throw new RangeError('Milliseconds must be non-negative');
  }

  if (typeof precision !== 'number' || precision < 1 || precision > 7) {
    precision = 2;
  }

  // Handle zero
  if (milliseconds === 0) {
    return '0 milliseconds';
  }

  // Define time units
  const units = [
    { name: 'day', ms: 24 * 60 * 60 * 1000 },
    { name: 'hour', ms: 60 * 60 * 1000 },
    { name: 'minute', ms: 60 * 1000 },
    { name: 'second', ms: 1000 },
    { name: 'millisecond', ms: 1 }
  ];

  const parts = [];
  let remaining = Math.floor(milliseconds);

  for (const unit of units) {
    if (remaining >= unit.ms) {
      const value = Math.floor(remaining / unit.ms);
      remaining = remaining % unit.ms;
      
      const plural = value > 1 ? 's' : '';
      parts.push(`${value} ${unit.name}${plural}`);

      // Stop if we've reached desired precision
      if (parts.length >= precision) {
        break;
      }
    }
  }

  if (parts.length === 0) {
    return '0 milliseconds';
  }

  // Join parts with commas and "and" before last item
  if (parts.length === 1) {
    return parts[0];
  }

  if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]}`;
  }

  const allButLast = parts.slice(0, -1);
  const last = parts[parts.length - 1];
  return allButLast.join(', ') + ', and ' + last;
}

export default {
  humanize
};
