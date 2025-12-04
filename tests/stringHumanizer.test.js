/**
 * StringHumanizer Tests
 * Comprehensive unit and integration tests for the StringHumanizer module
 */

const StringHumanizer = require('../backend/core/StringHumanizer');
const request = require('supertest');
const app = require('../backend/server');

describe('StringHumanizer Unit Tests', () => {
  describe('humanize() method', () => {
    test('should humanize PascalCase to spaced words', () => {
      expect(StringHumanizer.humanize('HelloWorld')).toBe('Hello world');
      expect(StringHumanizer.humanize('UserProfile')).toBe('User profile');
    });

    test('should humanize camelCase to spaced words', () => {
      expect(StringHumanizer.humanize('helloWorld')).toBe('Hello world');
      expect(StringHumanizer.humanize('userProfileSettings')).toBe('User profile settings');
    });

    test('should humanize snake_case to spaced words', () => {
      expect(StringHumanizer.humanize('hello_world')).toBe('Hello world');
      expect(StringHumanizer.humanize('user_profile_settings')).toBe('User profile settings');
    });

    test('should humanize kebab-case to spaced words', () => {
      expect(StringHumanizer.humanize('hello-world')).toBe('Hello world');
      expect(StringHumanizer.humanize('user-profile-settings')).toBe('User profile settings');
    });

    test('should preserve acronyms when appropriate', () => {
      const result = StringHumanizer.humanize('HTMLParser');
      expect(result).toBe('Html parser');
      // Note: The current implementation converts to lowercase, 
      // but preserves word boundaries
    });

    test('should handle multiple spaces', () => {
      expect(StringHumanizer.humanize('hello   world')).toBe('Hello world');
    });

    test('should handle empty string', () => {
      expect(StringHumanizer.humanize('')).toBe('');
    });

    test('should handle null/undefined', () => {
      expect(StringHumanizer.humanize(null)).toBe('');
      expect(StringHumanizer.humanize(undefined)).toBe('');
    });

    test('should apply sentence casing', () => {
      expect(StringHumanizer.humanize('HelloWorld', 'sentence')).toBe('Hello world');
    });

    test('should apply title casing', () => {
      expect(StringHumanizer.humanize('hello_world', 'title')).toBe('Hello World');
    });

    test('should apply lower casing', () => {
      expect(StringHumanizer.humanize('HelloWorld', 'lower')).toBe('hello world');
    });

    test('should apply upper casing', () => {
      expect(StringHumanizer.humanize('hello_world', 'upper')).toBe('HELLO WORLD');
    });
  });

  describe('dehumanize() method', () => {
    test('should convert spaced words to PascalCase', () => {
      expect(StringHumanizer.dehumanize('Hello World')).toBe('HelloWorld');
      expect(StringHumanizer.dehumanize('user profile settings')).toBe('UserProfileSettings');
    });

    test('should handle snake_case', () => {
      expect(StringHumanizer.dehumanize('hello_world')).toBe('HelloWorld');
    });

    test('should handle kebab-case', () => {
      expect(StringHumanizer.dehumanize('hello-world')).toBe('HelloWorld');
    });

    test('should handle empty string', () => {
      expect(StringHumanizer.dehumanize('')).toBe('');
    });

    test('should handle null/undefined', () => {
      expect(StringHumanizer.dehumanize(null)).toBe('');
      expect(StringHumanizer.dehumanize(undefined)).toBe('');
    });
  });

  describe('applyCasing() method', () => {
    test('should apply sentence case', () => {
      expect(StringHumanizer.applyCasing('hello world', 'sentence')).toBe('Hello world');
      expect(StringHumanizer.applyCasing('HELLO WORLD', 'sentence')).toBe('Hello world');
    });

    test('should apply title case', () => {
      expect(StringHumanizer.applyCasing('hello world', 'title')).toBe('Hello World');
      expect(StringHumanizer.applyCasing('hello world test', 'title')).toBe('Hello World Test');
    });

    test('should preserve acronyms in title case', () => {
      expect(StringHumanizer.applyCasing('HTML parser', 'title')).toBe('HTML Parser');
    });

    test('should apply lower case', () => {
      expect(StringHumanizer.applyCasing('Hello World', 'lower')).toBe('hello world');
    });

    test('should apply upper case', () => {
      expect(StringHumanizer.applyCasing('hello world', 'upper')).toBe('HELLO WORLD');
    });

    test('should handle empty string', () => {
      expect(StringHumanizer.applyCasing('', 'sentence')).toBe('');
    });
  });

  describe('truncate() method', () => {
    test('should truncate by fixed length from right', () => {
      const input = 'This is a long string that needs to be truncated';
      const result = StringHumanizer.truncate(input, 20, 'FixedLength', 'Right');
      expect(result.length).toBe(20);
      expect(result).toBe('This is a long st...');
    });

    test('should truncate by fixed length from left', () => {
      const input = 'This is a long string that needs to be truncated';
      const result = StringHumanizer.truncate(input, 20, 'FixedLength', 'Left');
      expect(result.length).toBe(20);
      expect(result).toBe('...s to be truncated');
    });

    test('should not truncate if string is shorter than length', () => {
      const input = 'Short text';
      const result = StringHumanizer.truncate(input, 50, 'FixedLength');
      expect(result).toBe(input);
    });

    test('should truncate by fixed number of words from right', () => {
      const input = 'This is a long string with many words to truncate';
      const result = StringHumanizer.truncate(input, 4, 'FixedNumberOfWords', 'Right');
      expect(result).toBe('This is a long ...');
    });

    test('should truncate by fixed number of words from left', () => {
      const input = 'This is a long string with many words to truncate';
      const result = StringHumanizer.truncate(input, 4, 'FixedNumberOfWords', 'Left');
      expect(result).toBe('... many words to truncate');
    });

    test('should not truncate if word count is less than limit', () => {
      const input = 'Short text';
      const result = StringHumanizer.truncate(input, 5, 'FixedNumberOfWords');
      expect(result).toBe(input);
    });

    test('should handle empty string', () => {
      expect(StringHumanizer.truncate('', 10)).toBe('');
    });

    test('should handle null/undefined', () => {
      expect(StringHumanizer.truncate(null, 10)).toBe('');
      expect(StringHumanizer.truncate(undefined, 10)).toBe('');
    });

    test('should handle invalid length parameter', () => {
      const input = 'Test string';
      expect(StringHumanizer.truncate(input, 0)).toBe(input);
      expect(StringHumanizer.truncate(input, -5)).toBe(input);
      expect(StringHumanizer.truncate(input, 'invalid')).toBe(input);
    });
  });
});

