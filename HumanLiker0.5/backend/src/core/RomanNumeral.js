/**
 * RomanNumeral - Convert between decimal and Roman numerals
 */

/**
 * Convert a decimal number to Roman numeral
 * @param {number} num - The decimal number (1-3999)
 * @returns {string} The Roman numeral representation
 */
function toRoman(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Input must be a valid number');
  }

  if (num < 1 || num > 3999) {
    throw new RangeError('Number must be between 1 and 3999');
  }

  const romanMap = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];

  let result = '';
  let remaining = Math.floor(num);

  for (const { value, symbol } of romanMap) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
}

/**
 * Convert a Roman numeral to decimal number
 * @param {string} roman - The Roman numeral string
 * @returns {number} The decimal number
 */
function fromRoman(roman) {
  if (typeof roman !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const romanUpper = roman.toUpperCase().trim();
  
  if (!romanUpper || !/^[MDCLXVI]+$/.test(romanUpper)) {
    throw new Error('Invalid Roman numeral format');
  }

  const romanValues = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
  };

  let result = 0;
  let prevValue = 0;

  // Process from right to left
  for (let i = romanUpper.length - 1; i >= 0; i--) {
    const currentValue = romanValues[romanUpper[i]];
    
    if (currentValue < prevValue) {
      // Subtract if smaller than previous (e.g., IV = 4)
      result -= currentValue;
    } else {
      // Add if equal or larger
      result += currentValue;
    }
    
    prevValue = currentValue;
  }

  return result;
}

export default {
  toRoman,
  fromRoman
};
