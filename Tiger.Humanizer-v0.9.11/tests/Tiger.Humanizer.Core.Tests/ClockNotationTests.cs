using System;
using System.Globalization;
using Xunit;

namespace Tiger.Humanizer.Core.Tests
{
    public class ClockNotationTests
    {
        private static readonly CultureInfo EnUs = CultureInfo.GetCultureInfo("en-US");

        [Theory]
        [InlineData(0, 0, "midnight")]
        [InlineData(12, 0, "noon")]
        [InlineData(3, 0, "three o'clock")]
        [InlineData(15, 0, "three o'clock")]
        [InlineData(2, 15, "quarter past two")]
        [InlineData(2, 30, "half past two")]
        [InlineData(4, 45, "quarter to five")]
        [InlineData(10, 5, "five past ten")]
        [InlineData(10, 25, "twenty five past ten")]
        [InlineData(10, 40, "twenty to eleven")]
        [InlineData(23, 50, "ten to twelve")]
        public void TimeOnly_ToClockNotation_English(int hour, int minute, string expected)
        {
            var time = new TimeOnly(hour, minute);
            var result = time.ToClockNotation(EnUs);
            Assert.Equal(expected, result);
        }

        [Fact]
        public void TimeOnly_ToClockNotation_NonEnglishCulture_FallsBackToEnglish()
        {
            var time = new TimeOnly(14, 30);
            var result = time.ToClockNotation(CultureInfo.GetCultureInfo("fr-FR"));
            Assert.Equal("half past two", result);
        }
    }
}
