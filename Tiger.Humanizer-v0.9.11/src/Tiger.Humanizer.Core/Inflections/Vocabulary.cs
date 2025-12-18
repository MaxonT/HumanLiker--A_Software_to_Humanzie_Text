using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Tiger.Humanizer.Inflections
{
    public interface IVocabulary
    {
        string Pluralize(string word);
        string Singularize(string word);
        bool IsUncountable(string word);

        void AddIrregular(string singular, string plural);
        void AddUncountable(string word);
        void AddPlural(string singularPattern, string pluralReplacement);
        void AddSingular(string pluralPattern, string singularReplacement);
    }

    internal sealed class DefaultVocabulary : IVocabulary
    {
        private readonly List<InflectionRule> pluralRules = new List<InflectionRule>();
        private readonly List<InflectionRule> singularRules = new List<InflectionRule>();
        private readonly HashSet<string> uncountables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, string> irregularSingularToPlural = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, string> irregularPluralToSingular = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        public DefaultVocabulary()
        {
            SeedUncountables();
            SeedIrregulars();
            SeedPluralRules();
            SeedSingularRules();
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

            var lower = word.ToLowerInvariant();

            if (irregularSingularToPlural.TryGetValue(lower, out var irregularPlural))
            {
                return MatchCasing(word, irregularPlural);
            }

            for (var i = pluralRules.Count - 1; i >= 0; i--)
            {
                var result = pluralRules[i].Apply(word);
                if (!ReferenceEquals(result, word))
                {
                    return result;
                }
            }

            return word.EndsWith("s", StringComparison.OrdinalIgnoreCase) ? word : word + "s";
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

            var lower = word.ToLowerInvariant();

            if (irregularPluralToSingular.TryGetValue(lower, out var irregularSingular))
            {
                return MatchCasing(word, irregularSingular);
            }

            for (var i = singularRules.Count - 1; i >= 0; i--)
            {
                var result = singularRules[i].Apply(word);
                if (!ReferenceEquals(result, word))
                {
                    return result;
                }
            }

            if (word.EndsWith("s", StringComparison.OrdinalIgnoreCase) && word.Length > 1)
            {
                return word.Substring(0, word.Length - 1);
            }

            return word;
        }

        public bool IsUncountable(string word)
        {
            if (string.IsNullOrWhiteSpace(word))
            {
                return false;
            }

            return uncountables.Contains(word.ToLowerInvariant());
        }

        public void AddIrregular(string singular, string plural)
        {
            if (string.IsNullOrWhiteSpace(singular) || string.IsNullOrWhiteSpace(plural))
            {
                return;
            }

            var singularKey = singular.ToLowerInvariant();
            var pluralKey = plural.ToLowerInvariant();

            irregularSingularToPlural[singularKey] = pluralKey;
            irregularPluralToSingular[pluralKey] = singularKey;
        }

        public void AddUncountable(string word)
        {
            if (string.IsNullOrWhiteSpace(word))
            {
                return;
            }

            uncountables.Add(word.ToLowerInvariant());
        }

        public void AddPlural(string singularPattern, string pluralReplacement)
        {
            if (string.IsNullOrWhiteSpace(singularPattern) || pluralReplacement == null)
            {
                return;
            }

            pluralRules.Add(new InflectionRule(singularPattern, pluralReplacement));
        }

        public void AddSingular(string pluralPattern, string singularReplacement)
        {
            if (string.IsNullOrWhiteSpace(pluralPattern) || singularReplacement == null)
            {
                return;
            }

            singularRules.Add(new InflectionRule(pluralPattern, singularReplacement));
        }

        private void SeedUncountables()
        {
            var words = new[]
            {
                "equipment",
                "information",
                "rice",
                "money",
                "species",
                "series",
                "fish",
                "sheep",
                "deer",
                "news"
            };

            foreach (var word in words)
            {
                AddUncountable(word);
            }
        }

        private void SeedIrregulars()
        {
            AddIrregular("person", "people");
            AddIrregular("man", "men");
            AddIrregular("woman", "women");
            AddIrregular("child", "children");
            AddIrregular("mouse", "mice");
            AddIrregular("goose", "geese");
            AddIrregular("tooth", "teeth");
            AddIrregular("foot", "feet");
        }

        private void SeedPluralRules()
        {
            AddPlural("(?i)([^aeiou])y$", "$1ies");
            AddPlural("(?i)([sxz]|[cs]h)$", "$0es");
            AddPlural("(?i)(?:([^f])fe|([lr])f)$", "$1$2ves");
            AddPlural("(?i)$", "s");
        }

        private void SeedSingularRules()
        {
            AddSingular("(?i)([^aeiou])ies$", "$1y");
            AddSingular("(?i)([sxz]|[cs]h)es$", "$1");
            AddSingular("(?i)([lr])ves$", "$1f");
            AddSingular("(?i)s$", "");
        }

        private static string MatchCasing(string original, string value)
        {
            if (string.IsNullOrEmpty(original) || string.IsNullOrEmpty(value))
            {
                return value;
            }

            // All upper
            if (IsAllUpper(original))
            {
                return value.ToUpperInvariant();
            }

            // First letter upper, rest lower
            if (char.IsUpper(original[0]) && original.Substring(1).ToLowerInvariant() == original.Substring(1))
            {
                return char.ToUpperInvariant(value[0]) + value.Substring(1).ToLowerInvariant();
            }

            return value;
        }

        private static bool IsAllUpper(string value)
        {
            for (var i = 0; i < value.Length; i++)
            {
                if (char.IsLetter(value[i]) && !char.IsUpper(value[i]))
                {
                    return false;
                }
            }

            return true;
        }

        private sealed class InflectionRule
        {
            private readonly Regex pattern;
            private readonly string replacement;

            public InflectionRule(string pattern, string replacement)
            {
                this.pattern = new Regex(pattern, RegexOptions.CultureInvariant);
                this.replacement = replacement;
            }

            public string Apply(string word)
            {
                if (!pattern.IsMatch(word))
                {
                    return word;
                }

                return pattern.Replace(word, replacement);
            }
        }
    }
}
