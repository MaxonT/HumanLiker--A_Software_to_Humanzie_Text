import DateTimeHumanizer from '../../src/core/DateTimeHumanizer.js';

describe('DateTimeHumanizer', () => {
  describe('humanize', () => {
    test('returns "just now" for very recent dates', () => {
      const now = new Date();
      const almostNow = new Date(now.getTime() - 500);
      expect(DateTimeHumanizer.humanize(almostNow, now)).toBe('just now');
    });

    test('returns seconds ago for recent past', () => {
      const now = new Date();
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      expect(DateTimeHumanizer.humanize(fiveSecondsAgo, now)).toBe('5 seconds ago');
    });

    test('returns minutes ago', () => {
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
      expect(DateTimeHumanizer.humanize(twoMinutesAgo, now)).toBe('2 minutes ago');
    });

    test('returns hours ago', () => {
      const now = new Date();
      const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
      expect(DateTimeHumanizer.humanize(threeHoursAgo, now)).toBe('3 hours ago');
    });

    test('returns days ago', () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      expect(DateTimeHumanizer.humanize(twoDaysAgo, now)).toBe('2 days ago');
    });

    test('returns future times', () => {
      const now = new Date();
      const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      expect(DateTimeHumanizer.humanize(inTwoHours, now)).toBe('in 2 hours');
    });

    test('handles string dates', () => {
      const now = new Date('2024-01-15T12:00:00Z');
      const past = '2024-01-15T10:00:00Z';
      expect(DateTimeHumanizer.humanize(past, now)).toBe('2 hours ago');
    });

    test('throws error for invalid dates', () => {
      expect(() => DateTimeHumanizer.humanize('invalid')).toThrow(TypeError);
      expect(() => DateTimeHumanizer.humanize(null)).toThrow(TypeError);
    });
  });
});
