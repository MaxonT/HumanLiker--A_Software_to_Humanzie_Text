using System.Globalization;
using Tiger.Humanizer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapPost("/api/humanizer/playground", (PlaygroundRequest request) =>
{
    var culture = string.IsNullOrWhiteSpace(request.Culture)
        ? CultureInfo.InvariantCulture
        : new CultureInfo(request.Culture);

    var kind = request.Kind?.ToLowerInvariant().Trim() ?? "string";

    PlaygroundResponse response = kind switch
    {
        "string" => HandleString(request, culture),
        "number" => HandleNumber(request, culture),
        "datetime" => HandleDateTime(request, culture),
        "timespan" => HandleTimeSpan(request, culture),
        "collection" => HandleCollection(request, culture),
        _ => HandleString(request, culture)
    };

    return Results.Ok(response);
});

app.Run();

static PlaygroundResponse HandleString(PlaygroundRequest request, CultureInfo culture)
{
    var value = request.Value ?? string.Empty;

    var humanized = value.Humanize(culture);
    var pascal = value.Dehumanize();
    var title = value.Transform(To.TitleCase, culture);
    var truncated = value.Truncate(24);

    return new PlaygroundResponse(
        Kind: "string",
        Culture: culture.Name,
        Original: value,
        Humanized: humanized,
        Reverse: pascal,
        Variant: title,
        Extra: truncated
    );
}

static PlaygroundResponse HandleNumber(PlaygroundRequest request, CultureInfo culture)
{
    var raw = request.Value ?? string.Empty;
    if (!decimal.TryParse(raw, NumberStyles.Any, culture, out var number))
    {
        return new PlaygroundResponse(
            Kind: "number",
            Culture: culture.Name,
            Original: raw,
            Humanized: "invalid number",
            Reverse: string.Empty,
            Variant: string.Empty,
            Extra: string.Empty
        );
    }

    var quantity = "case".ToQuantity((int)number, ShowQuantityAs.Words, culture);
    var cardinal = number.ToWords(culture);
    var ordinal = ((int)number).ToOrdinalWords(culture);

    return new PlaygroundResponse(
        Kind: "number",
        Culture: culture.Name,
        Original: raw,
        Humanized: quantity,
        Reverse: cardinal,
        Variant: ordinal,
        Extra: number.ToString(culture)
    );
}

static PlaygroundResponse HandleDateTime(PlaygroundRequest request, CultureInfo culture)
{
    var raw = request.Value ?? string.Empty;
    if (!DateTime.TryParse(raw, culture, DateTimeStyles.AssumeLocal, out var dt))
    {
        return new PlaygroundResponse(
            Kind: "datetime",
            Culture: culture.Name,
            Original: raw,
            Humanized: "invalid datetime",
            Reverse: string.Empty,
            Variant: string.Empty,
            Extra: string.Empty
        );
    }

    var now = DateTime.Now;
    var relative = dt.Humanize(dateToCompareAgainst: now, culture: culture);
    var age = dt.ToAge(now, culture);
    var ordinal = dt.ToOrdinalWords(culture);

    return new PlaygroundResponse(
        Kind: "datetime",
        Culture: culture.Name,
        Original: raw,
        Humanized: relative,
        Reverse: age,
        Variant: ordinal,
        Extra: dt.ToString(culture)
    );
}

static PlaygroundResponse HandleTimeSpan(PlaygroundRequest request, CultureInfo culture)
{
    var raw = request.Value ?? string.Empty;

    if (!TimeSpan.TryParse(raw, culture, out var ts))
    {
        return new PlaygroundResponse(
            Kind: "timespan",
            Culture: culture.Name,
            Original: raw,
            Humanized: "invalid timespan",
            Reverse: string.Empty,
            Variant: string.Empty,
            Extra: string.Empty
        );
    }

    var basic = ts.Humanize(culture: culture);
    var precise = ts.Humanize(precision: 2, culture: culture);
    var words = ts.Humanize(toWords: true, culture: culture);

    return new PlaygroundResponse(
        Kind: "timespan",
        Culture: culture.Name,
        Original: raw,
        Humanized: basic,
        Reverse: precise,
        Variant: words,
        Extra: ts.ToString()
    );
}

static PlaygroundResponse HandleCollection(PlaygroundRequest request, CultureInfo culture)
{
    var raw = request.Value ?? string.Empty;
    var parts = raw.Split(new[] { ',', ';', '|' }, StringSplitOptions.RemoveEmptyEntries)
        .Select(x => x.Trim())
        .Where(x => !string.IsNullOrWhiteSpace(x))
        .ToArray();

    var humanized = parts.Humanize(culture: culture);
    var orList = parts.Humanize("or", culture: culture);

    return new PlaygroundResponse(
        Kind: "collection",
        Culture: culture.Name,
        Original: raw,
        Humanized: humanized,
        Reverse: orList,
        Variant: string.Join(" | ", parts),
        Extra: parts.Length.ToString(CultureInfo.InvariantCulture)
    );
}

public record PlaygroundRequest(string Kind, string Culture, string Value);

public record PlaygroundResponse(
    string Kind,
    string Culture,
    string Original,
    string Humanized,
    string Reverse,
    string Variant,
    string Extra
);
