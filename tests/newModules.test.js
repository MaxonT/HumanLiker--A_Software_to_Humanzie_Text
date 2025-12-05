const NumberToWords = require('../backend/core/NumberToWords');
const Ordinalize = require('../backend/core/Ordinalize');
const ByteSize = require('../backend/core/ByteSize');
const RomanNumeral = require('../backend/core/RomanNumeral');
const MetricNumeral = require('../backend/core/MetricNumeral');
const CollectionHumanizer = require('../backend/core/CollectionHumanizer');
const DateTimeHumanizer = require('../backend/core/DateTimeHumanizer');
const TimeSpanHumanizer = require('../backend/core/TimeSpanHumanizer');
const request = require('supertest');
const app = require('../backend/server');

// NumberToWords tests
describe('NumberToWords', () => {
  test('converts basic numbers to words', () => {
    expect(NumberToWords.convert(0)).toBe('zero');
    expect(NumberToWords.convert(1)).toBe('one');
    expect(NumberToWords.convert(10)).toBe('ten');
    expect(NumberToWords.convert(42)).toBe('forty-two');
    expect(NumberToWords.convert(100)).toBe('one hundred');
    expect(NumberToWords.convert(1000)).toBe('one thousand');
  });

  test('converts teens correctly', () => {
    expect(NumberToWords.convert(11)).toBe('eleven');
    expect(NumberToWords.convert(15)).toBe('fifteen');
    expect(NumberToWords.convert(19)).toBe('nineteen');
  });

  test('converts large numbers', () => {
    expect(NumberToWords.convert(1000000)).toBe('one million');
    expect(NumberToWords.convert(1234567)).toBe('one million two hundred thirty-four thousand five hundred sixty-seven');
  });

  test('handles negative numbers', () => {
    expect(NumberToWords.convert(-5)).toBe('minus five');
  });

  test('handles edge cases', () => {
    expect(NumberToWords.convert(null)).toBe('');
    expect(NumberToWords.convert(undefined)).toBe('');
  });
});

// Ordinalize tests
describe('Ordinalize', () => {
  test('converts numbers to ordinals', () => {
    expect(Ordinalize.ordinalize(1)).toBe('1st');
    expect(Ordinalize.ordinalize(2)).toBe('2nd');
    expect(Ordinalize.ordinalize(3)).toBe('3rd');
    expect(Ordinalize.ordinalize(4)).toBe('4th');
    expect(Ordinalize.ordinalize(11)).toBe('11th');
    expect(Ordinalize.ordinalize(21)).toBe('21st');
    expect(Ordinalize.ordinalize(100)).toBe('100th');
  });

  test('converts to ordinal words', () => {
    expect(Ordinalize.ordinalizeWords(1)).toBe('first');
    expect(Ordinalize.ordinalizeWords(2)).toBe('second');
    expect(Ordinalize.ordinalizeWords(3)).toBe('third');
    expect(Ordinalize.ordinalizeWords(10)).toBe('tenth');
  });
});

// ByteSize tests
describe('ByteSize', () => {
  test('humanizes byte sizes', () => {
    expect(ByteSize.humanize(0)).toBe('0 B');
    expect(ByteSize.humanize(1024)).toBe('1.00 KB');
    expect(ByteSize.humanize(1048576)).toBe('1.00 MB');
    expect(ByteSize.humanize(1073741824)).toBe('1.00 GB');
  });

  test('parses byte size strings', () => {
    expect(ByteSize.parse('1 KB')).toBe(1024);
    expect(ByteSize.parse('1.5 MB')).toBe(1572864);
  });

  test('handles edge cases', () => {
    expect(ByteSize.humanize(null)).toBe('');
    expect(ByteSize.parse('')).toBe(0);
  });
});

// RomanNumeral tests
describe('RomanNumeral', () => {
  test('converts to Roman numerals', () => {
    expect(RomanNumeral.toRoman(1)).toBe('I');
    expect(RomanNumeral.toRoman(4)).toBe('IV');
    expect(RomanNumeral.toRoman(9)).toBe('IX');
    expect(RomanNumeral.toRoman(42)).toBe('XLII');
    expect(RomanNumeral.toRoman(2024)).toBe('MMXXIV');
  });

  test('converts from Roman numerals', () => {
    expect(RomanNumeral.fromRoman('I')).toBe(1);
    expect(RomanNumeral.fromRoman('IV')).toBe(4);
    expect(RomanNumeral.fromRoman('IX')).toBe(9);
    expect(RomanNumeral.fromRoman('XLII')).toBe(42);
    expect(RomanNumeral.fromRoman('MMXXIV')).toBe(2024);
  });

  test('handles edge cases', () => {
    expect(RomanNumeral.toRoman(0)).toBe('');
    expect(RomanNumeral.toRoman(4000)).toBe('');
    expect(RomanNumeral.fromRoman('')).toBe(0);
  });
});

