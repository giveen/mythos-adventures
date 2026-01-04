# Copilot instructions — MythOS / DnDAI

Purpose: short, actionable guidance so an AI coding agent can be productive in this repo.

- Big picture
  - Full-stack JavaScript app: React frontend in `client/` and Node/Express backend in `server/`.
  - Persistent state: SQLite DB in `server/db/` using `better-sqlite3` (synchronous API).
  - LLM integration: `server/services/llmService.js` posts to an external LLM (`process.env.LLM_URL`, `process.env.LLM_MODEL`) and composes a dynamic system prompt from `server/prompts/system-prompt.md` via `server/services/promptService.js`.
  - Runtime: backend is CommonJS (Node >=18), frontend is standard React (ESM).

- Key request/response flows to know
  - Story generation: client -> `POST /api/story` (see `server/routes/storyRoutes.js`) -> `server/controllers/storyController.js` -> `server/services/llmService.js` -> external LLM.
  - Roll handling: the system prompt instructs the model to request dice rolls by returning a JSON object like `{"roll":"STR"}`; backend listens for these and resolves actual dice via `server/routes/rollRoutes.js` and `server/services/diceService.js` before continuing the story.
  - Character data / active character: `server/models/activeCharacter.js` is injected into the system prompt; changing character structure requires updating `llmService.buildSystemPrompt()` formatting.

- Environment & run commands (discovered from package.json)
  - Frontend (from repo root): `npm start` (runs `cd client && npm start`).
  - Backend dev: `cd server && npm run dev` (uses `nodemon`); production: `cd server && npm run start`.
  - Init DB (server): `cd server && npm run initdb` (runs `server/db/init.js`).
  - Alternative root db init (root package.json): `npm run db:init` — note this invokes `client/src/services/dbService.js` per root script.
  - Node requirement: `node >=18` (see `server/package.json` `engines`).

- Project-specific conventions and patterns
  - Models use synchronous `better-sqlite3` calls and return values synchronously. Controllers are often `async` but do not `await` model calls — preserve the synchronous model patterns unless you intentionally convert end-to-end to async.
  - System prompt controls game behavior and roll mechanics. Do not reformat or remove the JSON-roll contract in `server/prompts/system-prompt.md` without updating `llmService.buildSystemPrompt()` and `rollRoutes` logic.
  - Environment variables can be provided either as `LLM_URL` / `LLM_MODEL` or as `REACT_APP_LLM_URL` / `REACT_APP_LLM_MODEL` for the client (see `client/src/services/llmClient.js`).
  - Keep backend code in CommonJS (module.exports / require) to match existing files in `server/`.

- Important files to inspect when changing behavior
  - `server/index.js` — main Express wiring and registered routes.
  - `server/services/llmService.js` — builds the system prompt and posts to the LLM.
  - `server/services/promptService.js` and `server/prompts/system-prompt.md` — source of system-level instructions to the model.
  - `server/routes/storyRoutes.js`, `server/controllers/storyController.js` — entrypoint for story flow.
  - `server/routes/rollRoutes.js`, `server/services/diceService.js` — roll handling; ensure JSON-roll contract compatibility.
  - `server/models/*` (especially `activeCharacter.js`, `characterModel.js`) — DB access patterns and schema assumptions.
  - `server/db/init.js` and `server/db/characters.js` — DB initialization and schema.
  - `client/src/services/llmClient.js` and `client/src/hooks/useLLM.js` — how the frontend invokes story generation and expects responses.

- Debugging and common tasks
  - LLM troubleshooting: add console logs in `server/services/llmService.js` (it already logs system prompt length) and inspect network requests to `process.env.LLM_URL`.
  - To reproduce a story request locally: `POST /api/story` with JSON `{ "prompt": "your prompt" }` to `http://localhost:4000/api/story`.
  - If changing DB schema, update `server/db/init.js` and run `cd server && npm run initdb`.

- Minimal examples the agent should follow
  - If the model must request a roll, it must output exactly a JSON object (no surrounding text): `{"roll": "STR"}`. Backend expects that pattern.
  - When you add fields to character objects, update `server/services/llmService.js` where the character block is rendered into the system prompt.

If anything above is unclear or you'd like me to expand a section (e.g., sample requests, example DB rows, or a developer quickstart), tell me which area to expand and I'll iterate.
