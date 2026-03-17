# Feature Specification: Profile Page

**Feature Branch**: `001-profile-page`
**Created**: 2026-03-17
**Status**: Draft
**Input**: User description: "GitHub Pages を使って、自分のプロフィールページを作りたい。Prairie cardのような感じのもの。自分のアイコン画像、x.com やその他snsへのリンクを表示できる。ブラウザの設定に応じてdark mode と light modeがだし分けられるようにしたい。また、yamlにsnsのアカウントなどの設定をまとめておいて、github actionsでビルドして github pagesに公開できるようにしたい。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Profile Card (Priority: P1)

A visitor navigates to the profile page URL and sees a centered
card displaying the owner's avatar image, display name, and a
short bio. The card is styled in a clean, Prairie card-like
layout with rounded corners and subtle shadow.

**Why this priority**: The profile card is the core visual
element. Without it, there is no product to show.

**Independent Test**: Open the deployed page in a browser and
confirm the avatar, name, and bio are visible and centered.

**Acceptance Scenarios**:

1. **Given** the page is deployed, **When** a visitor opens the URL, **Then** they see a centered card with the owner's avatar image, display name, and bio text.
2. **Given** the YAML config contains a name and avatar path, **When** the site is built, **Then** the generated HTML displays the configured name and avatar.
3. **Given** the avatar image file exists in the repository, **When** the page loads, **Then** the image renders without broken-image icons.

---

### User Story 2 - Browse SNS Links (Priority: P1)

Below the profile info, the visitor sees a vertical list of
SNS link buttons (e.g., X/Twitter, GitHub, LinkedIn, etc.).
Each button shows a platform icon and name for known platforms
(e.g., X, GitHub, LinkedIn), or the platform name only for
custom/unknown platforms. Buttons link to the owner's profile
on that platform.

**Why this priority**: SNS links are the primary purpose of
the page — a link-in-bio experience. Equal priority with
the profile card.

**Independent Test**: Click each SNS link button and verify
it opens the correct external profile URL in a new tab.

**Acceptance Scenarios**:

1. **Given** the YAML config lists three SNS accounts, **When** the page is built and opened, **Then** three link buttons appear in the card, each labeled with the platform name.
2. **Given** a visitor clicks an SNS link button, **When** the link opens, **Then** the correct external URL opens in a new browser tab.
3. **Given** the YAML config contains zero SNS entries, **When** the page is built, **Then** the card renders without any link buttons (no empty container or errors).

---

### User Story 3 - Dark and Light Mode (Priority: P2)

The page automatically adapts to the visitor's browser/OS
color scheme preference. In dark mode, the background and
card use dark tones with light text. In light mode, the
background and card use light tones with dark text.

**Why this priority**: Important for user experience and
accessibility, but the page is functional without it.

**Independent Test**: Toggle the OS dark/light mode setting
and reload the page; verify the color scheme changes
accordingly.

**Acceptance Scenarios**:

1. **Given** the visitor's OS is set to dark mode, **When** they open the page, **Then** the page renders with a dark color scheme (dark background, light text).
2. **Given** the visitor's OS is set to light mode, **When** they open the page, **Then** the page renders with a light color scheme (light background, dark text).
3. **Given** the visitor switches OS theme while the page is open, **When** the media query updates, **Then** the page theme switches without a reload.

---

### User Story 4 - YAML-Driven Configuration (Priority: P2)

The page owner edits a single YAML file to update their
display name, bio, avatar path, and SNS links. No HTML or
CSS editing is required to change personal content.

**Why this priority**: Separation of content and presentation
is a core architectural requirement, but end users interact
with the deployed page, not the config.

**Independent Test**: Change a value in the YAML file, run
the build, and verify the output HTML reflects the change.

**Acceptance Scenarios**:

1. **Given** the owner changes their display name in the YAML file, **When** the build runs, **Then** the generated HTML shows the updated name.
2. **Given** the owner adds a new SNS entry to the YAML file, **When** the build runs, **Then** a new link button appears on the page.
3. **Given** the owner removes an SNS entry from the YAML file, **When** the build runs, **Then** the corresponding link button no longer appears.

---

### User Story 5 - Automated Build and Deploy (Priority: P3)

When the owner pushes changes to the main branch, a GitHub
Actions workflow automatically builds the HTML from the YAML
config and deploys it to GitHub Pages. No manual steps are
needed.

**Why this priority**: Automation is important for
maintainability but the page can be manually built and
uploaded during early development.

