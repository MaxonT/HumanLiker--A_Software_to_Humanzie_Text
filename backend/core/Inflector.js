/**
 * Inflector - Provides string inflection methods (pluralize, singularize, case transformations)
 * Uses Vocabulary for irregular and uncountable words
 */

const Vocabulary = require('./Vocabulary');

class Inflector {
  static vocabulary = new Vocabulary();
  
  /**
   * Pluralize a word
   * @param {string} word - The word to pluralize
   * @returns {string} - The pluralized word
   */
  static pluralize(word) {
    if (!word) return '';
    
    const str = String(word).trim();
    if (!str) return '';
    
    const lower = str.toLowerCase();
    
    // Check if uncountable
    if (this.vocabulary.isUncountable(lower)) {
      return str;
    }
    
    // Check irregulars
    const irregular = this.vocabulary.getPlural(lower);
    if (irregular) {
      return this.matchCase(str, irregular);
    }
    
    // Apply pluralization rules
    
    // Words ending in s, x, z, ch, sh -> add es
    if (/(s|x|z|ch|sh)$/i.test(str)) {
      return str + 'es';
    }
    
    // Words ending in consonant + y -> change y to ies
    if (/[^aeiou]y$/i.test(str)) {
      return str.slice(0, -1) + 'ies';
    }
    
    // Words ending in f or fe -> change to ves
    if (/f$/i.test(str)) {
      return str.slice(0, -1) + 'ves';
    }
    if (/fe$/i.test(str)) {
      return str.slice(0, -2) + 'ves';
    }
    
    // Words ending in consonant + o -> add es (simplified rule)
    if (/[^aeiou]o$/i.test(str)) {
      return str + 'es';
    }
    
    // Default: add s
    return str + 's';
  }
  
  /**
   * Singularize a word
   * @param {string} word - The word to singularize
   * @returns {string} - The singularized word
   */
  static singularize(word) {
    if (!word) return '';
    
    const str = String(word).trim();
    if (!str) return '';
    
    const lower = str.toLowerCase();
    
    // Check if uncountable
    if (this.vocabulary.isUncountable(lower)) {
      return str;
    }
    
    // Check irregulars (reverse lookup)
    const irregular = this.vocabulary.getSingular(lower);
    if (irregular) {
      return this.matchCase(str, irregular);
    }
    
    // Apply singularization rules (reverse of pluralization)
    
    // Words ending in ses, xes, zes, ches, shes -> remove es
    if (/(s|x|z|ch|sh)es$/i.test(str)) {
      return str.slice(0, -2);
    }
    
    // Words ending in ies -> change to y
    if (/ies$/i.test(str)) {
      return str.slice(0, -3) + 'y';
    }
    
    // Words ending in ves -> change to f or fe (use f for simplicity)
    if (/ves$/i.test(str)) {
      // Check if it should end in 'fe' (like knife -> knives)
      if (/ives$/i.test(str)) {
        return str.slice(0, -3) + 'fe';
      }
      return str.slice(0, -3) + 'f';
    }
    
    // Words ending in oes -> change to o
    if (/[^aeiou]oes$/i.test(str)) {
      return str.slice(0, -2);
    }
    
    // Words ending in s -> remove s (but not ss)
    if (/([^s])s$/i.test(str)) {
      return str.slice(0, -1);
    }
    
    // Default: return as-is
    return str;
  }
  
  /**
   * Convert to PascalCase (e.g., "hello world" -> "HelloWorld")
   * @param {string} input - The input string
   * @returns {string} - The PascalCase string
   */
  static pascalize(input) {
    if (!input) return '';
    
    const str = String(input).trim();
    if (!str) return '';
    
    // Split by spaces, underscores, hyphens, or camelCase boundaries
    const words = str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(/[\s_-]+/);
    
    return words
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
  
  /**
   * Convert to camelCase (e.g., "hello world" -> "helloWorld")
   * @param {string} input - The input string
   * @returns {string} - The camelCase string
   */
  static camelize(input) {
    if (!input) return '';
    
    const pascal = this.pascalize(input);
    if (!pascal) return '';
    
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }
  
  /**
   * Convert to underscore_case (e.g., "HelloWorld" -> "hello_world")
   * @param {string} input - The input string
   * @returns {string} - The underscore_case string
   */
  static underscore(input) {
    if (!input) return '';
    
    const str = String(input).trim();
    if (!str) return '';
    
    return str
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z\d])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  }
  
  /**
   * Convert to dasherize (e.g., "HelloWorld" -> "hello-world")
   * @param {string} input - The input string
   * @returns {string} - The dasherized string
   */
  static dasherize(input) {
    if (!input) return '';
    
    const underscored = this.underscore(input);
    return underscored.replace(/_/g, '-');
  }
  
  /**
   * Convert to kebab-case (alias for dasherize)
   * @param {string} input - The input string
   * @returns {string} - The kebab-case string
   */
  static kebaberize(input) {
    return this.dasherize(input);
  }
  
  /**
   * Convert to Title Case (e.g., "hello world" -> "Hello World")
   * @param {string} input - The input string
   * @returns {string} - The Title Case string
   */
  static titleize(input) {
    if (!input) return '';
    
    const str = String(input).trim();
    if (!str) return '';
    
    // First convert to spaced words (handle camelCase, snake_case, kebab-case)
    let spaced = str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ');
    
    // Capitalize each word
    return spaced
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  /**
   * Convert a word to quantity form with number
   * @param {string} word - The word to quantify
   * @param {number} quantity - The quantity
   * @param {string} showQuantityAs - 'Numeric' or 'Words' (default: 'Numeric')
   * @returns {string} - The quantified string (e.g., "1 apple", "2 apples")
   */
  static toQuantity(word, quantity, showQuantityAs = 'Numeric') {
    if (!word) return '';
    
    const qty = parseInt(quantity, 10);
    if (isNaN(qty)) return word;
    
    let quantityStr;
    if (showQuantityAs === 'Words') {
      // Try to use NumberToWords if available, otherwise fall back to numeric
      try {
        const NumberToWords = require('./NumberToWords');
        quantityStr = NumberToWords.convert(qty);
      } catch (error) {
        quantityStr = String(qty);
      }
    } else {
      quantityStr = String(qty);
    }
    
    const inflected = qty === 1 ? word : this.pluralize(word);
    
    return `${quantityStr} ${inflected}`;
  }
  
  /**
   * Match the case of a template word to another word
   * @param {string} template - The word whose case to match
   * @param {string} word - The word to transform
   * @returns {string} - The transformed word with matched case
   */
  static matchCase(template, word) {
    if (!template || !word) return word || '';
    
    const templateStr = String(template);
    const wordStr = String(word);
    
    // Check if all uppercase
    if (templateStr === templateStr.toUpperCase()) {
      return wordStr.toUpperCase();
    }
    
    // Check if all lowercase
    if (templateStr === templateStr.toLowerCase()) {
      return wordStr.toLowerCase();
    }
    
    // Check if capitalized (first letter uppercase, rest lowercase)
    if (templateStr.charAt(0) === templateStr.charAt(0).toUpperCase() &&
        templateStr.slice(1) === templateStr.slice(1).toLowerCase()) {
      return wordStr.charAt(0).toUpperCase() + wordStr.slice(1).toLowerCase();
    }
    
    // Default: return word as-is
    return wordStr;
  }
}

module.exports = Inflector;
