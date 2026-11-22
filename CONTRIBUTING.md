# Contributing to Grow Kind

Thank you for your interest in contributing to Grow Kind.

Grow Kind is a learner-centred study and productivity platform. Contributions should support its goal of helping learners organise their academic responsibilities, build sustainable study habits, and understand their progress.

This guide explains the expected workflow for contributing to the project.

## 1. Before you begin

- Read the project `README.md` to understand the current application and how to run it.
- Read `GROW_KIND_PRODUCT_SPECIFICATION.md` for the product scope and requirements.
- Read `GROW_KIND_VISION.md` and `GROW_KIND_ROADMAP.md` for the product direction.
- Read `ARCHITECTURE.md` and `DECISIONS.md` before making changes that affect the system design or technology choices.
- Check existing issues and pull requests, if available, to avoid duplicating work.

If a requirement is unclear, discuss it before implementing a major change.

## 2. Development environment

The current application uses:

- Node.js for the backend runtime.
- Express for the current backend framework.
- HTML, CSS, and browser JavaScript for the current frontend.
- Prisma as the chosen ORM for the planned database-backed architecture.
- PostgreSQL as the chosen database engine.

Prisma and PostgreSQL are confirmed technology choices for the target architecture. Do not assume that every planned technology or future capability has already been integrated into the current application.

Use a supported Node.js version specified by the project configuration or README. Install dependencies using the package manager and lockfile used by the repository. Before running the application, check the available scripts in `package.json` and follow the current README instructions.

Do not commit local environment files, credentials, API keys, database passwords, or other secrets.

## 3. Branching workflow

Grow Kind uses the following branches:

- `main` — stable, release-ready code.
- `develop` — the primary integration branch.
- `feature/*` — focused branches for individual features or tasks.
- `fix/*` — focused branches for bug fixes, where appropriate.

Create new work branches from the latest `develop` branch. Do not use `main` as the everyday development base.

Example workflow:

```bash
git switch develop
git pull origin develop
git switch -c feature/short-description
```

Use a short, descriptive branch name, such as `feature/task-management` or `fix/timer-reset`.

When the work is ready:

1. Review your changes.
2. Run the relevant checks and tests.
3. Commit the focused changes.
4. Push the branch to GitHub.
5. Open a pull request targeting `develop`.
6. Respond to review feedback and make any required corrections.

Only stable, reviewed work should move from `develop` to `main` as part of a release.

## 4. Making changes

- Keep each contribution focused on one feature, fix, or documentation task.
- Follow the existing project structure and coding conventions.
- Prefer clear, readable code over unnecessarily clever solutions.
- Avoid unrelated changes and large rewrites without prior discussion.
- Keep accessibility, responsive behaviour, privacy, and reliability in mind.
- Do not introduce a new dependency or technology without explaining why it is needed.
- Update relevant documentation when behaviour, setup instructions, API contracts, or architecture decisions change.
- Do not mark roadmap items as complete until the implementation has been verified.

## 5. Testing and quality checks

Before opening a pull request:

- Run the checks and tests relevant to the files you changed.
- Build the application if the repository provides a build script.
- Manually test affected user flows when appropriate.
- Check browser console and server output for errors.
- Verify that existing functionality has not been unintentionally broken.

Use the scripts currently defined in `package.json`; do not assume a test or build command exists if it has not been configured.

If a test cannot be run, explain why in the pull request.

## 6. Commit messages

Write concise commit messages that describe the change.

Examples:

```text
Add subject management interface
Fix timer phase transition
Update database architecture documentation
Improve session statistics validation
```

Avoid vague messages such as `updates`, `changes`, or `final work`.

## 7. Pull request expectations

A pull request should include:

- A clear title describing the change.
- A short explanation of what changed and why.
- Relevant issue references, if applicable.
- Tests or checks performed and their results.
- Screenshots or a short recording for visible interface changes, where useful.
- Any known limitations or follow-up work.

Keep pull requests reasonably small so they can be reviewed effectively.

## 8. Documentation and architecture decisions

Documentation is part of the project, not an optional afterthought.

Update the relevant documentation when a contribution changes:

- Product behaviour or requirements.
- Architecture or technology choices.
- API endpoints or request/response behaviour.
- Database models or migrations.
- Installation, testing, or deployment instructions.
- User-facing workflows.

Significant technical decisions should be recorded in `DECISIONS.md`. When an existing decision is replaced, preserve the history and explain the new direction.

## 9. Security and privacy

- Never commit secrets, passwords, tokens, private keys, or real user data.
- Validate and safely handle data received from users and external systems.
- Avoid logging sensitive information.
- Report suspected security vulnerabilities privately to the project maintainer rather than publishing exploit details in a public issue.

## 10. Questions and contributions

If you are unsure whether a proposed change fits the project, raise the question before investing significant implementation effort.

Thank you for helping Grow Kind grow into a useful, reliable, and welcoming learning tool.
