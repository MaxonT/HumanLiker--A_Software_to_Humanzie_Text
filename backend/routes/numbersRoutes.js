const express = require('express');
const router = express.Router();
const NumberToWords = require('../core/NumberToWords');
const Ordinalize = require('../core/Ordinalize');
const RomanNumeral = require('../core/RomanNumeral');
const MetricNumeral = require('../core/MetricNumeral');

/**
 * POST /api/numbers/process
 * Process number transformations
 * 
 * Body:
 * {
 *   "input": number or string,
 *   "operation": "toWords" | "toOrdinal" | "toOrdinalWords" | "toRoman" | "fromRoman" | "toMetric" | "fromMetric"
 * }
 */
router.post('/process', (req, res) => {
  try {
    const { input, operation, decimals } = req.body;

    if (!input && input !== 0) {
      return res.status(400).json({
        success: false,
        error: 'Input is required'
      });
    }

    let output;

    switch (operation) {
      case 'toWords':
        output = NumberToWords.convert(Number(input));
        break;
      
      case 'toOrdinal':
        output = Ordinalize.ordinalize(Number(input));
        break;
      
      case 'toOrdinalWords':
        output = Ordinalize.ordinalizeWords(Number(input));
        break;
      
      case 'toRoman':
        output = RomanNumeral.toRoman(Number(input));
        break;
      
      case 'fromRoman':
        output = RomanNumeral.fromRoman(String(input));
        break;
      
      case 'toMetric':
        output = MetricNumeral.format(Number(input), decimals !== undefined ? Number(decimals) : 1);
        break;
      
      case 'fromMetric':
        output = MetricNumeral.parse(String(input));
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation. Must be one of: toWords, toOrdinal, toOrdinalWords, toRoman, fromRoman, toMetric, fromMetric'
        });
    }

    res.json({
      success: true,
      output: output
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
