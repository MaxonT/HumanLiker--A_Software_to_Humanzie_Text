/**
 * HeadingConverter - convert between headings (degrees) and compass directions
 */
class HeadingConverter {
  static compassPoints = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

  /**
   * Convert degrees to the nearest compass direction
   */
  static toCompass(degrees) {
    if (degrees === undefined || degrees === null || isNaN(degrees)) return '';
    const normalized = ((Number(degrees) % 360) + 360) % 360;
    const index = Math.round(normalized / 22.5) % this.compassPoints.length;
    return this.compassPoints[index];
  }

  /**
   * Convert a compass direction back to degrees (center of the sector)
   */
  static fromCompass(direction) {
    if (!direction || typeof direction !== 'string') return NaN;
    const upper = direction.toUpperCase();
    const index = this.compassPoints.indexOf(upper);
    if (index === -1) return NaN;
    return index * 22.5;
  }
}

module.exports = HeadingConverter;
