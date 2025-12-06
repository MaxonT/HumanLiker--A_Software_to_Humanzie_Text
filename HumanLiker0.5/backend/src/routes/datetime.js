import express from 'express';
import DateTimeHumanizer from '../core/DateTimeHumanizer.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();
const router = express.Router();

/**
 * POST /api/datetime/humanize
 * Humanize a date relative to now
 */
router.post('/humanize', (req, res, next) => {
  try {
    const { date, now } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required'
      });
    }

    const result = DateTimeHumanizer.humanize(date, now);

    logger.info('DateTime humanize', { date, now, result });

    res.json({
      success: true,
      output: result
    });
  } catch (error) {
    logger.error('DateTime humanize error', { error: error.message });
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
