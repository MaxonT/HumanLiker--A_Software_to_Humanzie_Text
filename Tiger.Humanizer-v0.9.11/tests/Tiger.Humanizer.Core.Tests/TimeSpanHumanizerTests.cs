using System;
using Tiger.Humanizer;
using Xunit;

namespace Tiger.Humanizer.Core.Tests
{
    public class TimeSpanHumanizerTests
    {
        [Fact]
        public void Zero_is_humanized_as_zero_milliseconds()
        {
            Assert.Equal("0 milliseconds", TimeSpan.Zero.Humanize());
        }

        [Fact]
        public void Single_millisecond_is_humanized_correctly()
        {
            Assert.Equal("1 millisecond", TimeSpan.FromMilliseconds(1).Humanize());
        }

        [Fact]
        public void Multiple_milliseconds_are_humanized_correctly()
        {
            Assert.Equal("500 milliseconds", TimeSpan.FromMilliseconds(500).Humanize());
        }

        [Fact]
        public void Sixteen_days_are_humanized_as_two_weeks()
        {
            Assert.Equal("2 weeks", TimeSpan.FromDays(16).Humanize());
        }
    }
}
