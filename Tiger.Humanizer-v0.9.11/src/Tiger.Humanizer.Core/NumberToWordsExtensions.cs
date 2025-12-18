using Tiger.Humanizer.Configuration;

namespace Tiger.Humanizer
{
    public static class NumberToWordsExtensions
    {
        public static string ToWords(this int number, string? culture = null)
        {
            return Configurator.NumberToWordsConverter.ToWords(number, culture);
        }

        public static string ToWords(this long number, string? culture = null)
        {
            return Configurator.NumberToWordsConverter.ToWords(number, culture);
        }

        public static string ToOrdinalWords(this int number, string? culture = null)
        {
            return Configurator.NumberToWordsConverter.ToOrdinalWords(number, culture);
        }

        public static string ToOrdinalWords(this long number, string? culture = null)
        {
            return Configurator.NumberToWordsConverter.ToOrdinalWords(number, culture);
        }
    }
}
