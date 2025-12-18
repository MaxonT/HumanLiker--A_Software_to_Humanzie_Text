using Tiger.Humanizer;
using Tiger.Humanizer.Configuration;
using Xunit;

namespace Tiger.Humanizer.Core.Tests
{
    public class InflectorTests
    {
        [Theory]
        [InlineData("cat", "cats")]
        [InlineData("bus", "buses")]
        [InlineData("box", "boxes")]
        [InlineData("church", "churches")]
        [InlineData("city", "cities")]
        [InlineData("leaf", "leaves")]
        public void Pluralize_RegularWords(string singular, string plural)
        {
            Assert.Equal(plural, singular.Pluralize());
        }

        [Theory]
        [InlineData("man", "men")]
        [InlineData("woman", "women")]
        [InlineData("child", "children")]
        [InlineData("person", "people")]
        [InlineData("mouse", "mice")]
        public void Pluralize_IrregularWords(string singular, string plural)
        {
            Assert.Equal(plural, singular.Pluralize());
        }

        [Theory]
        [InlineData("equipment")]
        [InlineData("information")]
        [InlineData("rice")]
        [InlineData("money")]
        [InlineData("fish")]
        [InlineData("sheep")]
        public void Pluralize_UncountablesStayTheSame(string word)
        {
            Assert.Equal(word, word.Pluralize());
            Assert.True(word.IsUncountable());
        }

        [Theory]
        [InlineData("cats", "cat")]
        [InlineData("buses", "bus")]
        [InlineData("boxes", "box")]
        [InlineData("churches", "church")]
        [InlineData("cities", "city")]
        [InlineData("leaves", "leaf")]
        public void Singularize_RegularWords(string plural, string singular)
        {
            Assert.Equal(singular, plural.Singularize());
        }

        [Theory]
        [InlineData("MEN", "MAN")]
        [InlineData("People", "Person")]
        public void Inflector_PreservesCasing(string plural, string singular)
        {
            Assert.Equal(singular, plural.Singularize());
        }

        [Fact]
        public void Vocabulary_CanBeExtendedWithIrregular()
        {
            Configurator.Vocabulary.AddIrregular("analysis", "analyses");

            Assert.Equal("analyses", "analysis".Pluralize());
            Assert.Equal("analysis", "analyses".Singularize());
        }

        [Fact]
        public void Vocabulary_CanBeExtendedWithUncountable()
        {
            Configurator.Vocabulary.AddUncountable("water");

            Assert.Equal("water", "water".Pluralize());
            Assert.True("water".IsUncountable());
        }
    }
}
