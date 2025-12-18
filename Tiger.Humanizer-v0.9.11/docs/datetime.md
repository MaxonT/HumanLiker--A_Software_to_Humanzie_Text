# DateTime / TimeSpan Humanize – Tiger.Humanizer

This document describes how Tiger.Humanizer turns raw dates and durations into
phrases like “2 hours ago”, “in 3 weeks”, or “2 weeks, 3 days”.

## 1. Relative DateTime humanization

The core extension is:

```csharp
someDateTime.Humanize();                 // "2 hours ago", "yesterday", "tomorrow", ...
```

Key options:

```csharp
// compare against an explicit reference moment
someDateTime.Humanize(dateToCompareAgainst: reference);

// switch between local and UTC comparisons
someUtcDate.Humanize(utcDate: true);
```

Under the hood a configurable `IDateTimeHumanizeStrategy` decides how to map a
`TimeSpan` into human‑readable buckets (seconds, minutes, hours, days, weeks,
months, years).

### Precision

Precision controls when we “round up” to the next unit. For example, with the
default threshold around 0.75:

- 44 seconds → “44 seconds”
- 45 seconds → “a minute”
- 104 seconds → “a minute”
- 105 seconds → “2 minutes”

You can plug in `PrecisionDateTimeHumanizeStrategy` to tweak this behaviour.

## 2. TimeSpan.Humanize

For raw durations you can call:

```csharp
TimeSpan.FromMilliseconds(1).Humanize();            // "1 millisecond"
TimeSpan.FromDays(16).Humanize();                   // "2 weeks"
TimeSpan.FromDays(16).Humanize(precision: 2);       // "2 weeks, 2 days"
```

More options:

```csharp
span.Humanize(
    precision: 2,
    minUnit: TimeUnit.Second,
    maxUnit: TimeUnit.Year,
    collectionSeparator: ", ",
    toWords: false
);
```

These helpers are powered by `ITimeSpanHumanizeStrategy` and localized unit
names (second(s), minute(s), hour(s), …).

## 3. ToAge

For age‑style phrasing, use `ToAge` on either `DateTime` or `TimeSpan`:

```csharp
someBirthDate.ToAge();          // "18 years"
span.ToAge(culture: "en-US");
```

The exact wording depends on culture (e.g., placement of the unit, plural rules).

## 4. DateTime.ToOrdinalWords

This builds on both number and date formatting:

```csharp
var date = new DateTime(2015, 1, 1);

date.ToOrdinalWords("en-US");   // "January 1st, 2015"
date.ToOrdinalWords("en-GB");   // "1st January 2015"
```

Different cultures can plug in their own templates for day/month ordering and
separator wording.

## 5. TimeOnly.ToClockNotation

Human‑style clock descriptions:

```csharp
new TimeOnly(14, 30).ToClockNotation("en");   // "half past two"
new TimeOnly(12, 00).ToClockNotation("en");   // "noon"
new TimeOnly(0, 00).ToClockNotation("en");    // "midnight"
```

Additional cultures (such as `pt-BR`) can define their own idioms.

## 6. Testing notes

The DateTime & TimeSpan test suites intentionally mirror the original Humanizer
README examples and add:

- boundary checks around 44/45 seconds, 104/105 seconds
- multiple unit combinations for `TimeSpan.Humanize(precision: n)`
- culture‑specific expectations for `ToOrdinalWords` and `ToClockNotation`

When you adjust precision or add a new culture, pair the change with tests so
that relative time phrasing stays stable across releases.
