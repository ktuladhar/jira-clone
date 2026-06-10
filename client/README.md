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
| `src/shared` | Reusable components, hooks, utils, and styles |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `ERR_OSSL_EVP_UNSUPPORTED` | Run `npm install` — scripts use `cross-env` for OpenSSL legacy mode |
| `npm install` peer dependency errors | Do not run `npm update` or `npm audit fix --force` — use versions in `package-lock.json` |
| Blank board / API errors | Ensure the API is running on port 3000 |
| Stale users or project name | Clear `authToken` from localStorage and reload |
