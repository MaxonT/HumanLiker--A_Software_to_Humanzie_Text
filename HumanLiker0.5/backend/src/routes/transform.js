import express from 'express';
import { validate, schemas } from '../middleware/validation.js';
import { transformService } from '../services/transformService.js';
import { historyService } from '../services/historyService.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();
const router = express.Router();

/**
 * POST /api/transform
 * Transform text using AI model and save to history
 */
router.post('/', validate(schemas.transform), async (req, res, next) => {
  try {
    const { text, tone, formality, sessionId, modelPreference } = req.validated.body;

    logger.info('Transform request received', {
      textLength: text.length,
      tone,
      formality,
      hasModelPreference: !!modelPreference
    });

    // Perform transformation
    const result = await transformService.transform(text, {
      tone,
      formality,
      modelPreference
    });

    // Save to history
    let recordId;
    try {
      const record = await historyService.saveRecord({
        sessionId,
        inputText: text,
        outputText: result.outputText,
        tone,
        formality,
        modelUsed: result.metadata?.modelUsed || result.metadata?.provider || 'unknown',
        scores: result.scores,
        metadata: result.metadata
      });
      recordId = record.id;
    } catch (saveError) {
      // Log but don't fail the request if saving fails
      logger.warn('Failed to save history record', { error: saveError.message });
    }

    const response = {
      id: recordId || 'temp',
      outputText: result.outputText,
      scores: result.scores,
      metadata: result.metadata
    };

    res.json(response);
  } catch (error) {
    logger.error('Transform endpoint error', { error: error.message });
    next(error);
  }
});

export default router;

