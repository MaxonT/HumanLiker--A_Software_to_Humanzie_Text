/**
 * Inflector Tests
 * Comprehensive unit and integration tests for the Inflector and Vocabulary modules
 */

const Inflector = require('../backend/core/Inflector');
const Vocabulary = require('../backend/core/Vocabulary');
const request = require('supertest');
const app = require('../backend/server');

describe('Vocabulary Unit Tests', () => {
  let vocabulary;
  
  beforeEach(() => {
    vocabulary = new Vocabulary();
  });
  
  describe('addIrregular() method', () => {
    test('should add irregular word pair', () => {
      vocabulary.addIrregular('test', 'tests');
      expect(vocabulary.getPlural('test')).toBe('tests');
      expect(vocabulary.getSingular('tests')).toBe('test');
    });
    
    test('should store in lowercase', () => {
      vocabulary.addIrregular('TEST', 'TESTS');
      expect(vocabulary.getPlural('test')).toBe('tests');
    });
    
    test('should throw error for missing parameters', () => {
      expect(() => vocabulary.addIrregular('', 'test')).toThrow();
      expect(() => vocabulary.addIrregular('test', '')).toThrow();
    });
  });
  
  describe('addUncountable() method', () => {
    test('should add uncountable word', () => {
      vocabulary.addUncountable('air');
      expect(vocabulary.isUncountable('air')).toBe(true);
    });
    
    test('should not add duplicates', () => {
      vocabulary.addUncountable('air');
      vocabulary.addUncountable('air');
      const count = vocabulary.uncountables.filter(w => w === 'air').length;
      expect(count).toBe(1);
    });
    
    test('should throw error for missing parameter', () => {
      expect(() => vocabulary.addUncountable('')).toThrow();
    });
  });
  
  describe('isUncountable() method', () => {
    test('should return true for uncountable words', () => {
      expect(vocabulary.isUncountable('equipment')).toBe(true);
      expect(vocabulary.isUncountable('information')).toBe(true);
      expect(vocabulary.isUncountable('sheep')).toBe(true);
    });
    
    test('should be case-insensitive', () => {
      expect(vocabulary.isUncountable('EQUIPMENT')).toBe(true);
    });
    
    test('should return false for countable words', () => {
      expect(vocabulary.isUncountable('apple')).toBe(false);
    });
  });
  
  describe('getPlural() and getSingular() methods', () => {
    test('should return plural for irregular singular', () => {
      expect(vocabulary.getPlural('person')).toBe('people');
      expect(vocabulary.getPlural('mouse')).toBe('mice');
      expect(vocabulary.getPlural('datum')).toBe('data');
    });
    
    test('should return singular for irregular plural', () => {
      expect(vocabulary.getSingular('people')).toBe('person');
      expect(vocabulary.getSingular('mice')).toBe('mouse');
      expect(vocabulary.getSingular('data')).toBe('datum');
    });
    
    test('should return null for non-irregular words', () => {
      expect(vocabulary.getPlural('apple')).toBeNull();
      expect(vocabulary.getSingular('apples')).toBeNull();
    });
  });
});

