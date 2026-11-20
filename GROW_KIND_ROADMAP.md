# Grow Kind — Product Roadmap

**Product:** Grow Kind  
**Product category:** Personal study and productivity platform  
**Long-term direction:** Personal Study OS  
**Repository:** `gfmwangi/Grow-Kind`  
**Document version:** 1.0  
**Status:** Initial roadmap — priorities and sequencing subject to review

---

## 1. Purpose

This roadmap describes the planned evolution of Grow Kind from its current study-timer foundation into a broader platform for organising and supporting student learning.

It is a planning document, not a statement that the listed features are already available. Each phase should be refined into feature specifications, technical tasks, and acceptance criteria before implementation.

## 2. Roadmap Principles

- **Build in manageable stages:** deliver useful, working increments rather than attempting the entire vision at once.
- **Validate before expanding:** use testing and learner feedback to guide priorities.
- **Protect existing functionality:** make changes incrementally and avoid unnecessary rewrites.
- **Design for maintainability:** use clear boundaries, consistent conventions, automated tests, and documented decisions.
- **Prioritise privacy and security:** consider data protection as features and user accounts are introduced.
- **Keep the experience coherent:** new modules should work together as one study platform.
- **Avoid premature complexity:** introduce infrastructure only when a real requirement justifies it.

## 3. Current Baseline

Grow Kind began as a study-timer application. The current codebase has a frontend built with HTML, CSS and JavaScript, and a Node.js/Express backend. The exact state and behaviour of the current implementation must be verified against the source code before individual features are labelled complete.

The initial development priority is to understand, stabilise, test, and document this foundation.

### Status definitions

| Status | Meaning |
|---|---|
| Planned | Identified as part of the product direction; not yet implemented |
| In progress | Currently being designed or implemented |
| Implemented | Present in the codebase and verified |
| Under review | Requires technical or product evaluation |
| Deferred | Intentionally postponed until dependencies or priorities change |

Do not mark a roadmap item as implemented solely because it appears in this document or another planning document.

## 4. Development Phases

The phases below describe a proposed sequence. They are not fixed deadlines. A phase should progress when its important requirements, tests, and quality criteria are satisfied.

### Phase 0 — Project foundation and engineering quality

**Goal:** Establish a reliable, understandable foundation for future development.

Planned work:

- Review the existing frontend, backend, and data-storage implementation.
- Correct outdated project branding and setup instructions.
- Document the current architecture and API behaviour.
- Identify existing functionality, limitations, and technical debt.
- Establish consistent code formatting and project conventions.
- Add automated tests around important existing behaviour.
- Introduce input validation and consistent error handling where needed.
- Review logging, configuration, secrets handling, and security basics.
- Establish GitHub Actions checks for relevant tests and build steps.
- Define a repeatable local development and deployment workflow.

**Exit considerations:**

- Developers can set up and run the project using accurate instructions.
- Important existing workflows have repeatable tests.
- Current system behaviour and known limitations are documented.
- Changes can be reviewed and integrated through the agreed `develop` workflow.

### Phase 1 — Core focus and study sessions

**Goal:** Make the study-session experience dependable, flexible, and easy to use.

Planned capabilities:

- Start, pause, resume, and reset a session.
- Support configurable study and break durations.
- Provide a classic Pomodoro-style cycle, including longer breaks where configured.
- Let learners manually start the next study or break phase.
- Support custom study cycles and intervals.
- Explore a stopwatch/count-up mode.
- Allow a session to be associated with a task, subject, or learning goal.
- Preserve and recover an active timer state appropriately after refresh or interruption.
- Provide optional sound and browser notifications, subject to browser permissions.
- Offer clear session completion and transition controls.
- Improve responsive behaviour for desktop and mobile screens.
- Add accessible controls, keyboard support, and clear feedback.
- Consider dark mode and user preferences.

**Exit considerations:**

- Timer state transitions behave correctly, including pause, resume, reset, and manual phase changes.
- Timing and recovery behaviour are tested.
- The interface is usable on supported screen sizes.
- Notifications and sounds fail gracefully when unavailable or disabled.

### Phase 2 — Tasks, subjects, and study organisation

**Goal:** Connect focused study sessions to the learner's actual academic responsibilities.

Planned capabilities:

