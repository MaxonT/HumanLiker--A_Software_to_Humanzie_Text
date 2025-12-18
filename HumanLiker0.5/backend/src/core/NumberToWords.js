/**
 * NumberToWords - Convert numbers to their word representation
 * Example: 123 -> "one hundred twenty-three"
 */

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

/**
 * Convert a number (0-999) to words
 * @param {number} num - Number between 0-999
 * @returns {string} Word representation
 */
function convertHundreds(num) {
  let result = '';
  
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  const ten = Math.floor(remainder / 10);
  const one = remainder % 10;

  if (hundred > 0) {
    result += ones[hundred] + ' hundred';
    if (remainder > 0) {
      result += ' ';
    }
  }

  if (remainder >= 10 && remainder < 20) {
    result += teens[remainder - 10];
  } else {
    if (ten > 0) {
      result += tens[ten];
      if (one > 0) {
        result += '-';
      }
    }
    if (one > 0) {
      result += ones[one];
    }
  }

  return result;
}

/**
 * Convert a number to words
 * @param {number} number - The number to convert
 * @param {boolean} [addAnd=false] - Whether to add "and" before tens (British style)
 * @returns {string} The word representation
 */
function convert(number, addAnd = false) {
  if (typeof number !== 'number' || isNaN(number)) {
    throw new TypeError('Input must be a valid number');
  }

  // Handle special cases
  if (number === 0) {
    return 'zero';
  }

  if (number < 0) {
    return 'negative ' + convert(Math.abs(number), addAnd);
  }

  // Handle decimals
  if (!Number.isInteger(number)) {
    const parts = number.toString().split('.');
    const intPart = parseInt(parts[0]);
    const decPart = parts[1];
    
    let result = convert(intPart, addAnd) + ' point';
    for (const digit of decPart) {
      result += ' ' + ones[parseInt(digit)];
    }
    return result;
  }

  // Handle large numbers (up to trillions)
  if (number >= 1e15) {
    return number.toExponential();
  }

  let result = '';
  let scaleIndex = 0;
  let remaining = number;

  while (remaining > 0) {
    const chunk = remaining % 1000;
    
    if (chunk > 0) {
      let chunkWords = convertHundreds(chunk);
      
      if (scales[scaleIndex]) {
        chunkWords += ' ' + scales[scaleIndex];
      }
      
      if (result) {
        // Add "and" for British style if applicable
        if (addAnd && scaleIndex === 0 && chunk < 100 && number >= 100) {
          result = chunkWords + ' and ' + result;
        } else {
          result = chunkWords + ' ' + result;
        }
      } else {
        result = chunkWords;
      }
    }
    
    remaining = Math.floor(remaining / 1000);
    scaleIndex++;
  }

  return result.trim();
}

/**
 * Convert a number to ordinal words
 * @param {number} number - The number to convert
 * @returns {string} The ordinal word representation (e.g., "first", "second")
 */
function convertToOrdinal(number) {
  if (typeof number !== 'number' || isNaN(number)) {
    throw new TypeError('Input must be a valid number');
  }

  if (!Number.isInteger(number) || number < 1) {
    throw new RangeError('Ordinal conversion only supports positive integers');
  }

  const ordinalOnes = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'];
  const ordinalTeens = ['tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
  const ordinalTens = ['', '', 'twentieth', 'thirtieth', 'fortieth', 'fiftieth', 'sixtieth', 'seventieth', 'eightieth', 'ninetieth'];

  // Simple cases (1-19)
  if (number < 10) {
    return ordinalOnes[number];
  }
  
  if (number >= 10 && number < 20) {
    return ordinalTeens[number - 10];
  }

  // For numbers >= 20, convert to cardinal and modify the last word
  const cardinal = convert(number, false);
  const words = cardinal.split(/[\s-]+/);
  const lastWord = words[words.length - 1];

  // Map last word to ordinal
  const ordinalMap = {
    'one': 'first',
    'two': 'second',
    'three': 'third',
    'four': 'fourth',
    'five': 'fifth',
    'six': 'sixth',
    'seven': 'seventh',
    'eight': 'eighth',
    'nine': 'ninth',
    'ten': 'tenth',
    'eleven': 'eleventh',
    'twelve': 'twelfth',
    'twenty': 'twentieth',
    'thirty': 'thirtieth',
    'forty': 'fortieth',
    'fifty': 'fiftieth',
    'sixty': 'sixtieth',
    'seventy': 'seventieth',
    'eighty': 'eightieth',
    'ninety': 'ninetieth'
  };

  if (ordinalMap[lastWord]) {
    words[words.length - 1] = ordinalMap[lastWord];
  } else {
    // Default: add 'th' suffix
    words[words.length - 1] = lastWord + 'th';
  }

  return words.join(' ');
}

export default {
  convert,
  convertToOrdinal
};
