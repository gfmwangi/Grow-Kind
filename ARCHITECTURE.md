# Grow Kind — Architecture

**Document status:** Living architecture document  
**Product:** Grow Kind  
**Repository:** `gfmwangi/Grow-Kind`  
**Primary integration branch:** `develop`  
**Stable branch:** `main`

---

## 1. Purpose

This document describes the architecture of Grow Kind: the application as it exists today and the intended technical direction as the product grows into a larger **Personal Study OS**.

Grow Kind is intended to help learners organise academic responsibilities, build sustainable study habits, understand their progress, and work towards learning goals. The current repository is the starting point: a study timer with configurable study and break durations and basic session totals.

This document is a long-term engineering reference. It distinguishes:

- **Current implementation:** technology and behaviour evidenced by the code currently in the repository.
- **Confirmed direction:** choices the project has explicitly selected for future development.
- **Proposed or to-be-decided direction:** technologies and architectural approaches to evaluate when requirements justify them.

A planned technology or feature must not be described as already implemented.

## 2. Architecture principles

The architecture should follow these principles:

1. **Build incrementally:** evolve the existing application in manageable steps rather than attempting a large rewrite.
2. **Keep responsibilities clear:** separate presentation, application logic, business rules, and data access as the system grows.
3. **Prefer a modular monolith initially:** organise the backend into clear modules without introducing microservices prematurely.
4. **Use technology for a reason:** adopt tools when they solve a demonstrated product or engineering problem.
5. **Protect learner data:** apply privacy, security, access control, and data integrity practices from the beginning.
6. **Design for accessibility:** support different devices, input methods, and accessibility preferences.
7. **Test important behaviour:** build confidence through appropriate unit, integration, and end-to-end tests.
8. **Document decisions:** record significant technical choices, alternatives, and consequences in `DECISIONS.md`.

## 3. Current system overview

### 3.1 Current architecture style

The current application is a small, single Node.js/Express application. Express serves the static frontend and exposes the backend API from the same server.

```text
Learner's browser
       |
       | HTTP
       v
Node.js process
       |
       +-----------------------------+
       | Express application         |
       |                             |
       |  /api/health                |
       |  /api/stats                 |
       |  /api/sessions              |
       |                             |
       |  Static frontend delivery   |
       +-----------------------------+
          |                     |
          | API responses       | Static files
          v                     v
   Session statistics      HTML / CSS / JS
          |
          v
 backend/data/sessions.json

Browser Local Storage
  - Timer duration settings
  - Sound preference

Browser Web Audio API
  - Timer phase notification sound
```

The diagram represents the implementation described by the current source files. It is not the final target architecture.

### 3.2 Current technology stack

| Area | Current implementation |
|---|---|
| Frontend markup | HTML |
| Styling | CSS |
| Frontend programming | Browser JavaScript |
| Backend runtime | Node.js |
| Backend framework | Express |
| HTTP communication | Fetch API and JSON |
| Static file delivery | Express static middleware |
| Timer scheduling | Browser `setInterval` and timestamp-based countdown |
| Browser preferences | `localStorage` |
| Notification sound | Web Audio API |
| Session statistics storage | JSON file using Node.js `fs` |
| File path handling | Node.js `path` |

The frontend uses a system font stack with Inter first in the CSS font-family list. The current styles define a responsive layout, focus-visible states, and reduced-motion handling.

### 3.3 Current project structure

The known project structure is:

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

The `backend/data/sessions.json` file is created by the backend when it is first needed. It is generated runtime data and is ignored by Git.

## 4. Current frontend architecture

The frontend is a browser-based application made with HTML, CSS, and JavaScript. It is not currently a React application.

### 4.1 HTML structure

`frontend/index.html` provides the page structure and semantic sections:

- A header containing the current product label.
- An introductory section and sound control.
- A timer card with the phase label, countdown, progress ring, and controls.
- A progress section showing all-time and current-day session counts.
- A settings form for study and break durations.
- A footer.

The page loads `styles.css` and loads `app.js` with the `defer` attribute.

### 4.2 JavaScript responsibilities

`frontend/app.js` currently manages:

