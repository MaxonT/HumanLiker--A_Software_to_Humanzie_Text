import express from 'express';
import { getDb } from '../db/index.js';
import { modelConfigs } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { setupLogger } from '../utils/logger.js';
import { modelConfigManager } from '../config/models.js';

const logger = setupLogger();
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const configs = await modelConfigManager.loadConfigs();
    res.json({ items: configs.map(c => ({
      ...c,
      isActive: Boolean(c.isActive)
    })) });
  } catch (error) {
    next(error);
  }
});

router.get('/config', async (req, res, next) => {
  try {
    const configs = await modelConfigManager.loadConfigs();
    res.json({ configs: configs.map(c => ({
      id: c.id,
      name: c.name,
      provider: c.provider,
      type: c.type,
      isActive: Boolean(c.isActive),
      priority: c.priority
    })) });
  } catch (error) {
    next(error);
  }
});

export default router;


