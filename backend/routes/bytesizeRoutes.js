const express = require('express');
const router = express.Router();
const ByteSize = require('../core/ByteSize');

/**
 * POST /api/bytesize/process
 * Process byte size humanization
 * 
 * Body:
 * {
 *   "input": bytes or string,
 *   "operation": "humanize" | "parse",
 *   "decimals": number (for humanize)
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
      case 'humanize':
        output = ByteSize.humanize(Number(input), decimals !== undefined ? Number(decimals) : 2);
        break;
      
      case 'parse':
        output = ByteSize.parse(String(input));
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation. Must be one of: humanize, parse'
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
