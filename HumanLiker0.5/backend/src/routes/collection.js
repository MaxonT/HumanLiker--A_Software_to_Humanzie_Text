import express from 'express';
import CollectionHumanizer from '../core/CollectionHumanizer.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();
const router = express.Router();

/**
 * POST /api/collection/humanize
 * Humanize an array into a readable string
 */
router.post('/humanize', (req, res, next) => {
  try {
    const { array, separator = ', ', lastSeparator = ' and ' } = req.body;

    if (!Array.isArray(array)) {
      return res.status(400).json({
        success: false,
        error: 'Array is required and must be an array'
      });
    }

    const result = CollectionHumanizer.humanize(array, separator, lastSeparator);

    logger.info('Collection humanize', { arrayLength: array.length, result });

    res.json({
      success: true,
      output: result
    });
  } catch (error) {
    logger.error('Collection humanize error', { error: error.message });
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
