const express = require('express');
const router = express.Router();
const CollectionHumanizer = require('../core/CollectionHumanizer');

/**
 * POST /api/collection/process
 * Process collection humanization
 * 
 * Body:
 * {
 *   "input": array of items,
 *   "operation": "humanize" | "humanizeOr" | "humanizeOxford",
 *   "separator": string (optional),
 *   "lastSeparator": string (optional)
 * }
 */
router.post('/process', (req, res) => {
  try {
    const { input, operation, separator, lastSeparator } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Input is required'
      });
    }

    if (!Array.isArray(input)) {
      return res.status(400).json({
        success: false,
        error: 'Input must be an array'
      });
    }

    let output;

    switch (operation) {
      case 'humanize':
        output = CollectionHumanizer.humanize(input, separator, lastSeparator);
        break;
      
      case 'humanizeOr':
        output = CollectionHumanizer.humanizeOr(input);
        break;
      
      case 'humanizeOxford':
        output = CollectionHumanizer.humanizeWithOxfordComma(input);
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation. Must be one of: humanize, humanizeOr, humanizeOxford'
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
