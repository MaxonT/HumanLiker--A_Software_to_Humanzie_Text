using System;
using System.Collections.Generic;
using System.Globalization;

namespace Tiger.Humanizer.Configuration
{
    public interface IDateTimeHumanizeStrategy
    {
        string Humanize(DateTime input, DateTime? dateToCompareAgainst = null, string? culture = null);
    }

    public interface IDateTimeOffsetHumanizeStrategy
    {
        string Humanize(DateTimeOffset input, DateTimeOffset? dateToCompareAgainst = null, string? culture = null);
    }

    public interface ITimeSpanHumanizeStrategy
    {
        string Humanize(TimeSpan input, string? culture = null);
    }

    public interface ICollectionFormatter
    {
        string Humanize<T>(
            IEnumerable<T?> collection,
            Func<T, string>? formatter = null,
            string? separator = null,
            string? lastSeparator = null);
    }

    public interface INumberToWordsConverter
    {
        string ToWords(long number, string? culture = null);
        string ToOrdinalWords(long number, string? culture = null);
    }

    public interface IVocabulary
    {
        string Pluralize(string word);
        string Singularize(string word);
        bool IsUncountable(string word);

        void AddIrregular(string singular, string plural);
        void AddUncountable(string word);
        void AddPlural(string pattern, string replacement);
        void AddSingular(string pattern, string replacement);
    }

    internal sealed class DefaultDateTimeHumanizeStrategy : IDateTimeHumanizeStrategy
    {
        public string Humanize(DateTime input, DateTime? dateToCompareAgainst = null, string? culture = null)
        {
            var compareTo = dateToCompareAgainst ?? DateTime.UtcNow;

            if (input.Kind == DateTimeKind.Unspecified)
            {
                input = DateTime.SpecifyKind(input, DateTimeKind.Utc);
            }

            if (compareTo.Kind == DateTimeKind.Unspecified)
            {
                compareTo = DateTime.SpecifyKind(compareTo, DateTimeKind.Utc);
            }

            var span = input - compareTo;
            return HumanizeTimeSpan(span, isDateTime: true);
        }

        internal static string HumanizeTimeSpan(TimeSpan span, bool isDateTime)
        {
            var isFuture = span.TotalSeconds > 0;
            var delta = span.Duration();

            if (isDateTime && delta.TotalSeconds < 1)
            {
                return EnglishRelativeTimeText.Now;
            }

            double seconds = delta.TotalSeconds;
            double minutes = delta.TotalMinutes;
            double hours = delta.TotalHours;
            double days = delta.TotalDays;

            if (days >= 2 * 365)
            {
                int years = (int)Math.Round(days / 365.0);
                return FormatUnit(years, "year", isDateTime, isFuture);
            }

            if (days >= 365)
            {
                int years = 1;
                return FormatUnit(years, "year", isDateTime, isFuture);
            }

            if (days >= 60)
            {
                int months = (int)Math.Round(days / 30.0);
                return FormatUnit(months, "month", isDateTime, isFuture);
            }

            if (days >= 30)
            {
                int months = 1;
                return FormatUnit(months, "month", isDateTime, isFuture);
            }

            if (isDateTime && Math.Abs(days - 1.0) < 0.01)
            {
                return isFuture ? EnglishRelativeTimeText.Tomorrow : EnglishRelativeTimeText.Yesterday;
            }

            if (days >= 7)
            {
                int weeks = (int)Math.Round(days / 7.0);
                return FormatUnit(weeks, "week", isDateTime, isFuture);
            }

            if (days >= 1)
            {
                int wholeDays = (int)Math.Round(days);
                return FormatUnit(wholeDays, "day", isDateTime, isFuture);
            }

            if (hours >= 1)
            {
                int wholeHours = (int)Math.Round(hours);
                return FormatUnit(wholeHours, "hour", isDateTime, isFuture);
            }

            if (minutes >= 1)
            {
                int wholeMinutes = (int)Math.Round(minutes);
                return FormatUnit(wholeMinutes, "minute", isDateTime, isFuture);
            }

            if (seconds < 45)
            {
                int wholeSeconds = (int)Math.Round(seconds);
                if (isDateTime)
                {
                    return EnglishRelativeTimeText.FormatSecondsForDateTime(wholeSeconds, isFuture);
                }

                return EnglishRelativeTimeText.FormatSeconds(wholeSeconds);
            }

            if (isDateTime)
            {
                return EnglishRelativeTimeText.FormatSingleMinute(isFuture, isDateTime);
            }

            return "1 minute";
        }

