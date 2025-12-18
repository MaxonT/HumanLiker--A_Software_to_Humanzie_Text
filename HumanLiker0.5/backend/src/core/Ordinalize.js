/**
 * Ordinalize - Convert numbers to ordinal form
 * Example: 1 -> 1st, 2 -> 2nd, 3 -> 3rd, 4 -> 4th
 */

/**
 * Get the ordinal suffix for a number
 * @param {number} number - The number to get suffix for
 * @returns {string} The ordinal suffix (st, nd, rd, th)
 */
function getOrdinalSuffix(number) {
  if (typeof number !== 'number' || isNaN(number)) {
    throw new TypeError('Input must be a valid number');
  }

  const absNumber = Math.abs(Math.floor(number));
  const lastDigit = absNumber % 10;
  const lastTwoDigits = absNumber % 100;

  // Special cases for 11, 12, 13
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }

  // Regular cases
  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/**
 * Convert a number to its ordinal form
 * @param {number} number - The number to ordinalize
 * @returns {string} The ordinalized number (e.g., "1st", "2nd", "3rd")
 */
function convert(number) {
  if (typeof number !== 'number' || isNaN(number)) {
    throw new TypeError('Input must be a valid number');
  }

  const suffix = getOrdinalSuffix(number);
  return `${number}${suffix}`;
}

export default {
  convert,
  getOrdinalSuffix
};
