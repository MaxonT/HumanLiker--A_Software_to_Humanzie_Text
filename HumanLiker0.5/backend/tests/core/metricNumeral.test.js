import MetricNumeral from '../../src/core/MetricNumeral.js';

describe('MetricNumeral', () => {
  describe('toMetric', () => {
    test('converts numbers to metric notation', () => {
      expect(MetricNumeral.toMetric(1000)).toBe('1.0k');
      expect(MetricNumeral.toMetric(1500)).toBe('1.5k');
      expect(MetricNumeral.toMetric(1000000)).toBe('1.0M');
      expect(MetricNumeral.toMetric(1500000)).toBe('1.5M');
    });

    test('converts billions and trillions', () => {
      expect(MetricNumeral.toMetric(1000000000)).toBe('1.0G');
      expect(MetricNumeral.toMetric(1000000000000)).toBe('1.0T');
    });

    test('returns small numbers as-is', () => {
      expect(MetricNumeral.toMetric(500)).toBe('500.0');
      expect(MetricNumeral.toMetric(999)).toBe('999.0');
    });

    test('respects precision', () => {
      expect(MetricNumeral.toMetric(1234, 0)).toBe('1k');
      expect(MetricNumeral.toMetric(1234, 2)).toBe('1.23k');
      expect(MetricNumeral.toMetric(1234, 3)).toBe('1.234k');
    });

    test('handles negative numbers', () => {
      expect(MetricNumeral.toMetric(-1000)).toBe('-1.0k');
      expect(MetricNumeral.toMetric(-1500000)).toBe('-1.5M');
    });

    test('throws error for invalid input', () => {
      expect(() => MetricNumeral.toMetric('abc')).toThrow(TypeError);
      expect(() => MetricNumeral.toMetric(NaN)).toThrow(TypeError);
    });
  });

  describe('fromMetric', () => {
    test('converts metric notation to numbers', () => {
      expect(MetricNumeral.fromMetric('1k')).toBe(1000);
      expect(MetricNumeral.fromMetric('1.5k')).toBe(1500);
      expect(MetricNumeral.fromMetric('1M')).toBe(1000000);
      expect(MetricNumeral.fromMetric('1.5M')).toBe(1500000);
    });

    test('handles case insensitivity for k', () => {
      expect(MetricNumeral.fromMetric('1K')).toBe(1000);
    });

    test('converts billions and trillions', () => {
      expect(MetricNumeral.fromMetric('1G')).toBe(1000000000);
      expect(MetricNumeral.fromMetric('1T')).toBe(1000000000000);
    });

    test('handles numbers without suffix', () => {
      expect(MetricNumeral.fromMetric('500')).toBe(500);
      expect(MetricNumeral.fromMetric('1.5')).toBe(1.5);
    });

    test('handles negative numbers', () => {
      expect(MetricNumeral.fromMetric('-1k')).toBe(-1000);
      expect(MetricNumeral.fromMetric('-1.5M')).toBe(-1500000);
    });

    test('handles whitespace', () => {
      expect(MetricNumeral.fromMetric('1 k')).toBe(1000);
      expect(MetricNumeral.fromMetric(' 1.5M ')).toBe(1500000);
    });

    test('throws error for invalid format', () => {
      expect(() => MetricNumeral.fromMetric('abc')).toThrow(Error);
      expect(() => MetricNumeral.fromMetric('')).toThrow(Error);
      expect(() => MetricNumeral.fromMetric(123)).toThrow(TypeError);
    });
  });
});
