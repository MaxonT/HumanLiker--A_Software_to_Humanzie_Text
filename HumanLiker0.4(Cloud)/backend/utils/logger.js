// Title: Logger Utility
// Description: Structured logger for HumanLiker v0.4 backend.

const ENV = process.env.NODE_ENV || 'development';

function baseLog(level, context, message, meta) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
    meta: meta || {}
  };
  // Simple JSON line logger; can be replaced with external sink later.
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

export const logger = {
  debug(context, message, meta) {
    if (ENV !== 'production') baseLog('debug', context, message, meta);
  },
  info(context, message, meta) {
    baseLog('info', context, message, meta);
  },
  warn(context, message, meta) {
    baseLog('warn', context, message, meta);
  },
  error(context, message, meta) {
    baseLog('error', context, message, meta);
  }
};
