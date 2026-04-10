# AGENTS.md

This file provides guidance to the coding agents when working with code in this repository.

## Commands

```bash
npm run build          # Compile TypeScript to dist/
npm test               # Run all Jest tests (requires .env with TOKEN=)
npm run check          # Lint and format with Biome (auto-fix)
```

Run a single test by name:
```bash
npm test -- --testNamePattern="test name here"
```

Tests hit the real Scrape.do API — a `.env` file with `TOKEN=<api_token>` is required.

## Architecture

This is a TypeScript client library for the [Scrape.do](https://scrape.do) web scraping API. It compiles to CommonJS in `dist/` and is published as `@scrape-do/client`.

**Source files** (`src/`):
- `lib.ts` — The `ScrapeDo` class: `sendRequest(method, options, body?)` builds query params and calls `makeRequest()`, which uses the native `https` module. `statistics()` hits the stats endpoint.
- `types.ts` — All TypeScript interfaces: `RequestOptions`, `Response`, `StatisticsResponse`, etc.
- `geocode.ts` — Enum of country/region codes passed as `geoCode` options.
- `playwithbrowser.ts` — Types for browser automation actions (`playWithBrowser` option).

**Request flow**: `sendRequest` → serializes `options` into query params (arrays become `key[0]=val` style, nested objects handled recursively) → `makeRequest` performs the HTTPS request → response is returned as `Response` with status, headers, body, and parsed JSON if applicable.

**Key design detail**: The `token` is always injected as the first query param. Custom/extra/forward headers are serialized with different key prefixes. The `playWithBrowser` array of actions is JSON-stringified into a single query param.
