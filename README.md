# HumanLiker - A Software to Humanize Text

## Overview

HumanLiker is a full-featured text humanizer application that rewrites text to sound more natural and human-like. This project is a complete rebuild and enhancement of the original Humanizer project, featuring a modern Express backend and a streamlined frontend interface.

## Features

- **Local-first Processing**: All text processing happens on your machine
- **Multiple Language Support**: English and Chinese text humanization
- **Tone Control**: Adjust tone (Neutral, Friendly, Assertive, Storytelling)
- **Customizable Humanization**: Control naturalness and formality levels
- **Privacy-focused**: No data collection or tracking

## Quick Start

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Development Mode

```bash
npm run dev
```

### Running Tests

```bash
npm test
```

## Project Structure

```
├── backend/          # Express server
├── frontend/         # Static HTML, CSS, and JavaScript
├── tests/           # Jest test files
└── package.json     # Project dependencies
```

## Original Project

This project is based on the original [Humanizer](https://github.com/MaxonT/HumanLiker--A_Software_to_Humanzie_Text) repository.

## License

MIT License (see LICENSE.txt)

## Next Steps

- Implement core string manipulation modules
- Add inflector functionality
- Enhance humanization algorithms
- Expand test coverage
