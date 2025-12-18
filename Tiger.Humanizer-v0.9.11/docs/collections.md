# Collections humanization

`Tiger.Humanizer` provides a simple way to turn collections into human-readable lists.

```csharp
using Tiger.Humanizer;

var items = new[] { "A", "B", "C" };

var result = items.Humanize(); // "A, B and C"
```

You can customize the separators and formatting:

```csharp
var result = items.Humanize(
    formatter: x => x.ToUpperInvariant(),
    separator: " | ",
    lastSeparator: " or ");
// "A | B or C"
```
