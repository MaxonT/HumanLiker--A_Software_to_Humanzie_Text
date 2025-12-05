const StringHumanizer = require('./StringHumanizer');
const CollectionHumanizer = require('./CollectionHumanizer');

/**
 * EnumProcessor - utilities for working with enum-like values
 */
class EnumProcessor {
  /**
   * Convert enum value to human readable label
   */
  static humanize(value, casing = 'title') {
    if (value == null) return '';
    return StringHumanizer.humanize(String(value), casing);
  }

  /**
   * Convert human-readable label back to a normalized enum key
   */
  static dehumanize(label) {
    if (label == null) return '';
    return StringHumanizer.dehumanize(String(label));
  }

  /**
   * Join multiple enum values into a human-readable list
   */
  static list(values, separator = 'and', casing = 'title') {
    if (!Array.isArray(values)) return '';
    const humanized = values.map(value => this.humanize(value, casing));
    return CollectionHumanizer.humanize(humanized, separator);
  }

  /**
   * Parse a flag string into normalized enum keys
   */
  static parseFlags(input, delimiter = ',') {
    if (!input || typeof input !== 'string') return [];
    return input
      .split(delimiter)
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => this.dehumanize(part));
  }
}

module.exports = EnumProcessor;