        private static string FormatUnit(int value, string unit, bool isDateTime, bool isFuture)
        {
            return EnglishRelativeTimeText.FormatUnit(value, unit, isDateTime, isFuture);
        }

    }

    internal sealed class DefaultDateTimeOffsetHumanizeStrategy : IDateTimeOffsetHumanizeStrategy
    {
        public string Humanize(DateTimeOffset input, DateTimeOffset? dateToCompareAgainst = null, string? culture = null)
        {
            var compareTo = dateToCompareAgainst ?? DateTimeOffset.UtcNow;
            var span = input - compareTo;
            return DefaultDateTimeHumanizeStrategy.HumanizeTimeSpan(span, isDateTime: true);
        }
    }

    internal sealed class DefaultTimeSpanHumanizeStrategy : ITimeSpanHumanizeStrategy
    {
        public string Humanize(TimeSpan input, string? culture = null)
        {
            var delta = input.Duration();

            if (delta.TotalMilliseconds < 1)
            {
                return EnglishTimeSpanText.ZeroMilliseconds;
            }

            double totalSeconds = delta.TotalSeconds;
            double totalMinutes = delta.TotalMinutes;
            double totalHours = delta.TotalHours;
            double totalDays = delta.TotalDays;

            if (totalSeconds < 1)
            {
                int ms = (int)Math.Round(delta.TotalMilliseconds);
                return ms == 1 ? "1 millisecond" : $"{ms} milliseconds";
            }

            if (totalMinutes < 1)
            {
                int seconds = (int)Math.Round(totalSeconds);
                return seconds == 1 ? "1 second" : $"{seconds} seconds";
            }

            if (totalHours < 1)
            {
                int minutes = (int)Math.Round(totalMinutes);
                return minutes == 1 ? "1 minute" : $"{minutes} minutes";
            }

            if (totalDays < 1)
            {
                int hours = (int)Math.Round(totalHours);
                return hours == 1 ? "1 hour" : $"{hours} hours";
            }

            if (totalDays < 7)
            {
                int days = (int)Math.Round(totalDays);
                return days == 1 ? "1 day" : $"{days} days";
            }

            if (totalDays < 30)
            {
                int weeks = (int)Math.Round(totalDays / 7.0);
                return weeks == 1 ? "1 week" : $"{weeks} weeks";
            }

            if (totalDays < 365)
            {
                int months = (int)Math.Round(totalDays / 30.0);
                return months == 1 ? "1 month" : $"{months} months";
            }

            int years = (int)Math.Round(totalDays / 365.0);
            return years == 1 ? "1 year" : $"{years} years";
        }
    }

    internal sealed class DefaultCollectionFormatter : ICollectionFormatter
    {
        public string Humanize<T>(
            IEnumerable<T?> collection,
            Func<T, string>? formatter = null,
            string? separator = null,
            string? lastSeparator = null)
        {
            separator ??= ", ";
            lastSeparator ??= " and ";

            var items = new List<string>();

            foreach (var item in collection)
            {
                if (item == null)
                {
                    continue;
                }

                if (formatter != null)
                {
                    items.Add(formatter(item));
                }
                else
                {
                    var text = item.ToString();
                    if (!string.IsNullOrWhiteSpace(text))
                    {
                        items.Add(text);
                    }
                }
            }

            if (items.Count == 0)
            {
                return string.Empty;
            }

            if (items.Count == 1)
            {
                return items[0];
            }

            if (items.Count == 2)
            {
                return string.Join(lastSeparator, items);
            }

            var allButLast = items.GetRange(0, items.Count - 1);
            var last = items[items.Count - 1];
            return string.Join(separator, allButLast) + lastSeparator + last;
        }
    }

