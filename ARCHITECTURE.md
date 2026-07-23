# Architecture

```text
Human (#sprint-main)
  -> Hermes, the planning brain (Groq / Gemini free model)
  -> task hand-off in #agent-coder
  -> OpenClaw, the coding hands (Ollama local / free model)
  -> code + report back in Slack
  -> human review / next decision

React (Vite) -> Laravel REST API -> SQLite
```

## Agent roles

| Agent | Responsibility | Channel |
| --- | --- | --- |
| Hermes | Plans work, manages project memory, posts status updates, and performs autonomous runs | `#sprint-main`, `#agent-log` |
| OpenClaw | Writes code, runs commands, and reports results from tasks assigned by Hermes | `#agent-coder` |
| Human | Defines goals, approves work, reviews output, and guides the agent loop | `#sprint-main`, `#agent-log` |

## Slack channel scheme

- `#sprint-main`: human goal posting, Hermes planning, approvals, and status updates.
- `#agent-coder`: OpenClaw coding tasks, execution output, and development feedback.
- `#agent-log`: autonomous run proof, memory/skill evidence, and audit trail.

Everything stays in visible channels. Do not rely on private DMs for the qualifier loop.

## Model routing

- **Hermes** uses a stronger planning model for task decomposition and memory-driven coordination. Preferred free models are Groq `openai/gpt-oss-120b` or Google Gemini `gemini-2.5-flash`.
- **OpenClaw** uses a free execution model for code generation and local runs. Preferred free models are Ollama `qwen2.5-coder` locally, with Groq or Gemini as fallback if needed.
- **Free stack only**: no paid API keys, no paid subscriptions, and no external paid models should be committed.

## Evidence and config

- Include `openclaw.json` and Hermes config files in the repo with placeholders for real tokens.
- Do not commit Slack bot tokens, app tokens, or model keys.
- Capture Slack round-trip tests and autonomous run proofs as screenshots or logs in `screenshots/` or `slack-export/`.
- Commit `agent-log.md` with unedited human/agent chat exchanges.
- Commit `skills/<name>/SKILL.md` for reusable Hermes skills.

## API resources

`/api/boards`, `/api/lists`, `/api/cards`, `/api/members`, and `/api/tags` return JSON. Cards own `tag_ids`, `assignee_id`, `due_date`, and `position`; moving a card updates its `list_id` and position.
