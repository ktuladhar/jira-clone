# Jira Clone API

Node.js / Express REST API with TypeScript and TypeORM 0.3. See the [root README](../README.md) for full setup instructions.

## Quick start

1. Copy `.env.example` to `.env` and set PostgreSQL credentials.
2. Create a database named `jira_development` (PostgreSQL 14+, tested with **18**).
3. Install and run:

```bash
npm install
npm start
```

The API listens on **http://localhost:3000**.

## Environment variables

| Variable | Description |
| --- | --- |
| `DB_HOST` | PostgreSQL host (default `localhost`) |
| `DB_PORT` | PostgreSQL port (default `5432`) |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_DATABASE` | Database name (default `jira_development`) |
| `JWT_SECRET` | Secret for signing JWT auth tokens |
| `NODE_ENV` | `development`, `test`, or `production` |
| `PORT` | Optional API port (default `3000`) |

## Guest seed data

`POST /authentication/guest` runs `src/database/createGuestAccount.ts`, which creates:

- A demo project named **Singularity v1.0**
- Six team members with chess piece avatars: **Queen**, **Rook**, **King**, **Bishop**, **Horse**, and **Pawn**
- Sample issues and comments for the kanban board

Each guest visit creates a **new** project and user set. The logged-in guest is **King**.

## Project structure

| File or folder | Description |
| --- | --- |
| `src/index.ts` | Entry file — middleware, routes, database connection, and Express startup |
| `src/routes.ts` | Public routes (`/authentication/guest`) and private routes (issues, project, comments) |
| `src/constants` | Shared constants used across the codebase |
| `src/controllers` | Route handlers — fetch, create, update, and delete data via TypeORM |
| `src/database` | `createConnection.ts` (TypeORM `DataSource`), guest/test seeds, and DB reset helpers |
| `src/entities` | TypeORM entities — columns, relations, and validations |
| `src/errors` | Custom errors and `catchErrors` wrapper for async/sync controllers |
| `src/middleware` | Auth, error handling, and response helpers |
| `src/serializers` | Transform database records before sending to the client |
| `src/utils` | Shared helpers (auth tokens, validation, TypeORM utilities) |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Port 3000 is already in use` | Stop the other API process, or set `PORT` in `.env` |
| PostgreSQL connection failed | Check `.env` credentials and that Postgres is running |
| `ts-node` not found (Windows) | The start script uses `npx ts-node` — run `npm install` in `/api` |
