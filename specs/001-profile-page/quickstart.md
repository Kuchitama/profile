# Quickstart: Profile Page

## Prerequisites

- Node.js 20+
- npm

## Local Setup

```bash
# Install dependencies
npm install

# Edit your profile
cp profile.yml.example profile.yml
# Edit profile.yml with your details

# Add your avatar image
cp /path/to/your/avatar.png images/avatar.png

# Build the page
npx tsx build.ts

# Open in browser
open dist/index.html
```

## Configuration

Edit `profile.yml` at the repository root:

```yaml
name: "Your Name"
bio: "Your short bio"
avatar: "images/avatar.png"  # or https://example.com/avatar.png
sns:
  - platform: x
    url: "https://x.com/yourhandle"
  - platform: github
    url: "https://github.com/yourhandle"
  - platform: my-blog
    url: "https://blog.example.com"
    label: "Blog"
```

### Known Platforms (with icons)

x, github, linkedin, instagram, facebook, youtube

Any other `platform` value renders as text-only.

## Deployment

Push to `main` branch. GitHub Actions will automatically
build and deploy to GitHub Pages.

## Dark/Light Mode

The page automatically adapts to your browser's color
scheme setting. No configuration needed.

## Verification Checklist

- [ ] `npx tsx build.ts` succeeds without errors
- [ ] `dist/index.html` displays your name and avatar
- [ ] All SNS links open correct URLs in new tabs
- [ ] Toggle OS dark/light mode — page adapts automatically
- [ ] Page looks correct on mobile (narrow browser window)
