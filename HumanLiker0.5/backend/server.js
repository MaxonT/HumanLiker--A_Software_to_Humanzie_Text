import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import healthRouter from './src/routes/health.js';
import transformRouter from './src/routes/transform.js';
import historyRouter from './src/routes/history.js';
import sessionsRouter from './src/routes/sessions.js';
import analyticsRouter from './src/routes/analytics.js';
import presetsRouter from './src/routes/presets.js';
import modelsRouter from './src/routes/models.js';
import { setupLogger } from './src/utils/logger.js';
import { initializeDatabase } from './src/db/index.js';
import { handleError } from './src/utils/errors.js';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';

// Setup logger
const logger = setupLogger();

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  }
});
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/transform', transformRouter);
app.use('/api/history', historyRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/presets', presetsRouter);
app.use('/api/models', modelsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'HumanLiker API',
    version: '0.5.0',
    status: 'running',
    endpoints: {
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path
  });
  handleError(err, req, res, next);
});

// Start server with database initialization
async function startServer() {
  try {
    // Initialize database before starting server
    await initializeDatabase();
    
    app.listen(PORT, () => {
      logger.info(`HumanLiker backend server running on port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        corsOrigin: CORS_ORIGIN
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

startServer();

export default app;

