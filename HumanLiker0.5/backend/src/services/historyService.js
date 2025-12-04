import { getDb } from '../db/index.js';
import { textSamples, sessions } from '../db/schema.js';
import { eq, desc, and, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { setupLogger } from '../utils/logger.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';

const logger = setupLogger();

/**
 * History Service
 * Handles text transformation history operations
 */
export class HistoryService {
  /**
   * Save a transformation record
   */
  async saveRecord(data) {
    try {
      const db = getDb();
      const recordId = uuidv4();
      const now = Math.floor(Date.now() / 1000);

      // Ensure session exists or create default
      let sessionId = data.sessionId;
      if (!sessionId) {
        sessionId = await this.getOrCreateDefaultSession();
      }

      const record = {
        id: recordId,
        sessionId: sessionId,
        inputText: data.inputText,
        outputText: data.outputText,
        tone: data.tone,
        formality: data.formality,
        modelUsed: data.modelUsed || 'unknown',
        scores: JSON.stringify(data.scores || {}),
        metadata: JSON.stringify(data.metadata || {}),
        createdAt: now
      };

      await db.insert(textSamples).values(record);

      logger.info('Saved transformation record', { recordId, sessionId });

      return {
        ...record,
        scores: typeof record.scores === 'string' ? JSON.parse(record.scores) : record.scores,
        metadata: typeof record.metadata === 'string' ? JSON.parse(record.metadata) : record.metadata
      };
    } catch (error) {
      logger.error('Failed to save history record', { error: error.message });
      throw new DatabaseError('Failed to save history record', { originalError: error.message });
    }
  }

  /**
   * Get or create default session
   */
  async getOrCreateDefaultSession() {
    try {
      const db = getDb();
      
      // Try to get default session
      const defaultSession = await db
        .select()
        .from(sessions)
        .where(eq(sessions.name, 'default'))
        .limit(1);

      if (defaultSession.length > 0) {
        return defaultSession[0].id;
      }

      // Create default session
      const sessionId = uuidv4();
      const now = Math.floor(Date.now() / 1000);
      
      await db.insert(sessions).values({
        id: sessionId,
        name: 'default',
        createdAt: now,
        updatedAt: now,
        metadata: null
      });

      return sessionId;
    } catch (error) {
      logger.error('Failed to get or create default session', { error: error.message });
      throw new DatabaseError('Failed to manage session', { originalError: error.message });
    }
  }

  /**
   * Get history list with pagination
   */
  async getHistory(options = {}) {
    try {
      const db = getDb();
      const { sessionId, limit = 20, offset = 0 } = options;

      let whereCondition = sessionId ? eq(textSamples.sessionId, sessionId) : undefined;

      const records = await db
        .select()
        .from(textSamples)
        .where(whereCondition)
        .orderBy(desc(textSamples.createdAt))
        .limit(limit)
        .offset(offset);

      // Count total
      const countResult = await db
        .select({ count: sql`count(*)` })
        .from(textSamples)
        .where(whereCondition);
      
      const total = countResult[0]?.count || 0;

      // Parse JSON fields
      const items = records.map(record => ({
        ...record,
        scores: typeof record.scores === 'string' ? JSON.parse(record.scores) : record.scores,
        metadata: typeof record.metadata === 'string' ? JSON.parse(record.metadata) : record.metadata,
        createdAt: new Date(record.createdAt * 1000).toISOString()
      }));

      return {
        items,
        total: Number(total),
        limit,
        offset
      };
    } catch (error) {
      logger.error('Failed to get history', { error: error.message });
      throw new DatabaseError('Failed to retrieve history', { originalError: error.message });
    }
  }

  /**
   * Get single history record
   */
  async getRecord(id) {
    try {
      const db = getDb();
      const records = await db
        .select()
        .from(textSamples)
        .where(eq(textSamples.id, id))
        .limit(1);

      if (records.length === 0) {
        throw new NotFoundError('History record');
      }

      const record = records[0];
      return {
        ...record,
        scores: typeof record.scores === 'string' ? JSON.parse(record.scores) : record.scores,
        metadata: typeof record.metadata === 'string' ? JSON.parse(record.metadata) : record.metadata,
        createdAt: new Date(record.createdAt * 1000).toISOString()
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to get history record', { error: error.message });
      throw new DatabaseError('Failed to retrieve history record', { originalError: error.message });
    }
  }

  /**
   * Delete history record
   */
  async deleteRecord(id) {
    try {
      const db = getDb();
      const result = await db
        .delete(textSamples)
        .where(eq(textSamples.id, id));

      if (result.changes === 0) {
        throw new NotFoundError('History record');
      }

      logger.info('Deleted history record', { id });
      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to delete history record', { error: error.message });
      throw new DatabaseError('Failed to delete history record', { originalError: error.message });
    }
  }
}

export const historyService = new HistoryService();
export default historyService;

