# Numbers & Quantities – Tiger.Humanizer

This document groups all “numbers and quantities” helpers in Tiger.Humanizer.
The goal is to turn dry numeric values into readable, friendly phrases without
losing precision when you need it.

## 1. ToQuantity

Attach the correct quantity and pluralization to a word:

```csharp
"case".ToQuantity(0);                 // "0 cases"
"case".ToQuantity(1);                 // "1 case"
"case".ToQuantity(5);                 // "5 cases"
```

You can control how the numeric part is rendered:

```csharp
"file".ToQuantity(2, ShowQuantityAs.None);   // "files"
"file".ToQuantity(2, ShowQuantityAs.Words);  // "two files"
```

## 2. Ordinalize

Turn numbers into `1st / 2nd / 3rd / ...`:

```csharp
1.Ordinalize();       // "1st"
2.Ordinalize();       // "2nd"
23.Ordinalize();      // "23rd"

"1".Ordinalize();     // "1st"
"42".Ordinalize();    // "42nd"  // based on locale rules
```

Locale‑aware variants (e.g., `pt-BR`) can take grammatical gender into account.

## 3. Titleize / Pascalize / Camelize / Underscore / Dasherize / Kebaberize

Helpers for jumping between common naming styles:

```csharp
"some value".Titleize();      // "Some Value"
"SomeValue".Underscore();     // "some_value"
"SomeValue".Kebaberize();     // "some-value"
"some_value".Pascalize();     // "SomeValue"
"some_value".Camelize();      // "someValue"
```

These functions are used everywhere inside Promptly / HumanLiker to keep model
names and metric labels consistent.

## 4. Fluent numeric magnitudes

Convenience extension methods for building large numbers in a readable way:

```csharp
2.Millions();     // 2_000_000
5.Thousands();    // 5_000
3.Billions();     // 3_000_000_000
```

Combined with date helpers, this makes configuration code easier to scan.

## 5. NumberToWords / ToOrdinalWords

Convert integers into full English words:

```csharp
0.ToWords();                  // "zero"
15.ToWords();                 // "fifteen"
3501.ToWords();               // "three thousand five hundred and one"

1.ToOrdinalWords();           // "first"
22.ToOrdinalWords();          // "twenty-second"
```

These APIs are also used by higher‑level helpers such as
`DateTime.ToOrdinalWords()`.

## 6. WordsToNumber / TryToNumber

Parse simple English number phrases back into integers:

```csharp
"one hundred and two".ToNumber();          // 102
"five thousand".ToNumber();                // 5000

int value;
if ("not a number".TryToNumber(out value))
{
    // parsed successfully
}
else
{
    // value is 0, and you know parsing failed
}
```

Currently the implementation focuses on practical English phrases. For anything
outside the supported range, you can fall back to your own parser.

## 7. Testing checklist

The `NumbersAndQuantitiesTests` suite aims to cover:

- edge cases around 0, 1, 2 and powers of ten
- large numbers (thousands, millions, billions)
- ordinal corner cases (11th, 12th, 13th, 111th, …)
- round‑trip behaviour for `WordsToNumber` where possible

If you extend the number system (for example, add support for another language),
mirror the English tests with localized expectations so behaviour stays
predictable.
