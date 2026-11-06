# Personal Learning Tracker

A full-stack learning workspace for organizing projects, choosing a random next concept, retaining one active concept per project, and preserving completed learning history. The application uses React/Vite on the client and Express/PostgreSQL on the server.

## Highlights

- Cookie-based JWT authentication with HTTP-only cookies and bcrypt-compatible password hashing (`bcryptjs` was chosen because native `bcrypt` cannot install from this Windows path containing `&`).
- Private, user-owned learning projects with create, edit, and delete actions.
- Pending concepts are case-insensitively unique inside a project and can be safely removed only while pending.
- Animated text-based selector (not a wheel); the winning concept is chosen transactionally by PostgreSQL-backed API logic.
- Independent current-learning state in every project, persisted in PostgreSQL.
- Completed history with timestamps and responsive, accessible React UI.

## Prerequisites

- Node.js 20+ (Node 22 tested)
- PostgreSQL 14+ with permission to create/use a database

## Setup

1. Create a database:

   ```sql
   CREATE DATABASE personal_learning_tracker;
   ```

2. Copy `.env.example` to `.env` and set a strong `JWT_SECRET` plus a valid `DATABASE_URL`.

3. Install the dependencies:

   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```

4. Apply versioned database migrations:

   ```bash
   npm run migrate
   ```

5. Start both apps:

   ```bash
   npm run dev
   ```

   Client: `http://localhost:5173` · API: `http://localhost:4000`

`CREATE_SAMPLE_PROJECTS=true` creates **Java Learning** and **Finance Learning** for each newly registered user. Set it to `false` when those starter projects are not desired.

## Structure

```text
client/                 React + Vite + Tailwind + Framer Motion
  src/components/       Reusable interface components
  src/context/          Authentication state
  src/pages/            Welcome, authentication, dashboard, project detail views
  src/services/         Cookie-aware REST client
server/
  migrations/           Ordered SQL migrations
  src/controllers/      Auth, project, and concept actions
  src/middleware/       Authentication, validation, errors
  src/routes/           REST API routing
  src/config/           Environment and PostgreSQL pool
```

## API

| Area | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| Projects | `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/:id` |
| Concepts | `GET/POST /api/projects/:id/concepts`, `DELETE /api/concepts/:id` |
| Learning | `POST /api/projects/:id/spin`, `POST /api/concepts/:id/complete` |

All non-auth endpoints require a valid cookie and verify resource ownership on the server.

## Data integrity and security

- UUID primary keys, foreign keys, cascades, timestamps, and supporting indexes live in `server/migrations/001_initial.sql`.
- `concepts_project_lower_name_unique` prevents duplicate concept names without case sensitivity.
- `one_active_concept_per_project` is a PostgreSQL partial unique index that ensures no project has more than one `LEARNING` concept.
- Spin locks the project row and runs in a transaction before promoting one pending concept. Completion also runs in a transaction.
- Passwords are salted/hash-verified with the bcrypt algorithm; JWTs live only in secure, HTTP-only cookies (`Secure` is enabled in production).
- Inputs are bounded and validated; SQL uses parameterized queries.

## Verification

Run the lightweight server validation tests:

```bash
npm test
```

Run a client production build:

```bash
npm run build
```

Then, with PostgreSQL configured, verify these end-to-end flows in a browser:

1. Register, log out, and log back in.
2. Create, edit, and delete a project.
3. Add concepts; verify case-insensitive duplicates are rejected.
4. Remove only pending concepts and confirm the dialog prevents accidental deletion.
5. Spin to select a concept, then attempt another spin (it is disabled/server-rejected).
6. Complete it and verify it enters completed history, then spin again.
7. Open two projects and retain a different active concept in each.
8. Refresh, log out/in, and sign in elsewhere to confirm the active concept persists.
9. Use a second account to confirm project URLs from the first account return `404`.
10. Send simultaneous `POST /spin` requests and verify the partial index/transaction leaves only one active concept.

## Notes for this workspace

This Windows workspace name contains an `&`, which prevents native npm command shims from reliably resolving paths. The root scripts use direct Node entry points to work around that condition. If Vite cannot write `client/dist` due to a local file lock, close any process holding it and rerun `npm run build`.
