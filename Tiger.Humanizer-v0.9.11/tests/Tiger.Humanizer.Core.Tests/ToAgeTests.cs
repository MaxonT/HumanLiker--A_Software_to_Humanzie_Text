using System;
using Tiger.Humanizer;
using Xunit;

namespace Tiger.Humanizer.Core.Tests
{
    public class ToAgeTests
    {
        [Fact]
        public void AgeForExactBirthday()
        {
            var birth = new DateTime(2000, 1, 1);
            var reference = new DateTime(2020, 1, 1);

            var age = birth.ToAge(reference);

            Assert.Equal("20 years", age);
        }
    }
}
