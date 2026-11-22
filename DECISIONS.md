# Grow Kind — Architecture Decision Records

This document records important technical and product-engineering decisions for Grow Kind. It helps the project maintain a clear history of what has been agreed, what is still being evaluated, and why decisions may change.

A decision marked **Confirmed** is an agreed direction. **Pending** means the choice has not yet been made. **Proposed** means an option worth evaluating, not an approved implementation requirement.

## Decision status guide

- **Confirmed** — explicitly agreed and should guide current planning and implementation.
- **Pending** — more information or evaluation is needed before choosing.
- **Proposed** — a possible direction that has not been approved.
- **Superseded** — replaced by a later decision; retain the record for history.

## ADR-001: Use Node.js as the backend runtime

**Status:** Confirmed

### Context
Grow Kind needs a backend to expose application functionality and, as the product grows, support persistent data, user accounts, and other server-side features.

### Decision
Use **Node.js** as the backend runtime.

### Consequences
- Backend code will run on Node.js.
- The project can build on the existing Node.js backend.
- Runtime and dependency versions should be documented and kept consistent across development and deployment.

## ADR-002: Use Prisma for ORM and database access

**Status:** Confirmed

### Context
Grow Kind will need a maintainable way to define data models and communicate with its database as its features expand.

### Decision
Use **Prisma ORM** for database modelling and database access.

Prisma is an ORM; it is not the database engine itself. The database provider must be selected separately.

### Consequences
- Data models and database access will be managed through Prisma.
- Schema changes should be handled through reviewed Prisma migrations.
- The chosen database provider must be compatible with the Prisma version and features used by the project.

## ADR-003: Use PostgreSQL as the database engine

**Status:** Confirmed

### Context
Prisma requires a database provider. Grow Kind needs a reliable relational database to store structured application data as the product grows.

### Decision
Use **PostgreSQL** as the database engine, with Prisma ORM managing schema modelling and database access.

### Consequences
- PostgreSQL is part of the confirmed target technology stack.
- Prisma will be configured to use the PostgreSQL provider.
- Database hosting, backup arrangements, and deployment configuration will be selected and documented before production use.
- Database schemas and changes should be managed through reviewed Prisma migrations.

## ADR-004: Choose the future frontend framework

**Status:** Proposed

### Context
The current frontend uses HTML, CSS, and browser JavaScript. As the application grows, a frontend framework and stronger type checking may improve maintainability.

### Decision
Evaluate **React with TypeScript** as a possible future frontend direction. Neither has been confirmed as a required migration.

### Consequences
- Continue to maintain the existing frontend until a migration is justified.
- Assess the complexity, learning requirements, accessibility, maintainability, and testing benefits before adopting a framework.
- Avoid rewriting working features solely to introduce a new technology.

## ADR-005: Keep the existing backend framework unless change is justified

**Status:** Proposed

### Context
The current backend uses Express. A different framework, such as NestJS, could be considered if the application becomes more complex.

### Decision
Continue with the existing Express foundation for now. Re-evaluate the framework only when clear project needs justify a change. NestJS is an option to evaluate, not a confirmed choice.

### Consequences
- Avoid an unnecessary backend rewrite.
- Keep backend modules organised and responsibilities clear.
- Revisit this decision if the current structure becomes difficult to maintain or test.

## ADR-006: Prefer a modular monolith as the target architecture

**Status:** Confirmed direction

### Context
Grow Kind is expected to gain multiple related features. Separating every feature into its own service too early would add deployment, networking, monitoring, and operational complexity.

### Decision
Prefer a **modular monolith** as the initial target architecture: one application organised into clear modules with defined responsibilities and boundaries.

### Consequences
- Keep related functionality in the same deployable application initially.
- Organise modules so that responsibilities and dependencies remain understandable.
- Consider separate services only when scale, reliability, team ownership, or another concrete requirement makes the additional complexity worthwhile.
- Do not adopt microservices prematurely.

## ADR-007: Use feature branches and controlled integration

**Status:** Confirmed

### Context
The project needs a Git workflow that supports focused development, review, and stable releases.

### Decision
Use the following branch workflow:

- `main` — stable, release-ready code.
- `develop` — the primary integration branch.
- `feature/*` — focused work branches created from `develop`.

Completed feature branches should be reviewed and merged into `develop`. Stable releases can then be merged from `develop` into `main` when ready.

### Consequences
- Do not treat `main` as the everyday development branch.
- Keep feature branches focused on a specific task.
- Review changes before merging them into `develop`.
- Keep documentation and implementation changes aligned with the actual state of the project.

## How to add a future decision

For each significant decision, add a new numbered record using this structure:

1. **Title**
2. **Status**
3. **Context** — the problem or reason a decision is needed.
4. **Decision** — what was chosen, or what remains undecided.
5. **Consequences** — benefits, trade-offs, constraints, and follow-up work.

When a decision changes, do not silently rewrite history. Mark the old record as **Superseded**, explain what replaced it, and add a new record describing the updated decision.

## Review principle

Review decisions when project requirements, technical constraints, costs, security needs, or user feedback materially change. A proposed technology should not be treated as part of the implemented stack until it has been deliberately adopted and reflected in the code and documentation.
