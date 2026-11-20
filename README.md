# Grow Kind

Grow Kind is a student-centred study and productivity project designed to help learners organise their study time, build consistent habits, and make steady progress towards their learning goals.

The project currently begins with a simple study timer. Over time, Grow Kind is intended to grow into a broader **Personal Study OS** that brings useful study-planning and progress tools together in one place.

> **Current status:** The repository currently contains the study timer application described below. Features in the product vision and roadmap are plans for future development, not claims about what is already implemented.

## Current features

- Starts with a 25-minute study period and a 5-minute break.
- Lets users choose different study and break durations.
- Plays a short sound when a timer phase ends.
- Counts completed study sessions.
- Saves timer lengths and the sound preference in the browser.
- Saves completed-session totals in `backend/data/sessions.json` on the computer running the backend.
- Provides a backend health-check endpoint and study-session statistics endpoints.

## Technology stack

The current application uses:

- **Frontend:** HTML, CSS, and browser JavaScript.
- **Backend:** Node.js and Express.
- **Data storage:** Browser storage for timer preferences and a JSON file for completed-session totals.

The backend also serves the frontend, so the application can be run through one local server.

## Project structure

```text
Grow-Kind/
├── backend/
│   ├── data/
│   │   └── .gitkeep
│   └── server.js
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The `backend/data/sessions.json` file is created when the backend first starts. It stores completed-session totals on the machine running the server and is ignored by Git.

## Getting started

### Requirements

- [Node.js](https://nodejs.org/) version 20 or later.
- Git (if you are cloning the repository).

### Clone the repository

```bash
git clone https://github.com/gfmwangi/Grow-Kind.git
cd Grow-Kind
```

If you already have the project on your computer, open the project folder in VS Code and use its integrated terminal.

### Install dependencies

```bash
npm install
```

### Start the application

```bash
npm start
```

Open the following address in your browser:

```text
http://localhost:3000
```

Keep the terminal running while you use the timer. To stop the server, press `Ctrl+C` in the terminal.

### Check the backend

Open:

```text
http://localhost:3000/api/health
```

A successful response is:

```json
{"status":"ok"}
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Checks that the backend is available. |
| `GET` | `/api/stats?date=YYYY-MM-DD` | Returns all-time and requested-day study-session counts. |
| `POST` | `/api/sessions` | Increments the session counts when a study session finishes. |

The `POST /api/sessions` endpoint expects a JSON request body in this format:

```json
{
  "date": "YYYY-MM-DD"
}
```

## Development workflow

The repository uses a branch-based workflow:

- `main` is reserved for stable, reviewed versions.
- `develop` is the primary integration branch.
- Feature branches are created from the latest `develop` branch.
- Completed feature branches are reviewed and merged into `develop` through pull requests.
- When the integrated application is ready for a stable release, changes are reviewed and merged from `develop` into `main`.

A typical feature branch name could be:

```text
feature/feature-name
```

For example:

```text
feature/study-planning
```

Before starting a new feature, update your local `develop` branch so that the feature branch begins from the latest integration work.

## Product documentation

The following documents describe the product's direction and planned development:

- [Product Specification](GROW_KIND_PRODUCT_SPECIFICATION.md) — describes the product concept, intended users, requirements, and scope.
- [Vision](GROW_KIND_VISION.md) — explains the purpose, mission, and guiding principles of Grow Kind.
- [Roadmap](GROW_KIND_ROADMAP.md) — outlines the planned phases of product development.

These documents describe the intended direction of the project. The implementation status of individual features should always be checked against the current codebase.

## Project direction

Grow Kind will evolve incrementally. Possible future areas include study planning, tasks and subjects, goals, session history, progress analytics, personalisation, and synchronisation across devices.

Future technologies and features will be introduced when they solve a clear product or engineering need. The project will prioritise maintainability, accessibility, privacy, reliability, and a useful experience for learners.

## Contributing

Development should be organised around focused changes:

1. Start from the latest `develop` branch.
2. Create a feature branch for the change.
3. Keep the change focused and test it locally.
4. Commit and push the feature branch.
5. Open a pull request targeting `develop`.
6. Review and merge the pull request after the changes are ready.

Please keep documentation aligned with the actual application and clearly distinguish implemented functionality from planned work.

## Repository

GitHub: [gfmwangi/Grow-Kind](https://github.com/gfmwangi/Grow-Kind)
