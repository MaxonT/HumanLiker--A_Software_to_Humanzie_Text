// <copyright>
//   Tiger.Humanizer - collection formatting interfaces.
// </copyright>

using System;
using System.Collections.Generic;

namespace Tiger.Humanizer.Configuration
{
    /// <summary>
    /// Defines a strategy for turning a collection into a human-readable string.
    /// </summary>
    public interface ICollectionFormatter
    {
        /// <summary>
        /// Humanizes the provided sequence of values into a single string.
        /// </summary>
        /// <typeparam name="T">The element type.</typeparam>
        /// <param name="source">The source sequence.</param>
        /// <param name="formatter">
        /// Optional element formatter. When <c>null</c>, <see cref="object.ToString"/> is used.
        /// </param>
        /// <param name="separator">
        /// The separator used between all elements except the last.
        /// When <c>null</c>, a comma and space (<c>", "</c>) is used.
        /// </param>
        /// <param name="lastSeparator">
        /// The separator between the last two elements.
        /// When <c>null</c>, <c>" and "</c> is used.
        /// </param>
        /// <returns>A human-readable representation of the sequence.</returns>
        string Humanize<T>(
            IEnumerable<T?> source,
            Func<T, string>? formatter = null,
            string? separator = null,
            string? lastSeparator = null);
    }
}
