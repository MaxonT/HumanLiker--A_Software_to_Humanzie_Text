import express from 'express';
import os from 'os';

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: formatUptime(uptime)
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      cpuCount: os.cpus().length
    },
    memory: {
      used: formatBytes(memoryUsage.heapUsed),
      total: formatBytes(memoryUsage.heapTotal),
      external: formatBytes(memoryUsage.external)
    }
  });
});

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export default router;

