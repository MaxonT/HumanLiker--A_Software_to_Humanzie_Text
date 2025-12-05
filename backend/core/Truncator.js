/**
 * Truncator - utility for truncating strings
 * Provides fixed-length and fixed-word-count strategies with optional direction.
 */
class Truncator {
  /**
   * General truncation entry point
   * @param {string} input
   * @param {number} length
   * @param {string} strategy - 'FixedLength' | 'FixedNumberOfWords'
   * @param {string} from - 'Right' | 'Left'
   * @param {string} ellipsis - ellipsis marker used when truncating
   * @returns {string}
   */
  static truncate(input, length, strategy = 'FixedLength', from = 'Right', ellipsis = '...') {
    if (strategy === 'FixedNumberOfWords') {
      return this.fixedNumberOfWords(input, length, from, ellipsis);
    }
    return this.fixedLength(input, length, from, ellipsis);
  }

  /**
   * Truncate by exact character length
   */
  static fixedLength(input, length, from = 'Right', ellipsis = '...') {
    if (input == null) return '';

    const str = String(input);
    if (str.trim() === '') return '';

    const maxLength = parseInt(length, 10);
    if (isNaN(maxLength) || maxLength <= 0) return str;
    if (str.length <= maxLength) return str;

    const ellipsisLength = ellipsis.length;
    const available = Math.max(maxLength - ellipsisLength, 0);

    if (from === 'Left') {
      return ellipsis + str.slice(str.length - available);
    }

    return str.slice(0, available) + ellipsis;
  }

  /**
   * Truncate by word count
   */
  static fixedNumberOfWords(input, wordCount, from = 'Right', ellipsis = '...') {
    if (input == null) return '';

    const str = String(input);
    if (str.trim() === '') return '';

    const maxWords = parseInt(wordCount, 10);
    if (isNaN(maxWords) || maxWords <= 0) return str;

    const words = str.split(/\s+/);
    if (words.length <= maxWords) return str;

    if (from === 'Left') {
      return `${ellipsis} ${words.slice(words.length - maxWords).join(' ')}`;
    }

    return `${words.slice(0, maxWords).join(' ')} ${ellipsis}`;
  }
}

module.exports = Truncator;
