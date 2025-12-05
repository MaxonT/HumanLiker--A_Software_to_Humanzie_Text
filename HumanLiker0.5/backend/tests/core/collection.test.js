import CollectionHumanizer from '../../src/core/CollectionHumanizer.js';

describe('CollectionHumanizer', () => {
  describe('humanize', () => {
    test('returns empty string for empty array', () => {
      expect(CollectionHumanizer.humanize([])).toBe('');
    });

    test('returns single item as string', () => {
      expect(CollectionHumanizer.humanize(['apple'])).toBe('apple');
    });

    test('joins two items with "and"', () => {
      expect(CollectionHumanizer.humanize(['apple', 'banana'])).toBe('apple and banana');
    });

    test('joins three items with commas and "and"', () => {
      expect(CollectionHumanizer.humanize(['apple', 'banana', 'cherry']))
        .toBe('apple, banana and cherry');
    });

    test('joins multiple items', () => {
      expect(CollectionHumanizer.humanize(['a', 'b', 'c', 'd']))
        .toBe('a, b, c and d');
    });

    test('uses custom separator', () => {
      expect(CollectionHumanizer.humanize(['a', 'b', 'c'], '; '))
        .toBe('a; b and c');
    });

    test('uses custom last separator', () => {
      expect(CollectionHumanizer.humanize(['a', 'b', 'c'], ', ', ' or '))
        .toBe('a, b or c');
    });

    test('throws error for non-array input', () => {
      expect(() => CollectionHumanizer.humanize('not an array')).toThrow(TypeError);
      expect(() => CollectionHumanizer.humanize(123)).toThrow(TypeError);
    });
  });
});
