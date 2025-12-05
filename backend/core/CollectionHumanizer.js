/**
 * CollectionHumanizer - Humanize collections with natural language
 * 
 * Examples:
 * - ['a', 'b', 'c'] → "a, b, and c"
 * - ['a', 'b'] → "a and b"
 * - ['a'] → "a"
 */

class CollectionHumanizer {
  /**
   * Humanize a collection of items
   * @param {Array} items - The collection to humanize
   * @param {string} separator - The separator to use (default: ', ')
   * @param {string} lastSeparator - The last separator to use (default: 'and')
   * @returns {string} - The humanized collection
   */
  static humanize(items, separator = ', ', lastSeparator = 'and') {
    if (!Array.isArray(items) || items.length === 0) {
      return '';
    }

    // Filter out null/undefined values and convert to strings
    const validItems = items
      .filter(item => item !== null && item !== undefined)
      .map(item => String(item));

    if (validItems.length === 0) {
      return '';
    }

    if (validItems.length === 1) {
      return validItems[0];
    }

    if (validItems.length === 2) {
      return `${validItems[0]} ${lastSeparator} ${validItems[1]}`;
    }

    const allButLast = validItems.slice(0, -1);
    const last = validItems[validItems.length - 1];
    
    return `${allButLast.join(separator)}${separator}${lastSeparator} ${last}`;
  }

  /**
   * Humanize a collection with "or" separator
   * @param {Array} items - The collection to humanize
   * @returns {string} - The humanized collection with "or"
   */
  static humanizeOr(items) {
    return this.humanize(items, ', ', 'or');
  }

  /**
   * Humanize a collection with Oxford comma
   * @param {Array} items - The collection to humanize
   * @returns {string} - The humanized collection with Oxford comma
   */
  static humanizeWithOxfordComma(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return '';
    }

    const validItems = items
      .filter(item => item !== null && item !== undefined)
      .map(item => String(item));

    if (validItems.length < 3) {
      return this.humanize(validItems);
    }

    const allButLast = validItems.slice(0, -1);
    const last = validItems[validItems.length - 1];
    
    return `${allButLast.join(', ')}, and ${last}`;
  }
}

module.exports = CollectionHumanizer;
