import NumberToWords from '../../src/core/NumberToWords.js';

describe('NumberToWords', () => {
  describe('convert', () => {
    test('converts 0 to words', () => {
      expect(NumberToWords.convert(0)).toBe('zero');
    });

    test('converts single digit numbers', () => {
      expect(NumberToWords.convert(1)).toBe('one');
      expect(NumberToWords.convert(5)).toBe('five');
      expect(NumberToWords.convert(9)).toBe('nine');
    });

    test('converts teen numbers', () => {
      expect(NumberToWords.convert(10)).toBe('ten');
      expect(NumberToWords.convert(13)).toBe('thirteen');
      expect(NumberToWords.convert(19)).toBe('nineteen');
    });

    test('converts two digit numbers', () => {
      expect(NumberToWords.convert(20)).toBe('twenty');
      expect(NumberToWords.convert(25)).toBe('twenty-five');
      expect(NumberToWords.convert(99)).toBe('ninety-nine');
    });

    test('converts hundreds', () => {
      expect(NumberToWords.convert(100)).toBe('one hundred');
      expect(NumberToWords.convert(123)).toBe('one hundred twenty-three');
      expect(NumberToWords.convert(999)).toBe('nine hundred ninety-nine');
    });

    test('converts thousands', () => {
      expect(NumberToWords.convert(1000)).toBe('one thousand');
      expect(NumberToWords.convert(1234)).toBe('one thousand two hundred thirty-four');
    });

    test('converts negative numbers', () => {
      expect(NumberToWords.convert(-5)).toBe('negative five');
      expect(NumberToWords.convert(-123)).toBe('negative one hundred twenty-three');
    });

    test('throws error for invalid input', () => {
      expect(() => NumberToWords.convert('abc')).toThrow(TypeError);
      expect(() => NumberToWords.convert(NaN)).toThrow(TypeError);
    });
  });

  describe('convertToOrdinal', () => {
    test('converts numbers to ordinal words', () => {
      expect(NumberToWords.convertToOrdinal(1)).toBe('first');
      expect(NumberToWords.convertToOrdinal(2)).toBe('second');
      expect(NumberToWords.convertToOrdinal(3)).toBe('third');
      expect(NumberToWords.convertToOrdinal(4)).toBe('fourth');
    });

    test('converts larger ordinals', () => {
      expect(NumberToWords.convertToOrdinal(21)).toBe('twenty first');
      expect(NumberToWords.convertToOrdinal(100)).toBe('one hundredth');
    });

    test('throws error for invalid input', () => {
      expect(() => NumberToWords.convertToOrdinal(-1)).toThrow(RangeError);
      expect(() => NumberToWords.convertToOrdinal(0)).toThrow(RangeError);
      expect(() => NumberToWords.convertToOrdinal(1.5)).toThrow(RangeError);
    });
  });
});
