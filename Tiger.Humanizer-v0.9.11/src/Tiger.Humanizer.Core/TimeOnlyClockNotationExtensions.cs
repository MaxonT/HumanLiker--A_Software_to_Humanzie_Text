using System;
using System.Globalization;

namespace Tiger.Humanizer
{
    /// <summary>
    /// Extensions for humanizing <see cref="TimeOnly"/> into clock-notation phrases.
    /// </summary>
    public static class TimeOnlyClockNotationExtensions
    {
        /// <summary>
        /// Converts a <see cref="TimeOnly"/> into a human-friendly clock phrase such as
        /// "three o'clock", "half past two", "quarter to five", or "noon".
        /// Currently supports English; other cultures fall back to English while keeping
        /// the <paramref name="culture"/> parameter for future extension.
        /// </summary>
        public static string ToClockNotation(this TimeOnly time, CultureInfo? culture = null)
        {
            culture ??= CultureContext.CurrentCulture;

            // For now we only implement English-style phrases and fall back for non-English cultures.
            if (!string.Equals(culture.TwoLetterISOLanguageName, "en", StringComparison.OrdinalIgnoreCase))
            {
                culture = CultureInfo.GetCultureInfo("en-US");
            }

            var hour = time.Hour;
            var minute = time.Minute;

            // Special cases: midnight / noon
            if (hour == 0 && minute == 0)
            {
                return "midnight";
            }

            if (hour == 12 && minute == 0)
            {
                return "noon";
            }

            // Convert to 12-hour clock
            var hourOnClock = hour % 12;
            if (hourOnClock == 0)
            {
                hourOnClock = 12;
            }

            string HourToWords(int h) => h.NumberToWords(culture);
            string MinuteToWords(int m) => m.NumberToWords(culture);

            // Exact hour: "three o'clock"
            if (minute == 0)
            {
                return $"{HourToWords(hourOnClock)} o'clock";
            }

            // Common conversational phrases
            if (minute == 15)
            {
                return $"quarter past {HourToWords(hourOnClock)}";
            }

            if (minute == 30)
            {
                return $"half past {HourToWords(hourOnClock)}";
            }

            if (minute == 45)
            {
                var nextHour = ((hourOnClock) % 12) + 1;
                return $"quarter to {HourToWords(nextHour)}";
            }

            // Before half past: "<n> past <hour>"
            if (minute < 30)
            {
                return $"{MinuteToWords(minute)} past {HourToWords(hourOnClock)}";
            }

            // After half past: "<n> to <nextHour>"
            var minutesToNext = 60 - minute;
            var nextHourOnClock = ((hourOnClock) % 12) + 1;
            return $"{MinuteToWords(minutesToNext)} to {HourToWords(nextHourOnClock)}";
        }
    }
}
