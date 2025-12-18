using Tiger.Humanizer.Configuration;

namespace Tiger.Humanizer
{
    public static class InflectorExtensions
    {
        public static string Pluralize(this string input)
        {
            return Configurator.Vocabulary.Pluralize(input);
        }

        public static string Singularize(this string input)
        {
            return Configurator.Vocabulary.Singularize(input);
        }

        public static bool IsUncountable(this string input)
        {
            return Configurator.Vocabulary.IsUncountable(input);
        }
    }
}
