<!--
  Sync Impact Report
  ===================
  Version change: N/A → 1.0.0 (initial ratification)
  Added principles:
    - I. Configuration-Driven
    - II. Static-First
    - III. Theme Adaptability
    - IV. Automated Deployment
    - V. Simplicity & Maintainability
  Added sections:
    - Technology Constraints
    - Development Workflow
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed (generic)
    - .specify/templates/spec-template.md ✅ no changes needed (generic)
    - .specify/templates/tasks-template.md ✅ no changes needed (generic)
  Follow-up TODOs: none
-->

# Profile Page Constitution

## Core Principles

### I. Configuration-Driven

All personal data (name, icon image path, SNS account links,
bio text) MUST be defined in a single YAML configuration file.
HTML output MUST be generated from this YAML at build time.
No personal data may be hard-coded in templates or scripts.
Rationale: enables non-developer edits and keeps content
separate from presentation.

### II. Static-First

The final output MUST be pure static HTML and CSS with no
server-side runtime. JavaScript is permitted only for
progressive enhancement (e.g., theme toggle override) and
MUST NOT be required for core functionality (displaying
profile info and SNS links). No heavy frontend frameworks
(React, Vue, etc.) are allowed.

### III. Theme Adaptability

The page MUST support both light mode and dark mode,
switching automatically via CSS `prefers-color-scheme` media
query based on the visitor's browser/OS setting. Both themes
MUST maintain sufficient contrast ratios (WCAG AA minimum).
A manual toggle is optional but MUST NOT break the automatic
behavior.

### IV. Automated Deployment

The site MUST be built and deployed exclusively through
GitHub Actions. The workflow MUST: (1) read the YAML config,
(2) generate static HTML/CSS, (3) deploy to GitHub Pages.
Manual deployment steps are not acceptable. The build MUST
be reproducible given the same inputs.

### V. Simplicity & Maintainability

Dependencies MUST be kept to the minimum necessary.
Prefer standard-library or single-purpose tools over large
frameworks. The build process MUST be understandable by
reading the workflow file alone. Adding a new SNS link MUST
require only a YAML edit, not a code change.

## Technology Constraints

- **Output**: Single-page static HTML + CSS hosted on
  GitHub Pages
- **Config format**: YAML (single file at repository root,
  e.g., `profile.yml`)
- **Build tool**: Lightweight templating (e.g., Python
  Jinja2, Node.js Handlebars, or shell-based) — chosen tool
  MUST be installable via a single package manager command
- **CI/CD**: GitHub Actions with `actions/deploy-pages`
- **Design reference**: Prairie card style — centered card
  layout with avatar, name, bio, and vertically stacked
  SNS link buttons
- **Browser support**: Modern evergreen browsers
  (Chrome, Firefox, Safari, Edge latest 2 versions)

## Development Workflow

- All changes are made on feature branches and merged to
  `main` via pull request.
- The GitHub Actions workflow triggers on push to `main`
  and deploys automatically.
- YAML config changes are validated in CI before deployment
  (schema check or build-failure-as-gate).
- Visual review of dark/light themes SHOULD be performed
  before merging UI changes.

## Governance

This constitution defines the guiding principles for the
Profile Page project. All implementation decisions MUST
align with the principles above.

- **Amendments** require a documented rationale and MUST
  update the version number below.
- **Versioning**: MAJOR for principle removal/redefinition,
  MINOR for new principles or expanded guidance, PATCH for
  clarifications.
- Compliance is verified during specification and plan
  review via the Constitution Check section in plan
  documents.

**Version**: 1.0.0 | **Ratified**: 2026-03-17 | **Last Amended**: 2026-03-17
