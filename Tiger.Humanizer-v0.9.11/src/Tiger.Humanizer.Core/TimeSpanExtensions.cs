using System;
using System.Collections.Generic;
using System.Globalization;
using Tiger.Humanizer.Configuration;

namespace Tiger.Humanizer
{
    public static class TimeSpanExtensions
    {
        public static string Humanize(this TimeSpan input, CultureInfo? culture = null)
        {
            return Configurator.TimeSpanHumanizeStrategy.Humanize(input, culture?.Name);
        }

        public static string Humanize(this TimeSpan input, int precision)
        {
            return Humanize(input, precision, toWords: false);
        }

        public static string Humanize(this TimeSpan input, int precision, bool toWords)
        {
            return Humanize(
                input,
                precision,
                toWords,
                useAnd: false,
                collectionSeparator: ", ",
                culture: CultureInfo.CurrentCulture,
                minUnit: TimeUnit.Millisecond,
                maxUnit: TimeUnit.Year);
        }

        public static string Humanize(
            this TimeSpan input,
            int precision,
            bool toWords,
            bool useAnd,
            string? collectionSeparator,
            CultureInfo? culture,
            TimeUnit minUnit,
            TimeUnit maxUnit)
        {
            if (precision < 1)
            {
                precision = 1;
            }

            if (collectionSeparator == null)
            {
                collectionSeparator = ", ";
            }

            var resolvedCulture = culture ?? CultureInfo.CurrentCulture;

            return HumanizeDuration(
                input,
                precision,
                toWords,
                useAnd,
                collectionSeparator,
                resolvedCulture,
                minUnit,
                maxUnit);
        }

        private static string HumanizeDuration(
            TimeSpan input,
            int precision,
            bool toWords,
            bool useAnd,
            string collectionSeparator,
            CultureInfo culture,
            TimeUnit minUnit,
            TimeUnit maxUnit)
        {
            var duration = input.Duration();

            if (duration == TimeSpan.Zero)
            {
                return FormatZero(toWords, culture);
            }

            var unitOrder = new[]
            {
                TimeUnit.Year,
                TimeUnit.Month,
                TimeUnit.Week,
                TimeUnit.Day,
                TimeUnit.Hour,
                TimeUnit.Minute,
                TimeUnit.Second,
                TimeUnit.Millisecond
            };

            var maxIndex = Array.IndexOf(unitOrder, maxUnit);
            var minIndex = Array.IndexOf(unitOrder, minUnit);

            if (maxIndex < 0)
            {
                maxIndex = 0;
            }

            if (minIndex < 0)
            {
                minIndex = unitOrder.Length - 1;
            }

            if (maxIndex > minIndex)
            {
                var tmp = maxIndex;
                maxIndex = minIndex;
                minIndex = tmp;
            }

            var remainingSeconds = duration.TotalSeconds;

            var unitValues = new Dictionary<TimeUnit, long>();

            long years = 0;
            long months = 0;
            long weeks = 0;
            long days = 0;
            long hours = 0;
            long minutes = 0;
            long seconds = 0;
            long milliseconds = 0;

            if (remainingSeconds >= 365 * 24 * 3600)
            {
                years = (long)(remainingSeconds / (365 * 24 * 3600));
                remainingSeconds -= years * 365 * 24 * 3600;
            }

            if (remainingSeconds >= 30 * 24 * 3600)
            {
                months = (long)(remainingSeconds / (30 * 24 * 3600));
                remainingSeconds -= months * 30 * 24 * 3600;
            }

            if (remainingSeconds >= 7 * 24 * 3600)
            {
                weeks = (long)(remainingSeconds / (7 * 24 * 3600));
                remainingSeconds -= weeks * 7 * 24 * 3600;
            }

            if (remainingSeconds >= 24 * 3600)
            {
                days = (long)(remainingSeconds / (24 * 3600));
                remainingSeconds -= days * 24 * 3600;
            }

            if (remainingSeconds >= 3600)
            {
                hours = (long)(remainingSeconds / 3600);
                remainingSeconds -= hours * 3600;
            }

            if (remainingSeconds >= 60)
            {
                minutes = (long)(remainingSeconds / 60);
                remainingSeconds -= minutes * 60;
            }

            if (remainingSeconds >= 1)
            {
                seconds = (long)remainingSeconds;
                remainingSeconds -= seconds;
            }

            var usedDaysForLargerUnits = (int)(years * 365 + months * 30 + weeks * 7 + days);
            var usedSecondsForSmallerUnits = (int)(hours * 3600 + minutes * 60 + seconds);

            var reconstructed = new TimeSpan(usedDaysForLargerUnits, 0, 0, usedSecondsForSmallerUnits);
            var remainingMilliseconds = duration - reconstructed;

            if (remainingMilliseconds.TotalMilliseconds >= 1)
            {
                milliseconds = (long)Math.Round(remainingMilliseconds.TotalMilliseconds);
            }

            unitValues[TimeUnit.Year] = years;
            unitValues[TimeUnit.Month] = months;
            unitValues[TimeUnit.Week] = weeks;
            unitValues[TimeUnit.Day] = days;
            unitValues[TimeUnit.Hour] = hours;
            unitValues[TimeUnit.Minute] = minutes;
            unitValues[TimeUnit.Second] = seconds;
            unitValues[TimeUnit.Millisecond] = milliseconds;

            var parts = new List<string>();

            for (var i = maxIndex; i <= minIndex; i++)
            {
                var unit = unitOrder[i];
                var value = unitValues[unit];

                if (value <= 0)
                {
                    continue;
                }

                parts.Add(FormatPart(value, unit, toWords, culture));

                if (parts.Count == precision)
                {
                    break;
                }
            }

            if (parts.Count == 0)
            {
                return FormatZero(toWords, culture);
            }

            return JoinParts(parts, collectionSeparator, useAnd);
        }

