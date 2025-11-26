// Title: Trace ID Utility
// Description: Generate a per-request trace identifier for logging and DB correlation.

export function generateTraceId() {
  const random = Math.random().toString(36).slice(2);
  const time = Date.now().toString(36);
  return `hl_${time}_${random}`;
}
