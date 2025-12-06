import RomanNumeral from '../../src/core/RomanNumeral.js';

describe('RomanNumeral', () => {
  describe('toRoman', () => {
    test('converts single digit numbers', () => {
      expect(RomanNumeral.toRoman(1)).toBe('I');
      expect(RomanNumeral.toRoman(5)).toBe('V');
      expect(RomanNumeral.toRoman(9)).toBe('IX');
    });

    test('converts two digit numbers', () => {
      expect(RomanNumeral.toRoman(10)).toBe('X');
      expect(RomanNumeral.toRoman(40)).toBe('XL');
      expect(RomanNumeral.toRoman(50)).toBe('L');
      expect(RomanNumeral.toRoman(90)).toBe('XC');
    });

    test('converts hundreds', () => {
      expect(RomanNumeral.toRoman(100)).toBe('C');
      expect(RomanNumeral.toRoman(400)).toBe('CD');
      expect(RomanNumeral.toRoman(500)).toBe('D');
      expect(RomanNumeral.toRoman(900)).toBe('CM');
    });

    test('converts thousands', () => {
      expect(RomanNumeral.toRoman(1000)).toBe('M');
      expect(RomanNumeral.toRoman(3999)).toBe('MMMCMXCIX');
    });

    test('converts complex numbers', () => {
      expect(RomanNumeral.toRoman(1984)).toBe('MCMLXXXIV');
      expect(RomanNumeral.toRoman(2024)).toBe('MMXXIV');
    });

    test('throws error for out of range', () => {
      expect(() => RomanNumeral.toRoman(0)).toThrow(RangeError);
      expect(() => RomanNumeral.toRoman(4000)).toThrow(RangeError);
    });

    test('throws error for invalid input', () => {
      expect(() => RomanNumeral.toRoman('abc')).toThrow(TypeError);
      expect(() => RomanNumeral.toRoman(NaN)).toThrow(TypeError);
    });
  });

  describe('fromRoman', () => {
    test('converts single numerals', () => {
      expect(RomanNumeral.fromRoman('I')).toBe(1);
      expect(RomanNumeral.fromRoman('V')).toBe(5);
      expect(RomanNumeral.fromRoman('X')).toBe(10);
    });

    test('converts subtractive notation', () => {
      expect(RomanNumeral.fromRoman('IV')).toBe(4);
      expect(RomanNumeral.fromRoman('IX')).toBe(9);
      expect(RomanNumeral.fromRoman('XL')).toBe(40);
      expect(RomanNumeral.fromRoman('XC')).toBe(90);
      expect(RomanNumeral.fromRoman('CD')).toBe(400);
      expect(RomanNumeral.fromRoman('CM')).toBe(900);
    });

    test('converts complex numerals', () => {
      expect(RomanNumeral.fromRoman('MCMLXXXIV')).toBe(1984);
      expect(RomanNumeral.fromRoman('MMXXIV')).toBe(2024);
      expect(RomanNumeral.fromRoman('MMMCMXCIX')).toBe(3999);
    });

    test('handles lowercase', () => {
      expect(RomanNumeral.fromRoman('mcmlxxxiv')).toBe(1984);
      expect(RomanNumeral.fromRoman('mmxxiv')).toBe(2024);
    });

    test('throws error for invalid format', () => {
      expect(() => RomanNumeral.fromRoman('ABC')).toThrow(Error);
      expect(() => RomanNumeral.fromRoman('')).toThrow(Error);
      expect(() => RomanNumeral.fromRoman(123)).toThrow(TypeError);
    });
  });
});
