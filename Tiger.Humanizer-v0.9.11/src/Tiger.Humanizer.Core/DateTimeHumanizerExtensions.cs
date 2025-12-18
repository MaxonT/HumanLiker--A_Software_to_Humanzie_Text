
using System;
using System.Globalization;

using Tiger.Humanizer.Configuration;

namespace Tiger.Humanizer
{
    public static class DateTimeHumanizerExtensions
    {
        public static string Humanize(this DateTime input, DateTime? dateToCompareAgainst = null, string? culture = null)
        {
            return Configurator.DateTimeHumanizeStrategy.Humanize(input, dateToCompareAgainst, culture);
        }

        public static string ToAge(this DateTime birthDate, DateTime? referenceDate = null, bool toWords = false, CultureInfo? culture = null)
        {
            var compare = referenceDate ?? DateTime.UtcNow;

            if (compare < birthDate)
            {
                compare = birthDate;
            }

            var years = compare.Year - birthDate.Year;

            if (compare.Month < birthDate.Month || (compare.Month == birthDate.Month && compare.Day < birthDate.Day))
            {
                years--;
            }

            if (years < 0)
            {
                years = 0;
            }

            var resolvedCulture = culture ?? CultureInfo.CurrentCulture;
            var number = toWords ? years.ToWords(resolvedCulture) : years.ToString(resolvedCulture);
            var unit = years == 1 ? "year" : "years";

            return string.Format(resolvedCulture, "{0} {1}", number, unit);
        }


        public static string Humanize(this DateTimeOffset input, DateTimeOffset? dateToCompareAgainst = null, string? culture = null)
        {
            return Configurator.DateTimeOffsetHumanizeStrategy.Humanize(input, dateToCompareAgainst, culture);
        }

        public static string Humanize(this TimeSpan input, string? culture = null)
        {
            return Configurator.TimeSpanHumanizeStrategy.Humanize(input, culture);
        }

        /// <summary>
        /// Converts a <see cref="DateTime"/> to a human readable ordinal date phrase.
        /// Example (en-GB):  1st January 2015
        /// Example (en-US):  January 1st, 2015
        /// </summary>
        public static string ToOrdinalWords(this DateTime date, string? culture = null)
        {
            var cultureInfo = ResolveCulture(culture);

            int day = date.Day;
            string dayOrdinal = day.Ordinalize(culture);

            string monthName = date.ToString("MMMM", cultureInfo);
            string yearText = date.Year.ToString(CultureInfo.InvariantCulture);

            if (IsUsEnglish(cultureInfo))
            {
                // January 1st, 2015
                return $"{monthName} {dayOrdinal}, {yearText}";
            }

            // 1st January 2015
            return $"{dayOrdinal} {monthName} {yearText}";
        }

        /// <summary>
        /// Fluent "clock notation" for <see cref="TimeOnly"/> values such as
        /// "three o'clock", "half past two", "quarter to six", "noon", "midnight".
        /// Currently implemented for English cultures; others fall back to invariant English.
        /// </summary>
        public static string ToClockNotation(this TimeOnly time, string? culture = null)
        {
            var cultureInfo = ResolveCulture(culture);

            int hour = time.Hour;
            int minute = time.Minute;

            if (hour == 12 && minute == 0)
            {
                return "noon";
            }

            if ((hour == 0 || hour == 24) && minute == 0)
            {
                return "midnight";
            }

            int hour12 = hour % 12;
            if (hour12 == 0)
            {
                hour12 = 12;
            }

            string hourWords = hour12.ToWords(culture);

            if (minute == 0)
            {
                return $"{hourWords} o'clock";
            }

            if (minute == 15)
            {
                return $"quarter past {hourWords}";
            }

            if (minute == 30)
            {
                return $"half past {hourWords}";
            }

            if (minute == 45)
            {
                int nextHour12 = (hour + 1) % 12;
                if (nextHour12 == 0)
                {
                    nextHour12 = 12;
                }

                string nextHourWords = nextHour12.ToWords(culture);
                return $"quarter to {nextHourWords}";
            }

            if (minute < 30)
            {
                string minuteWords = minute.ToWords(culture);
                string minuteUnit = minute == 1 ? "minute" : "minutes";
                return $"{minuteWords} {minuteUnit} past {hourWords}";
            }
            else
            {
                int toNext = 60 - minute;
                string minuteWords = toNext.ToWords(culture);
                string minuteUnit = toNext == 1 ? "minute" : "minutes";

                int nextHour12 = (hour + 1) % 12;
                if (nextHour12 == 0)
                {
                    nextHour12 = 12;
                }

                string nextHourWords = nextHour12.ToWords(culture);
                return $"{minuteWords} {minuteUnit} to {nextHourWords}";
            }
        }

        private static CultureInfo ResolveCulture(string? culture)
        {
            if (string.IsNullOrWhiteSpace(culture))
            {
                return CultureInfo.InvariantCulture;
            }

            try
            {
                return new CultureInfo(culture);
            }
            catch (CultureNotFoundException)
            {
                return CultureInfo.InvariantCulture;
            }
        }

        private static bool IsUsEnglish(CultureInfo cultureInfo)
        {
            // en-US plus variants should use "January 1st, 2015" order.
            return string.Equals(cultureInfo.Name, "en-US", StringComparison.OrdinalIgnoreCase) ||
                   string.Equals(cultureInfo.TwoLetterISOLanguageName, "en", StringComparison.OrdinalIgnoreCase) &&
                   cultureInfo.Name.EndsWith("US", StringComparison.OrdinalIgnoreCase);
        }
    }
}
