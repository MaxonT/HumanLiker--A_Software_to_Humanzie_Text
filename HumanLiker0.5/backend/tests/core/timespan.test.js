import TimeSpanHumanizer from '../../src/core/TimeSpanHumanizer.js';

describe('TimeSpanHumanizer', () => {
  describe('humanize', () => {
    test('returns "0 milliseconds" for zero', () => {
      expect(TimeSpanHumanizer.humanize(0)).toBe('0 milliseconds');
    });

    test('humanizes milliseconds', () => {
      expect(TimeSpanHumanizer.humanize(500)).toBe('500 milliseconds');
    });

    test('humanizes seconds', () => {
      expect(TimeSpanHumanizer.humanize(5000)).toBe('5 seconds');
      expect(TimeSpanHumanizer.humanize(1000)).toBe('1 second');
    });

    test('humanizes minutes', () => {
      expect(TimeSpanHumanizer.humanize(60000)).toBe('1 minute');
      expect(TimeSpanHumanizer.humanize(120000)).toBe('2 minutes');
    });

    test('humanizes hours', () => {
      expect(TimeSpanHumanizer.humanize(3600000)).toBe('1 hour');
      expect(TimeSpanHumanizer.humanize(7200000)).toBe('2 hours');
    });

    test('humanizes days', () => {
      expect(TimeSpanHumanizer.humanize(86400000)).toBe('1 day');
      expect(TimeSpanHumanizer.humanize(172800000)).toBe('2 days');
    });

    test('combines multiple units with default precision', () => {
      const oneHourOneMinute = 60 * 60 * 1000 + 60 * 1000;
      expect(TimeSpanHumanizer.humanize(oneHourOneMinute))
        .toBe('1 hour and 1 minute');
      
      const oneDayTwoHours = 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000;
      expect(TimeSpanHumanizer.humanize(oneDayTwoHours))
        .toBe('1 day and 2 hours');
    });

    test('respects precision parameter', () => {
      const complex = 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 15 * 60 * 1000 + 30 * 1000;
      
      expect(TimeSpanHumanizer.humanize(complex, 1)).toBe('2 days');
      expect(TimeSpanHumanizer.humanize(complex, 2)).toBe('2 days and 3 hours');
      expect(TimeSpanHumanizer.humanize(complex, 3)).toBe('2 days, 3 hours, and 15 minutes');
    });

    test('throws error for negative values', () => {
      expect(() => TimeSpanHumanizer.humanize(-1000)).toThrow(RangeError);
    });

    test('throws error for invalid input', () => {
      expect(() => TimeSpanHumanizer.humanize('abc')).toThrow(TypeError);
      expect(() => TimeSpanHumanizer.humanize(NaN)).toThrow(TypeError);
    });
  });
});
