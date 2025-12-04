import express from 'express';
import { validate, schemas } from '../middleware/validation.js';
import { historyService } from '../services/historyService.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();
const router = express.Router();

/**
 * GET /api/history
 * Get list of text transformation history
 */
router.get('/', validate(schemas.historyList), async (req, res, next) => {
  try {
    const { sessionId, limit = 20, offset = 0 } = req.validated.query;
    const result = await historyService.getHistory({ sessionId, limit, offset });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/history/:id
 * Get single history record by ID
 */
router.get('/:id', validate(schemas.historyId), async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const record = await historyService.getRecord(id);
    res.json(record);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/history/:id
 * Delete a history record
 */
router.delete('/:id', validate(schemas.historyId), async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    await historyService.deleteRecord(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

