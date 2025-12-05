# HumanLiker 1.0 - Text Humanization Suite

## Overview

HumanLiker is a comprehensive text humanization application that provides multiple utilities for transforming text, numbers, dates, and collections into human-readable formats. Built with Express backend and vanilla JavaScript frontend, it offers a complete suite of text processing tools.

## Features

### 🔤 String Humanizer
- **Humanize**: Convert PascalCase, camelCase, snake_case, or kebab-case to human-readable text
- **Dehumanize**: Convert human text back to PascalCase
- **Truncate**: Shorten text by character count or word count
- **Apply Casing**: Transform text to sentence, title, lower, or upper case

### 🔄 Inflector
- **Pluralize/Singularize**: Smart word inflection with irregular forms
- **Case Transformations**: PascalCase, camelCase, underscore_case, kebab-case, Title Case
- **To Quantity**: Format words with quantities (e.g., "5 apples")

### 🔢 Numbers
- **To Words**: Convert numbers to written words (e.g., 42 → "forty-two")
- **To Ordinal**: Convert to ordinal numbers (e.g., 1 → "1st", 2 → "2nd")
- **To Ordinal Words**: Convert to ordinal words (e.g., 1 → "first")
- **Roman Numerals**: Convert to/from Roman numerals (e.g., 2024 → "MMXXIV")
- **Metric Format**: Format with metric prefixes (e.g., 1000 → "1K", 1000000 → "1M")

### 📅 DateTime Humanizer
- **Humanize**: Relative time formatting (e.g., "2 days ago", "in 3 hours")
- **Format**: Multiple date formats (short, medium, long)

### ⏱️ TimeSpan Humanizer
- **Humanize**: Convert milliseconds to readable durations (e.g., "1h 30m")
- **Verbose Mode**: Full word formatting (e.g., "1 hour, 30 minutes")
- **To Unit**: Convert to specific units (seconds, minutes, hours, days)

### 💾 ByteSize Humanizer
- **Humanize**: Convert bytes to human-readable sizes (e.g., 1048576 → "1.00 MB")
- **Parse**: Convert size strings back to bytes (e.g., "1.5 GB" → bytes)

### 📋 Collection Humanizer
- **Natural Language Joining**: Join arrays with proper grammar
- **"And" separator**: "apple, banana, and cherry"
- **"Or" separator**: "apple, banana, or cherry"
- **Oxford Comma**: Optional Oxford comma support

### 🧭 Advanced Utilities
- **Truncator**: Shared truncation engine for fixed length or word-count strategies
- **Enum Processor**: Humanize/dehumanize enum-like values and flag lists
- **Heading Converter**: Convert degrees to compass directions (N, NE, E...)
- **Tuple Converter**: Format and parse tuple-like values

## Quick Start

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Development Mode

```bash
npm run dev
```

### Running Tests

```bash
npm test
```

All 137 tests should pass.

## API Endpoints

### String Operations
```
POST /api/string/process
Body: { input, operation, casing, length, truncator, from }
```

### Inflector Operations
```
POST /api/inflector/process
Body: { input, operation, quantity, showQuantityAs }
```

### Number Operations
```
POST /api/numbers/process
Body: { input, operation, decimals }
Operations: toWords, toOrdinal, toOrdinalWords, toRoman, fromRoman, toMetric, fromMetric
```

### DateTime Operations
```
POST /api/datetime/process
Body: { input, operation, formatType }
Operations: humanize, format
```

### TimeSpan Operations
```
POST /api/timespan/process
Body: { input, operation, maxUnits, verbose, unit, decimals }
Operations: humanize, toUnit, parse
```

### ByteSize Operations
```
POST /api/bytesize/process
Body: { input, operation, decimals }
Operations: humanize, parse
```

### Collection Operations
```
POST /api/collection/process
Body: { input, operation, separator, lastSeparator }
Operations: humanize, humanizeOr, humanizeOxford
```

### Advanced Utility Operations
```
POST /api/advanced/process
Body: {
  module: 'truncator' | 'enum' | 'heading' | 'tuple',
  operation: string,
  ...moduleSpecificPayload
}
Examples:
- Truncator: { module: 'truncator', operation: 'fixed', input, length, strategy, from, ellipsis }
- Enum: { module: 'enum', operation: 'list', values: ['Admin', 'ReadOnly'] }
- Heading: { module: 'heading', degrees: 225 }
- Tuple: { module: 'tuple', tuple: ['lat', 'long'] }
```

## Project Structure

```
├── backend/
│   ├── core/               # Core transformation modules
│   │   ├── StringHumanizer.js
│   │   ├── Inflector.js
│   │   ├── Vocabulary.js
│   │   ├── NumberToWords.js
│   │   ├── Ordinalize.js
│   │   ├── RomanNumeral.js
│   │   ├── MetricNumeral.js
│   │   ├── ByteSize.js
│   │   ├── CollectionHumanizer.js
│   │   ├── DateTimeHumanizer.js
│   │   ├── TimeSpanHumanizer.js
│   │   ├── Truncator.js
│   │   ├── EnumProcessor.js
│   │   ├── HeadingConverter.js
│   │   └── TupleConverter.js
│   ├── routes/             # API routes
│   └── server.js           # Express server
├── frontend/
│   ├── css/
│   ├── js/
│   │   ├── modules/        # Frontend API wrappers
│   │   └── app.js          # Main application logic
│   └── index.html
├── tests/                  # Jest test files
└── package.json

```

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Testing**: Jest, Supertest
- **Security**: CORS, Rate Limiting (100 req/15min)

## Example Usage

### Backend (Node.js)
```javascript
const NumberToWords = require('./backend/core/NumberToWords');
const ByteSize = require('./backend/core/ByteSize');

NumberToWords.convert(2024);        // "two thousand twenty-four"
ByteSize.humanize(1048576);         // "1.00 MB"
```

### Frontend API
```javascript
const result = await NumbersModule.processNumber({
  input: 42,
  operation: 'toWords'
});
// { success: true, output: "forty-two" }
```

## License

MIT License (see LICENSE.txt)

## Contributing

Contributions are welcome! Please ensure all tests pass before submitting PRs.

## Version

1.0.0 - Full feature release
