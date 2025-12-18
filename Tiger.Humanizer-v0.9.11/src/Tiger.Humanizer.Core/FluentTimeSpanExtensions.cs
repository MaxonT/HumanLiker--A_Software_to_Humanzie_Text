
using System;

namespace Tiger.Humanizer
{
    /// <summary>
    /// Fluent helpers for building <see cref="TimeSpan"/> instances from numeric literals.
    /// Mirrors the classic Humanizer 2.Days(), 5.Minutes(), 2.Weeks() style API.
    /// </summary>
    public static class FluentTimeSpanExtensions
    {
        public static TimeSpan Milliseconds(this int value) => TimeSpan.FromMilliseconds(value);
        public static TimeSpan Milliseconds(this long value) => TimeSpan.FromMilliseconds(value);
        public static TimeSpan Milliseconds(this double value) => TimeSpan.FromMilliseconds(value);

        public static TimeSpan Seconds(this int value) => TimeSpan.FromSeconds(value);
        public static TimeSpan Seconds(this long value) => TimeSpan.FromSeconds(value);
        public static TimeSpan Seconds(this double value) => TimeSpan.FromSeconds(value);

        public static TimeSpan Minutes(this int value) => TimeSpan.FromMinutes(value);
        public static TimeSpan Minutes(this long value) => TimeSpan.FromMinutes(value);
        public static TimeSpan Minutes(this double value) => TimeSpan.FromMinutes(value);

        public static TimeSpan Hours(this int value) => TimeSpan.FromHours(value);
        public static TimeSpan Hours(this long value) => TimeSpan.FromHours(value);
        public static TimeSpan Hours(this double value) => TimeSpan.FromHours(value);

        public static TimeSpan Days(this int value) => TimeSpan.FromDays(value);
        public static TimeSpan Days(this long value) => TimeSpan.FromDays(value);
        public static TimeSpan Days(this double value) => TimeSpan.FromDays(value);

        /// <summary>
        /// Treats a week as exactly 7 days for fluent date arithmetic.
        /// </summary>
        public static TimeSpan Weeks(this int value) => TimeSpan.FromDays(value * 7);
        public static TimeSpan Weeks(this long value) => TimeSpan.FromDays(value * 7);
        public static TimeSpan Weeks(this double value) => TimeSpan.FromDays(value * 7);
    }
}
