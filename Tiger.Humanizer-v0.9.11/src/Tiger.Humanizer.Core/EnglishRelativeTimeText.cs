// Tiger.Humanizer v0.9.1
// English relative time text resources centralised in a single helper.
// This keeps all human‑readable phrases for DateTime/TimeSpan "ago / from now"
// in one place so that we can later swap it per‑culture without touching core logic.

using System;
using System.Globalization;

namespace Tiger.Humanizer.Core
{
    internal static class EnglishRelativeTimeText
    {
        public static string Now => "now";

        public static string Tomorrow => "tomorrow";

        public static string Yesterday => "yesterday";

        /// <summary>
        /// Humanizes a small DateTime delta expressed in whole seconds,
        /// including the "ago / from now" suffix.
        /// </summary>
        public static string FormatSecondsForDateTime(int seconds, bool isFuture)
        {
            if (seconds == 0)
            {
                return Now;
            }

            string valueWord;
            string unitWord;

            if (seconds == 1)
            {
                valueWord = "one";
                unitWord = "second";
            }
            else
            {
                valueWord = seconds.ToString(CultureInfo.InvariantCulture);
                unitWord = "seconds";
            }

            var core = $"{valueWord} {unitWord}";
            return isFuture ? core + " from now" : core + " ago";
        }

        /// <summary>
        /// Humanizes a small TimeSpan delta expressed in whole seconds,
        /// without any "ago / from now" suffix.
        /// </summary>
        public static string FormatSeconds(int seconds)
        {
            if (seconds == 0)
            {
                return Now;
            }

            if (seconds == 1)
            {
                return "one second";
            }

            return seconds.ToString(CultureInfo.InvariantCulture) + " seconds";
        }

        /// <summary>
        /// Special handling for a single minute to avoid "1 minutes".
        /// </summary>
        public static string FormatSingleMinute(bool isFuture, bool isDateTime)
        {
            const string core = "one minute";

            if (!isDateTime)
            {
                return core;
            }

            return isFuture ? core + " from now" : core + " ago";
        }

        /// <summary>
        /// Generic helper for all the larger units (minute/hour/day/week/month/year).
        /// This is used by the DateTime and TimeSpan humanizers.
        /// </summary>
        public static string FormatUnit(int value, string unit, bool isDateTime, bool isFuture)
        {
            string word;

            if (value == 1)
            {
                word = "one " + unit;
            }
            else
            {
                word = value.ToString(CultureInfo.InvariantCulture) + " " + unit + "s";
            }

            if (!isDateTime)
            {
                return word;
            }

            return isFuture ? word + " from now" : word + " ago";
        }
    }
}
