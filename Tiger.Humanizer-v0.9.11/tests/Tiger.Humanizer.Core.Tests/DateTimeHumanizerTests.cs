using System;
using Tiger.Humanizer;
using Xunit;

namespace Tiger.Humanizer.Core.Tests
{
    public class DateTimeHumanizerTests
    {
        [Fact]
        public void Humanize_ReturnsNowForVerySmallDifferences()
        {
            var now = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);
            var slightlyLater = now.AddMilliseconds(500);

            var result = slightlyLater.Humanize(now);

            Assert.Equal("now", result);
        }

        [Fact]
        public void Humanize_UsesSecondsForShortDifferences()
        {
            var now = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);
            var earlier = now.AddSeconds(-30);

            var result = earlier.Humanize(now);

            Assert.Equal("30 seconds ago", result);
        }

        [Fact]
        public void Humanize_UsesMinuteAfterFortyFiveSeconds()
        {
            var now = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);
            var earlier = now.AddSeconds(-45);

            var result = earlier.Humanize(now);

            Assert.Equal("a minute ago", result);
        }

        [Fact]
        public void Humanize_UsesMinutesForLargerDifferences()
        {
            var now = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);
            var earlier = now.AddMinutes(-10);

            var result = earlier.Humanize(now);

            Assert.Equal("10 minutes ago", result);
        }

        [Fact]
        public void Humanize_UsesHours()
        {
            var now = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);
            var earlier = now.AddHours(-2);

            var result = earlier.Humanize(now);

            Assert.Equal("2 hours ago", result);
        }

        [Fact]
        public void Humanize_UsesYesterdayAndTomorrow()
        {
            var now = new DateTime(2025, 1, 2, 12, 0, 0, DateTimeKind.Utc);
            var yesterday = now.AddDays(-1);
            var tomorrow = now.AddDays(1);

            Assert.Equal("yesterday", yesterday.Humanize(now));
            Assert.Equal("tomorrow", tomorrow.Humanize(now));
        }

        [Fact]
        public void Humanize_UsesDaysWeeksMonthsYears()
        {
            var now = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);

            Assert.Equal("10 days ago", now.AddDays(-10).Humanize(now));
            Assert.Equal("2 weeks ago", now.AddDays(-14).Humanize(now));
            Assert.Equal("2 months ago", now.AddDays(-60).Humanize(now));
            Assert.Equal("2 years ago", now.AddDays(-730).Humanize(now));
        }

        [Fact]
        public void Humanize_CanDescribeFutureTimes()
        {
            var now = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);
            var later = now.AddHours(3);

            var result = later.Humanize(now);

            Assert.Equal("3 hours from now", result);
        }

        [Fact]
        public void Humanize_DateTimeOffset_WorksSimilarly()
        {
            var now = new DateTimeOffset(2025, 1, 1, 12, 0, 0, TimeSpan.Zero);
            var earlier = now.AddMinutes(-5);

            var result = earlier.Humanize(now);

            Assert.Equal("5 minutes ago", result);
        }
    }

    public class TimeSpanHumanizerTests
    {
        [Fact]
        public void Humanize_Milliseconds()
        {
            var span = TimeSpan.FromMilliseconds(1);

            var result = span.Humanize();

            Assert.Equal("1 millisecond", result);
        }

        [Fact]
        public void Humanize_Seconds()
        {
            var span = TimeSpan.FromSeconds(10);

            var result = span.Humanize();

            Assert.Equal("10 seconds", result);
        }

        [Fact]
        public void Humanize_Minutes()
        {
            var span = TimeSpan.FromMinutes(5);

            var result = span.Humanize();

            Assert.Equal("5 minutes", result);
        }

        [Fact]
        public void Humanize_Hours()
        {
            var span = TimeSpan.FromHours(3);

            var result = span.Humanize();

            Assert.Equal("3 hours", result);
        }

        [Fact]
        public void Humanize_DaysWeeksMonthsYears()
        {
            Assert.Equal("2 days", TimeSpan.FromDays(2).Humanize());
            Assert.Equal("2 weeks", TimeSpan.FromDays(14).Humanize());
            Assert.Equal("2 months", TimeSpan.FromDays(60).Humanize());
            Assert.Equal("2 years", TimeSpan.FromDays(730).Humanize());
        }

        [Fact]
        public void Fluent_TimeSpan_Helpers_Work()
        {
            2.Days().Should().Be(TimeSpan.FromDays(2));
            5.Hours().Should().Be(TimeSpan.FromHours(5));
            30.Minutes().Should().Be(TimeSpan.FromMinutes(30));
            500.Milliseconds().Should().Be(TimeSpan.FromMilliseconds(500));
            3.Weeks().Should().Be(TimeSpan.FromDays(21));
        }

        [Fact]
        public void DateTime_ToOrdinalWords_Uses_British_Format_By_Default()
        {
            var date = new DateTime(2015, 1, 4);
            date.ToOrdinalWords("en-GB").Should().Be("4th January 2015");
        }

        [Fact]
        public void DateTime_ToOrdinalWords_Uses_American_Format_For_en_US()
        {
            var date = new DateTime(2015, 1, 4);
            date.ToOrdinalWords("en-US").Should().Be("January 4th, 2015");
        }

        [Fact]
        public void TimeOnly_ToClockNotation_Produces_Natural_Phrases()
        {
            var three = new TimeOnly(3, 0);
            var halfPastTwo = new TimeOnly(14, 30);
            var almostSix = new TimeOnly(17, 45);

            three.ToClockNotation().Should().Be("three o'clock");
            halfPastTwo.ToClockNotation().Should().Be("half past two");
            almostSix.ToClockNotation().Should().Be("quarter to six");

            new TimeOnly(12, 0).ToClockNotation().Should().Be("noon");
            new TimeOnly(0, 0).ToClockNotation().Should().Be("midnight");
        }

    }
}
