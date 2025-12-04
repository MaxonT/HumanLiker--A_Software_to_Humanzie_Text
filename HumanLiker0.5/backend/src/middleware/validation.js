import { z } from 'zod';
import { ValidationError } from '../utils/errors.js';

/**
 * Validation middleware factory
 * Creates a middleware that validates request body/query/params against a Zod schema
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params
      });

      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));

        throw new ValidationError('Validation failed', { errors });
      }

      // Attach validated data to request
      req.validated = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Common validation schemas
 */
export const schemas = {
  // Transform request
  transform: z.object({
    body: z.object({
      text: z.string().min(1).max(50000, 'Text too long (max 50000 characters)'),
      tone: z.enum(['friendly', 'concise', 'confident', 'neutral']),
      formality: z.enum(['casual', 'balanced', 'formal']),
      sessionId: z.string().uuid().optional(),
      modelPreference: z.string().optional()
    })
  }),

  // Score request
  score: z.object({
    body: z.object({
      text: z.string().min(1).max(50000),
      criteria: z.object({
        tone: z.enum(['friendly', 'concise', 'confident', 'neutral']).optional(),
        formality: z.enum(['casual', 'balanced', 'formal']).optional()
      }).optional()
    })
  }),

  // History query
  historyList: z.object({
    query: z.object({
      sessionId: z.string().uuid().optional(),
      limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive().max(100)).optional(),
      offset: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().nonnegative()).optional()
    })
  }),

  // History ID
  historyId: z.object({
    params: z.object({
      id: z.string().uuid()
    })
  }),

  // Preset create/update
  preset: z.object({
    body: z.object({
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      tone: z.enum(['friendly', 'concise', 'confident', 'neutral']),
      formality: z.enum(['casual', 'balanced', 'formal']),
      modelPreference: z.string().optional(),
      isDefault: z.boolean().optional()
    })
  }),

  // Preset ID
  presetId: z.object({
    params: z.object({
      id: z.string().uuid()
    })
  }),

  // Session create/update
  session: z.object({
    body: z.object({
      name: z.string().min(1).max(200).optional(),
      metadata: z.record(z.any()).optional()
    })
  }),

  // Session ID
  sessionId: z.object({
    params: z.object({
      id: z.string().uuid()
    })
  })
};


