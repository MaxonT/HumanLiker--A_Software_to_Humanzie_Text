using System;
using System.Collections.Generic;
using System.Linq;

namespace Tiger.Humanizer.Configuration
{
    /// <summary>
    /// Default implementation of <see cref="ICollectionFormatter"/>.
    /// Produces values such as "A, B and C" for three items.
    /// </summary>
    public sealed class OxfordCommaCollectionFormatter : ICollectionFormatter
    {
        public string Humanize<T>(
            IEnumerable<T?> source,
            Func<T, string>? formatter = null,
            string? separator = null,
            string? lastSeparator = null)
        {
            if (source is null) throw new ArgumentNullException(nameof(source));

            // Materialize and normalize items, skipping null or blank entries.
            var items = new List<string>();
            foreach (var item in source)
            {
                if (item is null) continue;

                var text = formatter is null
                    ? item!.ToString()
                    : formatter(item);

                if (string.IsNullOrWhiteSpace(text))
                {
                    continue;
                }

                items.Add(text);
            }

            if (items.Count == 0)
            {
                return string.Empty;
            }

            if (items.Count == 1)
            {
                return items[0];
            }

            var sep = separator ?? ", ";
            var lastSep = lastSeparator ?? " and ";

            if (items.Count == 2)
            {
                // "A and B" style output.
                return string.Concat(items[0], lastSep, items[1]);
            }

            // Three or more items: "A, B and C" style output.
            var head = string.Join(sep, items.Take(items.Count - 1));
            return string.Concat(head, lastSep, items[^1]);
        }
    }
}
