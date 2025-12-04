import express from 'express';
import { validate, schemas } from '../middleware/validation.js';
import { getDb } from '../index.js';
import { presets } from '../schema.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, DatabaseError } from '../utils/errors.js';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const presetList = await db.select().from(presets);
    res.json({ items: presetList.map(p => ({
      ...p,
      isDefault: Boolean(p.isDefault),
      createdAt: new Date(p.createdAt * 1000).toISOString()
    })) });
  } catch (error) {
    next(new DatabaseError('Failed to retrieve presets', { originalError: error.message }));
  }
});

router.post('/', validate(schemas.preset), async (req, res, next) => {
  try {
    const { name, description, tone, formality, modelPreference, isDefault } = req.validated.body;
    const db = getDb();
    const presetId = uuidv4();
    await db.insert(presets).values({
      id: presetId,
      name,
      description,
      tone,
      formality,
      modelPreference,
      isDefault: isDefault ? 1 : 0,
      createdAt: Math.floor(Date.now() / 1000)
    });
    const [preset] = await db.select().from(presets).where(eq(presets.id, presetId));
    res.status(201).json({ ...preset, isDefault: Boolean(preset.isDefault) });
  } catch (error) {
    next(new DatabaseError('Failed to create preset', { originalError: error.message }));
  }
});

router.get('/:id', validate(schemas.presetId), async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const db = getDb();
    const [preset] = await db.select().from(presets).where(eq(presets.id, id));
    if (!preset) throw new NotFoundError('Preset');
    res.json({ ...preset, isDefault: Boolean(preset.isDefault) });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validate(schemas.presetId), async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const { name, description, tone, formality, modelPreference, isDefault } = req.body;
    const db = getDb();
    await db.update(presets).set({
      name, description, tone, formality, modelPreference,
      isDefault: isDefault ? 1 : 0
    }).where(eq(presets.id, id));
    const [preset] = await db.select().from(presets).where(eq(presets.id, id));
    if (!preset) throw new NotFoundError('Preset');
    res.json({ ...preset, isDefault: Boolean(preset.isDefault) });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validate(schemas.presetId), async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const db = getDb();
    const result = await db.delete(presets).where(eq(presets.id, id));
    if (result.changes === 0) throw new NotFoundError('Preset');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;


