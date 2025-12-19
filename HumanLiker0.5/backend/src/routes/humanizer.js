import express from 'express';
import { validate, schemas } from '../middleware/validation.js';
import { transformService } from '../services/transformService.js';
import { setupLogger } from '../utils/logger.js';

const router = express.Router();
const logger = setupLogger();

const cannedResponses = {
  datetime: {
    humanized: 'DateTime.ToOrdinalWords(culture)',
    reverse: 'Provides a human-readable ordinal date for the selected culture.'
  },
  timespan: {
    humanized: 'TimeSpan.Humanize(culture)',
    reverse: 'Round-trips a duration into clock-style phrasing.'
  },
  number: {
    humanized: '123 -> "one hundred and twenty-three"',
    reverse: 'WordsToNumber/TryToNumber can convert phrases back to numbers.'
  },
  collection: {
    humanized: 'Alice, Bob, and Charlie',
    reverse: 'Oxford comma collection formatter.'
  },
  enum: {
    humanized: 'Member without description attribute',
    reverse: 'DehumanizeTo<TEnum>() can map this back to an enum value.'
  }
};

router.post('/playground', validate(schemas.humanizerPlayground), async (req, res, next) => {
  const { kind, culture, value } = req.validated.body;

  try {
    if (kind === 'string') {
      const result = await transformService.transform(value, {
        tone: 'friendly',
        formality: 'balanced'
      });

      res.json({
        original: value,
        humanized: result.outputText,
        reverse: 'Powered by HumanLiker v0.5 transform pipeline.',
        scores: result.scores,
        metadata: result.metadata
      });
      return;
    }

    const canned = cannedResponses[kind] || {
      humanized: 'Not sure how to humanize this yet.',
      reverse: ''
    };

    res.json({
      original: value.trim(),
      humanized: canned.humanized,
      reverse: canned.reverse,
      culture
    });
  } catch (error) {
    logger.error('Humanizer playground error', { error: error.message });
    next(error);
  }
});

export default router;
