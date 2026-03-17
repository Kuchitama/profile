# profile Development Guidelines

## Active Technologies
- TypeScript 5.x (Node.js 20+)
- Dependencies: js-yaml, Handlebars, tsx
- Static site generator (single-page)

## Project Structure

```text
profile.yml              # User config (name, bio, avatar, links)
profile.yml.example      # Example config with comments
build.ts                 # Build script (YAML → HTML)
templates/
└── index.html.hbs       # Handlebars template (inline CSS, SVG icons)
images/                  # Avatar and static assets
dist/                    # Generated output (git-ignored)
package.json
tsconfig.json
.github/workflows/
└── deploy.yml           # GitHub Actions: build + deploy to Pages
specs/                   # Feature specifications
.specify/                # Speckit templates and constitution
```

## Commands

```bash
npm install              # Install dependencies
npm run build            # Build dist/index.html from profile.yml
```

## How It Works

1. `build.ts` reads `profile.yml`, validates fields, and compiles `templates/index.html.hbs` with Handlebars
2. Known platforms (x, github, linkedin, instagram, facebook, youtube, speakerdeck) get inline SVG icons from Simple Icons
3. CSS custom properties + `prefers-color-scheme` handle dark/light mode
4. GitHub Actions deploys `dist/` to GitHub Pages on push to main

## YAML Config

- `links` is the primary key for link entries (legacy `sns` key also supported)
- `bio` supports multiline YAML (`|` block scalar) — newlines are rendered as `<br>`
- `avatar` accepts local file path or external URL

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
