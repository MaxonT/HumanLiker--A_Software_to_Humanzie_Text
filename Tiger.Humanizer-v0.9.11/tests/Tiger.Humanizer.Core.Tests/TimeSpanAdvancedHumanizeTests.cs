using System;
using Tiger.Humanizer;
using Xunit;

namespace Tiger.Humanizer.Core.Tests
{
    public class TimeSpanAdvancedHumanizeTests
    {
        [Fact]
        public void SixteenDaysWithPrecisionTwo()
        {
            var span = TimeSpan.FromDays(16);
            var humanized = span.Humanize(precision: 2);
            Assert.Equal("2 weeks, 2 days", humanized);
        }

        [Fact]
        public void OneDayThreeHours()
        {
            var span = TimeSpan.FromDays(1) + TimeSpan.FromHours(3);
            var humanized = span.Humanize(precision: 2);
            Assert.Equal("1 day, 3 hours", humanized);
        }
    }
}
