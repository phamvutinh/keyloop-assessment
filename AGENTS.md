<!-- intent-skills:start -->
## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:
- Run `npm exec --no -- intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npm exec --no -- intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

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

## Documentation

- Record actual AI contributions, corrections, and verification in the README's AI Collaboration Narrative.

## Design source of truth

- Rules and tokens: @DESIGN.md (colors, typography, spacing, components, a11y) and
- Follow @reference_HTML.html for layout, visual hierarchy, spacing, typography, colors, and component appearance.
- Do not invent new colors, font sizes, or spacing values. Use tokens from @DESIGN.md.
- If the HTML and DESIGN.md conflict, stop and ask.
