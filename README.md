<h1 align="center">A simplified Jira clone built with React and Node</h1>

<div align="center">Auto formatted with Prettier, tested with Cypress 🎗</div>

<h3 align="center">
  <a href="https://jira.ivorreic.com/">Visit the live app</a> |
  <a href="https://github.com/ktuladhar/jira-clone/tree/master/client">View client</a> |
  <a href="https://github.com/ktuladhar/jira-clone/tree/master/api">View API</a>
</h3>

![Tech logos](https://i.ibb.co/DVFj8PL/tech-icons.jpg)

![App screenshot](https://i.ibb.co/W3qVvCn/jira-optimized.jpg)

## What is this and who is it for 🤷‍♀️

This is a fork of [oldboyxx/jira_clone](https://github.com/oldboyxx/jira_clone) — a showcase Jira-style app and a strong example of a modern, real-world React codebase.

There are many showcase/example React projects out there but most of them are way too simple. This codebase contains enough complexity to offer valuable insights to React developers of all skill levels while still being _relatively_ easy to understand.

## Features

- Proven, scalable, and easy to understand project structure
- Written in modern React, only functional components with hooks
- A variety of custom light-weight UI components such as datepicker, modal, various form elements etc
- Simple local React state management, without redux, mobx, or similar
- Custom webpack setup, without create-react-app or similar
- Client written in Babel powered JavaScript
- API written in TypeScript and using TypeORM

## Setting up development environment 🛠

### Prerequisites

- **Node.js 16–20** recommended (see [Node.js notes](#nodejs-notes) for Node 18+)
- **PostgreSQL 11** — TypeORM 0.2 in this project is not compatible with PostgreSQL 12+

### Database

Install [PostgreSQL](https://www.postgresql.org/) and create a database named `jira_development`, or run Postgres 11 with Docker:

```bash
docker run -d --name jira-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=jira_development \
  -p 5433:5432 \
  postgres:11
```

If you use Docker on port `5433`, set `DB_PORT=5433` in your `/api/.env` file.

### Install and run

- `git clone https://github.com/ktuladhar/jira-clone.git`
- Create an empty `.env` file in `/api`, copy `/api/.env.example` contents into it, and fill in your database username and password.
- `npm run install-dependencies`
- `cd api && npm start`
- `cd client && npm start` in another terminal tab
- App should now be running on `http://localhost:8080/`

### Node.js notes

**Client (Node 18+):** Webpack 4 requires the OpenSSL legacy provider:

```bash
# macOS / Linux
NODE_OPTIONS=--openssl-legacy-provider npm start

# Windows PowerShell
$env:NODE_OPTIONS="--openssl-legacy-provider"; npm start
```

**API (Windows):** If `ts-node` is not found, add `api/node_modules/.bin` to your `PATH` before running `npm start`.

## Running cypress end-to-end tests 🚥

- Set up development environment
- Create a database named `jira_test` and start the api with `cd api && npm run start:test`
- `cd client && npm run test:cypress`

## What's missing?

There are features missing from this showcase product which should exist in a real product:

### Migrations 🗄

We're currently using TypeORM's `synchronize` feature which auto creates the database schema on every application launch. It's fine to do this in a showcase product or during early development while the product is not used by anyone, but before going live with a real product, we should [introduce migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md).

### Proper authentication system 🔐

We currently auto create an auth token and seed a project with issues and users for anyone who visits the API without valid credentials. In a real product we'd want to implement a proper [email and password authentication system](https://www.google.com/search?q=email+and+password+authentication+node+js&oq=email+and+password+authentication+node+js).

### Accessibility ♿

Not all components have properly defined [aria attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA), visual focus indicators etc. Most early stage companies tend to ignore this aspect of their product but in many cases they shouldn't, especially once their userbase starts growing.

### Unit/Integration tests 🧪

Both Client and API are currently tested through [end-to-end Cypress tests](https://github.com/ktuladhar/jira-clone/tree/master/client/cypress/integration). That's good enough for a relatively simple application such as this, even if it was a real product. However, as the app grows in complexity, it might be wise to start writing additional unit/integration tests.

## Contributing

Feel free to open issues or submit pull requests on this fork.

## License

[MIT](https://opensource.org/licenses/MIT)

<hr>

<h3>
  <a href="https://jira.ivorreic.com/">Visit the live app</a> |
  <a href="https://github.com/ktuladhar/jira-clone/tree/master/client">View client</a> |
  <a href="https://github.com/ktuladhar/jira-clone/tree/master/api">View API</a>
</h3>
