/**
 * MetricNumeral - Convert between standard numbers and metric notation
 * Example: 1000 -> 1k, 1000000 -> 1M
 */

/**
 * Convert a number to metric notation
 * @param {number} num - The number to convert
 * @param {number} [precision=1] - Number of decimal places
 * @returns {string} The metric notation (e.g., "1.5k", "2.3M")
 */
function toMetric(num, precision = 1) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Input must be a valid number');
  }

  if (typeof precision !== 'number' || precision < 0) {
    precision = 1;
  }

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  const metricPrefixes = [
    { value: 1e12, symbol: 'T' },  // Tera
    { value: 1e9, symbol: 'G' },   // Giga
    { value: 1e6, symbol: 'M' },   // Mega
    { value: 1e3, symbol: 'k' }    // Kilo
  ];

  for (const { value, symbol } of metricPrefixes) {
    if (absNum >= value) {
      const converted = num / value;
      return sign + converted.toFixed(precision) + symbol;
    }
  }

  // Return as-is if less than 1000
  return num.toFixed(precision);
}

/**
 * Convert metric notation to standard number
 * @param {string} metricString - The metric notation string (e.g., "1.5k", "2M")
 * @returns {number} The standard number
 */
function fromMetric(metricString) {
  if (typeof metricString !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const trimmed = metricString.trim();
  
  if (!trimmed) {
    throw new Error('Input string cannot be empty');
  }

  const metricSuffixes = {
    'k': 1e3,   // Kilo
    'K': 1e3,
    'M': 1e6,   // Mega
    'G': 1e9,   // Giga
    'T': 1e12   // Tera
  };

  // Match number with optional metric suffix
  const match = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*([kKMGT]?)$/);
  
  if (!match) {
    throw new Error('Invalid metric format');
  }

  const numValue = parseFloat(match[1]);
  const suffix = match[2];

  if (suffix && metricSuffixes[suffix]) {
    return numValue * metricSuffixes[suffix];
  }

  return numValue;
}

export default {
  toMetric,
  fromMetric
};
