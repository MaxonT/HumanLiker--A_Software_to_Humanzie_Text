// Title: Error Handling Middleware
// Description: Normalizes errors into a consistent JSON structure.

import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, _next) {
  const status = err.httpStatus || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const traceId = req.traceId || 'no-trace';

  logger.error('http.error', 'Request failed', {
    traceId,
    code,
    status,
    path: req.path,
    method: req.method,
    message: err.message || String(err)
  });

  const safeMessage = status >= 500
    ? 'Server error. Please try again later.'
    : err.message || 'Request error.';

  res.status(status).json({
    ok: false,
    error: {
      code,
      message: safeMessage,
      trace_id: traceId
    }
  });
}
