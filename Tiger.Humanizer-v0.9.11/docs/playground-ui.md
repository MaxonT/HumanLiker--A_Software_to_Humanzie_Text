# Playground UI Guide

This document describes how to run and extend the **Tiger.Humanizer Playground UI**.

## 1. What the playground does

The playground is a small, self‑contained demo that lets you try most of the
`Tiger.Humanizer.Core` features from a browser:

- Convert **strings** between coding styles and human‑readable text
- Humanize **enums**
- Humanize **DateTime / DateTimeOffset** values
- Humanize **TimeSpan** intervals and ages
- Work with **numbers and quantities** (ToWords, ToOrdinalWords, ToQuantity, etc.)
- Experiment with different **cultures** (e.g. `en`, `fr`, `es`) at the request level

Internally, the page builds a small JSON payload and sends it to a
backend endpoint such as:

```http
POST /api/humanize
Content-Type: application/json
```

with a body shaped roughly like:

```json
{
  "inputType": "string | enum | datetime | timespan | number | collection",
  "mode": "standard | short | aggressive",
  "culture": "en-US",
  "rawInput": "the original user text or number",
  "options": {
    "letterCasing": "Title | Sentence | Lower | Upper",
    "truncateLength": 80,
    "truncateFrom": "right | left",
    "quantityFormat": "Words | Numeric"
  }
}
```

The backend is responsible for calling into `Tiger.Humanizer.Core`
and returning a structured result.

---

## 2. Running the playground locally

The playground is a single static HTML file. You can open it directly in a
browser, or serve it from any simple static server.

### Option A: open from file system

1. Locate the file:

   ```text
   /playground-ui/index.html
   ```

2. Open it in your browser (double‑click or drag into a tab).

   In this mode, the page runs in **mock mode** – it uses a local JS
   implementation to simulate Humanizer responses so that the UI is always
   interactive, even without a backend.

### Option B: serve from a static web server

You can also serve the playground from a local static server, for example:

```bash
cd playground-ui
python -m http.server 4173
```

Then open:

```text
http://localhost:4173/index.html
```

This is closer to how you would deploy it together with a real backend.

---

## 3. Wiring the UI to a real backend

The JavaScript code in `index.html` is structured around a small helper:

```js
async function runHumanizeRequest(payload) {
  if (useMock) {
    return runMockHumanizer(payload);
  }

  const response = await fetch('/api/humanize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}
```

To connect to a live backend:

1. Expose an API endpoint in your ASP.NET backend that accepts the JSON payload
   and calls into `Tiger.Humanizer.Core`.
2. Make sure the route path matches the one used in `fetch` (by default:
   `/api/humanize`).
3. Set `useMock = false` in the `<script>` section of `index.html`.

A very simple controller could look like:

```csharp
[ApiController]
[Route("api/[controller]")]
public class HumanizeController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] HumanizeRequest request)
    {
        var result = HumanizeDispatcher.Handle(request);
        return Ok(result);
    }
}
```

Where `HumanizeDispatcher` is a small adapter that chooses which extension
methods to call based on `request.InputType`.

---

## 4. Culture handling

The culture dropdown in the UI writes the selected culture code into the payload
(e.g. `"en-US"`, `"fr-FR"`, `"es-ES"`). On the backend you can bind this to
`CultureInfo`:

```csharp
CultureInfo culture = CultureInfo.GetCultureInfo(request.Culture ?? "en-US");
using (new CultureScope(culture))
{
    // Any calls to Tiger.Humanizer.Core here will see this culture
}
```

`CultureScope` can be a small helper that temporarily changes
`CultureInfo.CurrentCulture` and `CultureInfo.CurrentUICulture` within
a `using` block.

This makes it easy to plug in additional locale‑specific behavior later without
changing the playground UI.

---

## 5. Where to extend next

A few natural follow‑ups:

- Add more detailed result cards for numbers (e.g. raw number, ToWords,
  ToOrdinalWords, ToQuantity on the same panel).
- Visualize TimeSpan humanization as a small timeline bar.
- Show the exact method calls made on the backend (for learning / debugging).
- Add per‑locale badges so you can see immediately that the culture switch
  took effect.

The playground is deliberately small and self‑contained so you can keep
iterating on the UI without touching the core library.
