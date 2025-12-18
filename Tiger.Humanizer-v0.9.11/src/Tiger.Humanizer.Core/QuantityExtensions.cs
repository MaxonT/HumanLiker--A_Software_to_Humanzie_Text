using System;
using Tiger.Humanizer.Configuration;

namespace Tiger.Humanizer
{
    public enum ShowQuantityAs
    {
        None = 0,
        Numeric = 1,
        Words = 2
    }

    public static class QuantityExtensions
    {
        public static string ToQuantity(
            this string input,
            int quantity,
            ShowQuantityAs showQuantityAs = ShowQuantityAs.Numeric,
            string? numberFormat = null,
            string? culture = null)
        {
            if (input == null) throw new ArgumentNullException(nameof(input));

            var word = GetCorrectForm(input, quantity);

            switch (showQuantityAs)
            {
                case ShowQuantityAs.None:
                    return word;

                case ShowQuantityAs.Words:
                {
                    var numberWords = Configurator.NumberToWordsConverter.ToWords(quantity, culture);
                    return string.Concat(numberWords, " ", word);
                }

                case ShowQuantityAs.Numeric:
                default:
                {
                    string numberText;
                    if (string.IsNullOrWhiteSpace(numberFormat))
                    {
                        numberText = quantity.ToString(System.Globalization.CultureInfo.InvariantCulture);
                    }
                    else
                    {
                        numberText = quantity.ToString(numberFormat, System.Globalization.CultureInfo.InvariantCulture);
                    }

                    return string.Concat(numberText, " ", word);
                }
            }
        }

        private static string GetCorrectForm(string input, int quantity)
        {
            if (Configurator.Vocabulary.IsUncountable(input))
            {
                return input;
            }

            if (Math.Abs(quantity) == 1)
            {
                // singular
                return Configurator.Vocabulary.Singularize(input);
            }

            // plural
            return Configurator.Vocabulary.Pluralize(input);
        }
    }
}
