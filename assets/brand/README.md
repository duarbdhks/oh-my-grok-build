# Brand assets

Visual system for **oh-my-grok-build**. All source art lives in this tree. There is no runtime dependency on external image CDNs.

## Positioning

Lightweight orchestration discipline for Grok Build: consensus planning, bounded parallel execution, and independent verification — without replacing native runtime features.

## Design language

| Token | Value | Role |
|---|---|---|
| Background (dark) | `#0B1220` / `#070B12` | Terminal chrome |
| Panel | `#101826` / `#151D2B` | Cards |
| Plan | `#5B8DEF` | Stage 1 |
| Execute | `#3DDC97` | Stage 2 |
| Verify | `#F0B429` | Stage 3 |
| Body text | `#E8EEF5` | High contrast on dark |
| Muted | `#7F8FA6` | Captions |

Motif: a restrained terminal window with three stage bars (plan → execute → verify). Avoid neon glow, robot mascots, and generic “AI brain” imagery.

## Inventory

| File | Purpose | Recommended size |
|---|---|---|
| `mark.svg` / `source/mark-dark.svg` | Primary mark on dark UI | 128–512 px square |
| `mark-light.svg` / `source/mark-light.svg` | Mark on light UI | 128–512 px square |
| `favicon.svg` | Tab / small mark | 16–64 px |
| `oh-my-grok-build-avatar.png` | README avatar, GitHub avatar candidate | 256×256 |
| `oh-my-grok-build-avatar-light.png` | Light-background avatar | 256×256 |
| `oh-my-grok-build-social-preview.png` | GitHub social preview | 1200×630 |
| `social-preview.svg` | Editable social source | 1200×630 viewBox |
| `oh-my-grok-build-hero.png` | README hero | 1200×420 |
| `hero-banner.svg` | Editable hero source | 1200×420 viewBox |
| `diagrams/workflow.svg` (+ `.png`) | Interview→Plan→Execute→Verify | ~960×420 |
| `diagrams/terminal-flow.svg` (+ `.png`) | Static terminal mockup (not a live capture) | ~960×540 |
| `diagrams/architecture-overview.svg` (+ `.png`) | Native vs OGB layers | ~960×480 |
| `source/logo-horizontal.svg` | Wide logo strip | 640×128 |

## Light / dark usage

- Dark README and dark GitHub theme: use `mark.svg` / `oh-my-grok-build-avatar.png`.
- Light backgrounds: use `mark-light.svg` / `oh-my-grok-build-avatar-light.png`.
- Hero, social, and diagram assets are dark-first with high-contrast stage colors so they remain readable in both GitHub themes.

## Accessibility

When embedding in Markdown, always set non-empty `alt` text that describes the information in the image (for example: “workflow: plan, execute, verify”), not only the project name.

## Regeneration

SVGs use only system font stacks in `font-family` attributes (no remote `@font-face` or Google Fonts). Sources under `source/` and `diagrams/` are authoritative.

On macOS with ImageMagick:

```bash
FONT="/System/Library/Fonts/SFNSMono.ttf"
magick -density 144 -font "$FONT" assets/brand/source/mark-dark.svg \
  -resize 256x256 -strip -define png:compression-level=9 \
  assets/brand/oh-my-grok-build-avatar.png

magick -density 120 -font "$FONT" assets/brand/source/social-preview.svg \
  -resize 1200x630 -strip -define png:compression-level=9 \
  assets/brand/oh-my-grok-build-social-preview.png

magick -density 120 -font "$FONT" assets/brand/source/hero-banner.svg \
  -resize 1200x420 -strip -define png:compression-level=9 \
  assets/brand/oh-my-grok-build-hero.png

magick -density 120 -font "$FONT" assets/brand/diagrams/workflow.svg \
  -resize 960x420 -strip -define png:compression-level=9 \
  assets/brand/diagrams/workflow.png

magick -density 120 -font "$FONT" assets/brand/diagrams/terminal-flow.svg \
  -resize 960x540 -strip -define png:compression-level=9 \
  assets/brand/diagrams/terminal-flow.png

magick -density 120 -font "$FONT" assets/brand/diagrams/architecture-overview.svg \
  -resize 960x480 -strip -define png:compression-level=9 \
  assets/brand/diagrams/architecture-overview.png
```

## Provenance of terminal illustration

`diagrams/terminal-flow.*` is a **static mockup**. It illustrates the recommended command order; it is not an unedited capture of a live Grok Build session. Live validation evidence lives in `docs/validation.md`.
