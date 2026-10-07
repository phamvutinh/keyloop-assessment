# DESIGN.md — Lead Management CRM Design System

## 1. Visual Theme & Atmosphere

The interface is a clear, dependable, practical CRM for sales teams. The dashboard prioritizes quick reading of metrics, lead status, and follow-up activity. A light neutral canvas, white surfaces, and green accents keep the experience organized. Borders and shadows are restrained, separating content without making the interface feel heavy.

This is a responsive web app: a sidebar and data table on wide screens, with lead rows reorganized into readable cards on tablets and phones.

## 2. Color Palette

- **Page Background:** `#F0F1F1`.
- **Content Surface:** `#FFFFFF`.
- **Sidebar Background:** `#F8F8F8`.
- **Primary Text:** `#111318`.
- **Secondary Text:** `#747981`.
- **Borders:** `#E8E9EB`; stronger border `#D8DADE`.
- **Primary Action Accent:** green `#08A77C`; darker green for status and links `#087B60`; soft green surface `#E9F7F2`.
- **Alert / Follow-up Colors:** red `#DE5C60` with `#FFF0EF`; warm alert accent `#D8785F` with `#FFF4EF`.
- **Qualified Status:** purple `#9B52D4` with `#FBF1FF`.

Pair status colors with text labels; never communicate meaning through color alone. The current interface is light mode and does not define a dark-mode token set.

## 3. Component Styling

- **Application Frame:** on desktop, use an approximately `258px` sidebar and a flexible content column. The outer frame uses a `22px` radius and a subtle `0 14px 38px rgb(22 25 31 / 5%)` shadow.
- **Metric and List Surfaces:** white backgrounds, thin neutral borders, and typical `16–18px` corner radii. Keep padding compact and consistent.
- **Buttons:** standard buttons use a white surface, gray border, and pill shape. Primary buttons use a deep charcoal `#11151B` background with white text.
- **Search and Filters:** use clearly labeled, lightly bordered fields with small corner radii. The filter panel is anchored to the list toolbar.
- **Lead Table:** on desktop, rows use subtle separators. Status uses outlined text badges; stage progress uses a gray track with a green fill.
- **Responsive Lead Cards:** on tablets and phones, each lead becomes a card in this order: name, company, service, status, stage, last contact, and actions.
- **Contact Actions:** phone, message, and email actions share one icon style. On touch screens, action targets are at least `44 × 44px`.
- **Icons:** inline SVGs use Heroicons v2 Outline with a consistent stroke. Hide decorative icons from assistive technology when they convey no additional information.
- **Motion:** use short state transitions and honor `prefers-reduced-motion`.

## 4. Typography

- **Font Family:** Inter with system sans-serif fallbacks.
- **Body Copy:** `15px` with `1.5` line height; body text uses `14px` on small screens.
- **Page Headings:** medium-bold, fluid `23–28px`; approximately `24px` on mobile.
- **Key Metrics:** approximately `28px` on desktop and `25px` on mobile.
- **Desktop Table:** labels and data use smaller type to fit the table's information density. In responsive cards, lead names and data become larger and may wrap for readability.

Keep type hierarchy consistent. Lead names and company names can be long, so allow them to wrap in mobile cards instead of clipping them.

## 5. Layout Principles

- **Desktop:** application frame capped at `1600px`; sidebar occupies its own column and the main content fills the remaining space. Four metric cards sit above the lead list.
- **Tablet (up to `1100px`):** sidebar narrows to about `220px`; metrics switch to a two-column grid; lead rows become cards instead of compressing table columns.
- **Mobile (up to `760px`):** hide the sidebar, use a sticky top bar, and stack content in one column. Lead cards, details, and the footer reflow vertically.
- **Very Narrow Screens (up to `390px`):** reduce outer spacing and stack the toolbar so search, filters, and pagination remain usable.
- **Desktop Table:** allow its own horizontal scrolling when available width is insufficient. On tablet and mobile, reorganize table data into cards to avoid page-level horizontal scrolling.
- **Lead Details:** place lead information and the activity timeline side by side when space allows; stack them on narrow screens.
- **Spacing Rhythm:** favor multiples of `4px` and `8px`. Use whitespace, alignment, and subtle surfaces to establish hierarchy.

## 6. Do's and Don'ts

- ✅ Keep the light neutral background, high-contrast text, and green accents for primary actions and progress.
- ✅ Pair status colors with visible text labels.
- ✅ Preserve the same lead information order when the table becomes cards.
- ✅ Let long names, company names, and descriptions wrap on mobile; keep actions easy to identify and reach.
- ✅ Use Heroicons Outline consistently across interface icons.
- ❌ Do not apply the WattVision palette or switch to dark mode unless the design direction is explicitly changed.
- ❌ Do not shrink the whole interface to fit a phone; reorganize content at responsive breakpoints.
- ❌ Do not clip status labels, lead names, or stage information to save space.
- ❌ Do not add heavy shadows, decorative gradients, or stacked cards without a clear information-hierarchy purpose.
- ❌ Do not use an icon without a text label for a primary action.

## 7. Accessibility and Focus States

- **Keyboard Access:** all links, buttons, form controls, lead selection, and row actions must be reachable and operable with a keyboard. Keep focus order aligned with the visual reading order.
- **Visible Focus:** interactive controls use a clear focus ring. The current implementation uses a `3px` green outline (`rgb(8 167 124 / 36%)`) with a `2px` offset for `:focus-visible`. Preserve a visible indicator against both white surfaces and the page background; do not remove outlines without an equally clear replacement.
- **Accessible Names:** icon-only buttons need a meaningful accessible name. Inputs and selects need persistent labels; placeholders are not labels.
- **Status Communication:** keep status text visible alongside color. Progress indicators should expose their meaning and value to assistive technology when implemented as interactive or dynamic progress.
- **Touch Targets:** keep mobile actions at least `44 × 44px`, with enough separation to prevent accidental activation.
- **Motion and Zoom:** respect reduced-motion preferences and do not disable browser zoom. Responsive layouts must remain usable when text is enlarged.
- **Contrast:** maintain at least `4.5:1` contrast for normal text and `3:1` for large text, focus indicators, and essential graphics. Check status, muted, and focus colors against their actual surfaces when changing tokens.
- **Content Order:** labels, errors, and feedback should remain next to the control or data they describe in both desktop and mobile layouts.
