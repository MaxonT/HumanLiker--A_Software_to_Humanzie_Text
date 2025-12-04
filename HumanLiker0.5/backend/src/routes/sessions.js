import express from 'express';
import { validate, schemas } from '../middleware/validation.js';
import { getDb } from '../db/index.js';
import { sessions } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, DatabaseError } from '../utils/errors.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();
const router = express.Router();

/**
 * GET /api/sessions
 * Get list of sessions
 */
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const sessionList = await db
      .select()
      .from(sessions)
      .orderBy(desc(sessions.updatedAt));

    const items = sessionList.map(session => ({
      ...session,
      metadata: typeof session.metadata === 'string' 
        ? JSON.parse(session.metadata || '{}') 
        : session.metadata,
      createdAt: new Date(session.createdAt * 1000).toISOString(),
      updatedAt: new Date(session.updatedAt * 1000).toISOString()
    }));

    res.json({ items, total: items.length });
  } catch (error) {
    logger.error('Failed to get sessions', { error: error.message });
    next(new DatabaseError('Failed to retrieve sessions', { originalError: error.message }));
  }
});

/**
 * POST /api/sessions
 * Create a new session
 */
router.post('/', validate(schemas.session), async (req, res, next) => {
  try {
    const { name, metadata } = req.validated.body;
    const db = getDb();
    const sessionId = uuidv4();
    const now = Math.floor(Date.now() / 1000);

    await db.insert(sessions).values({
      id: sessionId,
      name: name || `Session ${new Date().toLocaleDateString()}`,
      createdAt: now,
      updatedAt: now,
      metadata: metadata ? JSON.stringify(metadata) : null
    });

    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    res.status(201).json({
      ...session[0],
      metadata: typeof session[0].metadata === 'string' 
        ? JSON.parse(session[0].metadata || '{}') 
        : session[0].metadata,
      createdAt: new Date(session[0].createdAt * 1000).toISOString(),
      updatedAt: new Date(session[0].updatedAt * 1000).toISOString()
    });
  } catch (error) {
    logger.error('Failed to create session', { error: error.message });
    next(new DatabaseError('Failed to create session', { originalError: error.message }));
  }
});

/**
 * GET /api/sessions/:id
 * Get single session
 */
router.get('/:id', validate(schemas.sessionId), async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const db = getDb();
    const sessionList = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id))
      .limit(1);

    if (sessionList.length === 0) {
      throw new NotFoundError('Session');
    }

    const session = sessionList[0];
    res.json({
      ...session,
      metadata: typeof session.metadata === 'string' 
        ? JSON.parse(session.metadata || '{}') 
        : session.metadata,
      createdAt: new Date(session.createdAt * 1000).toISOString(),
      updatedAt: new Date(session.updatedAt * 1000).toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/sessions/:id
 * Delete a session
 */
router.delete('/:id', validate(schemas.sessionId), async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const db = getDb();
    const result = await db
      .delete(sessions)
      .where(eq(sessions.id, id));

    if (result.changes === 0) {
      throw new NotFoundError('Session');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

