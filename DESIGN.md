# CareGo Design System

DESIGN.md is the only source of truth for CareGo UI colors, typography, spacing, radius, elevation, and component styling.

## Visual Direction

CareGo is a polished hospital AI care command center: clinical, calm, authoritative, data-first, trustworthy, fast to scan, professional, and hospital SaaS oriented.

The True Healing Framer reference may be used only for layout rhythm, section composition, spacing, calm healthcare mood, card grouping, and modern visual polish. Do not copy its colors, text, wellness branding, or product tone.

## Color Tokens

- surface: #f3faff
- surface-dim: #c7dde9
- surface-bright: #f3faff
- surface-container-lowest: #ffffff
- surface-container-low: #e6f6ff
- surface-container: #dbf1fe
- surface-container-high: #d5ecf8
- surface-container-highest: #cfe6f2
- on-surface: #071e27
- on-surface-variant: #3d4946
- inverse-surface: #1e333c
- inverse-on-surface: #dff4ff
- outline: #6d7a77
- outline-variant: #bcc9c5
- surface-tint: #006b5f
- primary: #00685d
- on-primary: #ffffff
- primary-container: #008376
- on-primary-container: #f4fffb
- inverse-primary: #70d8c8
- secondary: #526069
- on-secondary: #ffffff
- secondary-container: #d3e2ed
- on-secondary-container: #56656e
- tertiary: #266658
- on-tertiary: #ffffff
- tertiary-container: #417f70
- on-tertiary-container: #f4fffa
- error: #ba1a1a
- on-error: #ffffff
- error-container: #ffdad6
- on-error-container: #93000a
- primary-fixed: #8df5e4
- primary-fixed-dim: #70d8c8
- on-primary-fixed: #00201c
- on-primary-fixed-variant: #005048
- secondary-fixed: #d6e5ef
- secondary-fixed-dim: #bac9d3
- on-secondary-fixed: #0f1d25
- on-secondary-fixed-variant: #3b4951
- tertiary-fixed: #afefdd
- tertiary-fixed-dim: #94d3c1
- on-tertiary-fixed: #00201a
- on-tertiary-fixed-variant: #065043
- background: #f3faff
- on-background: #071e27
- surface-variant: #cfe6f2

## Risk Colors

- Red: #F44336 for critical alerts and immediate life-safety risks.
- Yellow: #FFC107 for high-priority monitoring and cautionary states.
- Green: #4CAF50 for stable conditions and successful completions.

Always pair color with text, for example: เขียว · ปกติ, เหลือง · ต้องติดตาม, แดง · เร่งด่วน.

## Typography

Primary font: Manrope. Thai UI should use comfortable line-height and may fall back to Noto Sans Thai.

- display-lg: 36px, 700, line-height 1.2
- headline-md: 24px, 600, line-height 1.3
- title-sm: 18px, 600, line-height 1.4
- body-lg: 16px, 400, line-height 1.6
- body-md: 14px, 400, line-height 1.6
- label-caps: 12px, 700, line-height 1.2, letter-spacing 0.05em
- data-tabular: 14px, 500, line-height 1.4

Do not scale font size with viewport width. Letter spacing must be 0 except label-caps.

## Spacing and Radius

- Base spacing: 8px
- Container max: 1440px
- Gutter: 24px
- Desktop page margin: 40px
- Card padding: 24px
- stack-sm: 4px
- stack-md: 12px
- stack-lg: 24px

Radius: sm 0.25rem, default 0.5rem, md 0.75rem, lg 1rem, xl 1.5rem, full 9999px.

Default radius should feel professional and clinical, not overly bubbly.

## Elevation

Avoid heavy shadows. Use tonal layers, low-contrast outlines, white or pale-blue surfaces, 1px borders, and very soft shadows only for active panels or modals.

## Component Rules

Cards: white or surface-container backgrounds, 1px low-contrast outline, header area with bottom border where appropriate, 24px padding, and 4px risk left-border for high-risk content.

Buttons: primary teal fill with white text, secondary soft-blue fill with teal text, 8px radius, clear action labels/icons.

Inputs: white background, subtle grey/blue border, teal focus border with soft light-blue glow.

Status chips: desaturated risk backgrounds with high-contrast text and explicit labels.

Tables: row-based, label-caps headers, soft-blue zebra rows, clickable patient rows where appropriate.

Vital sign monitors: focused clinical module, optionally dark mini-panel for real-time values.

## Required Reusable Components

StatCard, RiskBadge, StatusBadge, RoleBadge, PatientAvatar, PatientTable, PatientCard, CaseCard, AISummaryPanel, TranscriptPanel, TimelineItem, AlertCard, CarePlanCard, AgentCard, ActionButtonGroup, FilterBar, ConfirmModal, SidePanel, Toast, PatchLogButton, and PatchLogPage or PatchLogPanel.

## Interaction and Accessibility

Alerts, activities, patient rows, and case cards must be clickable. Actions should use confirmation modals when needed, show toast feedback, and update visible state. Use semantic HTML, accessible labels, buttons as buttons, links as links, sufficient contrast, keyboard usability, and non-color status cues.
