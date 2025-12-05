/**
 * RomanNumeral - Convert between integers and Roman numerals
 * 
 * Examples:
 * - 1 → I
 * - 4 → IV
 * - 9 → IX
 * - 2024 → MMXXIV
 */

class RomanNumeral {
  static values = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];

  /**
   * Convert an integer to a Roman numeral
   * @param {number} num - The integer to convert (1-3999)
   * @returns {string} - The Roman numeral representation
   */
  static toRoman(num) {
    if (num === undefined || num === null || isNaN(num)) {
      return '';
    }

    if (num <= 0 || num >= 4000) {
      return '';
    }

    let result = '';
    let remaining = num;

    for (const { value, numeral } of this.values) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }

    return result;
  }

  /**
   * Convert a Roman numeral to an integer
   * @param {string} roman - The Roman numeral to convert
   * @returns {number} - The integer representation
   */
  static fromRoman(roman) {
    if (!roman || typeof roman !== 'string') {
      return 0;
    }

    const romanUpper = roman.toUpperCase().trim();
    
    // Validate Roman numeral
    if (!/^[MDCLXVI]+$/.test(romanUpper)) {
      return 0;
    }

    const romanMap = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
    let result = 0;

    for (let i = 0; i < romanUpper.length; i++) {
      const current = romanMap[romanUpper[i]];
      const next = romanMap[romanUpper[i + 1]];

      if (next && current < next) {
        result -= current;
      } else {
        result += current;
      }
    }

    return result;
  }
}

module.exports = RomanNumeral;