describe('Inflector Unit Tests', () => {
  describe('pluralize() method', () => {
    test('should pluralize irregular nouns', () => {
      expect(Inflector.pluralize('person')).toBe('people');
      expect(Inflector.pluralize('man')).toBe('men');
      expect(Inflector.pluralize('woman')).toBe('women');
      expect(Inflector.pluralize('child')).toBe('children');
      expect(Inflector.pluralize('mouse')).toBe('mice');
      expect(Inflector.pluralize('goose')).toBe('geese');
    });
    
    test('should not pluralize uncountable nouns', () => {
      expect(Inflector.pluralize('equipment')).toBe('equipment');
      expect(Inflector.pluralize('information')).toBe('information');
      expect(Inflector.pluralize('sheep')).toBe('sheep');
    });
    
    test('should add es to words ending in s, x, z, ch, sh', () => {
      expect(Inflector.pluralize('bus')).toBe('buses');
      expect(Inflector.pluralize('box')).toBe('boxes');
      expect(Inflector.pluralize('buzz')).toBe('buzzes');
      expect(Inflector.pluralize('church')).toBe('churches');
      expect(Inflector.pluralize('wish')).toBe('wishes');
    });
    
    test('should change y to ies for consonant + y', () => {
      expect(Inflector.pluralize('baby')).toBe('babies');
      expect(Inflector.pluralize('city')).toBe('cities');
      expect(Inflector.pluralize('lady')).toBe('ladies');
    });
    
    test('should add s for vowel + y', () => {
      expect(Inflector.pluralize('boy')).toBe('boys');
      expect(Inflector.pluralize('day')).toBe('days');
      expect(Inflector.pluralize('key')).toBe('keys');
    });
    
    test('should change f/fe to ves', () => {
      expect(Inflector.pluralize('leaf')).toBe('leaves');
      expect(Inflector.pluralize('knife')).toBe('knives');
      expect(Inflector.pluralize('wife')).toBe('wives');
    });
    
    test('should add es for consonant + o', () => {
      expect(Inflector.pluralize('hero')).toBe('heroes');
      expect(Inflector.pluralize('potato')).toBe('potatoes');
    });
    
    test('should add s by default', () => {
      expect(Inflector.pluralize('apple')).toBe('apples');
      expect(Inflector.pluralize('dog')).toBe('dogs');
      expect(Inflector.pluralize('cat')).toBe('cats');
    });
    
    test('should handle empty input', () => {
      expect(Inflector.pluralize('')).toBe('');
      expect(Inflector.pluralize(null)).toBe('');
    });
  });
  
  describe('singularize() method', () => {
    test('should singularize irregular nouns', () => {
      expect(Inflector.singularize('people')).toBe('person');
      expect(Inflector.singularize('men')).toBe('man');
      expect(Inflector.singularize('women')).toBe('woman');
      expect(Inflector.singularize('children')).toBe('child');
      expect(Inflector.singularize('mice')).toBe('mouse');
    });
    
    test('should not singularize uncountable nouns', () => {
      expect(Inflector.singularize('equipment')).toBe('equipment');
      expect(Inflector.singularize('information')).toBe('information');
    });
    
    test('should remove es from words ending in ses, xes, zes, ches, shes', () => {
      expect(Inflector.singularize('buses')).toBe('bus');
      expect(Inflector.singularize('boxes')).toBe('box');
      expect(Inflector.singularize('churches')).toBe('church');
      expect(Inflector.singularize('wishes')).toBe('wish');
    });
    
    test('should change ies to y', () => {
      expect(Inflector.singularize('babies')).toBe('baby');
      expect(Inflector.singularize('cities')).toBe('city');
      expect(Inflector.singularize('ladies')).toBe('lady');
    });
    
    test('should change ves to f', () => {
      expect(Inflector.singularize('leaves')).toBe('leaf');
      expect(Inflector.singularize('knives')).toBe('knife');
    });
    
    test('should remove s by default', () => {
      expect(Inflector.singularize('apples')).toBe('apple');
      expect(Inflector.singularize('dogs')).toBe('dog');
      expect(Inflector.singularize('cats')).toBe('cat');
    });
    
    test('should handle empty input', () => {
      expect(Inflector.singularize('')).toBe('');
      expect(Inflector.singularize(null)).toBe('');
    });
  });
  
  describe('pascalize() method', () => {
    test('should convert to PascalCase', () => {
      expect(Inflector.pascalize('hello world')).toBe('HelloWorld');
      expect(Inflector.pascalize('hello_world')).toBe('HelloWorld');
      expect(Inflector.pascalize('hello-world')).toBe('HelloWorld');
    });
    
    test('should handle camelCase input', () => {
      expect(Inflector.pascalize('helloWorld')).toBe('HelloWorld');
    });
    
    test('should handle empty input', () => {
      expect(Inflector.pascalize('')).toBe('');
    });
  });
  
  describe('camelize() method', () => {
    test('should convert to camelCase', () => {
      expect(Inflector.camelize('hello world')).toBe('helloWorld');
      expect(Inflector.camelize('hello_world')).toBe('helloWorld');
      expect(Inflector.camelize('hello-world')).toBe('helloWorld');
    });
    
    test('should handle PascalCase input', () => {
      expect(Inflector.camelize('HelloWorld')).toBe('helloWorld');
    });
    
    test('should handle empty input', () => {
      expect(Inflector.camelize('')).toBe('');
    });
  });
  
  describe('underscore() method', () => {
    test('should convert to underscore_case', () => {
      expect(Inflector.underscore('HelloWorld')).toBe('hello_world');
      expect(Inflector.underscore('helloWorld')).toBe('hello_world');
      expect(Inflector.underscore('hello-world')).toBe('hello_world');
    });
    
    test('should handle spaces', () => {
      expect(Inflector.underscore('hello world')).toBe('hello_world');
    });
    
    test('should handle empty input', () => {
      expect(Inflector.underscore('')).toBe('');
    });
  });
  
  describe('dasherize() method', () => {
    test('should convert to dash-case', () => {
      expect(Inflector.dasherize('HelloWorld')).toBe('hello-world');
      expect(Inflector.dasherize('helloWorld')).toBe('hello-world');
      expect(Inflector.dasherize('hello_world')).toBe('hello-world');
    });
    
    test('should handle empty input', () => {
      expect(Inflector.dasherize('')).toBe('');
    });
  });
  
  describe('kebaberize() method', () => {
    test('should convert to kebab-case (same as dasherize)', () => {
      expect(Inflector.kebaberize('HelloWorld')).toBe('hello-world');
      expect(Inflector.kebaberize('helloWorld')).toBe('hello-world');
    });
  });
  
  describe('titleize() method', () => {
    test('should convert to Title Case', () => {
      expect(Inflector.titleize('hello world')).toBe('Hello World');
      expect(Inflector.titleize('hello_world')).toBe('Hello World');
      expect(Inflector.titleize('hello-world')).toBe('Hello World');
    });
    
    test('should handle camelCase', () => {
      expect(Inflector.titleize('helloWorld')).toBe('Hello World');
    });
    
    test('should handle empty input', () => {
      expect(Inflector.titleize('')).toBe('');
    });
  });
  
  describe('toQuantity() method', () => {
    test('should format with numeric quantity', () => {
      expect(Inflector.toQuantity('apple', 1)).toBe('1 apple');
      expect(Inflector.toQuantity('apple', 2)).toBe('2 apples');
      expect(Inflector.toQuantity('person', 1)).toBe('1 person');
      expect(Inflector.toQuantity('person', 5)).toBe('5 people');
    });
    
    test('should format with words if NumberToWords available', () => {
      // Test numeric fallback since NumberToWords might not exist
      const result = Inflector.toQuantity('apple', 3, 'Words');
      // Either "three apples" or "3 apples" depending on NumberToWords availability
      expect(result).toMatch(/^(3|three) apples$/);
    });
    
    test('should handle empty input', () => {
      expect(Inflector.toQuantity('', 5)).toBe('');
    });
    
    test('should handle invalid quantity', () => {
      expect(Inflector.toQuantity('apple', 'invalid')).toBe('apple');
    });
  });
  
  describe('matchCase() method', () => {
    test('should match all uppercase', () => {
      expect(Inflector.matchCase('HELLO', 'world')).toBe('WORLD');
    });
    
    test('should match all lowercase', () => {
      expect(Inflector.matchCase('hello', 'WORLD')).toBe('world');
    });
    
    test('should match capitalized', () => {
      expect(Inflector.matchCase('Hello', 'world')).toBe('World');
    });
    
    test('should return word as-is for mixed case', () => {
      expect(Inflector.matchCase('HeLLo', 'world')).toBe('world');
    });
  });
});

