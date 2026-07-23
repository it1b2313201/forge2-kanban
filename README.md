# Forge 2 Kanban

A small Trello-style Kanban board built for the Forge 2 qualifier.

This repo contains the React frontend plus evidence capture files for the qualifier. The app demonstrates the required Kanban features using a local demo dataset for reviewability without a backend. A Laravel REST API with SQLite is the intended backend integration for the full qualifier build.

## Live URL

Deploy the `frontend/` directory to Vercel or Netlify and update this URL before submission:

`https://your-project.vercel.app`

## Stack

- **Frontend:** React + Vite
- **Backend:** Laravel REST API + SQLite (expected for full qualifier compliance)
- **Agents / Models:** OpenClaw (coding hands) + Hermes (planning brain) on a free model stack: Ollama local, Groq, or Gemini. No paid model keys should be committed.

## What this app does

The Kanban app implements the core qualifier requirements:

- Boards with lists and cards
- Create, edit, and delete cards
- Drag-and-drop card movement between lists
- Coloured label/tags on cards
- Member assignment
- Due dates with overdue cards visually flagged
- Browser persistence via local storage

## Local run instructions

### Frontend only

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:4173`.

### Use a deployed backend API

Create `frontend/.env` and add:

```env
VITE_API_URL=https://your-backend-url.example.com/api
```

Then restart the frontend.

### Laravel API (optional)

For a full backend integration, use PHP 8.2+ and Composer. From a `backend/` directory:

```bash
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

## Qualifier evidence and repo contents

This repository is aligned to the Forge 2 qualifier handbook and should include:

- `README.md` — what the app does, run instructions, and live URL
- `ARCHITECTURE.md` — agent roles, Slack channel scheme, and model routing
- `agent-log.md` — unedited human/agent task exchanges
- `skills/<name>/SKILL.md` — reusable Hermes skill definition
- `openclaw.json` + `hermes.example.json` placeholders (with secrets removed)
- `screenshots/` or `slack-export/` — proof of Slack round-trip and agent loop
- `evidence/walkthrough.mp4` — 60-90 second screen recording or GIF
- The actual app code: frontend and Laravel backend

## Evidence included in this repo

- `screenshots/kanban-overview.png`
- `screenshots/kanban-card-editor.png`
- `screenshots/kanban-add-list.png`

## Agent log and config guidance

- `agent-log.md` is provided as a scaffold. Replace it with your actual human/agent Slack exchange before submission.
- `openclaw.json` contains placeholder Slack socket mode config:
  - `SLACK_APP_TOKEN`
  - `SLACK_BOT_TOKEN`
  - `ollama/qwen2.5-coder`
- `skills/status-report/SKILL.md` is included as a Hermes skill template for status updates. Keep the skill committed and use it for regular progress reports.
- Do not commit real tokens or keys. Use environment variables and placeholder values in committed config.
- Verify Slack round-trip test output and autonomous Hermes run evidence are captured in `screenshots/` or `slack-export/`.

## Qualifier notes

- Use only free models and free hosting.
- Do not commit real Slack tokens, API keys, or secrets.
- Make the GitHub repo public before submitting.
- Judges score only what is committed to the public repo.
- If the backend is not deployed by submission time, the frontend should still be runnable locally with clear instructions and a recorded walkthrough.

## Deploy and submission checklist

- Deploy the frontend from `frontend/` to a free host such as Vercel or Netlify.
- Update the `Live URL` at the top of this README before submitting.
- If using a backend, deploy the Laravel API to Render, Railway, or another free PHP host.
- Ensure `frontend/.env` points to the deployed backend API if applicable.
- Confirm the repo contains:
  - `README.md`
  - `ARCHITECTURE.md`
  - `agent-log.md`
  - `skills/status-report/SKILL.md`
  - `openclaw.json` and Hermes config placeholders
  - `screenshots/` or `slack-export/`
  - `evidence/walkthrough.mp4` or GIF
  - frontend code and any backend code
- Clone the repo fresh into a new folder and verify it runs before submitting.
- Keep the repo public until results are announced.