- Timer state, including the active phase, remaining seconds, phase length, running state, and end timestamp.
- Starting, pausing, resetting, and completing timer phases.
- Automatically moving between study and break phases.
- Rendering the countdown, phase label, progress ring, and button labels.
- Loading and validating saved timer settings.
- Saving study and break durations in browser Local Storage.
- Saving the sound preference in browser Local Storage.
- Generating a notification sound through the Web Audio API.
- Fetching session statistics from the backend.
- Sending a completed study session to the backend.
- Rendering the all-time and daily session totals.

The countdown uses an end timestamp and recalculates the remaining time. The interval triggers display updates; it is not the sole source of elapsed-time measurement.

### 4.3 Browser storage

The current application stores preferences in `localStorage`:

| Key | Purpose |
|---|---|
| `studyTimerSettings` | Stores study and break durations. |
| `studyTimerSoundEnabled` | Stores whether notification sound is enabled. |

These values are stored in the learner's browser. They are not currently synchronised across browsers or devices.

### 4.4 Styling and responsive behaviour

`frontend/styles.css` contains the application's visual system and layout rules. It defines shared CSS variables, typography, colours, cards, controls, timer visuals, and responsive breakpoints.

The current CSS includes:

- A desktop two-column workspace that changes to a single column on smaller screens.
- Responsive sizing for the timer and its controls.
- Visible keyboard focus styles.
- A reduced-motion media query.
- Different visual treatments for study and break phases.

## 5. Current backend architecture

### 5.1 Backend responsibilities

`backend/server.js` creates the Express application and currently handles:

- JSON request parsing with a 10 KB request-body limit.
- Health-check requests.
- Reading session statistics.
- Recording completed study sessions.
- Creating and reading the JSON statistics file.
- Serving the frontend's static files.
- Returning API-specific and page-level not-found responses.

The server uses the `PORT` environment variable when provided and otherwise listens on port `3000`. It binds to `0.0.0.0`.

The Express `x-powered-by` header is disabled.

### 5.2 Current API

| Method | Route | Responsibility |
|---|---|---|
| `GET` | `/api/health` | Returns `{ "status": "ok" }` when the server responds. |
| `GET` | `/api/stats?date=YYYY-MM-DD` | Returns the all-time count and count for the requested date. |
| `POST` | `/api/sessions` | Increments the all-time and date-specific session counts. |

The date value is validated against the `YYYY-MM-DD` format and checked as a real calendar date. Invalid dates receive an HTTP `400` response.

The session endpoint responds with HTTP `201` when a session is recorded. Read or write failures return an HTTP `500` response with a user-facing error message.

### 5.3 Current data storage

The backend stores statistics in:

```text
backend/data/sessions.json
```

The current data shape is:

```json
{
  "totalSessions": 0,
  "dailySessions": {}
}
```

- `totalSessions` stores the all-time completed-session count.
- `dailySessions` stores counts keyed by date, for example `"2026-11-20": 3`.

The backend creates the data directory and initial file if they do not exist.

**Current limitation:** this is file-based storage for a small local application. It is not a relational database and is not yet suitable as the long-term persistence layer for a multi-user platform. Concurrent writes, backups, data migrations, multi-instance deployment, and user-level data separation need a more robust design before the system grows.

### 5.4 Frontend-to-backend data flow

**Loading statistics**

1. The frontend determines the current local calendar date.
2. It sends `GET /api/stats?date=YYYY-MM-DD`.
3. Express validates the date and reads the JSON file.
4. The backend returns the all-time and requested-day counts.
5. The frontend updates the progress display.

**Recording a completed study session**

1. The timer reaches the end of a study phase.
2. The frontend sends `POST /api/sessions` with a JSON date value.
3. Express validates the date.
4. The backend reads the existing statistics, increments the overall and daily counts, and writes the updated JSON file.
5. The backend returns the updated counts.
6. The frontend refreshes the displayed totals.

The current frontend displays a message if the save fails. The timer phase can finish even if the request to save the session does not succeed.

## 6. Confirmed future technology decisions

The following choices have been explicitly selected for the future system:

| Area | Confirmed direction | Notes |
|---|---|---|
| Backend runtime | Node.js | Node.js will remain the backend runtime as the platform expands. |
| Database access and management | Prisma ORM | Prisma will be used to define and manage application data access, models, and migrations. |

