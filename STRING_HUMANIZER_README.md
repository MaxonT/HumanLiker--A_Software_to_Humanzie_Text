# StringHumanizer Module

This module provides string manipulation capabilities for the HumanLiker application.

## Features

- **Humanize**: Convert PascalCase, camelCase, snake_case, or kebab-case strings to human-readable format
- **Dehumanize**: Convert human-readable strings back to PascalCase
- **Apply Casing**: Transform strings to different case styles (sentence, title, lower, upper)
- **Truncate**: Shorten strings by character count or word count

## API Endpoint

`POST /api/string/process`

Request body:
```json
{
  "input": "string to process",
  "operation": "humanize|dehumanize|truncate",
  "casing": "sentence|title|lower|upper",
  "length": 50,
  "truncator": "FixedLength|FixedNumberOfWords",
  "from": "Right|Left"
}
```

## Testing

Run all tests with:
```bash
npm test
```

All 41 tests pass successfully.

## Implementation Details

The StringHumanizer module is implemented as a standalone class with static methods for maximum reusability across the application.
