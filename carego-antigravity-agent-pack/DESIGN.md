---
name: CareGo Design System
colors:
  surface: "#f3faff"
  surface-dim: "#c7dde9"
  surface-bright: "#f3faff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#e6f6ff"
  surface-container: "#dbf1fe"
  surface-container-high: "#d5ecf8"
  surface-container-highest: "#cfe6f2"
  on-surface: "#071e27"
  on-surface-variant: "#3d4946"
  inverse-surface: "#1e333c"
  inverse-on-surface: "#dff4ff"
  outline: "#6d7a77"
  outline-variant: "#bcc9c5"
  surface-tint: "#006b5f"
  primary: "#00685d"
  on-primary: "#ffffff"
  primary-container: "#008376"
  on-primary-container: "#f4fffb"
  inverse-primary: "#70d8c8"
  secondary: "#526069"
  on-secondary: "#ffffff"
  secondary-container: "#d3e2ed"
  on-secondary-container: "#56656e"
  tertiary: "#266658"
  on-tertiary: "#ffffff"
  tertiary-container: "#417f70"
  on-tertiary-container: "#f4fffa"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#8df5e4"
  primary-fixed-dim: "#70d8c8"
  on-primary-fixed: "#00201c"
  on-primary-fixed-variant: "#005048"
  secondary-fixed: "#d6e5ef"
  secondary-fixed-dim: "#bac9d3"
  on-secondary-fixed: "#0f1d25"
  on-secondary-fixed-variant: "#3b4951"
  tertiary-fixed: "#afefdd"
  tertiary-fixed-dim: "#94d3c1"
  on-tertiary-fixed: "#00201a"
  on-tertiary-fixed-variant: "#065043"
  background: "#f3faff"
  on-background: "#071e27"
  surface-variant: "#cfe6f2"
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: "700"
    lineHeight: "1.2"
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: "600"
    lineHeight: "1.3"
  title-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: "600"
    lineHeight: "1.4"
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: "400"
    lineHeight: "1.6"
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: "400"
    lineHeight: "1.6"
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: 0.05em
  data-tabular:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: "500"
    lineHeight: "1.4"
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-page: 40px
  card-padding: 24px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for high-stakes hospital environments, prioritizing cognitive ease, rapid information processing, and a sense of clinical "quiet." The brand personality is **composed, authoritative, and frictionless**, aiming to reduce the stress of hospital staff through a "Command Center" aesthetic.

The style utilizes a **Corporate Modern** approach with a strong emphasis on **Minimalism**. It avoids unnecessary decorative elements to focus on data legibility. Surfaces are predominantly clean white to reflect a sterile, professional medical environment, while card-based containers organize complex medical records and patient data into digestible modules. The interface should feel like a high-end medical instrument—precise, reliable, and always responsive.

## Colors

The color strategy uses a "Clinical White" foundation to maximize contrast and cleanliness. **Teal (#00897B)** serves as the primary brand anchor, chosen for its association with medical professionalism and calming psychological effect. **Soft Blue (#E3F2FD)** is utilized as a structural color for backgrounds, hover states, and subtle grouping, preventing the interface from feeling stark.

The **Risk System** follows universal healthcare standards:

- **Red (#F44336):** Critical alerts and immediate life-safety risks.
- **Yellow (#FFC107):** High-priority monitoring and cautionary states.
- **Green (#4CAF50):** Stable conditions and successful completions.

Neutral tones are pulled from a slate-grey palette (#455A64) to ensure text remains highly readable without the harshness of pure black.

## Typography

This design system utilizes **Manrope** for its exceptional balance of modern geometry and high legibility, which translates seamlessly to Thai character rendering. The typeface's open counters and tall x-height ensure that medical terminology and patient names are clear even at smaller sizes or from a distance on mounted monitors.

Typography levels are generous. Large "Display" levels are reserved for dashboard summaries (e.g., total bed occupancy), while "Data Tabular" settings are optimized for patient charts and lab results. For Thai language support, line-heights are increased by approximately 10-15% compared to standard English-only layouts to accommodate tone marks and vowels without clipping.

## Layout & Spacing

The layout follows a **Fixed Grid** model optimized for 1440px desktop displays, common in hospital workstations. The structure uses a 12-column grid with a substantial **24px gutter** to ensure visual breathing room between dense data sets.

The spacing rhythm is built on an **8px base unit**. Dashboards utilize a "Masonry-lite" card-based layout where information is grouped into logical modules. High-density areas (like medication lists) may drop to 4px spacing, while global page margins are kept wide at 40px to create a "Command Center" frame that feels organized and intentional.

## Elevation & Depth

To maintain a sterile and modern feel, this design system avoids heavy shadows. Instead, it utilizes **Tonal Layers** and **Low-Contrast Outlines**.

1.  **Level 0 (Background):** Soft Blue (#E3F2FD) or pure white.
2.  **Level 1 (Cards):** White surfaces with a 1px border in a slightly darker blue-grey tint.
3.  **Level 2 (Active/Modals):** A very soft, diffused ambient shadow (0px 4px 20px, 5% opacity) to indicate temporary overlay without breaking the flat, professional aesthetic.

Depth is primarily communicated through color-blocking rather than physical shadows, ensuring the UI feels like a digital dashboard rather than a collection of floating papers.

## Shapes

The design system employs **Rounded (0.5rem)** corners as the standard. This choice is intentional; sharp corners (0px) can feel aggressive or overly technical, while fully pill-shaped corners can feel too casual or "bubbly."

A 0.5rem (8px) radius strikes a balance between professional precision and approachable healthcare. Cards, input fields, and buttons all share this radius to create a unified visual language. Larger components, like modal overlays, may use **rounded-xl (1.5rem)** to soften their impact on the screen.

## Components

- **Cards:** The primary container. Must include a header area with a bottom-border and a padding of 24px. High-risk cards should include a 4px left-border accent using the Risk System colors.
- **Buttons:** Primary buttons use the Teal fill with white text. Secondary buttons use the Soft Blue fill with Teal text. All buttons have an 8px radius.
- **Input Fields:** Clean white backgrounds with a subtle grey border. On focus, the border transitions to Teal with a soft light-blue outer glow.
- **Status Chips:** Used for patient triage. They feature a desaturated version of the risk color as a background with high-contrast text for maximum readability (e.g., Light Red background with Deep Red text).
- **Data Tables:** Row-based with alternating "zebra" stripes in Soft Blue (#E3F2FD) at 30% opacity. Headers must be "Label-Caps" style for clear differentiation from patient data.
- **Vital Sign Monitors:** A specialized component using a dark-mode-inspired mini-module within the light UI to highlight real-time data like heart rate or SpO2, creating a "focal point" in the command center.
