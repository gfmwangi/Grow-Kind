# Grow Kind — Changelog

All notable changes to Grow Kind are documented in this file.

This project follows a simple changelog format inspired by Keep a Changelog. Entries are grouped by version or development stage and use these categories where relevant:

- **Added** — new features or capabilities.
- **Changed** — changes to existing functionality.
- **Fixed** — bug fixes.
- **Removed** — removed features or behaviour.
- **Security** — security-related changes.

Grow Kind is under active development. Until the first formal release, entries are recorded under **Unreleased**. A feature should only be listed as implemented when it has actually been added to the codebase.

## [Unreleased]

### Added
- Project documentation for the product specification, vision, roadmap, architecture, and architecture decisions.
- A study timer with configurable study and break durations.
- Automatic transitions between study and break phases.
- A completed-session counter.
- A short notification sound when a timer phase ends.
- Browser-based preferences for timer durations and sound settings.
- A backend API for health checks and study-session statistics.
- File-based persistence for recorded study-session statistics.

### Changed
- Established **Grow Kind** as the product name while retaining the existing GitHub repository name `Grow-Kind`.
- Established the Git workflow using focused feature branches, `develop` for integration, and `main` for stable releases.

### Notes
- This is a development-stage changelog, not a declaration that Grow Kind has reached its first production release.
- Future entries should include meaningful user-facing and technical changes as they are implemented.
- Do not add planned roadmap features here until they have actually been delivered.

## Future release entry template

When a version is released, add a dated section near the top of this file:

```markdown
## [1.0.0] - YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Security
- ...
```
