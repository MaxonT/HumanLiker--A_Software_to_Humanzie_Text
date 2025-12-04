module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  
  // API configuration
  api: {
    version: '1.0.0',
    prefix: '/api'
  },
  
  // Humanizer configuration
  humanizer: {
    defaultCasing: 'sentence',
    defaultTruncator: 'FixedLength',
    defaultPrecision: 2,
    addAndInWords: true
  },
  
  // Localization settings (for future multi-language support)
  localization: {
    defaultLanguage: 'en',
    supportedLanguages: ['en'] // Will expand to zh, es, fr, etc.
  }
};
