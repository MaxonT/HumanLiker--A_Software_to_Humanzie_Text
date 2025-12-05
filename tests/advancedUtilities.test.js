const Truncator = require('../backend/core/Truncator');
const EnumProcessor = require('../backend/core/EnumProcessor');
const HeadingConverter = require('../backend/core/HeadingConverter');
const TupleConverter = require('../backend/core/TupleConverter');
const app = require('../backend/server');
const request = require('supertest');

describe('Truncator', () => {
  test('truncates using fixed length from right', () => {
    const input = 'This is a demo string';
    const result = Truncator.truncate(input, 10, 'FixedLength', 'Right');
    expect(result).toBe('This is...');
  });

  test('truncates using fixed number of words from left', () => {
    const input = 'One two three four five';
    const result = Truncator.truncate(input, 3, 'FixedNumberOfWords', 'Left');
    expect(result).toBe('... three four five');
  });
});

describe('EnumProcessor', () => {
  test('humanizes and dehumanizes values', () => {
    expect(EnumProcessor.humanize('UserProfile')).toBe('User profile');
    expect(EnumProcessor.dehumanize('User profile')).toBe('UserProfile');
  });

  test('lists values and parses flags', () => {
    const list = EnumProcessor.list(['ReadOnly', 'Admin'], 'or');
    expect(list).toBe('Read only or Admin');

    const parsed = EnumProcessor.parseFlags('Read only, Admin');
    expect(parsed).toEqual(['ReadOnly', 'Admin']);
  });
});

describe('HeadingConverter', () => {
  test('converts degrees to compass', () => {
    expect(HeadingConverter.toCompass(0)).toBe('N');
    expect(HeadingConverter.toCompass(90)).toBe('E');
    expect(HeadingConverter.toCompass(225)).toBe('SW');
  });

  test('converts compass to degrees', () => {
    expect(HeadingConverter.fromCompass('N')).toBe(0);
    expect(HeadingConverter.fromCompass('SW')).toBe(225);
  });
});

describe('TupleConverter', () => {
  test('formats tuple to string', () => {
    expect(TupleConverter.toString(['lat', 'long'])).toBe('(lat, long)');
  });

  test('parses tuple string', () => {
    expect(TupleConverter.parse('(a, b, c)')).toEqual(['a', 'b', 'c']);
  });
});

describe('Advanced Routes', () => {
  test('processes truncator requests', async () => {
    const response = await request(app)
      .post('/api/advanced/process')
      .send({ module: 'truncator', input: 'Edge testing', length: 8, strategy: 'FixedLength' });

    expect(response.status).toBe(200);
    expect(response.body.output).toBe('Edge ...');
  });

  test('processes heading requests', async () => {
    const response = await request(app)
      .post('/api/advanced/process')
      .send({ module: 'heading', degrees: 90 });

    expect(response.status).toBe(200);
    expect(response.body.output).toBe('E');
  });

  test('processes enum flag parsing', async () => {
    const response = await request(app)
      .post('/api/advanced/process')
      .send({ module: 'enum', operation: 'parseFlags', value: 'Read only, Admin' });

    expect(response.status).toBe(200);
    expect(response.body.output).toEqual(['ReadOnly', 'Admin']);
  });
});
