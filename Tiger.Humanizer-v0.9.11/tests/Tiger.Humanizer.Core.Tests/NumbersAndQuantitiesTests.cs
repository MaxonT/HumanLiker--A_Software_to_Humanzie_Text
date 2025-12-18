using Tiger.Humanizer;
using Xunit;

namespace Tiger.Humanizer.Core.Tests
{
    public class NumbersAndQuantitiesTests
    {
        [Theory]
        [InlineData(1, "1st")]
        [InlineData(2, "2nd")]
        [InlineData(3, "3rd")]
        [InlineData(4, "4th")]
        [InlineData(11, "11th")]
        [InlineData(12, "12th")]
        [InlineData(13, "13th")]
        [InlineData(21, "21st")]
        [InlineData(22, "22nd")]
        [InlineData(23, "23rd")]
        [InlineData(101, "101st")]
        public void Ordinalize_Int_Works(int value, string expected)
        {
            Assert.Equal(expected, value.Ordinalize());
        }

        [Theory]
        [InlineData("1", "1st")]
        [InlineData("2", "2nd")]
        [InlineData("3", "3rd")]
        [InlineData("11", "11th")]
        public void Ordinalize_String_Works(string value, string expected)
        {
            Assert.Equal(expected, value.Ordinalize());
        }

        [Theory]
        [InlineData(0, "zero")]
        [InlineData(1, "one")]
        [InlineData(2, "two")]
        [InlineData(10, "ten")]
        [InlineData(15, "fifteen")]
        [InlineData(20, "twenty")]
        [InlineData(21, "twenty-one")]
        [InlineData(42, "forty-two")]
        [InlineData(100, "one hundred")]
        [InlineData(101, "one hundred and one")]
        [InlineData(215, "two hundred and fifteen")]
        [InlineData(1000, "one thousand")]
        [InlineData(1001, "one thousand and one")]
        [InlineData(1042, "one thousand and forty-two")]
        [InlineData(1100, "one thousand one hundred")]
        [InlineData(3421, "three thousand four hundred and twenty-one")]
        public void Number_ToWords_English(int value, string expected)
        {
            Assert.Equal(expected, value.ToWords());
        }

        [Theory]
        [InlineData(1, "first")]
        [InlineData(2, "second")]
        [InlineData(3, "third")]
        [InlineData(4, "fourth")]
        [InlineData(5, "fifth")]
        [InlineData(8, "eighth")]
        [InlineData(9, "ninth")]
        [InlineData(12, "twelfth")]
        [InlineData(20, "twentieth")]
        [InlineData(21, "twenty-first")]
        [InlineData(42, "forty-second")]
        public void Number_ToOrdinalWords_English(int value, string expected)
        {
            Assert.Equal(expected, value.ToOrdinalWords());
        }

        [Theory]
        [InlineData(0, "0 cases")]
        [InlineData(1, "1 case")]
        [InlineData(2, "2 cases")]
        public void ToQuantity_Numeric_UsesPluralizationRules(int quantity, string expected)
        {
            Assert.Equal(expected, "case".ToQuantity(quantity));
        }

        [Fact]
        public void ToQuantity_Words_UsesNumberWords()
        {
            var result = "file".ToQuantity(3, ShowQuantityAs.Words);
            Assert.Equal("three files", result);
        }

        [Fact]
        public void ToQuantity_None_ReturnsOnlyWord()
        {
            var result = "case".ToQuantity(2, ShowQuantityAs.None);
            Assert.Equal("cases", result);
        }

        [Fact]
        public void ToQuantity_RespectsUncountableVocabulary()
        {
            var result = "fish".ToQuantity(5);
            Assert.Equal("5 fish", result);
        }

        [Fact]
        public void Casing_Titleize_Works()
        {
            Assert.Equal("Some Example Name", "some_example_name".Titleize());
            Assert.Equal("Some Example Name", "SomeExampleName".Titleize());
        }

        [Fact]
        public void Casing_Pascalize_Works()
        {
            Assert.Equal("SomeExampleName", "some_example_name".Pascalize());
            Assert.Equal("SomeExampleName", "some example name".Pascalize());
        }

        [Fact]
        public void Casing_Camelize_Works()
        {
            Assert.Equal("someExampleName", "some_example_name".Camelize());
            Assert.Equal("someExampleName", "Some example name".Camelize());
        }

        [Fact]
        public void Casing_Underscore_Works()
        {
            Assert.Equal("some_example_name", "SomeExampleName".Underscore());
        }

        [Fact]
        public void Casing_Dasherize_And_Kebaberize_Work()
        {
            Assert.Equal("some-example-name", "SomeExampleName".Dasherize());
            Assert.Equal("some-example-name", "SomeExampleName".Kebaberize());
        }

        [Fact]
        public void Fluent_Number_Magnitudes_Work_For_Int()
        {
            3.Hundreds().Should().Be(300);
            5.Thousands().Should().Be(5000);
            2.Millions().Should().Be(2_000_000);
            1.Billions().Should().Be(1_000_000_000);
        }

        [Fact]
        public void Fluent_Number_Magnitudes_Work_For_Chained_Calls()
        {
            // 3.Hundreds().Thousands() = 300 * 1000
            Assert.Equal(300_000, 3.Hundreds().Thousands());
        }

        [Fact]
        public void Fluent_Number_Magnitudes_Work_For_Double()
        {
            Assert.Equal(1_250_000_000d, 1.25.Billions());
        }



        [Theory]
        [InlineData("zero", 0)]
        [InlineData("one", 1)]
        [InlineData("ten", 10)]
        [InlineData("twenty one", 21)]
        [InlineData("one hundred", 100)]
        [InlineData("one hundred and five", 105)]
        [InlineData("three thousand five hundred and one", 3501)]
        [InlineData("two million three hundred thousand", 2_300_000)]
        [InlineData("minus one hundred", -100)]
        [InlineData("negative two thousand and ten", -2010)]
        public void WordsToNumber_Basic_Phrases_Work(string input, long expected)
        {
            var result = input.ToNumber();
            Assert.Equal(expected, result);
        }

        [Fact]
        public void TryToNumber_ReturnsFalse_For_Invalid_Input()
        {
            long value;
            var ok = "not a number".TryToNumber(out value);

            Assert.False(ok);
        }

    }
}
