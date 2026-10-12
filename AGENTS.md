# AGENTS.md

Guidance for coding agents working in this repository.

## Project Overview

Build Keyloop Scenario C: a Sales Lead Management Tool.
Core flows: list leads, view lead details and activity history, and save follow-up activities.

## References

- For UI work, read DESIGN.md.
- Use README.md for build, run, and test commands.

## Agent skills

### Issue tracker

Issues are tracked in this repo's GitHub Issues. See `docs/agents/issue-tracker.md`.

### Domain docs

This repo uses single-context domain docs: root `GLOSSARY.md` and `docs/adr/`. See `docs/agents/domain.md`.

## TypeScript Standards

- Never use `: any` or `as any`. Use domain types, `unknown` with type guards (`in` / `typeof`), or schemas.
- Never write unchecked inline casts for member access: `(val as { prop: string }).prop` is forbidden.
- Use `import type` for type-only dependencies.

## Documentation

- Record actual AI contributions, corrections, and verification in the README's AI Collaboration Narrative.

## Design source of truth

- Rules and tokens: @DESIGN.md (colors, typography, spacing, components, a11y) and
- Follow @reference_HTML.html for layout, visual hierarchy, spacing, typography, colors, and component appearance.
- Do not invent new colors, font sizes, or spacing values. Use tokens from @DESIGN.md.
- If the HTML and DESIGN.md conflict, stop and ask.
