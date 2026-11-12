---
name: NDJSON field guide
description: A light, source-cited field guide to the Copilot usage metrics NDJSON reports.
colors:
  paper: "oklch(0.982 0.004 250)"
  sheet: "oklch(1 0 0)"
  ink: "oklch(0.23 0.025 262)"
  ink-2: "oklch(0.40 0.022 262)"
  ink-3: "oklch(0.50 0.018 262)"
  rule: "oklch(0.90 0.008 258)"
  rule-2: "oklch(0.94 0.006 258)"
  tint: "oklch(0.965 0.008 255)"
  report-daily-totals: "oklch(0.53 0.16 255)"
  report-28-day-totals: "oklch(0.50 0.17 292)"
  report-users-1-day: "oklch(0.54 0.14 152)"
  report-users-28-day: "oklch(0.53 0.10 196)"
  report-user-teams: "oklch(0.70 0.15 72)"
  report-repos: "oklch(0.52 0.17 340)"
  stop: "oklch(0.55 0.19 25)"
  ok: "oklch(0.50 0.13 152)"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.4rem, 3.6vw, 3.9rem)"
    fontWeight: 750
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.7rem, 2.2vw, 2.25rem)"
    fontWeight: 720
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 680
    lineHeight: 1.3
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tnum"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 650
    letterSpacing: "0.04em"
  data:
    fontFamily: "ui-monospace, SF Mono, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.84rem"
    lineHeight: 1.68
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  pill: "999px"
spacing:
  rail: "232px"
  notes: "270px"
  gap: "clamp(24px, 3vw, 48px)"
components:
  button:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "40px"
    padding: "0 16px"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.pill}"
    height: "40px"
  specimen-tag:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.pill}"
  plate:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.lg}"
  data-well:
    backgroundColor: "{colors.tint}"
    rounded: "{rounded.md}"
---

# Design System: NDJSON field guide

## Overview

**Creative North Star: "The Field Guide"**

A specimen book for data. Each report family is a species with its own ink and a punched tag. The page shows a real-shaped specimen first, then names its parts, then warns where it is easy to misread. Sources sit in the margin next to the claim, the way a field guide cites its plates.

Density is calm reading with dense, inspectable figures. The light ground and full-width layout are brand commitments from PRODUCT.md (laptop screen share).

**Key Characteristics:**
- Six report-family inks, used as transit-style lines and tag rings, never as decoration.
- System sans for prose; monospace only for real field names, endpoints, and data.
- White plates with soft layered shadows on a cool white ground.
- Margin source notes beside each claim.

## Colors

Restrained neutrals with a six-ink categorical set that always means a report family.

### Report inks
- **Daily totals blue** (oklch(0.53 0.16 255)): organization-1-day and enterprise-1-day. Also the default link and focus color.
- **28-day violet** (oklch(0.50 0.17 292)): 28-day totals, and Phase 3.
- **Per-user green** (oklch(0.54 0.14 152)): users-1-day, and Phase 1.
- **Per-user teal** (oklch(0.53 0.10 196)): users-28-day.
- **User-teams amber** (oklch(0.70 0.15 72)): user-teams-1-day and the team-join trace. Fill or ring only, never body text.
- **Repositories magenta** (oklch(0.52 0.17 340)): repos-1-day.

### Signal
- **Stop red** (oklch(0.55 0.19 25)): "does not work", limits markers, and "not in the files". Nothing else.
- **OK green** (oklch(0.50 0.13 152)): yes-dots in the matrix and copy success.

### Neutral
- **Paper** (oklch(0.982 0.004 250)): page ground.
- **Sheet** (white): plates, cards, tags.
- **Ink / Ink 2 / Ink 3**: text, secondary text, labels and captions.
- **Tint** (oklch(0.965 0.008 255)): data wells, code, selected rail item.
- **Rule / Rule 2**: hairline dividers.

### Named Rules
**The One Meaning Rule.** A report ink always means its report. Red always means "does not work". Never reuse either for decoration.

## Typography

**Body and display:** system UI sans. **Data:** system monospace.

**Character:** Plain and fast to read on a shared screen. Weight and size carry hierarchy; there are no decorative faces.

### Hierarchy
- **Display** (750, clamp(2.4rem, 3.6vw, 3.9rem), 1.04): page title only.
- **Headline** (720, clamp(1.7rem, 2.2vw, 2.25rem), 1.12): section titles.
- **Title** (680, 1.12rem, 1.3): sub-blocks, cards, rungs.
- **Body** (400, 17px, 1.6, tabular numbers): prose, max 72ch.
- **Label** (650, 0.72rem, 0.04em, uppercase): margin note keys and table heads only.
- **Data** (mono, 0.84rem, 1.68): records, endpoints, field paths.

### Named Rules
**The Real Mono Rule.** Monospace marks real identifiers and values. Never use it as a "technical" costume for prose.

## Layout

Three columns at laptop width: a sticky contents rail (232px), the main column, and a 270px source-notes margin inside each content row. Figures (map, explorer, trace, grids) span the full main width. Sections are separated by a hairline and 72px top padding.

Breakpoints: at 1320px the notes narrow to 230px; at 1120px notes fold under the prose and the explorer stacks; at 860px the rail becomes a horizontal scroller and all grids become one column.

## Elevation & Depth

Hybrid: flat ground, lifted white plates. Depth means "this is a specimen you can inspect".

### Shadow Vocabulary
- **Plate** (`box-shadow: 0 1px 2px oklch(0.25 0.03 262 / 0.06), 0 2px 8px oklch(0.25 0.03 262 / 0.05), 0 0 0 1px oklch(0.25 0.03 262 / 0.06)`): all plates and grid panels.
- **Inset well** (`box-shadow: inset 0 0 0 1px var(--rule-2)`): data wells inside plates.

## Shapes

Radii 6, 10, 16, and pill. Nested surfaces step down (16 plate, 10 well, 6 inner chip) so corners stay concentric. Tags, chips, and buttons are pills. Specimen tags carry a punched ring in the report ink.

## Components

- **Specimen tag:** pill, white, mono label, ring in report ink. Selected tab inverts to ink.
- **Map node:** white card, report-ink band on top, ring, mono IDs. Solid lines work; dashed red lines do not.
- **Field explorer:** record well on the left with key buttons, field note on the right, dotted leader line from the selected key to the note.
- **Trace:** stepper with four bars, two tables per step, new rows tinted amber, dropped rows struck through.
- **Buttons:** pill, 40px tall, press scale 0.96, transitions on named properties only.
- **Copy button:** icons cross-fade with scale 0.25 to 1, blur 4px to 0.

## Do's and Don'ts

- Do link a GitHub Docs source beside each fact, and label our own ideas as ideas.
- Do keep sample data synthetic and labeled.
- Do not use em dashes or dash-like bullet markers.
- Do not add a dark theme or category-default KPI cards.
- Do not animate more than the one map draw-on; respect reduced motion.
