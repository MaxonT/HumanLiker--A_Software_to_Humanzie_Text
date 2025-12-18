using System.Collections.Generic;
using Tiger.Humanizer;
using Xunit;

namespace Tiger.Humanizer.Core.Tests
{
    public class CollectionHumanizerTests
    {
        [Fact]
        public void Humanize_JoinsWithOxfordCommaByDefault()
        {
            var items = new[] { "A", "B", "C" };

            var result = items.Humanize();

            Assert.Equal("A, B and C", result);
        }

        [Fact]
        public void Humanize_HandlesTwoItems()
        {
            var items = new[] { "A", "B" };

            var result = items.Humanize();

            Assert.Equal("A and B", result);
        }

        [Fact]
        public void Humanize_HandlesSingleItem()
        {
            var items = new[] { "Only" };

            var result = items.Humanize();

            Assert.Equal("Only", result);
        }

        [Fact]
        public void Humanize_RespectsCustomSeparators()
        {
            var items = new[] { "A", "B", "C" };

            var result = items.Humanize(separator: " | ", lastSeparator: " or ");

            Assert.Equal("A | B or C", result);
        }

        private sealed class SomeClass
        {
            public string Name { get; }

            public SomeClass(string name)
            {
                Name = name;
            }

            public override string ToString()
            {
                return $"[{Name}]";
            }
        }

        [Fact]
        public void Humanize_UsesFormatterWhenProvided()
        {
            var items = new List<SomeClass>
            {
                new SomeClass("A"),
                new SomeClass("B"),
                new SomeClass("C")
            };

            var result = items.Humanize(x => x.Name);

            Assert.Equal("A, B and C", result);
        }
    }
}
