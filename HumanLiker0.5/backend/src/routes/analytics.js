import express from 'express';
import { getDb } from '../db/index.js';
import { textSamples } from '../db/schema.js';
import { sql, eq, and, gte } from 'drizzle-orm';
import { setupLogger } from '../utils/logger.js';
import { DatabaseError } from '../utils/errors.js';

const logger = setupLogger();
const router = express.Router();

/**
 * GET /api/analytics
 * Get analytics data for charts and KPIs
 * 
 * Query parameters:
 * - type: usage|distribution|quality
 * - period: 7d|30d|90d|all (default: 30d)
 * - sessionId: optional UUID
 */
router.get('/', async (req, res, next) => {
  try {
    const { type = 'usage', period = '30d', sessionId } = req.query;

    switch (type) {
      case 'usage':
        return res.json(await getUsageData(period, sessionId));
      case 'distribution':
        return res.json(await getDistributionData(sessionId));
      case 'quality':
        return res.json(await getQualityData(sessionId));
      default:
        return res.status(400).json({
          error: { code: 'INVALID_TYPE', message: 'Invalid analytics type' }
        });
    }
  } catch (error) {
    logger.error('Analytics error', { error: error.message });
    next(new DatabaseError('Failed to retrieve analytics', { originalError: error.message }));
  }
});

/**
 * Get usage growth data (for line chart)
 */
async function getUsageData(period, sessionId) {
  const db = getDb();
  
  // Calculate time threshold
  const now = Math.floor(Date.now() / 1000);
  let threshold = 0;
  if (period === '7d') threshold = now - 7 * 24 * 3600;
  else if (period === '30d') threshold = now - 30 * 24 * 3600;
  else if (period === '90d') threshold = now - 90 * 24 * 3600;
  // else 'all' - threshold remains 0

  let query = db
    .select({
      date: sql`date(datetime(${textSamples.createdAt}, 'unixepoch')) as date`,
      count: sql`count(*) as count`
    })
    .from(textSamples)
    .where(gte(textSamples.createdAt, threshold))
    .groupBy(sql`date`);

  if (sessionId) {
    query = query.where(and(gte(textSamples.createdAt, threshold), eq(textSamples.sessionId, sessionId)));
  }

  const data = await query;
  
  return {
    type: 'usage',
    period,
    data: data.map(row => ({
      date: row.date,
      count: Number(row.count)
    }))
  };
}

/**
 * Get distribution data (for pie chart)
 */
async function getDistributionData(sessionId) {
  const db = getDb();
  
  let query = db
    .select({
      tone: textSamples.tone,
      count: sql`count(*) as count`
    })
    .from(textSamples)
    .groupBy(textSamples.tone);

  if (sessionId) {
    query = query.where(eq(textSamples.sessionId, sessionId));
  }

  const data = await query;
  
  return {
    type: 'distribution',
    data: data.map(row => ({
      tone: row.tone,
      count: Number(row.count)
    }))
  };
}

/**
 * Get quality metrics (for gauge chart)
 */
async function getQualityData(sessionId) {
  const db = getDb();
  
  let query = db
    .select({
      avgToneAccuracy: sql`avg(cast(json_extract(${textSamples.scores}, '$.toneAccuracy') as real)) as avg_tone`,
      avgHumanLikeness: sql`avg(cast(json_extract(${textSamples.scores}, '$.humanLikeness') as real)) as avg_human`,
      totalCost: sql`sum(cast(json_extract(${textSamples.scores}, '$.tokenCost') as real)) as total_cost`
    })
    .from(textSamples);

  if (sessionId) {
    query = query.where(eq(textSamples.sessionId, sessionId));
  }

  const [result] = await query;
  
  return {
    type: 'quality',
    data: {
      avgToneAccuracy: result.avg_tone ? Number(result.avg_tone.toFixed(1)) : 0,
      avgHumanLikeness: result.avg_human ? Number(result.avg_human.toFixed(1)) : 0,
      totalCost: result.total_cost ? Number(result.total_cost.toFixed(2)) : 0
    }
  };
}

export default router;


