const express = require('express');
const router = express.Router();
const DateTimeHumanizer = require('../core/DateTimeHumanizer');

/**
 * POST /api/datetime/process
 * Process datetime humanization
 * 
 * Body:
 * {
 *   "input": date string or timestamp,
 *   "operation": "humanize" | "format",
 *   "formatType": "short" | "medium" | "long" (for format operation)
 * }
 */
router.post('/process', (req, res) => {
  try {
    const { input, operation, formatType } = req.body;

    if (!input && input !== 0) {
      return res.status(400).json({
        success: false,
        error: 'Input is required'
      });
    }

    let output;

    switch (operation) {
      case 'humanize':
        output = DateTimeHumanizer.humanize(input);
        break;
      
      case 'format':
        output = DateTimeHumanizer.format(input, formatType || 'medium');
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation. Must be one of: humanize, format'
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
