import ByteSize from '../../src/core/ByteSize.js';

describe('ByteSize', () => {
  describe('constructor', () => {
    test('creates ByteSize from bytes', () => {
      const bs = new ByteSize(1024);
      expect(bs.bytes).toBe(1024);
    });

    test('throws error for negative bytes', () => {
      expect(() => new ByteSize(-1)).toThrow(TypeError);
    });

    test('throws error for non-number', () => {
      expect(() => new ByteSize('abc')).toThrow(TypeError);
    });
  });

  describe('static factory methods', () => {
    test('fromBytes', () => {
      const bs = ByteSize.fromBytes(1024);
      expect(bs.bytes).toBe(1024);
    });

    test('fromKilobytes', () => {
      const bs = ByteSize.fromKilobytes(1);
      expect(bs.bytes).toBe(1024);
    });

    test('fromMegabytes', () => {
      const bs = ByteSize.fromMegabytes(1);
      expect(bs.bytes).toBe(1024 * 1024);
    });

    test('fromGigabytes', () => {
      const bs = ByteSize.fromGigabytes(1);
      expect(bs.bytes).toBe(1024 * 1024 * 1024);
    });
  });

  describe('getters', () => {
    test('kilobytes getter', () => {
      const bs = new ByteSize(2048);
      expect(bs.kilobytes).toBe(2);
    });

    test('megabytes getter', () => {
      const bs = new ByteSize(1024 * 1024 * 5);
      expect(bs.megabytes).toBe(5);
    });
  });

  describe('humanize', () => {
    test('humanizes bytes', () => {
      const bs = new ByteSize(500);
      expect(bs.humanize()).toBe('500 B');
    });

    test('humanizes kilobytes', () => {
      const bs = new ByteSize(1024);
      expect(bs.humanize()).toBe('1.00 KB');
    });

    test('humanizes megabytes', () => {
      const bs = new ByteSize(1024 * 1024 * 1.5);
      expect(bs.humanize()).toBe('1.50 MB');
    });

    test('humanizes gigabytes', () => {
      const bs = new ByteSize(1024 * 1024 * 1024 * 2.5);
      expect(bs.humanize()).toBe('2.50 GB');
    });

    test('respects precision', () => {
      const bs = new ByteSize(1024 * 1.567);
      expect(bs.humanize(1)).toBe('1.6 KB');
      expect(bs.humanize(3)).toBe('1.567 KB');
    });
  });
});
