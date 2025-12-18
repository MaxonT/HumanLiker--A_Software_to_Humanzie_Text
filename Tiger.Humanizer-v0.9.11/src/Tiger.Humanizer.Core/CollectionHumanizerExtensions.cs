using System;
using System.Collections.Generic;
using Tiger.Humanizer.Configuration;

namespace Tiger.Humanizer
{
    public static class CollectionHumanizerExtensions
    {
        public static string Humanize<T>(
            this IEnumerable<T?> source,
            Func<T, string>? formatter = null,
            string? separator = null,
            string? lastSeparator = null)
        {
            if (source == null) throw new ArgumentNullException(nameof(source));
            return Configurator.CollectionFormatter.Humanize(source, formatter, separator, lastSeparator);
        }
    }
}
