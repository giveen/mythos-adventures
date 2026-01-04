# MythOS Adventures

A full-stack storytelling / tabletop assistant that generates interactive narratives and game sessions using a React frontend and a Node.js backend with LLM integration and a lightweight local model manager.

## Description

MythOS Adventures is an interactive story and campaign engine built for running procedurally-generated tabletop content. The project provides a React-based client UI and an Express-based server that coordinates story generation via configurable LLM backends, resolves dice-roll contracts, and persists session/character data in a local SQLite database.

## Features

- Interactive story generation driven by an LLM (configurable via environment variables).
- Roll-handling contract: the LLM may request dice via a JSON object (for example `{"roll":"STR"}`) that the server resolves.
- Local model manager panel (Ollama) for pulling/activating local models and checking status.
- Character management and persistence (SQLite via `better-sqlite3`).
- Modular routes and services to extend LLM behavior and add game mechanics.

## Technical Overview

- Frontend: React (client/) — standard Create React App structure with hooks, components, and services.
- Backend: Node.js + Express (server/) — REST routes under `/api/*` and service modules in `server/services/`.
- Database: SQLite (server/db/) using `better-sqlite3` for a synchronous, simple persistence layer.
- LLM integration: `server/services/llmService.js` composes a dynamic system prompt and posts to an LLM endpoint defined by environment variables.
- Roll handling: server recognizes and resolves the LLM's JSON roll contract and then resumes story generation.

## Prerequisites

- Node.js 18 or newer
- npm (included with Node.js)
- (Optional) Ollama or other local model runtime if you will use the Ollama panel and local models

## Repository Layout

- `client/` — React frontend
- `server/` — Express backend, database initialization, routes, and services
- `server/db/` — DB initialization and schema files
- `server/prompts/` — system prompt templates used to control LLM behavior
- `scripts/` — utility scripts (e.g., headless checks)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/giveen/mythos-adventures.git
cd mythos-adventures
```

2. Install root dependencies (if any), then install client and server dependencies:

```bash
# optional: install root deps if package.json at root requires it
npm install

cd client
npm install

cd ../server
npm install
```

3. Initialize the server database (creates SQLite file and seed data):

```bash
cd server
npm run initdb
```

Note: There is also a root script `npm run db:init` that runs the server DB initializer if present in root package.json.

## Configuration / Environment Variables

Create `.env` files in `server/` and, if desired, in `client/` for environment-specific settings.

Common environment variables used by the project:

- `LLM_URL` — URL for the external LLM endpoint (server-side). Example: `https://api.example.com/v1/generate`
- `LLM_MODEL` — LLM model name to request (server-side).
- `REACT_APP_LLM_URL` — (optional) client-side LLM URL for debugging or client integrations.
- `REACT_APP_LLM_MODEL` — (optional) client-side model name.
- `REACT_APP_API_URL` — (optional) base URL the client uses to call the backend (defaults to `http://localhost:4000`).
- `PORT` — backend listening port (defaults to `4000` if unset in `server/index.js`).
- `REACT_APP_TTS_URL` — (optional) local TTS server URL (this project may disable TTS by default).

Example `server/.env`:

```ini
LLM_URL=https://api.example.com/v1/generate
LLM_MODEL=gpt-4.1
PORT=4000
```

Example `client/.env`:

```ini
REACT_APP_API_URL=http://localhost:4000
REACT_APP_LLM_URL=
REACT_APP_LLM_MODEL=
```

## Development

Start the backend dev server (nodemon recommended):

```bash
cd server
npm run dev
```

Start the React frontend (development server):

```bash
cd client
npm start
```

- The frontend runs on `http://localhost:3000` by default.
- The backend API runs on `http://localhost:4000` by default.

Open `http://localhost:3000/settings` to view the Settings page, which includes the Ollama panel (lazy-loaded).

## Build & Deploy

Build the frontend for production:

```bash
cd client
npm run build
```

Serve the built frontend from a static host or integrate it with the backend. To serve the static build with the Express server, add a static middleware in `server/index.js` or copy the `build/` output into a directory the server serves.

Start the backend in production mode (example):

```bash
cd server
npm run start
```

## Troubleshooting

- Build errors about parsing or duplicate declarations: ensure files contain only a single `import React ...` and no duplicated component definitions. Running `npm run build` in `client/` surfaces these issues.
- Port conflicts: if port `3000` or `4000` are in use, set `REACT_APP_API_URL` or `PORT` to alternate ports.
- Database issues: run `cd server && npm run initdb` to recreate the local SQLite DB and schema.
- LLM errors: check `server/services/llmService.js` logs and verify `LLM_URL` and `LLM_MODEL` environment variables are correct.
- Ollama panel shows `Installed: false` or empty models: ensure the Ollama service is running locally or configure the backend `server/services/ollamaService.js` to point at your model runtime.
- Dependency vulnerabilities: after `git push`, GitHub may report Dependabot alerts; run `npm audit` and update vulnerable packages as appropriate.

If you encounter runtime issues, check the server logs (stdout) and browser console for stack traces.

## Contribution

Contributions are welcome. Suggested workflow:

1. Fork the repository and create a feature branch.
2. Run tests and linters (if present) and ensure the project builds.
3. Open a PR with a clear description of the change and any migration steps.

Coding style:

- Keep backend code CommonJS (existing server files use `require`/`module.exports`).
- Frontend is ESM/React — follow the patterns in `client/src/` for hooks and services.

## License

No project license file is included in the repository by default. If you want to apply a permissive license, add a `LICENSE` file (for example the MIT license):

```text
MIT License
Copyright (c) YEAR Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

Replace `YEAR` and `Your Name` as appropriate.

If you prefer a different license, add your chosen `LICENSE` file to the repo.

---

If you would like, I can:

- Add a sample `.env.example` file.
- Create a `LICENSE` file (MIT) and commit it.
- Add CI checks for builds/tests.

Tell me which of those you'd like next.
# DnDAI / MythOS

A full-stack JavaScript project with:

- React frontend in `client/`
- Node/Express backend in `server/`
- SQLite database in `server/db/`
- Shared utilities in `src/`

This project powers the MythOS interactive storytelling engine.
