const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes placeholder
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HumanLiker server is running' });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server only if not in test mode
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`HumanLiker server listening on port ${PORT}`);
  });
}

// Export for testing
module.exports = app;
