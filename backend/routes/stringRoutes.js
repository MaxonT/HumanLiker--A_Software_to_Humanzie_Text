/**
 * String Processing Routes
 * API endpoints for string humanization and manipulation
 */

const express = require('express');
const router = express.Router();
const StringHumanizer = require('../core/StringHumanizer');

/**
 * POST /api/string/process
 * Process a string based on the specified operation
 * 
 * Request body:
 * - input: string to process
 * - operation: 'humanize', 'dehumanize', or 'truncate'
 * - casing: (optional) 'sentence', 'title', 'lower', 'upper' (for humanize)
 * - length: (optional) maximum length or word count (for truncate)
 * - truncator: (optional) 'FixedLength' or 'FixedNumberOfWords' (for truncate)
 * - from: (optional) 'Right' or 'Left' (for truncate)
 */
router.post('/process', (req, res) => {
  try {
    const { input, operation, casing, length, truncator, from } = req.body;
    
    // Validate operation
    const validOperations = ['humanize', 'dehumanize', 'truncate'];
    if (!operation || !validOperations.includes(operation)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid operation. Must be one of: humanize, dehumanize, truncate'
      });
    }
    
    let output;
    
    switch (operation) {
      case 'humanize':
        output = StringHumanizer.humanize(input, casing || 'sentence');
        break;
        
      case 'dehumanize':
        output = StringHumanizer.dehumanize(input);
        break;
        
      case 'truncate':
        if (!length) {
          return res.status(400).json({
            success: false,
            error: 'Length parameter is required for truncate operation'
          });
        }
        output = StringHumanizer.truncate(
          input,
          length,
          truncator || 'FixedLength',
          from || 'Right'
        );
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation'
        });
    }
    
    res.json({
      success: true,
      output: output
    });
    
  } catch (error) {
    console.error('Error processing string:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
