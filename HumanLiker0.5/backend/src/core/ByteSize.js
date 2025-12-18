/**
 * ByteSize - Represent and humanize byte sizes
 * Example: 1024 bytes -> "1 KB"
 */

class ByteSize {
  /**
   * Create a ByteSize instance
   * @param {number} bytes - Number of bytes
   */
  constructor(bytes) {
    if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
      throw new TypeError('Bytes must be a non-negative number');
    }
    this.bytes = Math.floor(bytes);
  }

  /**
   * Create ByteSize from bytes
   * @param {number} bytes - Number of bytes
   * @returns {ByteSize} ByteSize instance
   */
  static fromBytes(bytes) {
    return new ByteSize(bytes);
  }

  /**
   * Create ByteSize from kilobytes
   * @param {number} kilobytes - Number of kilobytes
   * @returns {ByteSize} ByteSize instance
   */
  static fromKilobytes(kilobytes) {
    return new ByteSize(kilobytes * 1024);
  }

  /**
   * Create ByteSize from megabytes
   * @param {number} megabytes - Number of megabytes
   * @returns {ByteSize} ByteSize instance
   */
  static fromMegabytes(megabytes) {
    return new ByteSize(megabytes * 1024 * 1024);
  }

  /**
   * Create ByteSize from gigabytes
   * @param {number} gigabytes - Number of gigabytes
   * @returns {ByteSize} ByteSize instance
   */
  static fromGigabytes(gigabytes) {
    return new ByteSize(gigabytes * 1024 * 1024 * 1024);
  }

  /**
   * Create ByteSize from terabytes
   * @param {number} terabytes - Number of terabytes
   * @returns {ByteSize} ByteSize instance
   */
  static fromTerabytes(terabytes) {
    return new ByteSize(terabytes * 1024 * 1024 * 1024 * 1024);
  }

  /**
   * Get kilobytes
   * @returns {number} Size in kilobytes
   */
  get kilobytes() {
    return this.bytes / 1024;
  }

  /**
   * Get megabytes
   * @returns {number} Size in megabytes
   */
  get megabytes() {
    return this.bytes / (1024 * 1024);
  }

  /**
   * Get gigabytes
   * @returns {number} Size in gigabytes
   */
  get gigabytes() {
    return this.bytes / (1024 * 1024 * 1024);
  }

  /**
   * Get terabytes
   * @returns {number} Size in terabytes
   */
  get terabytes() {
    return this.bytes / (1024 * 1024 * 1024 * 1024);
  }

  /**
   * Humanize the byte size
   * @param {number} [precision=2] - Number of decimal places
   * @returns {string} Human-readable size (e.g., "1.5 MB")
   */
  humanize(precision = 2) {
    if (typeof precision !== 'number' || precision < 0) {
      precision = 2;
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let size = this.bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    const formatted = unitIndex === 0 ? size.toString() : size.toFixed(precision);
    return `${formatted} ${units[unitIndex]}`;
  }

  /**
   * Convert to string
   * @returns {string} String representation
   */
  toString() {
    return this.humanize();
  }

  /**
   * Convert to JSON
   * @returns {object} JSON representation
   */
  toJSON() {
    return {
      bytes: this.bytes,
      humanized: this.humanize()
    };
  }
}

export default ByteSize;
