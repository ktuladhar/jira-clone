<h1 align="center">A simplified Jira clone built with React and Node</h1>

<div align="center">Auto formatted with Prettier, tested with Cypress 🎗</div>

![App screenshot](https://i.ibb.co/W3qVvCn/jira-optimized.jpg)

## About

This is a fork of [oldboyxx/jira_clone](https://github.com/oldboyxx/jira_clone) — a full-featured Jira-style project management app built as a showcase of modern React and Node.js patterns.

Unlike many tutorial projects, this codebase has real-world complexity: drag-and-drop kanban boards, rich issue modals, custom UI components, and a typed REST API — while remaining readable enough to learn from.

**Repository:** [github.com/ktuladhar/jira-clone](https://github.com/ktuladhar/jira-clone)

## App features

### Kanban board
- Four-column board: **Backlog**, **Selected for development**, **In progress**, and **Done**
- Drag-and-drop issues between columns and within a column ([react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd))
- Filter issues by assignee, type, and search text

### Issue management
- Create, view, edit, and delete issues
- Issue types: **Task**, **Bug**, **Story**
- Priority levels from Lowest to Highest
- Rich-text description editor ([Quill](https://quilljs.com/))
- Assignees and reporter
- Due dates with a custom date/time picker
- Time tracking (original estimate, time spent, remaining)

### Comments
- Add, edit, and delete comments on issues
- Rich-text comment editor

### Project tools
- Issue search modal
- Project settings (name, URL, description, category, avatar)
- Guest authentication — visiting the app auto-creates a session with seeded sample data

### Demo data
- Seeded project: **Singularity v1.0**
- Six chess-themed team members: **Queen**, **Rook**, **King**, **Bishop**, **Horse**, and **Pawn** (with matching piece avatars)
- Logged-in guest user: **King**

## Tech stack

| Layer | Technologies |
| --- | --- |
| **Client** | React 16, React Router 5, Styled Components, Formik, Axios, Webpack 4, Babel |
| **API** | Node.js, Express, TypeScript, TypeORM 0.3, PostgreSQL 18, JWT |
| **Testing** | Cypress (E2E), Jest (client unit tests available) |
| **Tooling** | ESLint, Prettier, Husky, lint-staged |

## Project structure

```
jira_clone/
├── api/                    # Node/TypeScript REST API
│   ├── src/
│   │   ├── controllers/    # Route handlers (issues, projects, comments, auth)
│   │   ├── entities/       # TypeORM models (User, Project, Issue, Comment)
│   │   ├── middleware/     # Auth, error handling, response helpers
│   │   ├── database/       # Connection setup and seed scripts
│   │   └── routes.ts       # Public and private route definitions
│   └── .env.example
├── client/                 # React SPA
│   ├── src/
│   │   ├── App/            # Root layout, routing, global styles
│   │   ├── Auth/           # Guest authentication flow
│   │   ├── Project/        # Board, issue details, settings, search
│   │   └── shared/         # Reusable components, hooks, and utilities
│   └── cypress/            # End-to-end tests
└── package.json            # Root scripts (install, build, pre-commit)
```

## Architecture

### Client
- **No Redux/MobX** — state is managed locally with React hooks and a custom `useApi` hook for data fetching
- **Custom Webpack setup** — no Create React App; full control over the build pipeline
- **Shared component library** — Modal, Select, DatePicker, TextEditor, Form, Button, Tooltip, and more built in-house
- **Query-param modals** — issue search and create modals are driven by URL query parameters

### API
- **Express REST API** with JWT bearer-token authentication
- **TypeORM 0.3** with PostgreSQL 18; schema is auto-synchronized on startup (no migrations yet)
- **Guest accounts** — `POST /authentication/guest` creates a user, project, sample issues, and six chess-themed team members (see [Demo data](#demo-data))
- **Entity relationships** — Projects have many Issues; Issues have many Comments and many-to-many Users (assignees)

### Client auth
- Unauthenticated visits redirect to `/authenticate` before loading the board
- JWT is stored in `localStorage` as `authToken`
- Clear the token to start a fresh guest session with new seed data

### API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/authentication/guest` | Create guest session and receive JWT |
| `GET` | `/currentUser` | Get authenticated user |
| `GET` | `/project` | Get project with users and issues |
| `PUT` | `/project` | Update project settings |
| `GET` | `/issues` | List all project issues |
| `GET` | `/issues/:issueId` | Get issue with users and comments |
| `POST` | `/issues` | Create issue |
| `PUT` | `/issues/:issueId` | Update issue |
| `DELETE` | `/issues/:issueId` | Delete issue |
| `POST` | `/comments` | Create comment |
| `PUT` | `/comments/:commentId` | Update comment |
| `DELETE` | `/comments/:commentId` | Delete comment |

## Fork changes

This fork includes compatibility updates for modern development environments:

- **TypeORM upgraded to 0.3** with **PostgreSQL 18** support (previously required PostgreSQL 11)
- **`pg` upgraded to v8** — fixes silent connection failures on Node.js 18+
- **Chess-themed guest seed data** — six demo users with piece avatars and **Singularity v1.0** project
- **Client auth routing** — authenticate before hitting protected API routes
- **Node.js 18+ client startup** — OpenSSL legacy provider set via `cross-env` in npm scripts
- **API startup messages** — clearer errors for port conflicts and database connection failures
- **README and repo links** updated to point to [ktuladhar/jira-clone](https://github.com/ktuladhar/jira-clone)

## Setting up development environment 🛠

### Prerequisites

- **Node.js 16–20** recommended (see [Node.js notes](#nodejs-notes) for Node 18+)
- **PostgreSQL 14+** — tested with **PostgreSQL 18**

### Database

Install [PostgreSQL](https://www.postgresql.org/) and create a database named `jira_development`, or run Postgres 18 with Docker:

```bash
docker run -d --name jira-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=jira_development \
  -p 5432:5432 \
  postgres:18
```

If you use a non-default port, set `DB_PORT` in your `/api/.env` file accordingly.

### Install and run

```bash
git clone https://github.com/ktuladhar/jira-clone.git
cd jira-clone
```

1. Create an empty `.env` file in `/api`, copy `/api/.env.example` contents into it, and fill in your database credentials.
2. Install dependencies:

```bash
npm run install-dependencies
```

3. Start the API (port **3000**):

```bash
cd api && npm start
```

4. Start the client in a second terminal (port **8080**):

```bash
cd client && npm start
```

5. Open **http://localhost:8080/** — the app will authenticate as a guest and load the **Singularity v1.0** demo project.

See also: [api/README.md](api/README.md) and [client/README.md](client/README.md).

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database user | — |
| `DB_PASSWORD` | Database password | — |
| `DB_DATABASE` | Database name | `jira_development` |
| `JWT_SECRET` | Secret for signing auth tokens | — |
| `NODE_ENV` | Environment (`development`, `test`, `production`) | `development` |

### Node.js notes

**Client (Node 18+):** Webpack 4 requires the OpenSSL legacy provider. The `npm start` and `npm run build` scripts set this automatically via `cross-env`. If you still see `ERR_OSSL_EVP_UNSUPPORTED`, run `npm install` in `/client` first.

**API (Windows):** The start script uses `npx ts-node` so no manual PATH setup is required.

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `Port 3000 is already in use` | Find and stop the process on port 3000 (Windows: `netstat -ano`, then `taskkill /F /PID <pid> /T`) |
| `ERR_OSSL_EVP_UNSUPPORTED` (client) | Run `npm install` in `/client` — do not run `npm audit fix --force` |
| `npm install` fails in `/client` | Use the pinned versions in `package-lock.json`; avoid `npm update` |
| Stale demo users or project name | DevTools → Console: `localStorage.removeItem('authToken'); location.reload()` |
| Board loads but no data | Ensure the API is running on port **3000** |

### Production build

```bash
npm run build          # Compile API (TypeScript) and client (Webpack)
npm run start:production
```

## Running Cypress end-to-end tests 🚥

1. Set up the development environment
2. Create a database named `jira_test`
3. Start the API in test mode: `cd api && npm run start:test`
4. Open Cypress: `cd client && npm run test:cypress`

Test suites cover authentication, issue create/details, drag-and-drop, filters, search, and project settings.

## What's missing?

Features that would exist in a production app but are intentionally out of scope for this showcase:

### Migrations 🗄

TypeORM's `synchronize` auto-creates the database schema on every launch. Before going live, [introduce migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md).

### Proper authentication 🔐

The app uses guest tokens with seeded data. A real product would need email/password auth, registration, and password reset.

### Accessibility ♿

Not all components have full [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) or visible focus indicators.

### Unit/integration tests 🧪

Coverage is primarily through [Cypress E2E tests](https://github.com/ktuladhar/jira-clone/tree/master/client/cypress/integration). Unit and integration tests would be valuable as the app grows.

## Contributing

Issues and pull requests are welcome on this fork.

## License

[MIT](https://opensource.org/licenses/MIT)

## Credits

Originally created by [Ivor Reic](https://github.com/oldboyxx/jira_clone). Maintained as a fork by [ktuladhar](https://github.com/ktuladhar).
