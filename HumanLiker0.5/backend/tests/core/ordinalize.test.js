import Ordinalize from '../../src/core/Ordinalize.js';

describe('Ordinalize', () => {
  describe('getOrdinalSuffix', () => {
    test('returns correct suffix for numbers ending in 1', () => {
      expect(Ordinalize.getOrdinalSuffix(1)).toBe('st');
      expect(Ordinalize.getOrdinalSuffix(21)).toBe('st');
      expect(Ordinalize.getOrdinalSuffix(101)).toBe('st');
    });

    test('returns correct suffix for numbers ending in 2', () => {
      expect(Ordinalize.getOrdinalSuffix(2)).toBe('nd');
      expect(Ordinalize.getOrdinalSuffix(22)).toBe('nd');
      expect(Ordinalize.getOrdinalSuffix(102)).toBe('nd');
    });

    test('returns correct suffix for numbers ending in 3', () => {
      expect(Ordinalize.getOrdinalSuffix(3)).toBe('rd');
      expect(Ordinalize.getOrdinalSuffix(23)).toBe('rd');
      expect(Ordinalize.getOrdinalSuffix(103)).toBe('rd');
    });

    test('returns "th" for 11, 12, 13', () => {
      expect(Ordinalize.getOrdinalSuffix(11)).toBe('th');
      expect(Ordinalize.getOrdinalSuffix(12)).toBe('th');
      expect(Ordinalize.getOrdinalSuffix(13)).toBe('th');
      expect(Ordinalize.getOrdinalSuffix(111)).toBe('th');
      expect(Ordinalize.getOrdinalSuffix(112)).toBe('th');
      expect(Ordinalize.getOrdinalSuffix(113)).toBe('th');
    });

    test('returns "th" for other numbers', () => {
      expect(Ordinalize.getOrdinalSuffix(4)).toBe('th');
      expect(Ordinalize.getOrdinalSuffix(10)).toBe('th');
      expect(Ordinalize.getOrdinalSuffix(100)).toBe('th');
    });

    test('throws error for invalid input', () => {
      expect(() => Ordinalize.getOrdinalSuffix('abc')).toThrow(TypeError);
      expect(() => Ordinalize.getOrdinalSuffix(NaN)).toThrow(TypeError);
    });
  });

  describe('convert', () => {
    test('converts numbers to ordinal strings', () => {
      expect(Ordinalize.convert(1)).toBe('1st');
      expect(Ordinalize.convert(2)).toBe('2nd');
      expect(Ordinalize.convert(3)).toBe('3rd');
      expect(Ordinalize.convert(4)).toBe('4th');
      expect(Ordinalize.convert(11)).toBe('11th');
      expect(Ordinalize.convert(21)).toBe('21st');
      expect(Ordinalize.convert(100)).toBe('100th');
    });

    test('throws error for invalid input', () => {
      expect(() => Ordinalize.convert('abc')).toThrow(TypeError);
      expect(() => Ordinalize.convert(NaN)).toThrow(TypeError);
    });
  });
});