        private static string FormatZero(bool toWords, CultureInfo culture)
        {
            const int zero = 0;
            string number = toWords ? zero.ToWords(culture) : zero.ToString(culture);
            return $"{number} seconds";
        }

        private static string FormatPart(long value, TimeUnit unit, bool toWords, CultureInfo culture)
        {
            string number = toWords
                ? ((int)value).ToWords(culture)
                : value.ToString(culture);

            string unitName = GetUnitName(unit, value);

            return $"{number} {unitName}";
        }

        private static string GetUnitName(TimeUnit unit, long value)
        {
            bool isPlural = value != 1;

            switch (unit)
            {
                case TimeUnit.Year:
                    return isPlural ? "years" : "year";
                case TimeUnit.Month:
                    return isPlural ? "months" : "month";
                case TimeUnit.Week:
                    return isPlural ? "weeks" : "week";
                case TimeUnit.Day:
                    return isPlural ? "days" : "day";
                case TimeUnit.Hour:
                    return isPlural ? "hours" : "hour";
                case TimeUnit.Minute:
                    return isPlural ? "minutes" : "minute";
                case TimeUnit.Second:
                    return isPlural ? "seconds" : "second";
                case TimeUnit.Millisecond:
                    return isPlural ? "milliseconds" : "millisecond";
                default:
                    return isPlural ? "seconds" : "second";
            }
        }

        private static string JoinParts(IReadOnlyList<string> parts, string collectionSeparator, bool useAnd)
        {
            if (parts.Count == 1)
            {
                return parts[0];
            }

            if (!useAnd)
            {
                return string.Join(collectionSeparator, parts);
            }

            if (parts.Count == 2)
            {
                return $"{parts[0]} and {parts[1]}";
            }

            var result = new System.Text.StringBuilder();

            for (var i = 0; i < parts.Count; i++)
            {
                if (i > 0)
                {
                    if (i == parts.Count - 1)
                    {
                        result.Append(" and ");
                    }
                    else
                    {
                        result.Append(collectionSeparator);
                    }
                }

                result.Append(parts[i]);
            }

            return result.ToString();
        }
    }
}
