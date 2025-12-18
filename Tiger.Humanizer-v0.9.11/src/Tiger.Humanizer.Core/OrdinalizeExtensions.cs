using System;

namespace Tiger.Humanizer
{
    public static class OrdinalizeExtensions
    {
        public static string Ordinalize(this int number)
        {
            return OrdinalizeInternal(number);
        }

        public static string Ordinalize(this long number)
        {
            return OrdinalizeInternal(number);
        }

        public static string Ordinalize(this string numberString)
        {
            if (numberString == null) throw new ArgumentNullException(nameof(numberString));

            if (!long.TryParse(numberString, out var value))
            {
                throw new FormatException($"'{numberString}' is not a valid integer value.");
            }

            return OrdinalizeInternal(value);
        }

        private static string OrdinalizeInternal(long number)
        {
            var abs = Math.Abs(number);
            var lastTwo = abs % 100;
            var lastDigit = abs % 10;

            string suffix;
            if (lastTwo is 11 or 12 or 13)
            {
                suffix = "th";
            }
            else
            {
                suffix = lastDigit switch
                {
                    1 => "st",
                    2 => "nd",
                    3 => "rd",
                    _ => "th"
                };
            }

            return string.Concat(number.ToString(System.Globalization.CultureInfo.InvariantCulture), suffix);
        }
    }
}