    internal sealed class DefaultNumberToWordsConverter : INumberToWordsConverter
    {
        private static readonly string[] UnitsMap = new[]
        {
            "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
            "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
            "seventeen", "eighteen", "nineteen"
        };

        private static readonly string[] TensMap = new[]
        {
            "zero", "ten", "twenty", "thirty", "forty", "fifty",
            "sixty", "seventy", "eighty", "ninety"
        };

        public string ToWords(long number, string? culture = null)
        {
            // Only English for now; ignore culture parameter.
            if (number == 0)
            {
                return "zero";
            }

            if (number < 0)
            {
                return "minus " + Convert(-number);
            }

            return Convert(number).Trim();
        }

        public string ToOrdinalWords(long number, string? culture = null)
        {
            // Basic English ordinal words
            if (number == 0)
            {
                return "zeroth";
            }

            var positive = Math.Abs(number);
            var words = ToWords(positive);
            var tokens = words.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

            if (tokens.Length == 0)
            {
                return words;
            }

            var last = tokens[^1];
            var ordinalLast = ToOrdinalWord(last);

            tokens[^1] = ordinalLast;
            var result = string.Join(" ", tokens);

            if (number < 0)
            {
                result = "minus " + result;
            }

            return result;
        }

        private static string Convert(long number)
        {
            if (number == 0)
            {
                return string.Empty;
            }

            if (number < 0)
            {
                return "minus " + Convert(-number);
            }

            if (number < 20)
            {
                return UnitsMap[number];
            }

            if (number < 100)
            {
                var tens = TensMap[number / 10];
                var remainder = number % 10;

                if (remainder == 0)
                {
                    return tens;
                }

                return tens + "-" + UnitsMap[remainder];
            }

            if (number < 1000)
            {
                var hundreds = UnitsMap[number / 100] + " hundred";
                var remainder = number % 100;

                if (remainder == 0)
                {
                    return hundreds;
                }

                return hundreds + " and " + Convert(remainder);
            }

            if (number < 1_000_000)
            {
                var thousands = Convert(number / 1000) + " thousand";
                var remainder = number % 1000;

                if (remainder == 0)
                {
                    return thousands;
                }

                if (remainder < 100)
                {
                    return thousands + " and " + Convert(remainder);
                }

                return thousands + " " + Convert(remainder);
            }

            if (number < 1_000_000_000)
            {
                var millions = Convert(number / 1_000_000) + " million";
                var remainder = number % 1_000_000;

                if (remainder == 0)
                {
                    return millions;
                }

                if (remainder < 100)
                {
                    return millions + " and " + Convert(remainder);
                }

                return millions + " " + Convert(remainder);
            }

            if (number < 1_000_000_000_000)
            {
                var billions = Convert(number / 1_000_000_000) + " billion";
                var remainder = number % 1_000_000_000;

                if (remainder == 0)
                {
                    return billions;
                }

                if (remainder < 100)
                {
                    return billions + " and " + Convert(remainder);
                }

                return billions + " " + Convert(remainder);
            }

            // Fallback, not intended for extremely large numbers
            return number.ToString(System.Globalization.CultureInfo.InvariantCulture);
        }

        private static string ToOrdinalWord(string word)
        {
            // Handle special cases
            return word switch
            {
                "one" => "first",
                "two" => "second",
                "three" => "third",
                "five" => "fifth",
                "eight" => "eighth",
                "nine" => "ninth",
                "twelve" => "twelfth",
                _ => BuildRegularOrdinal(word)
            };
        }

