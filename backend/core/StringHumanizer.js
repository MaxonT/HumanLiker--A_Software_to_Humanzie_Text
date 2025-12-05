/**
 * StringHumanizer - Core module for humanizing and dehumanizing strings
 * Handles various string transformations including case conversions and truncation
 */
const Truncator = require('./Truncator');

class StringHumanizer {
  /**
   * Humanize a string by converting PascalCase, snake_case, kebab-case to readable text
   * @param {string} input - The string to humanize
   * @param {string} casing - The casing to apply ('sentence', 'title', 'lower', 'upper')
   * @returns {string} - The humanized string
   */
  static humanize(input, casing = 'sentence') {
    // Handle null/undefined
    if (input == null) return '';
    
    const str = String(input);
    if (str.trim() === '') return '';
    
    let result = str;
    
    // Handle PascalCase or camelCase
    // Insert space before uppercase letters that follow lowercase or are followed by lowercase
    result = result.replace(/([a-z])([A-Z])/g, '$1 $2');
    result = result.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
    
    // Handle snake_case
    result = result.replace(/_/g, ' ');
    
    // Handle kebab-case
    result = result.replace(/-/g, ' ');
    
    // Collapse multiple spaces into single space
    result = result.replace(/\s+/g, ' ').trim();
    
    // Apply casing
    return this.applyCasing(result, casing);
  }
  
  /**
   * Dehumanize a string by converting it to PascalCase
   * @param {string} input - The string to dehumanize
   * @returns {string} - The dehumanized string in PascalCase
   */
  static dehumanize(input) {
    // Handle null/undefined
    if (input == null) return '';
    
    const str = String(input);
    if (str.trim() === '') return '';
    
    // Split by spaces, underscores, or hyphens
    const words = str.split(/[\s_-]+/);
    
    // Convert each word to capitalized form
    const pascalCase = words
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
    
    return pascalCase;
  }
  
  /**
   * Apply a specific casing to text
   * @param {string} text - The text to transform
   * @param {string} casing - The casing type ('sentence', 'title', 'lower', 'upper')
   * @returns {string} - The transformed text
   */
  static applyCasing(text, casing) {
    if (text == null || text.trim() === '') return '';
    
    const str = String(text);
    
    switch (casing.toLowerCase()) {
      case 'sentence':
        // First letter uppercase, rest as-is but lowercase
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        
      case 'title':
        // Capitalize first letter of each word
        return str.split(' ')
          .map(word => {
            if (word.length === 0) return word;
            // Preserve acronyms (all uppercase words)
            if (word === word.toUpperCase() && word.length > 1) {
              return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(' ');
        
      case 'lower':
        return str.toLowerCase();
        
      case 'upper':
        return str.toUpperCase();
        
      default:
        return str;
    }
  }
  
  /**
   * Truncate a string using different strategies
   * @param {string} input - The string to truncate
   * @param {number} length - The maximum length or word count
   * @param {string} truncator - The truncation strategy ('FixedLength' or 'FixedNumberOfWords')
   * @param {string} from - Truncate from 'Right' or 'Left'
   * @returns {string} - The truncated string
   */
  static truncate(input, length, truncator = 'FixedLength', from = 'Right') {
    return Truncator.truncate(input, length, truncator, from);
  }
}

module.exports = StringHumanizer;