Prisma is an ORM, not a database engine. A database product must be selected separately. The relational database choice is recorded as a decision still to be confirmed in Section 7.

The existing Express backend can remain in place while the application is small. A framework change is not required merely because the platform is growing.

## 7. Proposed target architecture and technology options

This section records the intended direction and candidates to evaluate. Unless marked as confirmed in Section 6, these are not final technology commitments.

### 7.1 Target high-level architecture

The intended direction is a modular application with distinct responsibilities:

```text
Web / mobile / installable client
              |
              v
       Application API
              |
              v
       Node.js backend
              |
     +--------+---------+
     |        |         |
     v        v         v
 Identity   Learning   Progress
 module     module     module
     |        |         |
     +--------+---------+
              |
              v
       Application services
              |
              v
       Prisma data access
              |
              v
       Relational database
```

Additional infrastructure may be introduced when required:

- Background job processing for work that should not block an API request.
- Caching for frequently requested data.
- Real-time communication for collaborative or live features.
- Object storage for user-uploaded files.
- Monitoring, logging, backups, and alerting for production operations.

The diagram is conceptual. It does not imply that these modules or services already exist.

### 7.2 Frontend direction

**Candidate direction: React with TypeScript.**

As the user interface gains more screens, forms, shared components, and complex state, React and TypeScript may provide a maintainable component model and stronger development-time checks.

Adoption should be based on actual frontend complexity. The current HTML/CSS/JavaScript application remains the starting point until a migration is planned and approved.

### 7.3 Backend direction

**Confirmed runtime: Node.js.**

The current Express application can evolve into a modular monolith. Possible modules include:

- Authentication and identity.
- User profiles and preferences.
- Study sessions and focus tools.
- Tasks and academic planning.
- Subjects and learning goals.
- Progress, analytics, and reports.
- Notifications.
- Collaboration and study groups.

**Framework:** Express may continue to serve the API. NestJS is a candidate to evaluate if stronger conventions, dependency injection, and module organisation become valuable. A framework migration is not currently required or confirmed.

### 7.4 Database direction

**ORM: Prisma — confirmed.**

**Database engine: to be selected.** PostgreSQL is a strong candidate for evaluation because the planned platform is likely to contain related structured data, such as users, subjects, tasks, goals, sessions, and progress records. It is not recorded as a final decision until the project explicitly approves it.

The future data model should consider:

- User ownership and access boundaries.
- Relationships between users, subjects, tasks, goals, and sessions.
- Data validation and integrity constraints.
- Schema migrations and rollback strategy.
- Indexes for common queries.
- Backups, restoration, and retention.
- Time zones and date boundaries for daily statistics.

### 7.5 API direction

REST is a suitable starting point for communication between the client and Node.js backend. API contracts should be documented and versioning introduced when compatibility requirements make it necessary.

The backend should validate input, enforce permissions, apply business rules, and return predictable error responses. The client must not be treated as a trusted source of identity or permissions.

### 7.6 Testing direction

The platform should build a layered testing approach:

- **Unit tests:** individual functions and business rules.
- **Integration tests:** API routes, persistence, and module interactions.
- **End-to-end tests:** important learner journeys through the application.
- **Accessibility checks:** keyboard use, semantics, contrast, and assistive-technology support.

Potential tools include Vitest or Jest for JavaScript/TypeScript tests and Playwright for browser end-to-end tests. Tool selection remains open until the testing setup is designed.

### 7.7 Delivery and infrastructure direction

| Area | Candidate direction | When it may be useful |
|---|---|---|
| Source control | Git and GitHub | Already used by the project. |
| CI/CD | GitHub Actions | Automated checks and deployment workflows. |
| Containers | Docker | Reproducible environments and deployment consistency. |
| Hosting | Managed application and database hosting | When the application is deployed for real users. |
| Monitoring | Structured logs, error tracking, and service monitoring | Before and during production operation. |
| Backups | Automated database backups and restore tests | Once persistent user data is introduced. |

### 7.8 Optional capabilities for later phases

These technologies are candidates, not immediate requirements:

