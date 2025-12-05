/**
 * ByteSize - Humanize byte sizes
 * 
 * Examples:
 * - 1024 → 1 KB
 * - 1048576 → 1 MB
 * - 1073741824 → 1 GB
 */

class ByteSize {
  static units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];

  /**
   * Humanize a byte size
   * @param {number} bytes - The number of bytes
   * @param {number} decimals - Number of decimal places (default: 2)
   * @returns {string} - The humanized byte size
   */
  static humanize(bytes, decimals = 2) {
    if (bytes === undefined || bytes === null || isNaN(bytes)) {
      return '';
    }

    if (bytes === 0) {
      return '0 B';
    }

    const absBytes = Math.abs(bytes);
    const unitIndex = Math.floor(Math.log(absBytes) / Math.log(1024));
    const value = absBytes / Math.pow(1024, unitIndex);
    const formattedValue = value.toFixed(decimals);
    const unit = this.units[Math.min(unitIndex, this.units.length - 1)];

    return `${bytes < 0 ? '-' : ''}${formattedValue} ${unit}`;
  }

  /**
   * Parse a humanized byte size back to bytes
   * @param {string} str - The byte size string (e.g., "1.5 MB")
   * @returns {number} - The number of bytes
   */
  static parse(str) {
    if (!str || typeof str !== 'string') {
      return 0;
    }

    const match = str.trim().match(/^(-?\d+(?:\.\d+)?)\s*([A-Z]+)$/i);
    if (!match) {
      return parseInt(str) || 0;
    }

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    const unitIndex = this.units.indexOf(unit);

    if (unitIndex === -1) {
      return 0;
    }

    return Math.round(value * Math.pow(1024, unitIndex));
  }
}

module.exports = ByteSize;
