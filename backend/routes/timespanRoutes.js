const express = require('express');
const router = express.Router();
const TimeSpanHumanizer = require('../core/TimeSpanHumanizer');

/**
 * POST /api/timespan/process
 * Process timespan humanization
 * 
 * Body:
 * {
 *   "input": milliseconds or string,
 *   "operation": "humanize" | "toUnit" | "parse",
 *   "maxUnits": number (for humanize),
 *   "verbose": boolean (for humanize),
 *   "unit": string (for toUnit),
 *   "decimals": number (for toUnit)
 * }
 */
router.post('/process', (req, res) => {
  try {
    const { input, operation, maxUnits, verbose, unit, decimals } = req.body;

    if (!input && input !== 0) {
      return res.status(400).json({
        success: false,
        error: 'Input is required'
      });
    }

    let output;

    switch (operation) {
      case 'humanize':
        output = TimeSpanHumanizer.humanize(Number(input), {
          maxUnits: maxUnits !== undefined ? Number(maxUnits) : 2,
          verbose: verbose === true || verbose === 'true'
        });
        break;
      
      case 'toUnit':
        output = TimeSpanHumanizer.toUnit(
          Number(input),
          unit || 'seconds',
          decimals !== undefined ? Number(decimals) : 2
        );
        break;
      
      case 'parse':
        output = TimeSpanHumanizer.parse(String(input));
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation. Must be one of: humanize, toUnit, parse'
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
