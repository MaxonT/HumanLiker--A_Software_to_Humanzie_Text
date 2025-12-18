/**
 * CollectionHumanizer - Format arrays into human-readable strings
 * Example: ["apple", "banana", "cherry"] -> "apple, banana and cherry"
 */

/**
 * Humanize an array into a readable string
 * @param {Array} array - The array to humanize
 * @param {string} [separator=", "] - The separator between items
 * @param {string} [lastSeparator=" and "] - The separator before the last item
 * @returns {string} The humanized string
 */
function humanize(array, separator = ', ', lastSeparator = ' and ') {
  if (!Array.isArray(array)) {
    throw new TypeError('Input must be an array');
  }

  if (array.length === 0) {
    return '';
  }

  if (array.length === 1) {
    return String(array[0]);
  }

  if (array.length === 2) {
    return `${array[0]}${lastSeparator}${array[1]}`;
  }

  // For 3 or more items
  const allButLast = array.slice(0, -1);
  const last = array[array.length - 1];
  
  return allButLast.join(separator) + lastSeparator + last;
}

export default {
  humanize
};
