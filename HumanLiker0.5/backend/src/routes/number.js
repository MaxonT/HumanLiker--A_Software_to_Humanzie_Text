import express from 'express';
import NumberToWords from '../core/NumberToWords.js';
import Ordinalize from '../core/Ordinalize.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();
const router = express.Router();

/**
 * POST /api/number/towords
 * Convert number to words
 */
router.post('/towords', (req, res, next) => {
  try {
    const { number, addAnd = false } = req.body;

    if (typeof number !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Number is required and must be a valid number'
      });
    }

    const result = NumberToWords.convert(number, addAnd);

    logger.info('Number to words conversion', { number, result });

    res.json({
      success: true,
      output: result
    });
  } catch (error) {
    logger.error('Number to words error', { error: error.message });
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/number/ordinalize
 * Convert number to ordinal form
 */
router.post('/ordinalize', (req, res, next) => {
  try {
    const { number } = req.body;

    if (typeof number !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Number is required and must be a valid number'
      });
    }

    const result = Ordinalize.convert(number);

    logger.info('Number ordinalize', { number, result });

    res.json({
      success: true,
      output: result
    });
  } catch (error) {
    logger.error('Number ordinalize error', { error: error.message });
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
