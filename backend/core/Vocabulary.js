/**
 * Vocabulary - Manages irregular and uncountable words for inflection
 * Stores common irregular plural/singular forms and uncountable nouns
 */

class Vocabulary {
  constructor() {
    /**
     * Map of singular -> plural for irregular nouns
     * Stored in lowercase for case-insensitive matching
     */
    this.irregulars = {
      'person': 'people',
      'man': 'men',
      'woman': 'women',
      'child': 'children',
      'tooth': 'teeth',
      'foot': 'feet',
      'mouse': 'mice',
      'goose': 'geese',
      'ox': 'oxen',
      'datum': 'data',
      'medium': 'media',
      'analysis': 'analyses',
      'diagnosis': 'diagnoses',
      'basis': 'bases',
      'crisis': 'crises',
      'phenomenon': 'phenomena',
      'criterion': 'criteria',
      'cactus': 'cacti',
      'focus': 'foci',
      'fungus': 'fungi',
      'nucleus': 'nuclei',
      'radius': 'radii',
      'stimulus': 'stimuli',
      'axis': 'axes',
      'testis': 'testes'
    };
    
    /**
     * Array of uncountable nouns that don't have plural forms
     */
    this.uncountables = [
      'equipment',
      'information',
      'rice',
      'money',
      'species',
      'series',
      'fish',
      'sheep',
      'deer',
      'moose',
      'swine',
      'buffalo',
      'salmon',
      'trout',
      'aircraft',
      'spacecraft',
      'watercraft',
      'hovercraft',
      'headquarters',
      'news',
      'mathematics',
      'physics',
      'economics',
      'politics',
      'athletics',
      'diabetes',
      'measles',
      'mumps'
    ];
    
    // Create reverse mapping for singulars (plural -> singular)
    this._pluralToSingular = {};
    for (const [singular, plural] of Object.entries(this.irregulars)) {
      this._pluralToSingular[plural] = singular;
    }
  }
  
  /**
   * Add an irregular word pair
   * @param {string} singular - The singular form
   * @param {string} plural - The plural form
   */
  addIrregular(singular, plural) {
    if (!singular || !plural) {
      throw new Error('Both singular and plural forms are required');
    }
    
    const singularLower = String(singular).toLowerCase();
    const pluralLower = String(plural).toLowerCase();
    
    this.irregulars[singularLower] = pluralLower;
    this._pluralToSingular[pluralLower] = singularLower;
  }
  
  /**
   * Add an uncountable word
   * @param {string} word - The uncountable word
   */
  addUncountable(word) {
    if (!word) {
      throw new Error('Word is required');
    }
    
    const wordLower = String(word).toLowerCase();
    if (!this.uncountables.includes(wordLower)) {
      this.uncountables.push(wordLower);
    }
  }
  
  /**
   * Check if a word is uncountable
   * @param {string} word - The word to check
   * @returns {boolean} - True if the word is uncountable
   */
  isUncountable(word) {
    if (!word) return false;
    
    const wordLower = String(word).toLowerCase();
    return this.uncountables.includes(wordLower);
  }
  
  /**
   * Get the plural form of an irregular singular word
   * @param {string} singular - The singular form
   * @returns {string|null} - The plural form or null if not found
   */
  getPlural(singular) {
    if (!singular) return null;
    
    const singularLower = String(singular).toLowerCase();
    return this.irregulars[singularLower] || null;
  }
  
  /**
   * Get the singular form of an irregular plural word
   * @param {string} plural - The plural form
   * @returns {string|null} - The singular form or null if not found
   */
  getSingular(plural) {
    if (!plural) return null;
    
    const pluralLower = String(plural).toLowerCase();
    return this._pluralToSingular[pluralLower] || null;
  }
}

module.exports = Vocabulary;