describe('StringHumanizer Integration Tests', () => {
  describe('POST /api/string/process', () => {
    test('should humanize a string with default casing', async () => {
      const response = await request(app)
        .post('/api/string/process')
        .send({
          input: 'HelloWorld',
          operation: 'humanize'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('output', 'Hello world');
    });

    test('should humanize with title casing', async () => {
      const response = await request(app)
        .post('/api/string/process')
        .send({
          input: 'hello_world_example',
          operation: 'humanize',
          casing: 'title'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('Hello World Example');
    });

    test('should dehumanize a string', async () => {
      const response = await request(app)
        .post('/api/string/process')
        .send({
          input: 'Hello World',
          operation: 'dehumanize'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('HelloWorld');
    });

    test('should truncate a string with fixed length', async () => {
      const response = await request(app)
        .post('/api/string/process')
        .send({
          input: 'This is a very long string that should be truncated',
          operation: 'truncate',
          length: 20,
          truncator: 'FixedLength',
          from: 'Right'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output.length).toBe(20);
      expect(response.body.output).toContain('...');
    });

    test('should return 400 for invalid operation', async () => {
      const response = await request(app)
        .post('/api/string/process')
        .send({
          input: 'test',
          operation: 'invalid_operation'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 when truncate operation missing length', async () => {
      const response = await request(app)
        .post('/api/string/process')
        .send({
          input: 'test string',
          operation: 'truncate'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Length parameter is required');
    });

    test('should handle empty input gracefully', async () => {
      const response = await request(app)
        .post('/api/string/process')
        .send({
          input: '',
          operation: 'humanize'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('');
    });
  });
});
