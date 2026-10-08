# DESIGN.md — AI Manager / Real Design System

## 1. Purpose

This document defines the shared visual and interaction rules for AI Manager: the Lead Management CRM, standalone 404 page, and utility guideline page.

## 2. Visual Theme & Atmosphere

AI Manager is a quiet, operational interface for managing leads and follow-up work. It prioritizes scan-friendly hierarchy, calm feedback, and clear action states.

Use neutral surfaces and near-black text as the default. Green is a high-signal cue for positive actions, selection, and keyboard focus; use it selectively.

## 3. Color Palette

| Role        | Name        | Hex       | Usage                                             |
| ----------- | ----------- | --------- | ------------------------------------------------- |
| background  | Background  | `#f0f1f1` | Outer application canvas and low-emphasis regions |
| foreground  | Foreground  | `#111318` | Headings, body text, dark primary controls        |
| accent      | Accent      | `#08a77c` | Focus ring, positive action, selection cue        |
| surface     | Surface     | `#ffffff` | Cards, inputs, panels, selected navigation        |
| muted       | Muted       | `#747981` | Metadata, helper text, inactive navigation        |
| border      | Border      | `#e8e9eb` | Dividers, input outlines, component boundaries    |
| accent-dark | Accent dark | `#087b60` | Pressed and hover state for positive actions      |

Do not introduce additional colors without defining their role and accessibility behavior.

## 4. Typography

- **Display and UI:** Inter, with fallbacks: `ui-sans-serif`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `sans-serif`.
- **Headings:** Use strong hierarchy through size and weight rather than decorative styling.
- **Body text:** Minimum 16px for reading content; use a line height between 1.5 and 1.75.
- **Labels and metadata:** May use 12–14px when paired with readable contrast and clear hierarchy.

## 5. Layout Principles

- Use an 8px spacing rhythm.
- Use 10px corner radii for controls.
- Use 16–22px corner radii for grouped surfaces such as cards and panels.
- Use 1px borders with `#e8e9eb`.
- Keep primary content in normal document flow with Flexbox or Grid.
- Use a sidebar on larger screens; switch to compact horizontal navigation on narrow screens.
- Support responsive layouts at 375px, 768px, 1024px, and 1440px.
- Avoid horizontal page scrolling on mobile.

## 6. Component Rules

### Buttons

- Use one dark primary button for the highest-priority action in a task area.
- Primary button: `#111318` background with `#ffffff` text.
- Primary hover: `#2b3139` background and border with `#ffffff` text, matching the `reference_HTML.html` “New Lead” hover effect.
- Secondary button: white surface with a border; hover changes surface and border only.
- Disabled buttons use the background surface and muted text.
- Buttons must have visible text unless they are icon-only controls.

### Icon Buttons

- Use Heroicons-style outlined icons with consistent stroke weight.
- Icon-only buttons require an accessible `aria-label`.
- Use a 10px radius for square icon controls.
- Maintain at least a 40px target on desktop and 44px on touch layouts.

### Inputs

- Every input needs a visible label.
- Place helper text below the input when context is needed.
- Use a white surface, 1px border, and 10px radius.
- Show a visible focus ring using `#08a77c`.
- Do not use placeholder text as the only label.

### Status Badges

- Status must be expressed through text as well as color.
- Use compact pills with a 999px radius.
- Reserve green for active, successful, or positive states.
- Use muted presentation for inactive or low-priority states.

### Loading States

- Use a spinner only when progress cannot be expressed more clearly.
- Pair loading indicators with explanatory text, such as “Loading lead details.”
- Respect `prefers-reduced-motion`.
- Reserve layout space so content does not shift while loading.

### Feedback Messages

- Confirm successful actions with concise text.
- Use an icon, label, and short explanation where useful.
- Keep non-blocking feedback in a polite live region.
- Error messages must explain the problem and the corrective action.

## 7. Interaction States

Every interactive component should define these states where applicable:

- Default
- Hover
- Focus-visible
- Active or selected
- Disabled
- Loading
- Success
- Error

Use surface and border changes before introducing another color. Do not make hover states lighter gray text.

## 8. Accessibility

- Maintain at least 4.5:1 contrast for body text.
- Use a visible `:focus-visible` outline: 3px `#08a77c` with an offset.
- Ensure all controls are keyboard reachable.
- Give icon-only controls accessible names.
- Do not rely on color alone to communicate status.
- Support reduced motion.
- Keep touch targets at least 44×44px on mobile.
- Preserve logical focus order across responsive layouts.

## 9. Voice & Tone

### Adjectives

Quiet, operational, precise.

### Messaging Principles

- Use concise, task-oriented labels.
- Prefer clear actions such as “Create lead,” “Export list,” and “Back to leads.”
- Use short status labels and descriptive field labels.
- Avoid decorative jargon, invented metrics, and competing visual emphasis.

## 10. Imagery & Icons

- Product interfaces do not use decorative hero imagery.
- Use imagery only when it supports identity or data recognition.
- Avoid fabricated logos and decorative stock imagery.
- Use one coherent Heroicons-style icon family.
- Never use emoji as functional icons.

## 11. Do’s and Don’ts

### Do

- Use neutral surfaces with selective green emphasis.
- Keep cards, forms, navigation, and actions visually consistent.
- Use clear labels and visible focus states.
- Reuse patterns documented in `guidelines.html`.

### Don’t

- Add gradients, glass effects, neon glows, or decorative illustrations.
- Use green as a large background wash.
- Introduce unapproved colors for component states.
- Hide essential actions on mobile.
- Create new one-off component patterns when an existing utility component fits.
