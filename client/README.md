# Jira Clone Client

React 16 SPA with a custom Webpack 4 setup. See the [root README](../README.md) for full setup instructions.

## Quick start

```bash
npm install
npm start
```

The dev server runs at **http://localhost:8080**. The API must be running on **http://localhost:3000**.

## Authentication flow

1. On first visit, the app redirects to `/authenticate`.
2. The client calls `POST /authentication/guest` and stores the JWT in `localStorage` as `authToken`.
3. The user is redirected to `/project/board` with seeded demo data.

Protected routes require a token. If the token is missing or invalid, the client clears it and returns to `/authenticate`.

### Refresh demo data

Guest seed data (chess users, **Singularity v1.0** project) is created per guest session. To load a fresh session:

```javascript
localStorage.removeItem('authToken');
location.reload();
```

Or open the app in a private/incognito window.

## Board features

### Calendar dashboard filter

Click **Calendar** in the board filter bar to open a month-view dashboard (`Project/Board/Filters/CalendarFilter`):

- Browse issues by due date on a month grid with issue counts per day
- Filter by search term, assignee, type, status, and priority
- Navigate months with arrows or month/year selectors
- Jump to **Today**, select a day to filter the board, or toggle **Unscheduled work**

Selecting a day or updating a due date in issue details keeps the calendar view in sync.

### Due dates

- Set or clear due dates from issue details (`Project/Board/IssueDetails/DueDate`)
- Board cards show a compact due date with overdue styling for past-due, non-done issues
- The shared `DatePicker` component supports date-only and date/time modes, manual entry, clear, and a portaled calendar overlay that avoids layout shift inside modals

## Node.js 18+

Webpack 4 needs the OpenSSL legacy provider on newer Node versions. The `npm start` and `npm run build` scripts set `NODE_OPTIONS=--openssl-legacy-provider` via `cross-env` automatically.

If you see `ERR_OSSL_EVP_UNSUPPORTED`, run `npm install` in `/client` first.

## Project structure

I've used this architecture on multiple larger projects in the past and it performed really well.

There are two special root folders in `src`: `App` and `shared` (described below). All other root folders in `src` (in our case only two: `Auth` and `Project`) should follow the structure of the routes. We can call these folders modules.

The main rule to follow: **Files from one module can only import from ancestor folders within the same module or from `src/shared`.** This makes the codebase easier to understand, and if you're fiddling with code in one module, you will never introduce a bug in another module.

| File or folder | Description |
| --- | --- |
| `src/index.jsx` | Entry file — Babel polyfills and React render |
| `src/index.html` | Single HTML shell; Webpack injects scripts and styles |
| `src/App` | Global routes, layout, styles, and fonts |
| `src/Auth` | Guest authentication (`/authenticate`) |
| `src/Project` | Board, issue details, settings, search, and create modals |
| `src/Project/Board/Filters/CalendarFilter` | Board calendar dashboard filter and month grid |
| `src/Project/Board/IssueDetails/DueDate` | Due date field in the issue details sidebar |
| `src/shared/components/DatePicker` | Reusable date/time picker with portaled calendar popup |
| `src/shared` | Reusable components, hooks, utils, and styles |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `ERR_OSSL_EVP_UNSUPPORTED` | Run `npm install` — scripts use `cross-env` for OpenSSL legacy mode |
| `npm install` peer dependency errors | Do not run `npm update` or `npm audit fix --force` — use versions in `package-lock.json` |
| Blank board / API errors | Ensure the API is running on port 3000 |
| Blank screen after opening Calendar filter | Ensure you are on the latest code — a missing component import previously crashed the calendar panel |
| Calendar or DatePicker clipped inside modals | The DatePicker renders its dropdown via a portal with fixed positioning; reload if you still see inline layout shift |
| Stale users or project name | Clear `authToken` from localStorage and reload |
