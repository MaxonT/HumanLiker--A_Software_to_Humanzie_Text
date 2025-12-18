using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Tiger.Humanizer
{
    public static class StringCasingExtensions
    {
        private static readonly Regex WordBoundaryRegex = new Regex(
            @"[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+",
            RegexOptions.Compiled);

        public static string Titleize(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return string.Empty;
            }

            var words = SplitWords(input);
            for (int i = 0; i < words.Count; i++)
            {
                words[i] = Capitalize(words[i]);
            }

            return string.Join(" ", words);
        }

        public static string Pascalize(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return string.Empty;
            }

            var words = SplitWords(input);
            var sb = new StringBuilder();
            foreach (var word in words)
            {
                sb.Append(Capitalize(word));
            }

            return sb.ToString();
        }

        public static string Camelize(this string input)
        {
            var pascal = Pascalize(input);
            if (string.IsNullOrEmpty(pascal))
            {
                return pascal;
            }

            if (pascal.Length == 1)
            {
                return pascal.ToLowerInvariant();
            }

            return char.ToLowerInvariant(pascal[0]) + pascal.Substring(1);
        }

        public static string Underscore(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return string.Empty;
            }

            var words = SplitWords(input);
            return string.Join("_", words).ToLowerInvariant();
        }

        public static string Dasherize(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return string.Empty;
            }

            var words = SplitWords(input);
            return string.Join("-", words).ToLowerInvariant();
        }

        public static string Kebaberize(this string input)
        {
            // Alias to dasherize; keeping separate for semantic clarity
            return Dasherize(input);
        }

        private static List<string> SplitWords(string input)
        {
            var normalized = input
                .Replace("_", " ")
                .Replace("-", " ");

            var words = new List<string>();

            foreach (var token in normalized.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries))
            {
                foreach (Match match in WordBoundaryRegex.Matches(token))
                {
                    if (match.Success)
                    {
                        words.Add(match.Value);
                    }
                }
            }

            return words;
        }

        private static string Capitalize(string word)
        {
            if (string.IsNullOrEmpty(word))
            {
                return string.Empty;
            }

            if (word.Length == 1)
            {
                return word.ToUpperInvariant();
            }

            return char.ToUpperInvariant(word[0]) + word.Substring(1).ToLowerInvariant();
        }
    }
}
