
using System;

namespace Tiger.Humanizer
{
    /// <summary>
    /// Fluent helpers for constructing specific dates in a readable way:
    /// On.January.The(4) or On.January.The4th, etc.
    /// </summary>
    public static class On
    {
        public static MonthSelector January => new MonthSelector(1);
        public static MonthSelector February => new MonthSelector(2);
        public static MonthSelector March => new MonthSelector(3);
        public static MonthSelector April => new MonthSelector(4);
        public static MonthSelector May => new MonthSelector(5);
        public static MonthSelector June => new MonthSelector(6);
        public static MonthSelector July => new MonthSelector(7);
        public static MonthSelector August => new MonthSelector(8);
        public static MonthSelector September => new MonthSelector(9);
        public static MonthSelector October => new MonthSelector(10);
        public static MonthSelector November => new MonthSelector(11);
        public static MonthSelector December => new MonthSelector(12);
    }

    /// <summary>
    /// Represents a particular month; used by the <see cref="On"/> helpers.
    /// </summary>
    public readonly struct MonthSelector
    {
        private readonly int _month;

        public MonthSelector(int month)
        {
            _month = month;
        }

        /// <summary>
        /// Returns the date for the given day in this month, using either the
        /// provided year or the current year if omitted.
        /// </summary>
        public DateTime The(int day, int? year = null)
        {
            var actualYear = year ?? DateTime.Today.Year;
            return new DateTime(actualYear, _month, day);
        }

        // Convenience ordinal-style properties: The1st, The2nd, ..., The31st

        public DateTime The1st => The(1);
        public DateTime The2nd => The(2);
        public DateTime The3rd => The(3);
        public DateTime The4th => The(4);
        public DateTime The5th => The(5);
        public DateTime The6th => The(6);
        public DateTime The7th => The(7);
        public DateTime The8th => The(8);
        public DateTime The9th => The(9);
        public DateTime The10th => The(10);
        public DateTime The11th => The(11);
        public DateTime The12th => The(12);
        public DateTime The13th => The(13);
        public DateTime The14th => The(14);
        public DateTime The15th => The(15);
        public DateTime The16th => The(16);
        public DateTime The17th => The(17);
        public DateTime The18th => The(18);
        public DateTime The19th => The(19);
        public DateTime The20th => The(20);
        public DateTime The21st => The(21);
        public DateTime The22nd => The(22);
        public DateTime The23rd => The(23);
        public DateTime The24th => The(24);
        public DateTime The25th => The(25);
        public DateTime The26th => The(26);
        public DateTime The27th => The(27);
        public DateTime The28th => The(28);
        public DateTime The29th => The(29);
        public DateTime The30th => The(30);
        public DateTime The31st => The(31);
    }
}