**Independent Test**: Push a YAML change to main and verify
the live GitHub Pages site reflects the change within a few
minutes.

**Acceptance Scenarios**:

1. **Given** the owner pushes a commit to the main branch, **When** the GitHub Actions workflow completes, **Then** the updated page is live on GitHub Pages.
2. **Given** the YAML config has a syntax error, **When** the workflow runs, **Then** the build fails with a clear error message and the previous deployment remains intact.

---

### Edge Cases

- What happens when the avatar is a local file path but the file is missing? The build MUST fail with a descriptive error.
- What happens when the avatar is an external URL that is unreachable at runtime? The page MUST display a fallback placeholder (e.g., initials or generic icon).
- What happens when an SNS URL in the YAML is malformed? The build SHOULD validate URLs and warn, but MUST NOT break the entire page for other valid links.
- What happens when the YAML file is empty or missing required fields? The build MUST fail with a clear error indicating which fields are required.
- What happens when the page is viewed on a very narrow screen (mobile)? The card MUST remain readable and centered, with link buttons stacking vertically.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display a profile card centered on screen containing the owner's avatar image, display name, and bio text.
- **FR-002**: The page MUST display a vertical list of SNS link buttons below the profile information, each linking to the configured external URL. Known platforms MUST show a platform icon alongside the name; unknown/custom platforms MUST show the name only.
- **FR-003**: Each SNS link MUST open in a new browser tab.
- **FR-004**: The page MUST automatically switch between dark and light color schemes based on the visitor's `prefers-color-scheme` browser setting.
- **FR-005**: Both color schemes MUST maintain readable contrast (WCAG AA compliance: minimum 4.5:1 for normal text).
- **FR-006**: All personal content (name, bio, avatar path, SNS links) MUST be read from a single YAML configuration file at build time.
- **FR-007**: Adding or removing an SNS link MUST require only a YAML file edit, not a template or code change.
- **FR-008**: The system MUST provide a predefined list of known SNS platforms (e.g., X, GitHub, LinkedIn, Instagram, Facebook, YouTube) with associated icons. Users MUST also be able to add custom links with a platform name and URL.
- **FR-009**: A GitHub Actions workflow MUST build the HTML from the YAML config and deploy to GitHub Pages on every push to main.
- **FR-010**: The page MUST be responsive and render correctly on mobile devices (minimum viewport width: 320px).
- **FR-011**: The build MUST fail with a clear error message if required YAML fields (name, avatar) are missing.

### Key Entities

- **Profile**: The owner's identity information — display name, bio text, avatar image (local file path or external URL). Exactly one profile exists per site.
- **SNS Link**: A social media link — platform identifier, display name, URL, and display order. Known platforms (e.g., X, GitHub, LinkedIn) have associated icons; custom platforms display name only. Zero or more links can be configured. Each link belongs to the single Profile.
- **Theme**: Visual appearance configuration — light and dark variants. Both are always present; the active variant is determined by the visitor's browser setting.

## Clarifications

### Session 2026-03-17

- Q: SNSリンクボタンにプラットフォームアイコンを表示するか？ → A: 既知プラットフォームはアイコン＋名前、未知のものはテキストのみ
- Q: SNSプラットフォームの定義方法は？ → A: 事前定義リスト＋カスタムリンク（既知はアイコン付き、任意URLも追加可能）
- Q: アバター画像のソースは？ → A: ローカルファイルまたは外部URL（両方対応）

## Assumptions

- The profile page is for a single person (not a team or organization).
- The YAML config file lives at the repository root (e.g., `profile.yml`).
- The avatar image can be either a local file in the repository or an external URL. The build validates existence for local files only.
- SNS links are displayed in the order they appear in the YAML file.
- The page does not require any user authentication or dynamic server-side logic.
- TypeScript + Handlebars is used for the build step (decided during planning; see research.md).
- The GitHub repository has GitHub Pages enabled (or the workflow enables it).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can identify the profile owner (name, face, bio) within 2 seconds of page load.
- **SC-002**: A visitor can reach any configured SNS profile in 1 click from the page.
- **SC-003**: The page loads completely in under 2 seconds on a standard broadband connection.
- **SC-004**: The page passes WCAG AA contrast checks in both dark and light modes.
- **SC-005**: The page renders correctly (no horizontal scroll, no overlapping elements) on screens from 320px to 2560px wide.
- **SC-006**: A content update (YAML edit → push → live site) completes in under 5 minutes with zero manual deployment steps.
- **SC-007**: Adding a new SNS link requires editing only the YAML file (no other file changes needed).