- Create, view, edit, complete, and delete tasks.
- Add task descriptions, priorities, due dates, and status.
- Organise work by subjects, courses, and topics.
- Associate study sessions with tasks and subjects.
- Create daily and weekly study plans.
- Add personal study goals and progress indicators.
- Build reusable study-plan templates.
- Start a study session directly from a task.
- Provide a clear view of upcoming and overdue work.

**Exit considerations:**

- Task and subject data can be created, updated, and retrieved reliably.
- Relationships between tasks, subjects, goals, and sessions are clear.
- Validation and error handling cover important user actions.
- The interface remains understandable as the number of records grows.

### Phase 3 — Study history, analytics, and reflection

**Goal:** Help learners understand their study activity and make informed adjustments.

Planned capabilities:

- Maintain a detailed record of completed study sessions.
- Show daily, weekly, and monthly study activity.
- Summarise time by subject, topic, or task.
- Compare planned and completed study activity where relevant data exists.
- Track goals and progress over time.
- Provide useful trends and visualisations.
- Support optional streaks without shame-based messaging.
- Add session notes, reflections, and learning outcomes.
- Explore activity heatmaps and study reports.
- Provide appropriate data export, such as CSV or PDF, where useful.

**Exit considerations:**

- Analytics are calculated from reliable underlying records.
- Totals and summaries are consistent and testable.
- Charts and reports communicate information clearly.
- Users can understand and control the records used to generate their progress information.

### Phase 4 — Personalisation, accessibility, and offline capability

**Goal:** Make Grow Kind adaptable and dependable across different study environments.

Planned capabilities:

- Save user preferences for timer behaviour and interface settings.
- Improve accessibility and keyboard navigation.
- Refine responsive layouts and mobile usability.
- Evaluate Progressive Web App (PWA) installation.
- Evaluate service-worker caching for appropriate application resources.
- Support offline access to suitable core features.
- Store relevant local data safely and handle storage failures.
- Explore synchronisation when connectivity returns, if an account and sync architecture are available.
- Handle timer behaviour realistically within browser and operating-system limitations.

**Exit considerations:**

- Offline behaviour is clearly defined and tested.
- The application communicates sync state and conflicts where applicable.
- Local data is not silently overwritten or lost.
- Supported accessibility and responsive requirements are verified.

### Phase 5 — Accounts, cloud data, and synchronisation

**Goal:** Enable secure personal accounts and access to a learner's data across devices.

Planned capabilities:

- User registration, login, and logout.
- Secure password storage and account recovery.
- Profile and preference management.
- Authentication and role/permission checks where needed.
- Cloud storage for user-owned tasks, subjects, goals, notes, and session records.
- Multi-device data synchronisation.
- Backup and recovery procedures.
- Account data export and deletion controls.
- Session management and security monitoring appropriate to the product.

**Data and backend evolution:**

- Evaluate a move from the current storage approach to a relational database.
- PostgreSQL is the proposed long-term relational database.
- Design database schemas, constraints, indexes, and migrations deliberately.
- Select a data-access approach, such as Prisma or Drizzle, after a focused technical evaluation.
- Define conflict handling and synchronisation rules before enabling multi-device editing.

**Exit considerations:**

- Authentication and authorisation are tested.
- User data is isolated between accounts.
- Backup, recovery, export, and deletion workflows are documented and tested.
- Security and privacy risks have been reviewed.

### Phase 6 — Collaborative learning

**Goal:** Let learners study together while retaining control over their individual learning experience.

Planned capabilities:

- Private and invite-based study rooms.
- Group focus sessions.
- Study partners and accountability partnerships.
- Shared goals and optional group challenges.
- Group progress summaries with privacy controls.
- Room moderation and reporting tools where needed.
- Real-time updates where they materially improve the experience.

**Exit considerations:**

- Membership, invitations, and permissions are enforced.
- Private information is not exposed through group features.
- Real-time features recover appropriately from connection interruptions.
- Community features support learning rather than unhealthy comparison.

### Phase 7 — AI-assisted study support

**Goal:** Offer optional assistance that helps learners plan and understand their learning without replacing their own effort.

Potential capabilities:

- Generate draft study plans from learner-provided goals or syllabus content.
- Break large assignments into manageable suggested tasks.
- Help organise and summarise learner-provided notes.
- Suggest revision schedules and review reminders.
- Identify subjects or topics receiving less attention based on available records.
- Help learners reflect on progress and plan next steps.

**Important considerations:**

