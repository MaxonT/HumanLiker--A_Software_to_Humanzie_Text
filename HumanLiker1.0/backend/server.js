const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'HumanLiker 1.0 API is running',
    version: '1.0.0'
  });
});

// API Routes will be added in future PRs
// app.use('/api/string', require('./routes/stringRoutes'));
// app.use('/api/inflector', require('./routes/inflectorRoutes'));
// app.use('/api/datetime', require('./routes/datetimeRoutes'));
// app.use('/api/number', require('./routes/numberRoutes'));
// app.use('/api/bytesize', require('./routes/bytesizeRoutes'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: err.message 
  });
});

// Serve frontend (catch-all route - must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HumanLiker 1.0 Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
