/**
 * Inflector Routes
 * API endpoints for word inflection and case transformations
 */

const express = require('express');
const router = express.Router();
const Inflector = require('../core/Inflector');

/**
 * POST /api/inflector/process
 * Process a word/text based on the specified operation
 * 
 * Request body:
 * - input: string to process
 * - operation: 'pluralize', 'singularize', 'pascalize', 'camelize', 'underscore', 
 *              'dasherize', 'kebaberize', 'titleize', 'toQuantity'
 * - quantity: (optional) number for toQuantity operation
 * - showQuantityAs: (optional) 'Numeric' or 'Words' for toQuantity (default: 'Numeric')
 */
router.post('/process', (req, res) => {
  try {
    const { input, operation, quantity, showQuantityAs } = req.body;
    
    // Validate operation
    const validOperations = [
      'pluralize',
      'singularize',
      'pascalize',
      'camelize',
      'underscore',
      'dasherize',
      'kebaberize',
      'titleize',
      'toQuantity'
    ];
    
    if (!operation || !validOperations.includes(operation)) {
      return res.status(400).json({
        success: false,
        error: `Invalid operation. Must be one of: ${validOperations.join(', ')}`
      });
    }
    
    let output;
    
    switch (operation) {
      case 'pluralize':
        output = Inflector.pluralize(input);
        break;
        
      case 'singularize':
        output = Inflector.singularize(input);
        break;
        
      case 'pascalize':
        output = Inflector.pascalize(input);
        break;
        
      case 'camelize':
        output = Inflector.camelize(input);
        break;
        
      case 'underscore':
        output = Inflector.underscore(input);
        break;
        
      case 'dasherize':
        output = Inflector.dasherize(input);
        break;
        
      case 'kebaberize':
        output = Inflector.kebaberize(input);
        break;
        
      case 'titleize':
        output = Inflector.titleize(input);
        break;
        
      case 'toQuantity':
        output = Inflector.toQuantity(
          input,
          quantity || 1,
          showQuantityAs || 'Numeric'
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
    console.error('Error processing inflector:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
