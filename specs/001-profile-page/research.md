# Research: Profile Page

## Decision 1: Build Tool

**Decision**: TypeScript (Node.js 20+) + js-yaml + Handlebars

**Rationale**:
- TypeScript provides type safety for YAML parsing and
  validation, catching config errors at build time
- js-yaml is the standard YAML parser for Node.js
- Handlebars supports `{{#each}}` loops for iterating SNS links
  and `{{#if}}` conditionals for optional fields
- Node.js is pre-installed on GitHub Actions runners
- `tsx` runner allows executing TypeScript directly without a
  separate compile step, keeping the workflow simple
- Single `build.ts` file (~60 lines), readable and maintainable
- User preference: TypeScript over Python

**Alternatives considered**:
- Python 3 + PyYAML + Jinja2: Fewer transitive dependencies
  (3 packages), but user explicitly requested TypeScript.
- Jekyll: 90+ gem dependencies, overkill for single page,
  violates Constitution Principle V (Simplicity).
- Shell + envsubst: Cannot do template loops (disqualifying
  for variable-length SNS link list).

## Decision 2: SNS Platform Icons

**Decision**: Simple Icons SVGs embedded inline in the template

**Rationale**:
- Zero external requests or CDN dependencies (Static-First)
- Each SVG path is ~200-500 bytes, sub-1KB total for 6 icons
- `fill="currentColor"` enables automatic dark/light theme
  adaptation via CSS
- MIT licensed, brand-accurate designs
- Known platforms: X, GitHub, LinkedIn, Instagram, Facebook,
  YouTube (extensible by adding more SVG paths)

**Alternatives considered**:
- Font Awesome CDN: External dependency violates Constitution
  Principle II (Static-First)
- Font Awesome self-hosted: 100KB+ for 6 icons, violates
  Principle V (Simplicity)
- Custom SVGs: Unnecessary effort when Simple Icons exists

## Decision 3: CSS Architecture

**Decision**: Single inline `<style>` block with CSS custom
properties and `prefers-color-scheme` media query

**Rationale**:
- CSS custom properties (variables) enable clean theme
  switching with a single media query override
- Inline style avoids an extra HTTP request
- Single-page site does not benefit from external CSS caching
- No CSS preprocessor needed (Principle V)

**Alternatives considered**:
- External CSS file: Extra request for no caching benefit on
  a single-page site
- Sass/Less: Unnecessary build complexity for ~100 lines CSS
- Tailwind CSS: Heavy framework, violates Principle V

## Decision 4: GitHub Actions Deployment Strategy

**Decision**: Custom workflow with `actions/upload-pages-artifact`
and `actions/deploy-pages`

**Rationale**:
- Official GitHub-supported actions for Pages deployment
- Full control over the build step (run TypeScript build script)
- Workflow file is self-documenting
- Supports GitHub Pages "GitHub Actions" source setting

**Alternatives considered**:
- `gh-pages` branch approach: Works but requires force-pushing
  to a branch, less clean than the artifact-based approach
- Jekyll auto-build: Would require adopting Jekyll (rejected
  above)

## Decision 5: TypeScript Execution Strategy

**Decision**: Use `tsx` to run TypeScript directly

**Rationale**:
- `tsx` executes `.ts` files directly without a separate
  `tsc` compilation step
- No `dist/` build artifacts for the build script itself
- Single command: `npx tsx build.ts`
- Keeps the GitHub Actions workflow minimal
- `tsconfig.json` still used for type checking and IDE support

**Alternatives considered**:
- `tsc` + `node`: Requires two-step build (compile TS → run JS),
  adds complexity for a single-file build script
- `ts-node`: Similar to tsx but slower startup and more config
- Deno: Different runtime, would add unfamiliar tooling
