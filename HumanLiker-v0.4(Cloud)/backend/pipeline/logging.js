// Title: Pipeline Step Logging Helper
// Description: Utility to log pipeline steps to the database and logger.

import { logger } from '../utils/logger.js';

/**
 * Log a pipeline step to both the database and the logger
 * @param {Object} db - The SQLite database instance
 * @param {number} requestId - The request ID
 * @param {number} stepOrder - The order of this step (1, 2, 3, ...)
 * @param {string} stepName - The name of the step (e.g., 'preprocess', 'skeleton')
 * @param {boolean} success - Whether the step succeeded
 * @param {Object} detailMeta - Optional metadata to store in detail_json
 * @param {string} traceId - Optional trace ID for logger correlation
 */
export function logPipelineStep(db, requestId, stepOrder, stepName, success, detailMeta = {}, traceId = null) {
  const startedAt = new Date().toISOString();
  const finishedAt = new Date().toISOString();
  const detailJson = JSON.stringify(detailMeta);

  try {
    const stmt = db.prepare(`
      INSERT INTO pipeline_steps 
      (request_id, step_name, step_order, started_at, finished_at, success, detail_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(requestId, stepName, stepOrder, startedAt, finishedAt, success ? 1 : 0, detailJson);

    logger.debug('pipeline.step', `Step ${stepName} ${success ? 'completed' : 'failed'}`, {
      traceId,
      requestId,
      stepName,
      stepOrder,
      success,
      ...detailMeta
    });
  } catch (err) {
    logger.error('pipeline.step.log', 'Failed to log pipeline step', {
      traceId,
      requestId,
      stepName,
      error: err.message
    });
    // Don't throw - logging failure shouldn't break the pipeline
  }
}

