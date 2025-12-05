/**
 * TupleConverter - lightweight tuple parsing and formatting helper
 */
class TupleConverter {
  /**
   * Convert array or tuple-like value to formatted string
   */
  static toString(tuple, separator = ', ') {
    if (!Array.isArray(tuple)) return '';
    return `(${tuple.join(separator)})`;
  }

  /**
   * Parse tuple string back into array values
   */
  static parse(tupleString) {
    if (!tupleString || typeof tupleString !== 'string') return [];

    const trimmed = tupleString.trim();
    const withoutBrackets = trimmed.replace(/^\(/, '').replace(/\)$/, '');
    if (withoutBrackets.trim() === '') return [];

    return withoutBrackets.split(',').map(part => part.trim());
  }
}

module.exports = TupleConverter;
