---
name: Borno Higher Study
description: Global Higher Education Directory & Admission Governance Platform
colors:
  primary: "#0B192C"
  primary-light: "#1E3E62"
  primary-dark: "#060E18"
  accent-teal: "#0D9488"
  accent-teal-dark: "#0F766E"
  accent-teal-subtle: "#CCFBF1"
  champagne: "#C5A059"
  champagne-subtle: "#F9F6F0"
  neutral-bg: "#FFFFFF"
  neutral-surface: "#F8FAFC"
  neutral-warm: "#F7F7F6"
  neutral-border: "#E2E8F0"
  neutral-text: "#0F172A"
  neutral-muted: "#475569"
typography:
  display:
    fontFamily: "'DM Sans', 'Noto Sans Bengali', sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'DM Sans', 'Noto Sans Bengali', sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'DM Sans', 'Noto Sans Bengali', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Inter', 'Noto Sans Bengali', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'Inter', 'Noto Sans Bengali', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-light}"
  button-accent:
    backgroundColor: "{colors.accent-teal}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
---

# Design System: Borno Higher Study

## Overview

**Creative North Star: "The Global Scholar's Ledger"**

Borno Higher Study is designed as an authoritative, high-trust institution directory and admissions governance portal. Its visual tone is editorial, disciplined, and scholarly—resembling the precision of a national academic gazette combined with modern digital utility. It explicitly rejects generic AI SaaS aesthetics (such as gratuitous violet-blue gradients, rounded icon tiles above every header, nested cards inside cards, and washed-out gray-on-gray copy).

Instead, the interface conveys reliability through crisp typographic hierarchy, deep maritime blue foundations (`#0B192C`), purposeful academic teal accents (`#0D9488`), and subtle warm parchment surfaces (`#F8FAFC`, `#F9F6F0`). Data tables, financial metrics, and deadlines take centre stage with tabular numerals and clear visual boundaries.

### Key Characteristics:
- **Scholarly Authority:** Deep navy foundations paired with clean, crisp white surfaces and disciplined hairline dividers.
- **Data Clarity Over Decoration:** Tabular numerals for living costs, verified institution counts, and currency conversions; explicit status badges (`TARGET_MET`, `EXHAUSTIVE_COVERAGE`, `ACCEPTED`).
- **High-Contrast Legibility:** WCAG AAA compliant text contrast (minimum 4.5:1 for body copy; dark charcoal `#0F172A` on light backgrounds).
- **Subtle, Purposeful Motion:** Micro-interactions restricted to 150-200ms opacity and translateY transitions, respecting reduced-motion preferences.

## Colors

The palette is anchored by deep scholastic navies, punctuated by precise teal actions, and warmed by champagne highlights for official notices.

