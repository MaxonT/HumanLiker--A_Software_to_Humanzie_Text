using System;
using System.Collections.Generic;
using System.Globalization;

namespace Tiger.Humanizer
{
    public static class WordsToNumberExtensions
    {
        /// <summary>
        /// Converts an English number phrase into its numeric value.
        /// </summary>
        /// <remarks>
        /// Supports simple cardinal forms like:
        /// - "zero", "one", "two", ...
        /// - "twenty one", "one hundred and five"
        /// - "three thousand five hundred and one"
        /// - "two million three hundred thousand"
        /// - with optional "and" as a filler word.
        ///
        /// Currently only English words are supported.
        /// </remarks>
        public static long ToNumber(this string words, string? culture = null)
        {
            if (words is null)
            {
                throw new ArgumentNullException(nameof(words));
            }

            if (!words.TryToNumber(out var value, culture))
            {
                throw new ArgumentException("Input string is not a valid number phrase.", nameof(words));
            }

            return value;
        }

        public static bool TryToNumber(this string words, out long value, string? culture = null)
        {
            if (string.IsNullOrWhiteSpace(words))
            {
                value = 0;
                return false;
            }

            // For now we only implement an English parser. The culture parameter is kept
            // for future extension and symmetry with other Humanizer APIs.
            culture ??= CultureInfo.InvariantCulture.Name;
            if (!culture.StartsWith("en", StringComparison.OrdinalIgnoreCase))
            {
                value = 0;
                return false;
            }

            return TryParseEnglish(words, out value);
        }

        private static bool TryParseEnglish(string words, out long value)
        {
            var units = new Dictionary<string, long>(StringComparer.OrdinalIgnoreCase)
            {
                ["zero"] = 0,
                ["one"] = 1,
                ["two"] = 2,
                ["three"] = 3,
                ["four"] = 4,
                ["five"] = 5,
                ["six"] = 6,
                ["seven"] = 7,
                ["eight"] = 8,
                ["nine"] = 9,
                ["ten"] = 10,
                ["eleven"] = 11,
                ["twelve"] = 12,
                ["thirteen"] = 13,
                ["fourteen"] = 14,
                ["fifteen"] = 15,
                ["sixteen"] = 16,
                ["seventeen"] = 17,
                ["eighteen"] = 18,
                ["nineteen"] = 19
            };

            var tens = new Dictionary<string, long>(StringComparer.OrdinalIgnoreCase)
            {
                ["twenty"] = 20,
                ["thirty"] = 30,
                ["forty"] = 40,
                ["fifty"] = 50,
                ["sixty"] = 60,
                ["seventy"] = 70,
                ["eighty"] = 80,
                ["ninety"] = 90
            };

            var scales = new Dictionary<string, long>(StringComparer.OrdinalIgnoreCase)
            {
                ["hundred"] = 100,
                ["thousand"] = 1_000,
                ["million"] = 1_000_000,
                ["billion"] = 1_000_000_000
            };

            var normalized = words.Replace("-", " ");
            var tokens = normalized.Split(new[] { ' ', '\t', '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

            long total = 0;
            long current = 0;
            bool isNegative = false;
            bool sawAny = false;

            foreach (var rawToken in tokens)
            {
                var token = rawToken.Trim().ToLowerInvariant();
                if (token.Length == 0)
                {
                    continue;
                }

                if (token == "and")
                {
                    // filler word, ignore
                    continue;
                }

                if (token == "minus" || token == "negative")
                {
                    if (sawAny)
                    {
                        value = 0;
                        return false; // sign must appear at the beginning
                    }

                    isNegative = true;
                    continue;
                }

                if (units.TryGetValue(token, out var unitValue))
                {
                    current += unitValue;
                    sawAny = true;
                    continue;
                }

                if (tens.TryGetValue(token, out var tensValue))
                {
                    current += tensValue;
                    sawAny = true;
                    continue;
                }

                if (scales.TryGetValue(token, out var scaleValue))
                {
                    if (scaleValue == 100)
                    {
                        if (current == 0)
                        {
                            current = 1;
                        }

                        current *= scaleValue;
                    }
                    else
                    {
                        if (current == 0)
                        {
                            // "thousand" without a leading number is ambiguous
                            value = 0;
                            return false;
                        }

                        total += current * scaleValue;
                        current = 0;
                    }

                    sawAny = true;
                    continue;
                }

                // Unknown token
                value = 0;
                return false;
            }

            if (!sawAny)
            {
                value = 0;
                return false;
            }

            total += current;
            value = isNegative ? -total : total;
            return true;
        }
    }
}
