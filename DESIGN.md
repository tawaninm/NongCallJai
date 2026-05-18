# VoiceMed / NongCallJai Design System

`DESIGN.md` is the source of truth for VoiceMed UI. The current customer-facing visual layer is **NongCallJai**, implemented as a Warm Care Companion platform informed by the BOTNOI Figma file.

## Figma Source

- Primary design source: `BOTNOI` Figma file, node `2:2`.
- Codex should inspect Figma before major UI work and map its frames, components, variables, colors, spacing, typography, and responsive layout back into the Vite/TanStack app.
- Do not pull or export bitmap images from Figma into the website. Figma imagery is visual reference only unless the user explicitly provides final exported assets for web use.
- Figma-first flow: design in Figma first, implement approved frames in code second.
- Current web implementation should favor responsive HTML/CSS sections over large exported bitmap banners when the content is text, pricing, safety, or navigation.

## Visual Direction

NongCallJai should feel:

- Warm, soft, trustworthy, and premium enough for a real care technology startup.
- Family/caregiver friendly.
- Calm enough for healthcare-adjacent service.
- Clear enough for non-technical families.
- Real-service ready, not demo/prototype language.
- Distinct from generic SaaS templates by using a care-thread story: phone call -> elder response -> LINE summary -> family action.

The mascot **Nong Calljai** is the main emotional character for public pages, LINE OA assets, pricing banners, and footer quote sections. Website implementation should use repo-owned generated/source assets or user-provided exports, not copied Figma draft images. Use mascot imagery deliberately so it supports trust and product clarity rather than overwhelming every section.

## Tokens

Use the warm care companion palette as the primary system:

```css
--vm-bg: #eaf7ef;
--vm-mint-50: #f4fbf6;
--vm-mint-100: #eaf7ef;
--vm-mint-200: #cfe9d7;
--vm-mint-300: #a8d8b6;
--vm-mint-400: #7cc58e;
--vm-mint-500: #4fa66a;
--vm-mint-600: #3f8e58;
--vm-mint-700: #337248;
--vm-mint-800: #2a5b3b;
--vm-mint-900: #223a2e;
--vm-mint-950: #17221c;
--vm-surface: rgba(250, 251, 248, 0.82);
--vm-glass-border: rgba(34, 58, 46, 0.12);
--vm-primary: #4fa66a;
--vm-sky: #75b6c8;
--vm-peach: #f2b8a2;
--vm-amber: #f5b85a;
--vm-line: #06c755;
--vm-navy: #223a2e;
--vm-muted: #52625a;
```

Typography:

- Primary web font: Manrope.
- Thai fallback: Noto Sans Thai, system Thai sans-serif.
- Figma text reference uses SF Pro style scale; implement with Manrope/Noto Sans Thai in web.
- Use generous Thai line-height.
- Hero H1 target: 52-56px desktop, 38-42px mobile.

## Components

- Public page shell: soft care gradient, rounded glass sections, product-led hierarchy, and restrained mascot usage.
- Buttons:
  - Primary: green gradient from `#3f8e58` to `#4fa66a` to `#7cc58e`.
  - Secondary: white glass with green text.
  - LINE-specific moments may use `#06c755` sparingly.
- Pricing cards:
  - Responsive HTML cards, icon header, clear monthly price, and green recommendation ring for Standard.
- Marketing sections:
  - Split hero, product preview, care-thread timeline, trust strip, feature moment cards, safety panel, pricing grid, FAQ, and structured dark footer CTA.
- QR/LINE cards:
  - Large QR placeholder or LIFF link card, clear status text, no secret tokens beyond one-time invite token.
- Admin setup rows:
  - Compact internal cards showing customer, LINE status, consent status, Botnoi mapping status.
- Footer CTA:
  - Dark green/navy rounded panel with emotional Thai copy, safety-aware copy, and real links instead of a single banner image.

## Product UI Rules

- Public pages sell the subscription and explain the service flow.
- Current web flow: landing -> pricing -> mock checkout -> service onboarding -> LINE connect -> waiting setup.
- Family-facing web must not show call feedback, transcript, audio, call history, reports, or voicebot schedule manager.
- Feedback after calls is delivered through LINE OA by the LINE team.
- Botnoi schedule/script setup is handled in Botnoi dashboard by the Botnoi team.
- Internal admin pages may show setup/mapping status only.
- Avoid dense hospital command-center styling.
- Do not use diagnosis, prescription, treatment, or medication-adjustment wording as product claims.