// MetricNumeral tests
describe('MetricNumeral', () => {
  test('formats with metric prefixes', () => {
    expect(MetricNumeral.format(1000)).toBe('1.0K');
    expect(MetricNumeral.format(1500)).toBe('1.5K');
    expect(MetricNumeral.format(1000000)).toBe('1.0M');
    expect(MetricNumeral.format(1200000000)).toBe('1.2B');
  });

  test('parses metric strings', () => {
    expect(MetricNumeral.parse('1K')).toBe(1000);
    expect(MetricNumeral.parse('1.5M')).toBe(1500000);
    expect(MetricNumeral.parse('2B')).toBe(2000000000);
  });

  test('handles edge cases', () => {
    expect(MetricNumeral.format(0)).toBe('0');
    expect(MetricNumeral.parse('')).toBe(0);
  });
});

// CollectionHumanizer tests
describe('CollectionHumanizer', () => {
  test('humanizes collections', () => {
    expect(CollectionHumanizer.humanize(['a'])).toBe('a');
    expect(CollectionHumanizer.humanize(['a', 'b'])).toBe('a and b');
    expect(CollectionHumanizer.humanize(['a', 'b', 'c'])).toBe('a, b, and c');
  });

  test('humanizes with "or"', () => {
    expect(CollectionHumanizer.humanizeOr(['a', 'b', 'c'])).toBe('a, b, or c');
  });

  test('humanizes with Oxford comma', () => {
    expect(CollectionHumanizer.humanizeWithOxfordComma(['a', 'b', 'c'])).toBe('a, b, and c');
  });

  test('handles edge cases', () => {
    expect(CollectionHumanizer.humanize([])).toBe('');
    expect(CollectionHumanizer.humanize(null)).toBe('');
  });
});

// DateTimeHumanizer tests
describe('DateTimeHumanizer', () => {
  test('humanizes dates', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);
    const tomorrow = new Date(now.getTime() + 86400000);
    
    expect(DateTimeHumanizer.humanize(now)).toBe('just now');
    expect(DateTimeHumanizer.humanize(yesterday)).toContain('ago');
    expect(DateTimeHumanizer.humanize(tomorrow)).toContain('in');
  });

  test('formats dates', () => {
    const date = new Date('2024-01-15');
    const formatted = DateTimeHumanizer.format(date, 'medium');
    expect(formatted).toContain('2024');
  });

  test('handles edge cases', () => {
    expect(DateTimeHumanizer.humanize(null)).toBe('');
    expect(DateTimeHumanizer.format(null)).toBe('');
  });
});

// TimeSpanHumanizer tests
describe('TimeSpanHumanizer', () => {
  test('humanizes time spans', () => {
    expect(TimeSpanHumanizer.humanize(1000)).toBe('1s');
    expect(TimeSpanHumanizer.humanize(60000)).toBe('1m');
    expect(TimeSpanHumanizer.humanize(3600000)).toBe('1h');
    expect(TimeSpanHumanizer.humanize(86400000)).toBe('1d');
  });

  test('humanizes with verbose mode', () => {
    expect(TimeSpanHumanizer.humanize(1000, { verbose: true })).toBe('1 second');
    expect(TimeSpanHumanizer.humanize(60000, { verbose: true })).toBe('1 minute');
  });

  test('converts to specific units', () => {
    expect(TimeSpanHumanizer.toUnit(1000, 'seconds')).toBe('1.00 seconds');
    expect(TimeSpanHumanizer.toUnit(60000, 'minutes')).toBe('1.00 minutes');
  });

  test('parses time spans', () => {
    expect(TimeSpanHumanizer.parse('1s')).toBe(1000);
    expect(TimeSpanHumanizer.parse('1m')).toBe(60000);
    expect(TimeSpanHumanizer.parse('1 hour')).toBe(3600000);
  });

  test('handles edge cases', () => {
    expect(TimeSpanHumanizer.humanize(null)).toBe('');
    expect(TimeSpanHumanizer.parse('')).toBe(0);
  });
});

// API Integration tests
describe('API Integration', () => {
  test('POST /api/numbers/process - toWords', async () => {
    const response = await request(app)
      .post('/api/numbers/process')
      .send({ input: 42, operation: 'toWords' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.output).toBe('forty-two');
  });

  test('POST /api/numbers/process - toOrdinal', async () => {
    const response = await request(app)
      .post('/api/numbers/process')
      .send({ input: 1, operation: 'toOrdinal' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.output).toBe('1st');
  });

  test('POST /api/numbers/process - toRoman', async () => {
    const response = await request(app)
      .post('/api/numbers/process')
      .send({ input: 2024, operation: 'toRoman' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.output).toBe('MMXXIV');
  });

  test('POST /api/bytesize/process - humanize', async () => {
    const response = await request(app)
      .post('/api/bytesize/process')
      .send({ input: 1024, operation: 'humanize' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.output).toBe('1.00 KB');
  });

  test('POST /api/collection/process - humanize', async () => {
    const response = await request(app)
      .post('/api/collection/process')
      .send({ input: ['a', 'b', 'c'], operation: 'humanize' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.output).toBe('a, b, and c');
  });

  test('POST /api/timespan/process - humanize', async () => {
    const response = await request(app)
      .post('/api/timespan/process')
      .send({ input: 60000, operation: 'humanize' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.output).toBe('1m');
  });
});
