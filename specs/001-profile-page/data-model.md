# Data Model: Profile Page

## YAML Configuration Schema (`profile.yml`)

### Profile (root object)

| Field    | Type   | Required | Description                                    |
|----------|--------|----------|------------------------------------------------|
| name     | string | Yes      | Display name shown on the card                 |
| bio      | string | No       | Short bio text below the name                  |
| avatar   | string | Yes      | Path to local image file or external URL        |
| sns      | list   | No       | Ordered list of SNS Link objects               |

### SNS Link (list item under `sns`)

| Field    | Type   | Required | Description                                    |
|----------|--------|----------|------------------------------------------------|
| platform | string | Yes      | Platform identifier (known slug or custom name) |
| url      | string | Yes      | Full URL to the owner's profile                |
| label    | string | No       | Custom display label (defaults to platform name)|

### Known Platform Registry

Known platforms have associated SVG icons. The platform
field value is matched case-insensitively.

| Slug       | Display Name | Has Icon |
|------------|-------------|----------|
| x          | X           | Yes      |
| github     | GitHub      | Yes      |
| linkedin   | LinkedIn    | Yes      |
| instagram  | Instagram   | Yes      |
| facebook   | Facebook    | Yes      |
| youtube    | YouTube     | Yes      |

Any `platform` value not in this list is treated as a
custom platform (no icon, name displayed as-is or via
`label` override).

## Example YAML

```yaml
name: "Kuchitama"
bio: "Software Engineer"
avatar: "images/avatar.png"
sns:
  - platform: x
    url: "https://x.com/kuchitama"
  - platform: github
    url: "https://github.com/Kuchitama"
  - platform: linkedin
    url: "https://linkedin.com/in/kuchitama"
  - platform: my-blog
    url: "https://blog.example.com"
    label: "Blog"
```

## Validation Rules

- `name` MUST be a non-empty string.
- `avatar` MUST be a non-empty string. If it starts with
  `http://` or `https://`, it is treated as an external URL.
  Otherwise, it is treated as a local file path relative to
  the repository root, and the file MUST exist at build time.
- Each SNS entry MUST have both `platform` and `url` fields.
- `url` MUST start with `http://` or `https://`.
- `sns` list may be empty or omitted (zero links is valid).
- `bio` may be omitted (card renders without bio section).

## Entity Relationships

```text
Profile (1) ──has──▶ (0..*) SNS Link
Profile (1) ──has──▶ (1) Avatar (local file or external URL)
Theme ──selected by──▶ Browser prefers-color-scheme
```

## State Transitions

This is a static site with no runtime state. The only
"state" is the build-time transformation:

```text
YAML config + Template + Icons
        │
        ▼ (build.ts via tsx)
  Static HTML + CSS
        │
        ▼ (GitHub Actions)
  Deployed to GitHub Pages
```
