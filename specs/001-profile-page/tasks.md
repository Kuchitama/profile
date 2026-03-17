# Tasks: Profile Page

**Input**: Design documents from `/specs/001-profile-page/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Tests**: Not explicitly requested in the spec. Tests are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and shared config files

- [x] T001 Initialize Node.js project with package.json (run `npm init -y` and add dependencies: js-yaml, handlebars, tsx, typescript, @types/js-yaml)
- [x] T002 Create tsconfig.json with strict mode, ESM module resolution, Node.js 20+ target
- [x] T003 [P] Create .gitignore with entries for node_modules/, dist/, and .DS_Store
- [x] T004 [P] Create images/ directory with a placeholder .gitkeep file
- [x] T005 [P] Create profile.yml.example with sample config per data-model.md schema in profile.yml.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build script core, TypeScript types, and Handlebars template skeleton that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Define TypeScript interfaces for Profile config (ProfileConfig, SnsLink) in build.ts matching data-model.md schema
- [x] T007 Implement YAML loading and validation logic in build.ts: read profile.yml, parse with js-yaml, validate required fields (name, avatar) and fail build if missing, warn and skip SNS entries with malformed URLs (not starting with http(s)), check local avatar file exists
- [x] T008 Create base Handlebars template skeleton in templates/index.html.hbs with HTML5 doctype, viewport meta, empty `<style>` block, and `<main>` container with Handlebars placeholders for name, bio, avatar
- [x] T009 Implement Handlebars compilation and HTML generation in build.ts: load template, compile with profile data, write output to dist/index.html (create dist/ directory if missing)
- [x] T010 Add npm script `"build": "tsx build.ts"` in package.json and verify end-to-end: profile.yml.example → dist/index.html

**Checkpoint**: `npx tsx build.ts` successfully generates dist/index.html from a sample YAML config

---

## Phase 3: User Story 1 - View Profile Card (Priority: P1) MVP

**Goal**: Display a centered Prairie card with avatar, name, and bio

**Independent Test**: Open dist/index.html in a browser and confirm the avatar, name, and bio are visible and centered on a clean card

### Implementation for User Story 1

- [x] T011 [US1] Add profile card HTML structure in templates/index.html.hbs: centered card container with avatar `<img>`, name `<h1>`, and bio `<p>` using Handlebars `{{name}}`, `{{bio}}`, `{{avatar}}` variables
- [x] T012 [US1] Add light mode base CSS in templates/index.html.hbs `<style>` block: CSS custom properties for colors (--bg, --card-bg, --text, --text-secondary, --shadow), body centering with flexbox, card styles (max-width, border-radius, padding, box-shadow)
- [x] T013 [US1] Style avatar image in templates/index.html.hbs: circular crop (border-radius: 50%), fixed size (e.g., 120px), centered above name
- [x] T014 [US1] Style name and bio typography in templates/index.html.hbs: font-family (system font stack), font sizes, line-height, color using CSS custom properties
- [x] T015 [US1] Add responsive CSS in templates/index.html.hbs: card scales down on narrow viewports (min-width: 320px), appropriate padding adjustments with media query
- [x] T016 [US1] Handle avatar source in build.ts: if avatar starts with http(s) use URL directly, otherwise copy local file to dist/ and set relative path in template data
- [x] T017 [US1] Add avatar fallback styling in templates/index.html.hbs: CSS for broken image state (background-color placeholder), and `onerror` inline handler to show initials or generic icon for external URL avatars that fail to load
- [x] T018 [US1] Create profile.yml with real user data (name, bio, avatar path) and build to verify card renders correctly

**Checkpoint**: Card displays centered with avatar, name, and bio. Page is responsive from 320px to 2560px.

---

## Phase 4: User Story 2 - Browse SNS Links (Priority: P1)

**Goal**: Display vertically stacked SNS link buttons with platform icons for known platforms

**Independent Test**: Click each SNS link button and verify correct URL opens in new tab

### Implementation for User Story 2

- [x] T019 [US2] Define known platform registry in build.ts: map of platform slugs (x, github, linkedin, instagram, facebook, youtube) to display names and inline SVG path data from Simple Icons
- [x] T020 [US2] Register Handlebars helper in build.ts to look up platform icon SVG by slug (returns SVG markup for known platforms, empty string for unknown)
- [x] T021 [US2] Add SNS links section to templates/index.html.hbs: `{{#each sns}}` loop rendering `<a>` buttons with `target="_blank"` and `rel="noopener noreferrer"`, calling icon helper `{{{platformIcon platform}}}`, displaying label or platform display name
- [x] T022 [US2] Style SNS link buttons in templates/index.html.hbs: vertical stack layout, consistent button styling (width, padding, border-radius, hover effect), SVG icon sizing (20px inline, fill: currentColor), spacing between buttons
- [x] T023 [US2] Handle zero SNS entries in templates/index.html.hbs: `{{#if sns.length}}` conditional to render nothing when list is empty
- [x] T024 [US2] Add SNS entries to profile.yml (at least 3 links including one custom platform) and verify all buttons render with correct icons and links

**Checkpoint**: SNS buttons display below profile card. Known platforms show icons. Links open in new tabs. Empty SNS list renders cleanly.

---

## Phase 5: User Story 3 - Dark and Light Mode (Priority: P2)

**Goal**: Page automatically adapts to browser dark/light mode preference via CSS

**Independent Test**: Toggle OS dark/light mode setting and verify page theme changes accordingly without reload

### Implementation for User Story 3

- [x] T025 [US3] Add dark mode CSS custom properties in templates/index.html.hbs: `@media (prefers-color-scheme: dark)` block overriding --bg, --card-bg, --text, --text-secondary, --shadow with dark theme values
- [x] T026 [US3] Ensure SNS button styles adapt to dark mode in templates/index.html.hbs: button background, border, hover state, and text colors use CSS custom properties
- [x] T027 [US3] Verify WCAG AA contrast ratios: check light mode text/bg (minimum 4.5:1 for normal text) and dark mode text/bg meet minimum ratios, adjust color values if needed

**Checkpoint**: Page renders correctly in both dark and light modes. Theme switches automatically without reload. Contrast meets WCAG AA.

---

## Phase 6: User Story 4 - YAML-Driven Configuration (Priority: P2)

**Goal**: All personal content is driven by YAML config; changing YAML and rebuilding reflects changes

**Independent Test**: Change a value in profile.yml, run build, verify output HTML reflects the change

### Implementation for User Story 4

- [x] T028 [US4] Add build-time validation error messages in build.ts: fail with clear error for missing profile.yml and missing required fields (name, avatar); for invalid SNS entries (missing platform/url) and malformed URLs, emit warning and skip the entry without failing the build
- [x] T029 [US4] Handle optional fields gracefully in build.ts: bio omission renders card without bio paragraph, empty sns list renders card without links section
- [x] T030 [US4] Update profile.yml.example with comprehensive example covering all fields (name, bio, avatar as local file, SNS with known and custom platforms) and inline comments explaining each field (extends T005 minimal stub)

**Checkpoint**: Editing profile.yml and rebuilding reflects all changes. Invalid config produces clear error messages. Optional fields work when omitted.

---

## Phase 7: User Story 5 - Automated Build and Deploy (Priority: P3)

**Goal**: GitHub Actions workflow builds HTML from YAML and deploys to GitHub Pages on push to main

**Independent Test**: Push a YAML change to main and verify the live GitHub Pages site updates within minutes

### Implementation for User Story 5

- [x] T031 [US5] Create GitHub Actions workflow in .github/workflows/deploy.yml: trigger on push to main, checkout repo, setup Node.js 20, npm ci, npx tsx build.ts, upload dist/ as pages artifact, deploy to GitHub Pages
- [x] T032 [US5] Configure GitHub Pages deployment in .github/workflows/deploy.yml: use actions/configure-pages, actions/upload-pages-artifact (path: dist/), and actions/deploy-pages with proper permissions (pages: write, id-token: write)
- [x] T033 [US5] Add concurrency control to .github/workflows/deploy.yml: group by "pages", cancel-in-progress: false to prevent deployment conflicts

**Checkpoint**: Pushing to main triggers automatic build and deployment to GitHub Pages. Build failure on invalid YAML prevents broken deployment.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that span multiple user stories

- [x] T034 [P] Add HTML `<meta>` tags in templates/index.html.hbs: charset, description, og:title, og:image for social sharing
- [x] T035 [P] Add favicon support: include `<link rel="icon">` in template, optionally generated from avatar
- [x] T036 Verify full build pipeline end-to-end: npm ci → npx tsx build.ts → open dist/index.html, check all stories work together, verify dist/index.html total page size < 50KB
- [x] T037 Run quickstart.md verification checklist: confirm all items pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (Phase 2)
- **US2 (Phase 4)**: Depends on Foundational (Phase 2), can run in parallel with US1
- **US3 (Phase 5)**: Depends on US1 (Phase 3) — needs base CSS custom properties
- **US4 (Phase 6)**: Depends on Foundational (Phase 2) — can run after Phase 2
- **US5 (Phase 7)**: Depends on US1 (Phase 3) — needs working build to deploy
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Foundational only — no other story dependencies
- **US2 (P1)**: Foundational only — independent of US1 (both modify template but different sections)
- **US3 (P2)**: Depends on US1 — extends the CSS custom properties defined in US1
- **US4 (P2)**: Foundational only — validates/extends build.ts from Phase 2
- **US5 (P3)**: Depends on US1 — needs a working build pipeline to deploy

### Recommended Execution Order (Solo Developer)

1. Phase 1 → Phase 2 (Setup + Foundation)
2. Phase 3 (US1: Profile Card) — **MVP milestone**
3. Phase 4 (US2: SNS Links)
4. Phase 5 (US3: Dark/Light Mode)
5. Phase 6 (US4: YAML Validation)
6. Phase 7 (US5: GitHub Actions Deploy)
7. Phase 8 (Polish)

### Parallel Opportunities

- T003, T004, T005 can run in parallel (Setup phase)
- US1 and US2 can run in parallel after Phase 2 (different template sections)
- US4 can run in parallel with US3 (different concerns: validation vs. CSS)
- T034, T035 can run in parallel (Polish phase)

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Profile Card)
4. Complete Phase 4: US2 (SNS Links)
5. **STOP and VALIDATE**: Open dist/index.html, verify card + links work
6. Manually upload dist/ to test deployment if needed

### Incremental Delivery

1. Setup + Foundational → Build pipeline ready
2. US1 → Profile card visible → **MVP!**
3. US2 → SNS links functional → Core product complete
4. US3 → Dark/light mode → Polished UX
5. US4 → Validation hardened → Production-ready config
6. US5 → Auto-deploy → Fully automated
7. Polish → Meta tags, favicon → Launch-ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No test tasks generated (tests not requested in spec)
