# Lueyu's homepage

Pixel-style personal homepage. The two typefaces are bundled locally so the
page does not depend on Google Fonts at runtime. The Noto Sans SC subset
covers all copy in `src/`; chat bubbles use a system font stack on purpose so
runtime AI replies render consistently.

## Local development

```bash
npm install
npm run dev
```

Run `npm run build` to type-check and generate the static site in `dist/`.

## The personal Agent (v2 — tool-using agent)

The floating Agent panel is a real tool-using agent, not just a chatbot: it
observes the live page, drives the UI (scroll / navigate / highlight), and
reads Lueyu's project repos — with every tool call shown in a terminal-style
trace. A separate lens button lets visitors click any page section for an
in-context AI explanation ("点哪儿讲哪儿").

Architecture in one line: **the browser is the agent's environment, the
server is the policy layer.** The tool loop runs client-side; the persona
prompts, tool-schema whitelist, wire validation, rate limits, and model
access stay server-side.

- Frontend:
  - `src/lib/agentRuntime.ts` — multi-round tool loop (observe → decide →
    act → observe). Max 3 tool rounds, then one forced no-tools round, so
    the loop always terminates.
  - `src/lib/agentTools.ts` — browser tool executors: `read_page`,
    `get_profile`, `open_section`, `open_project`, `highlight`,
    `show_message_form`, `set_theme`; repo tools are forwarded to the
    server. Registers the router (from `SiteRoutes`) and the message-form
    launcher (from `AgentPanel`).
  - `src/lib/agent.ts` — wire protocol (user / assistant+tool_calls /
    tool), localStorage history (auto-migrates the v1 chat format), the
    `/api/agent` client, and automatic fallback to v1 `/api/chat`.
  - `src/components/AgentPanel.tsx` — chat + trace UI, typewriter replay,
    message form as an in-thread card. Mounted in `SiteRoutes`' RouteFrame,
    so the panel (and conversation) survive route changes.
  - `src/components/PageLens.tsx` — lens mode (crosshair + hover outline),
    explanation popover with its own persona.
  - `src/lib/siteProfile.ts` — site data shared by the page and the agent
    (single source of truth; `App.tsx` imports it).
- Backend (`fc/index.js`), all under `/api/*`:
  - `POST /api/agent` — one step of the loop per request. Injects the
    persona system prompt, sends the tool schemas, validates the wire
    history (tool-name whitelist, tool_call_id pairing, ≤30 messages,
    ≤12 tool results), and maps the model reply to
    `{ narration, tool_calls, reply }`. `surface: "lens"` switches to the
    explainer persona with a single no-tools round.
  - `POST /api/tool` — executes the two read-only repo tools:
    `list_repo_files` / `read_repo_file`.
  - `POST /api/chat`, `POST /api/message` — v1 chat and the visitor
    message form (unchanged; message delivery stays server-side).
- Repo sources for the repo tools:
  - `aidr` — served from the local snapshot `fc/snapshot/aidr/` (built from
    the local AIDR working tree: services/deploy/shared source, architecture
    docs, and Lueyu's own notes in `lueyu-work/`, `lueyu-research/`,
    `lueyu-deliverables/`; `lueyu-notes.md` is the agent's navigation guide).
    Gitignored third-party code; `scripts/pack-fc.ps1` packs it into
    `fc-code.zip` locally.
  - `daily-portfolio` — live GitHub API. Add more via
    `GITHUB_REPOS="slug=owner/name,..."`; set `GITHUB_TOKEN` to raise the
    API rate limit. Files are capped at 64 KB / 3500 chars and binary files
    are refused; the file tree is cached 10 minutes per instance.
    `list_repo_files` lists docs fully and summarizes deep source dirs —
    pass a `filter` substring (e.g. `restic`) to find specific files.
- Abuse protection: 150 agent/chat requests per IP per day (≈50+ turns),
  60 repo-tool reads per IP per day, 10 messages per IP per day, 500 max
  tokens per round, wire history capped at 30 messages.
- Degradation: if `/api/agent` returns 404 (the `worker/` and
  `edge-functions/` backends still speak v1), the frontend automatically
  falls back to plain `/api/chat` — the site degrades to a chatbot, never
  breaks.
- A service worker (`public/sw.js`) caches assets and pages for fast repeat
  visits.

On `lueyu.github.io`, the frontend defaults to the FC trigger URL even if a
local `.env` file is absent. `VITE_AGENT_ENDPOINT` can override it for another
deployment; `.env` is gitignored.

## Deployment

Site (GitHub Pages user site):

```bash
npm run deploy
```

Backend function (Aliyun FC console):

```powershell
powershell -ExecutionPolicy Bypass -File scripts\pack-fc.ps1
```

Then in the FC console upload the generated `fc-code.zip` to the `lueyu-agent`
function. The zip includes `fc/snapshot/` (AIDR project material) when present.
Required environment variables: `DEEPSEEK_API_KEY`, `ADMIN_TOKEN`,
`OSS_BUCKET`, `OSS_REGION`, `OSS_ACCESS_KEY_ID`, `OSS_ACCESS_KEY_SECRET`.
Optional: `GITHUB_TOKEN`, `GITHUB_REPOS`, `CHAT_DAILY_LIMIT`,
`TOOL_DAILY_LIMIT`. The HTTP trigger must use anonymous auth (无需认证).

## Alternative backends (not deployed)

- `worker/` — Cloudflare Workers + KV version, fully tested locally.
- `edge-functions/` + `shared/` — Tencent EdgeOne Pages version, typechecked.

Both speak the same `/api/*` contract, so switching is a deploy away.