### Primary
- **Scholastic Deep Navy** (#0B192C): Structural headers, primary action buttons, key brand navigation, and hero backdrop. Represents institutional gravitas.
- **Deep Navy Light** (#1E3E62): Hover states and active navigation highlights.
- **Deep Navy Dark** (#060E18): Ultra-deep footers and dark-mode foundation backgrounds.

### Secondary
- **Academic Teal** (#0D9488): Primary call-to-action badges, verified stamps, active selection rings, and interactive filters.
- **Academic Teal Subtle** (#CCFBF1): Soft contextual tags, verified status pill backgrounds, and search match highlights.

### Tertiary
- **Editorial Champagne** (#C5A059): Official accreditation badges, scholarship spotlights, and distinction alerts.
- **Champagne Subtle** (#F9F6F0): Warm backdrop containers for official warnings and fee notices.

### Neutral
- **Charcoal Text** (#0F172A): Primary readable typography on light surfaces. Ensures maximum readability without harshness.
- **Slate Muted Text** (#475569): Secondary metadata, captions, and publication dates. Never falls below 4.5:1 contrast ratio.
- **Pure White** (#FFFFFF): Core card, modal, and reading canvas.
- **Parchment Surface** (#F8FAFC): Subtle page backgrounds and table row alternations.
- **Hairline Border** (#E2E8F0): 1px structural dividing lines.

### Named Rules
**The Verification Contrast Rule.** Every verified checkmark, deadline countdown, and fee figure must render with minimum 4.5:1 contrast against its immediate container. No gray-on-tinted-pill text is permitted.
**The Single Accent Rule.** Only one accent color may lead an interactive viewport: Academic Teal for actionable items, Champagne for official advisories.

## Typography

**Display Font:** 'DM Sans' (with 'Noto Sans Bengali', system-ui fallback)
**Body Font:** 'Inter' (with 'Noto Sans Bengali', system-ui fallback)
**Tabular/Metrics:** 'Inter' with `font-variant-numeric: tabular-nums`

**Character:** Balanced institutional authority with modern legibility. Headers have confident geometric presence, while body copy prioritizes rapid scannability across dense requirements.

### Hierarchy
- **Display** (Bold 700, clamp(2.25rem, 5vw, 3.75rem), 1.15 line-height): Main hero statements and national directory titles.
- **Headline** (Bold 700, clamp(1.75rem, 3.5vw, 2.5rem), 1.2 line-height): Section headers and primary tool headings.
- **Title** (Semibold 600, 1.25rem, 1.35 line-height): University titles, program names, and card headers.
- **Body** (Regular 400, 0.9375rem / 15px, 1.6 line-height): Description copy, policy explanations, requirements list. Max line length 72ch.
- **Label** (Semibold 600, 0.75rem, 1.4 line-height, letter-spacing 0.05em): Badges, category markers, and table header labels.

### Named Rules
**The Tabular Currency Rule.** All fees in BDT, USD, EUR, and GBP, intake countdown counters, and university statistics must utilize tabular numerals (`font-variant-numeric: tabular-nums`) to prevent jitter and maintain clean columns.

## Layout

- **Container Widths:** Main content container max-w-7xl (1280px); editorial reading max-w-4xl (896px); narrow forms max-w-lg (512px).
- **Grid Strategy:** 12-column responsive layout with 24px gutters (desktop) collapsing to 16px (mobile).
- **Spacing Rhythm:** Based on an 8px modular scale (4px, 8px, 16px, 24px, 32px, 48px, 64px).

## Elevation & Depth

Surfaces follow a clean, planar architectural model rather than heavy shadows or artificial glow effects. Depth is conveyed through subtle tonal variation and crisp 1px borders.

### Shadow Vocabulary
- **Resting Planar** (`box-shadow: 0 1px 3px 0 rgba(11, 25, 44, 0.05)`): Default cards and dropdown panels.
- **Lifted Focus** (`box-shadow: 0 4px 14px -2px rgba(11, 25, 44, 0.07)`): Interactive cards on hover and open modals.

### Named Rules
**The No-Frivolous-Glow Rule.** No neon box-shadows, blurred backdrop glows, or colored drop shadows. Elevation must remain structural and crisp.

## Shapes

- **Radius Strategy:** Restrained geometric radius. 8px (`rounded-md` or `rounded-lg`) for cards and inputs; 4px (`rounded-sm`) for badges and small buttons. Never use pill-shaped containers for cards or data widgets.
- **Borders:** Crisp 1px borders using `#E2E8F0` on light mode, `#1E293B` on dark mode.

## Components

### Buttons
- **Shape:** 8px radius (`rounded-lg`).
- **Primary:** Scholastic Navy background (`#0B192C`), crisp white text, padding `10px 20px`, smooth hover transition to `#1E3E62`.
- **Accent:** Academic Teal background (`#0D9488`), white text, hover `#0F766E`.
- **Secondary / Outline:** Transparent background, 1px border `#CBD5E1`, text `#0F172A`, hover `#F1F5F9`.

### Badges & Status Indicators
- **Style:** 4px radius, compact padding `3px 8px`, 11px uppercase or 12px medium font.
- **Target Met / Verified:** Teal subtle bg (`#CCFBF1`), deep teal text (`#0F766E`), 1px border `#99F6E4`.
- **Exhaustive Coverage / Notice:** Champagne subtle bg (`#F9F6F0`), champagne text (`#92400E`), 1px border `#FDE68A`.

### Tables
- **Header:** Background `#F8FAFC`, uppercase label text `#475569`, bottom border 2px `#E2E8F0`.
- **Rows:** Alternating subtle zebra striping, 1px bottom border `#F1F5F9`, hover highlight `#F8FAFC`.
- **Numbers:** Tabular numeric alignment with explicit right alignment for monetary values.

### Inputs & Forms
- **Border:** 1px `#CBD5E1`, 8px radius, white background.
- **Focus:** 2px outline `#0D9488` with 2px offset, zero blur halo.

## Do's and Don'ts

### Do:
- **Do** format all financial figures with their respective currency symbol and clear BDT conversion rates.
- **Do** state verified timestamps and official primary documentation links on admission requirements.
- **Do** provide clear focus outlines for keyboard navigation across all buttons, inputs, and links.
- **Do** maintain responsive table scrolling or card transformation on small mobile displays (<640px).

### Don't:
- **Don't** use decorative purple-to-blue gradients or glossy glassmorphism that obscures text readability.
- **Don't** nest cards inside cards more than 1 level deep.
- **Don't** use low-contrast gray text (<4.5:1) on white or colored container backgrounds.
- **Don't** use floating bouncy easing or disruptive entrance animations that delay user interaction.