        private static string BuildRegularOrdinal(string word)
        {
            if (string.IsNullOrEmpty(word))
            {
                return word;
            }

            if (word.EndsWith("y", StringComparison.Ordinal))
            {
                return word.Substring(0, word.Length - 1) + "ieth";
            }

            if (word.EndsWith("e", StringComparison.Ordinal))
            {
                return word + "th";
            }

            // Default: just append "th"
            return word + "th";
        }
    }

    }

    internal sealed class DefaultVocabulary : IVocabulary
    {
        private readonly HashSet<string> _uncountables = new(StringComparer.OrdinalIgnoreCase)
        {
            "equipment",
            "information",
            "rice",
            "money",
            "species",
            "series",
            "fish",
            "sheep"
        };

        private readonly Dictionary<string, string> _irregularPlurals = new(StringComparer.OrdinalIgnoreCase)
        {
            { "man", "men" },
            { "woman", "women" },
            { "child", "children" },
            { "person", "people" },
            { "mouse", "mice" },
            { "goose", "geese" },
            { "tooth", "teeth" },
            { "foot", "feet" },
            { "ox", "oxen" }
        };

        private readonly Dictionary<string, string> _irregularSingulars;
        private readonly List<(string pattern, string replacement)> _pluralRules = new();
        private readonly List<(string pattern, string replacement)> _singularRules = new();

        public DefaultVocabulary()
        {
            _irregularSingulars = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            foreach (var kvp in _irregularPlurals)
            {
                _irregularSingulars[kvp.Value] = kvp.Key;
            }

            // Pluralization rules (very small subset, good enough for a first version)
            AddPlural("(.*)fe$", "$1ves");
            AddPlural("(.*)f$", "$1ves");
            AddPlural("(.*[sxz])$", "$1es");
            AddPlural("(.*(sh|ch))$", "$1es");
            AddPlural("([^aeiou])y$", "$1ies");
            AddPlural("$", "s");

            // Singularization rules (reverse of above)
            AddSingular("(.*)ves$", "$1f");
            AddSingular("(.*[sxz])es$", "$1");
            AddSingular("(.*(sh|ch))es$", "$1");
            AddSingular("([^aeiou])ies$", "$1y");
            AddSingular("s$", "");
        }

        public string Pluralize(string word)
        {
            if (string.IsNullOrWhiteSpace(word))
            {
                return word;
            }

            if (IsUncountable(word))
            {
                return word;
            }

            if (_irregularPlurals.TryGetValue(word, out var irregularPlural))
            {
                return MatchCasing(irregularPlural, word);
            }

            foreach (var (pattern, replacement) in _pluralRules)
            {
                var result = System.Text.RegularExpressions.Regex.Replace(
                    word,
                    pattern,
                    replacement,
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                if (!string.Equals(result, word, StringComparison.OrdinalIgnoreCase))
                {
                    return MatchCasing(result, word);
                }
            }

            return word;
        }

        public string Singularize(string word)
        {
            if (string.IsNullOrWhiteSpace(word))
            {
                return word;
            }

            if (IsUncountable(word))
            {
                return word;
            }

            if (_irregularSingulars.TryGetValue(word, out var irregularSingular))
            {
                return MatchCasing(irregularSingular, word);
            }

            foreach (var (pattern, replacement) in _singularRules)
            {
                var result = System.Text.RegularExpressions.Regex.Replace(
                    word,
                    pattern,
                    replacement,
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                if (!string.Equals(result, word, StringComparison.OrdinalIgnoreCase))
                {
                    return MatchCasing(result, word);
                }
            }

            return word;
        }

        public bool IsUncountable(string word)
        {
            return _uncountables.Contains(word);
        }

        public void AddIrregular(string singular, string plural)
        {
            if (string.IsNullOrWhiteSpace(singular) || string.IsNullOrWhiteSpace(plural))
            {
                return;
            }

            _irregularPlurals[singular] = plural;
            _irregularSingulars[plural] = singular;
        }

        public void AddUncountable(string word)
        {
            if (string.IsNullOrWhiteSpace(word))
            {
                return;
            }

            _uncountables.Add(word);
        }

        public void AddPlural(string pattern, string replacement)
        {
            if (string.IsNullOrWhiteSpace(pattern))
            {
                return;
            }

            _pluralRules.Insert(0, (pattern, replacement));
        }

        public void AddSingular(string pattern, string replacement)
        {
            if (string.IsNullOrWhiteSpace(pattern))
            {
                return;
            }

            _singularRules.Insert(0, (pattern, replacement));
        }

        private static string MatchCasing(string result, string original)
        {
            if (string.IsNullOrEmpty(result) || string.IsNullOrEmpty(original))
            {
                return result;
            }

            if (IsAllUpper(original))
            {
                return result.ToUpperInvariant();
            }

            if (IsFirstUpper(original))
            {
                if (result.Length == 1)
                {
                    return result.ToUpperInvariant();
                }

                return char.ToUpperInvariant(result[0]) + result.Substring(1).ToLowerInvariant();
            }

            return result.ToLowerInvariant();
        }

        private static bool IsAllUpper(string input)
        {
            foreach (var c in input)
            {
                if (char.IsLetter(c) && !char.IsUpper(c))
                {
                    return false;
                }
            }

            return true;
        }

        private static bool IsFirstUpper(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return false;
            }

            if (!char.IsLetter(input[0]) || !char.IsUpper(input[0]))
            {
                return false;
            }

            for (int i = 1; i < input.Length; i++)
            {
                if (char.IsLetter(input[i]) && !char.IsLower(input[i]))
                {
                    return false;
                }
            }

            return true;
        }
    }

    public static class Configurator
    {
        private static IDateTimeHumanizeStrategy _dateTimeHumanizeStrategy = new DefaultDateTimeHumanizeStrategy();
        private static IDateTimeOffsetHumanizeStrategy _dateTimeOffsetHumanizeStrategy = new DefaultDateTimeOffsetHumanizeStrategy();
        private static ITimeSpanHumanizeStrategy _timeSpanHumanizeStrategy = new DefaultTimeSpanHumanizeStrategy();
        private static ICollectionFormatter _collectionFormatter = new DefaultCollectionFormatter();
        private static INumberToWordsConverter _numberToWordsConverter = new DefaultNumberToWordsConverter();
        private static IVocabulary _vocabulary = new DefaultVocabulary();

        public static IDateTimeHumanizeStrategy DateTimeHumanizeStrategy
        {
            get => _dateTimeHumanizeStrategy;
            set => _dateTimeHumanizeStrategy = value ?? throw new ArgumentNullException(nameof(value));
        }

        public static IDateTimeOffsetHumanizeStrategy DateTimeOffsetHumanizeStrategy
        {
            get => _dateTimeOffsetHumanizeStrategy;
            set => _dateTimeOffsetHumanizeStrategy = value ?? throw new ArgumentNullException(nameof(value));
        }

        public static ITimeSpanHumanizeStrategy TimeSpanHumanizeStrategy
        {
            get => _timeSpanHumanizeStrategy;
            set => _timeSpanHumanizeStrategy = value ?? throw new ArgumentNullException(nameof(value));
        }

        public static ICollectionFormatter CollectionFormatter
        {
            get => _collectionFormatter;
            set => _collectionFormatter = value ?? throw new ArgumentNullException(nameof(value));
        }

        public static INumberToWordsConverter NumberToWordsConverter
        {
            get => _numberToWordsConverter;
            set => _numberToWordsConverter = value ?? throw new ArgumentNullException(nameof(value));
        }

        public static IVocabulary Vocabulary
        {
            get => _vocabulary;
            set => _vocabulary = value ?? throw new ArgumentNullException(nameof(value));
        }
    }
}