- AI-generated content must be presented as assistance, not unquestionable fact.
- Learners should review and control generated plans and changes.
- Uploaded documents and personal learning data require careful privacy and security handling.
- AI features should not be required for core study workflows.
- Evaluate cost, latency, reliability, accessibility, and provider dependency before selecting services.

### Phase 8 — Integrations and broader platform capabilities

**Goal:** Connect Grow Kind to useful learning and productivity services where there is clear user value.

Potential capabilities:

- Calendar integrations.
- Note-taking and task-management integrations.
- Flashcard and revision-tool integrations.
- Import and export workflows.
- Carefully scoped public APIs.
- Native mobile application evaluation.
- Institutional or classroom-oriented features, if supported by validated user needs.

Integrations should be selected based on demand, security, maintainability, and the quality of the available APIs.

## 5. Proposed Technology Evolution

Technology choices should support the product's needs without creating avoidable complexity. The following is a direction for evaluation, not a commitment to adopt every technology.

| Area | Current or starting point | Proposed direction |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Evaluate React and TypeScript as interface complexity grows |
| Backend | Node.js and Express | Continue with Express initially; evaluate a modular structure and NestJS only if justified |
| Data storage | Existing implementation requires source verification | Evaluate PostgreSQL for structured multi-user data |
| Data access | Existing approach requires source verification | Evaluate Prisma or Drizzle after a focused comparison |
| Testing | Current coverage requires verification | Add suitable unit, integration, and end-to-end testing |
| CI | Requires verification | GitHub Actions for automated checks |
| Packaging and environments | Requires verification | Consider Docker for consistent environments |
| Caching and background jobs | Not assumed to be required initially | Evaluate Redis or a job queue when workload requires it |
| Real-time collaboration | Future capability | Evaluate WebSockets or an appropriate managed alternative |
| Deployment and monitoring | Current setup requires verification | Choose services based on reliability, cost, security, and operational needs |

### Architecture strategy

Start with a well-structured modular monolith unless evidence shows that separate services are necessary. This keeps deployment and development manageable while allowing clear boundaries between product modules.

Avoid adopting microservices, Redis, complex event infrastructure, or multiple databases simply because the long-term product may become large.

### Technology decision process

Before adopting a major technology:

1. Identify the product or engineering problem.
2. Compare realistic alternatives.
3. Consider learning cost, maintenance, security, performance, hosting, and cost.
4. Build a small proof of concept when uncertainty is significant.
5. Record the decision and its trade-offs in `DECISIONS.md`.
6. Revisit the decision if requirements change.

## 6. Cross-Cutting Requirements

The following concerns apply across phases:

- Security and privacy by design.
- Accessible and responsive user experience.
- Data validation and integrity.
- Clear error handling and useful logs.
- Automated testing for critical behaviour.
- Maintainable code and documented interfaces.
- Performance appropriate to the supported devices and usage.
- Backup, recovery, and data portability where user data is stored.
- Clear distinction between implemented, planned, and experimental capabilities.

## 7. Prioritisation

Within each phase, prioritise work using the following considerations:

1. Does it solve a meaningful learner problem?
2. Is it necessary for the reliability or security of existing features?
3. Does it unblock other important capabilities?
4. Can it be delivered and tested in a manageable increment?
5. Does it introduce ongoing cost or operational complexity?
6. Can its value be evaluated with user feedback or measurable acceptance criteria?

A feature should not be prioritised solely because it is technically interesting.

## 8. How Roadmap Work Becomes Development Work

Before implementation, each significant roadmap item should have:

- A feature specification describing its purpose and scope.
- User stories or clear use cases.
- Functional and non-functional requirements where applicable.
- Acceptance criteria.
- A technical design for changes affecting architecture or data.
- A testing plan.
- Documentation updates where behaviour, setup, or interfaces change.

Work should be developed on focused feature branches, reviewed, tested, and merged into `develop` according to the project's Git workflow. `main` should remain the stable release branch.

## 9. Roadmap Maintenance

This roadmap should be updated when priorities change, phases are completed, new requirements are validated, or technical decisions alter the planned sequence.

When updating it:

- Record the date and nature of meaningful changes.
- Do not mark work complete until it has been implemented and verified.
- Explain significant deferrals or scope changes.
- Keep this roadmap consistent with the product specification, vision, architecture, and changelog.

---

**Grow Kind — Grow at your own pace.**