describe('Inflector Integration Tests', () => {
  describe('POST /api/inflector/process', () => {
    test('should pluralize a word', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: 'person',
          operation: 'pluralize'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('output', 'people');
    });
    
    test('should singularize a word', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: 'people',
          operation: 'singularize'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('person');
    });
    
    test('should pascalize text', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: 'hello world',
          operation: 'pascalize'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('HelloWorld');
    });
    
    test('should camelize text', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: 'hello world',
          operation: 'camelize'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('helloWorld');
    });
    
    test('should underscore text', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: 'HelloWorld',
          operation: 'underscore'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('hello_world');
    });
    
    test('should dasherize text', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: 'HelloWorld',
          operation: 'dasherize'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('hello-world');
    });
    
    test('should kebaberize text', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: 'HelloWorld',
          operation: 'kebaberize'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('hello-world');
    });
    
    test('should titleize text', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: 'hello world',
          operation: 'titleize'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('Hello World');
    });
    
    test('should convert to quantity with numeric format', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: 'apple',
          operation: 'toQuantity',
          quantity: 5,
          showQuantityAs: 'Numeric'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('5 apples');
    });
    
    test('should return 400 for invalid operation', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: 'test',
          operation: 'invalid_operation'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
    
    test('should handle empty input gracefully', async () => {
      const response = await request(app)
        .post('/api/inflector/process')
        .send({
          input: '',
          operation: 'pluralize'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toBe('');
    });
  });
});
