# Project AI Instructions

These instructions orient AI coding agents to this LitElement + TypeScript component and docs site.

## Big Picture
- Single exported web component `KanaControl` (`src/kana-control.ts`) compiled to root `kana-control.js` + type defs via `tsc` (see `tsconfig.json`).
- Build output mirrors `src/` tree into root: `src/test/kana-control_test.ts` -> `test/kana-control_test.js`.
- Docs static site lives in `docs-src/` (Eleventy templates) and is generated into `docs/`; Rollup bundling/minification is ONLY for docs (`rollup.config.js`). Do not introduce app bundling for NPM publish.
- Custom Elements Manifest produced by `npm run analyze` to `custom-elements.json` for tooling.

## Key Workflows
- Install: `npm i`
- Build once: `npm run build`; watch: `npm run build:watch`.
- Clean generated artifacts before a fresh build: `npm run clean`.
- Dev preview (Lit dev mode): `npm run serve` -> http://localhost:8000/ (component demo in `dev/index.html`). Prod mode: `MODE=prod npm run serve:prod`.
- Docs pipeline: `npm run docs` (cleans, builds component, analyzes, rollup bundle to `docs/kana-control.bundled.js`, copies assets, runs Eleventy). Watch docs content: `npm run docs:gen:watch`. Serve generated site: `npm run docs:serve`.
- Size check (gzip bundle heuristic): `npm run checksize` (temporary `kana-control.bundled.js`).
- Component analysis (update manifest): `npm run analyze` (+ `analyze:watch`).
- Publish release: push tag `vX.Y.Z` -> `.github/workflows/publish.yml` builds & tests then `npm publish` (tag `latest`).
- Canary publish: every push to `main` runs `.github/workflows/canary.yml` generating ephemeral version `BASE-canary.<shortsha>` and publishes with dist-tag `canary` (install via `npm i kana-control@canary`).

## Testing
- Test suites authored in TS under `src/test/`; compiled JS lives in `test/` and matched by pattern `./test/**/*_test.js` in `web-test-runner.config.js`.
- Full test matrix (dev + prod): `npm test` (runs `test:dev` then `test:prod`).
- Watch mode (dev): `npm test:watch`; production watch: `npm run test:prod:watch`.
- Limit browsers: prepend `BROWSERS=chromium,firefox` etc. to test scripts.
- `MODE=prod` env variable switches export conditions to production for both server and test runner configs; ensure this for production-specific regressions.

## Conventions & Patterns
- LitElement usage: properties declared with `@property()` decorator; numeric types specify `{type: Number}`; avoid adding side effects in `render()` other than template generation.
- Events: dispatch custom events (`count-changed`) without detail payload here—extend if needed by adding `{detail: {...}}` when modifying.
- Styles: static `styles` export using `css` tagged template; keep host-level styles minimal and component-scoped.
- Tests assert shadow DOM structure via `@open-wc/testing` `assert.shadowDom.equal`; maintain deterministic markup order for reliability.
- Do NOT alter Rollup config for publishing—README clarifies publishing should remain unbundled; keep build script as plain `tsc`.
- Strict TypeScript & lit template checking enforced (see `tsconfig.json` plugins: `ts-lit-plugin`). If loosening rules, document specific compiler flag changes in this file.
- Avoid adding new global build steps; prefer extending existing npm scripts if necessary (e.g., add a post-build script rather than replacing `build`).

## External Integrations
- Eleventy config `.eleventy.cjs` drives docs generation; examples and API docs in `docs-src/` transform into static `docs/` folder for GitHub Pages.
- Legacy browser support handled via `@web/dev-server-legacy` plugin configuration in `web-dev-server.config.js` and `web-test-runner.config.js`; polyfills intentionally toggled (e.g., webcomponents disabled during dev server, enabled in tests).

## Safe Editing Guidance
 - When changing component API (properties, events, slots, css parts), update: source (`src/kana-control.ts`), tests, docs examples (`docs-src/examples/*.md`), and regenerate manifest (`npm run analyze`).
- Keep output paths stable: changing `outDir` or `rootDir` in `tsconfig.json` will break docs & tests path assumptions.
- For new components, replicate pattern (TS in `src/`, tests under `src/test/`, no bundling for publish) and update docs & manifest script globs.

## Quick Checklist (before PR)
- Build succeeds (`npm run build`).
- Tests pass in dev & prod (`npm test`).
- Manifest updated if API changed (`npm run analyze`).
- Docs regenerate if docs content or bundle changed (`npm run docs`).
- No unintended Rollup/publish changes.

Feedback welcome: clarify any section that feels incomplete or project-specific nuances to add.
