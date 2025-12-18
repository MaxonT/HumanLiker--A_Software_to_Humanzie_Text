import express from 'express';
import ByteSize from '../core/ByteSize.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();
const router = express.Router();

/**
 * POST /api/bytesize/humanize
 * Humanize a byte size
 */
router.post('/humanize', (req, res, next) => {
  try {
    const { bytes, precision = 2 } = req.body;

    if (typeof bytes !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Bytes is required and must be a valid number'
      });
    }

    const byteSize = ByteSize.fromBytes(bytes);
    const result = byteSize.humanize(precision);

    logger.info('ByteSize humanize', { bytes, precision, result });

    res.json({
      success: true,
      output: result
    });
  } catch (error) {
    logger.error('ByteSize humanize error', { error: error.message });
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