- **Redis:** caching, rate limiting, or temporary coordination when justified.
- **Background job queue:** reminders, scheduled reports, and other asynchronous work.
- **WebSockets:** real-time study rooms, presence, or collaboration.
- **Progressive Web App (PWA):** installability and selected offline capabilities.
- **Object storage:** user-uploaded documents or other files.
- **AI service integration:** optional study assistance, recommendations, or summarisation, with privacy and safety controls.

Each capability should be introduced only after its use case, operational cost, privacy impact, and maintenance burden are understood.

## 8. Security and privacy considerations

Security is an architectural requirement, not a feature to add at the end.

As the platform becomes multi-user, the architecture must include:

- Secure authentication and session/token handling.
- Server-side authorisation for every protected resource.
- Strict user-level data isolation.
- Input validation and safe error handling.
- Rate limiting and abuse protection on sensitive endpoints.
- Secure secret and environment-variable management.
- HTTPS in deployed environments.
- Appropriate security headers and cross-origin policy.
- Dependency updates and vulnerability checks.
- Data minimisation, retention, export, and deletion processes.
- Safe handling of uploaded files if file uploads are introduced.
- Audit logging for sensitive administrative actions where appropriate.

The current timer does not implement a user-account system. These are requirements for future authenticated features, not descriptions of current functionality.

## 9. Scalability and reliability strategy

Grow Kind should scale through measured improvements:

1. Keep the early application simple and understandable.
2. Separate backend modules as product responsibilities expand.
3. Replace JSON-file persistence with a database before introducing multi-user persistent data.
4. Add indexes and optimise queries based on observed usage.
5. Introduce caching or background processing only when a measurable need appears.
6. Use horizontal scaling only after application state and persistence are designed to support it.
7. Add monitoring, backups, and recovery procedures before relying on the platform for important learner data.

A modular monolith is the preferred initial target. Microservices should be considered only if independent deployment, scaling, ownership, or reliability needs justify the additional complexity.

## 10. Architecture evolution

The architecture is expected to evolve in stages.

| Stage | Architectural focus |
|---|---|
| Current foundation | Single Node.js/Express application, browser frontend, JSON session statistics. |
| Engineering foundation | Clear module boundaries, documented API contracts, automated tests, environment configuration, and reliable error handling. |
| Structured persistence | Select a relational database, introduce Prisma, design migrations, and move session data safely. |
| Multi-user foundation | Authentication, authorisation, user-owned data, privacy controls, and account lifecycle. |
| Personal Study OS | Add tasks, subjects, goals, study history, analytics, and notifications as separate application modules. |
| Expanded platform | Evaluate PWA/offline support, collaboration, real-time features, integrations, and AI-assisted capabilities. |
| Scale and operations | Improve observability, performance, deployment automation, backup/recovery, and infrastructure where usage requires it. |

Progress between stages should depend on requirements, implementation quality, testing, and learner feedback—not fixed dates.

## 11. Architecture decision records

Significant technical decisions should be recorded in `DECISIONS.md` or in individual architecture decision records.

Each decision should capture:

- The context and problem.
- The decision and its status (proposed, accepted, superseded, or rejected).
- Alternatives considered.
- Reasons for the choice.
- Consequences, trade-offs, and migration implications.
- The date and any conditions for revisiting the decision.

Initial decisions to record include:

1. Node.js as the backend runtime — confirmed.
2. Prisma as the ORM — confirmed for future database-backed development.
3. The relational database engine — pending selection.
4. React and TypeScript — candidate frontend direction.
5. Express continuation versus a future framework change — to be evaluated.
6. Modular monolith as the preferred initial growth architecture.

## 12. Maintenance of this document

Update this document when:

- The architecture changes materially.
- A proposed technology becomes an accepted decision.
- A major module or integration is introduced.
- Data storage, authentication, deployment, or security responsibilities change.
- An earlier decision is superseded.

Keep the current implementation, accepted decisions, and future proposals clearly distinguished in every update.

---

**Architecture summary:** Grow Kind starts as a browser-based study timer served by a Node.js/Express application. Its architecture will evolve incrementally toward a modular Personal Study OS. Node.js is the confirmed backend runtime and Prisma is the confirmed ORM direction. The database engine and other future technologies will be selected and documented as their requirements become clear.
