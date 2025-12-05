import express from 'express';
import TimeSpanHumanizer from '../core/TimeSpanHumanizer.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();
const router = express.Router();

/**
 * POST /api/duration/humanize
 * Humanize a duration in milliseconds
 */
router.post('/humanize', (req, res, next) => {
  try {
    const { milliseconds, precision = 2 } = req.body;

    if (typeof milliseconds !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Milliseconds is required and must be a valid number'
      });
    }

    const result = TimeSpanHumanizer.humanize(milliseconds, precision);

    logger.info('Duration humanize', { milliseconds, precision, result });

    res.json({
      success: true,
      output: result
    });
  } catch (error) {
    logger.error('Duration humanize error', { error: error.message });
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
