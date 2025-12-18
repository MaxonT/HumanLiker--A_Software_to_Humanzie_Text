# Inflector – Pluralize / Singularize / Vocabulary

This document explains how Tiger.Humanizer handles English word inflection –
turning singular words into plural forms (and back), and extending the vocabulary
with your own domain-specific rules.

## 1. Core APIs

The primary extension methods are available on `string`:

```csharp
"case".Pluralize();        // "cases"
"cases".Singularize();     // "case"
"person".Pluralize();      // "people"
"equipment".Pluralize();   // "equipment" (uncountable)
```

Under the hood all calls are routed through a shared `Vocabulary`:

```csharp
using Tiger.Humanizer.Core.Inflection;

var vocab = Vocabularies.Default;

var plural = vocab.Pluralize("goose");     // "geese"
var single = vocab.Singularize("children");// "child"
```

The default vocabulary ships with a balanced set of:
- **regular rules** (e.g., `cat` → `cats`, `bus` → `buses`)
- **irregular pairs** (`person` ↔ `people`, `mouse` ↔ `mice`, …)
- **uncountables** (`equipment`, `information`, `fish`, …)

## 2. Custom vocabulary rules

For project‑specific terminology you can extend the active vocabulary at runtime.
The most common entry points:

```csharp
Vocabularies.Default.AddIrregular("criterion", "criteria");
Vocabularies.Default.AddUncountable("middleware");
Vocabularies.Default.AddPlural("formula", "formulae");
Vocabularies.Default.AddSingular("data", "datum");
```

After the rules are registered, all `Pluralize()` and `Singularize()` calls
automatically respect them.

## 3. Rule resolution order

When transforming a word, the engine applies rules in the following order:

1. **Exact uncountable match** – returns the original word unchanged.
2. **Explicit irregular mapping** – checks both singular→plural and plural→singular.
3. **Custom plural/singular rules** – regex‑based patterns you add yourself.
4. **Built‑in regular rules** – covers common English endings.
5. **Fallback** – if nothing matches, returns the input unchanged.

This order keeps behaviour predictable: once you mark something as uncountable
or irregular, that decision always wins over generic heuristics.

## 4. Edge cases

The default implementation aims to be practical rather than perfect English grammar.
Some known tricky areas:

- **Brand names & acronyms** – e.g., `"SQL"` or `"iOS"` are left untouched.
- **Hyphenated nouns** – currently treated as a single token (`"runner-up"`).
- **Non‑English words** – may or may not pluralize “nicely”; you can override
  behaviour via custom rules.

If your domain relies on these cases (for example, legal or medical text),
define explicit irregular / uncountable entries to lock in the behaviour you want.

## 5. Testing philosophy

The `Tiger.Humanizer.Core.Tests` project contains Inflector tests that:

- Mirror the original Humanizer README examples.
- Add additional coverage for:
  - irregular pairs
  - uncountables
  - custom rules added at runtime

When you introduce new vocabulary rules, add a small test case alongside them.
That way your pluralization behaviour stays stable even as the rule set grows.
