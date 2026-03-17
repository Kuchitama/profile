# Implementation Plan: Profile Page

**Branch**: `001-profile-page` | **Date**: 2026-03-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-profile-page/spec.md`

## Summary

Build a Prairie card-style single-page profile site hosted on GitHub Pages.
A TypeScript build script reads a YAML config file (`profile.yml`) containing
the owner's name, bio, avatar, and SNS links, then generates a static
`index.html` with inline CSS. The page supports automatic dark/light mode
via `prefers-color-scheme`. Known SNS platforms display inline SVG icons
from Simple Icons. GitHub Actions automates the build and deployment on
every push to main.

## Technical Context

**Language/Version**: TypeScript 5.x (Node.js 20+)
**Primary Dependencies**: js-yaml, Handlebars (template engine)
**Storage**: N/A (static site, YAML config file)
**Testing**: Manual browser testing + CI build validation
**Target Platform**: GitHub Pages (static hosting), modern evergreen browsers
**Project Type**: Static site generator (single-page)
**Performance Goals**: Page load < 2 seconds, total page size < 50KB
**Constraints**: No server-side runtime, no heavy JS frameworks, minimal dependencies
**Scale/Scope**: Single page, single user, ~6 known SNS platforms

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle                     | Status | Evidence                                                    |
|-------------------------------|--------|-------------------------------------------------------------|
| I. Configuration-Driven       | PASS   | All content from `profile.yml`, no hard-coded data          |
| II. Static-First              | PASS   | Pure HTML+CSS output, no required JS, no frameworks         |
| III. Theme Adaptability       | PASS   | CSS `prefers-color-scheme` + custom properties, WCAG AA     |
| IV. Automated Deployment      | PASS   | GitHub Actions workflow builds and deploys on push to main  |
| V. Simplicity & Maintainability | PASS | Few npm packages, single build script, YAML-only edits      |

**Post-Phase 1 Re-check**: All principles remain satisfied. Inline SVG icons
add zero external dependencies. CSS custom properties keep theme logic simple.
TypeScript adds type safety to YAML parsing and validation with minimal
additional complexity (tsx runner avoids separate compilation step).

## Project Structure

### Documentation (this feature)

```text
specs/001-profile-page/
├── plan.md              # This file
├── research.md          # Phase 0: build tool & icon decisions
├── data-model.md        # Phase 1: YAML schema & entities
├── quickstart.md        # Phase 1: local dev guide
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
profile.yml              # User config (name, bio, avatar, SNS links)
profile.yml.example      # Example config for reference
build.ts                 # TypeScript build script (YAML → HTML)
templates/
└── index.html.hbs       # Handlebars template with inline CSS & SVG icons
images/
└── avatar.png           # Default avatar location (user-provided)
dist/
└── index.html           # Generated output (git-ignored)
package.json             # Node.js project config
tsconfig.json            # TypeScript config
.github/
└── workflows/
    └── deploy.yml       # GitHub Actions: build + deploy to Pages
```

**Structure Decision**: Flat single-project layout at repository root.
No `src/` directory needed — the project is a build script, a template,
and a config file. The `dist/` directory holds the generated output and
is deployed as a GitHub Pages artifact.

## Complexity Tracking

> No constitution violations. This section is intentionally empty.
