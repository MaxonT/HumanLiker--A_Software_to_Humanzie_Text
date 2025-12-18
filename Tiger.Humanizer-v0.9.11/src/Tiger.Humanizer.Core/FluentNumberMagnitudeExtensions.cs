
namespace Tiger.Humanizer
{
    /// <summary>
    /// Fluent helpers for building large numbers in a readable way:
    /// 1.25.Billions(), 3.Hundreds().Thousands(), etc.
    /// </summary>
    public static class FluentNumberMagnitudeExtensions
    {
        // int overloads -> long so we can safely grow
        public static long Hundreds(this int value) => value * 100L;
        public static long Thousands(this int value) => value * 1_000L;
        public static long Millions(this int value) => value * 1_000_000L;
        public static long Billions(this int value) => value * 1_000_000_000L;

        // long overloads
        public static long Hundreds(this long value) => value * 100L;
        public static long Thousands(this long value) => value * 1_000L;
        public static long Millions(this long value) => value * 1_000_000L;
        public static long Billions(this long value) => value * 1_000_000_000L;

        // double overloads: keep as double to preserve fractions like 1.25.Billions()
        public static double Hundreds(this double value) => value * 100d;
        public static double Thousands(this double value) => value * 1_000d;
        public static double Millions(this double value) => value * 1_000_000d;
        public static double Billions(this double value) => value * 1_000_000_000d;
    }
}
