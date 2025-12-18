# Tiger.Humanizer v0.8.0

This is the eighth incremental step towards a full Humanizer clone.

Included in this version:

- Everything from v0.7.0 (string/enum/date-time/collections/inflector, quantities, ordinalization, casing helpers, plus the shared configurator & vocabulary).
- Basic `WordsToNumber` / `TryToNumber` support for English cardinal number phrases.

- New fluent helpers:
  - TimeSpan helpers on numeric literals:
    - `2.Days()`, `5.Hours()`, `30.Minutes()`, `500.Milliseconds()`, `3.Weeks()`.
  - Number magnitude helpers:
    - `3.Hundreds()` → `300`
    - `5.Thousands()` → `5000`
    - `2.Millions()` → `2000000`
    - `1.25.Billions()` → `1250000000d`
    - Chaining like `3.Hundreds().Thousands()` → `300000`.
  - Fluent date helpers:
    - `On.January.The4th` / `On.December.The(25)` produce concrete `DateTime` values for the current (or specified) year.
- New high-level date/time phrasing:
  - `DateTime.ToOrdinalWords(culture)`:
    - `new DateTime(2015, 1, 4).ToOrdinalWords("en-GB")` → `"4th January 2015"`.
    - `new DateTime(2015, 1, 4).ToOrdinalWords("en-US")` → `"January 4th, 2015"`.
  - `TimeOnly.ToClockNotation(culture)` (English):
    - `new TimeOnly(3, 0).ToClockNotation()` → `"three o'clock"`.
    - `new TimeOnly(14, 30).ToClockNotation()` → `"half past two"`.
    - `new TimeOnly(17, 45).ToClockNotation()` → `"quarter to six"`.
    - `new TimeOnly(12, 0).ToClockNotation()` → `"noon"`.
    - `new TimeOnly(0, 0).ToClockNotation()` → `"midnight"`.

You can build and (once projects are wired up) run tests with:

```bash
dotnet test
```

Next steps will add:

- Culture-aware behaviours and locale-specific packages built on top of the existing English core.
- A playground UI for exploring all Humanizer behaviours in your Promptly / HumanLiker visual style.
