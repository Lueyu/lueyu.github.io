# Agent Upgrade Design (v2): Tools, Repo Access, Page Lens

Date: 2026-10-29 · Status: **implemented & verified locally** (see Verification)
Plan doc: `docs/superpowers/plans/2026-10-29-agent-upgrade-plan.md`

## Goal

Turn the homepage chatbot into a real agent and let the page prove it:
observe → decide → act → observe, visible in a terminal-style trace; repo
tools ground project claims in real code/docs; the lens explains any page
section on click. Three demo moments for visitors (especially interviewers):

1. "带我看看你最拿得出手的项目" — the agent looks at the page, reads repo
   material, scrolls/navigates/highlights, then talks about it.
2. The trace UI shows every tool call and result — auditable reasoning.
3. Tool failures are admitted in-character instead of hallucinated.

## Architecture

```
┌─ Browser (environment + orchestration) ─────────────────────────────┐
│  AgentPanel (chat + trace)               PageLens (lens + popover)  │
│        │                                        │                   │
│        ▼                                        ▼                   │
│  agentRuntime: ≤3 tool rounds + 1 forced no-tools round              │
│        │                                                            │
│        ├─ browser tools: read_page / get_profile / open_section /    │
│        │   open_project / highlight / show_message_form / set_theme  │
│        ▼                                        ▼                   │
└── POST /api/agent (panel | lens) ──────── POST /api/tool (repos) ───┘
                 │                                   │
┌─ Aliyun FC (policy layer) ───────────────────────────────────────────┐
│  /api/agent: persona system prompt (server-only) · tool schema       │
│              whitelist · wire validation · rate limit · DeepSeek     │
│  /api/tool:  list_repo_files / read_repo_file                        │
│              · aidr → local snapshot (fc/snapshot/aidr, gitignored)  │
│              · daily-portfolio → GitHub API (GITHUB_REPOS config)    │
│  /api/message: visitor message delivery (only real side effect)      │
└──────────────────────────────────────────────────────────────────────┘
```

Rationale: page observation/actions must run where the page lives (the
browser); everything untrusted-or-secret stays server-side (persona,
whitelist, token, delivery). The loop is stateless — conversation state
(including tool exchanges) travels in the message array, validated and
passed through on every request. This keeps FC/Workers/EdgeOne portable.

## Tool inventory (9)

| Tool | Runs | Effect |
|---|---|---|
| `read_page()` | browser | live route, most-visible section, theme, title, time |
| `get_profile(field)` | browser | structured profile from `siteProfile.ts` (shared with the page) |
| `list_repo_files(repo, filter?)` | server | file listing. Default: docs/configs listed fully, services source summarized per service; `filter` (path substring) returns exact matches |
| `read_repo_file(repo, path)` | server | file content ≤3500 chars, binary/oversize/traversal refused |
| `open_section(section)` | browser | smooth-scroll (navigates home first if needed, with retry) |
| `open_project(slug)` | browser | router.navigate to `/projects/:slug`; panel survives |
| `highlight(target)` | browser | pixel spotlight outline for ~2.4 s + scroll into view |
| `show_message_form(draft?)` | browser | opens the in-thread message card, optional draft |
| `set_theme(mode)` | browser | day/night via custom event (home only, verified after 250 ms) |

## Wire protocol

```jsonc
// POST /api/agent  { messages: WireMessage[], allowTools?: boolean }
//   | { surface: "lens", lens: { title, text } }
{ "role": "user",      "content": "..." }
{ "role": "assistant", "content": "…narration…", "tool_calls": [
    { "id": "call_x", "name": "open_section", "arguments": "{\"section\":\"work\"}" } ] }
{ "role": "tool", "tool_call_id": "call_x", "content": "{ ok, summary, data }" }

// response (panel):  { narration, tool_calls, reply, remaining }
//   reply XOR tool_calls; narration may accompany tool_calls
// response (lens):   { reply, remaining }
```

Client loop (`agentRuntime.ts`): append user → POST → if tool_calls: emit
narration bubble + trace rows, execute tools (browser locally, repo tools
via `POST /api/tool`), append tool results, POST again (≤3 tool rounds) →
final round sent with `allowTools:false` so the model must answer in text.

## Safety & validation (server, per request)

- Tool names checked against a fixed whitelist (both in echoed
  `assistant.tool_calls` and in the model response before it reaches the
  client).
- Structural walk: every tool_call id must be answered by exactly one tool
  message (`tool_call_id` pairing); no unanswered calls before a new user
  message; last message must be user or tool; ≥1 user message.
- Caps: ≤30 messages (trimmed at a user boundary), ≤4 tool_calls per
  assistant message, ≤12 tool results, content ≤2000 chars (tool results
  ≤4000, repo file content ≤3500 + truncation marker).
- Repo tools: read-only; snapshot paths resolved and jailed under the
  snapshot root; GitHub slugs validated against `REPO_RE` and the
  `GITHUB_REPOS` registry; binary (NUL-byte) and >64 KB files refused.
- Rate limits: 150 chat/agent requests per IP per day, 60 tool reads per
  IP per day, 10 messages per IP per day; 500 max tokens per round.
- Persona/simulation prompts, tool schemas, and API keys never leave the
  server. The browser-side message array is treated as untrusted input.
- Delivery (`/api/message`) unchanged: server-side validation, rate limit,
  notification channels. The agent can only open the form UI, never send.

## Lens

- Entry: fixed pixel-style button above the agent trigger; toggles
  `body.lens-active` (crosshair cursor, dashed hover outlines); Esc exits.
- Click resolves `closest("section, article, header, footer")`, skips
  interactive elements and text selections, gathers `{title, text≤1500}`.
- `POST /api/agent { surface: "lens" }` → single no-tools round with the
  explainer persona (professional + playful, 3–6 sentences).
- Popover: fixed-position pixel card anchored to the section (flips above
  when space is tight), loading dots, typewriter reveal,
  `prefers-reduced-motion` respected.

## Persona v2 highlights (fc/index.js)

- Simulation layer rewritten from "you have no tools" to "you may only use
  the whitelisted tools; never fabricate tool results".
- Tool etiquette: one short in-character narration line before tool calls;
  ≤3 calls per round; no tools for small talk.
- Interviewer mode: ground praise in `get_profile`/repo material (real
  motives, trade-offs, verification — no invented metrics); weakness
  answers follow admit → trade-off → next-step; audience-tiered delivery.
- Repo material is presented as "我翻了他的代码/README" without exposing
  the delivery channel (local snapshot vs GitHub).

## Trade-offs (deliberate)

- **No SSE streaming.** The deployed FC response API is single-shot. Chose
  per-round request/response + client-side typewriter replay; the runtime's
  callback interface is a stream consumer, so swapping in SSE later is
  localized. Works identically across all three backends.
- **Client-held loop state.** Enables stateless servers and the automatic
  v1 fallback (404 on `/api/agent` → plain `/api/chat` chatbot mode).
- **AIDR via local snapshot** (third-party repo): gitignored, packed into
  `fc-code.zip` locally by `scripts/pack-fc.ps1`; seed README included at
  `fc/snapshot/aidr/README.md` — replace with the real repo zip contents.

## Verification (2026-10-29, local)

`npm run build` (tsc + vite) passes. End-to-end scenario suite against
standalone `node fc/index.js` with mock DeepSeek + mock GitHub:
**26/26 passed** — the 24 scenarios below plus snapshot listing-shape (summary
mode, payload ≤ echo cap) and `filter="restic"` exact-match lookup; service
ping; CORS preflight; legacy chat; agent round 1
(narration + 2 tool_calls); snapshot list/read (seed README); path-traversal
blocked; GitHub read; unknown repo; browser tool name rejected by `/api/tool`;
missing path soft-fail; tool 429; agent round 2 (tool results → final reply);
lens round; `allowTools:false`; forged tool name → 400; orphan tool_call_id →
400; unanswered call before new user → 400; last-message-assistant → 400;
empty lens input → 400; 36-message trim; system prompt injection verified at
the mock upstream; chat 429.

Manual QA still to do on the real deployment: full browser loop (scroll /
highlight / navigate-and-continue), lens on home + project pages, form
draft prefill, day/night, mobile, reduced-motion, localStorage migration,
legacy fallback against a v1 backend.

## Deployment checklist

1. ~~Build the AIDR snapshot~~ **done (2026-10-29)** — curated from the local
   working tree `D:\aidr` into `fc/snapshot/aidr/` (361 files, ~1.7 MB):
   full `services/` (6 microservices incl. tests), `deploy/`, `shared/`,
   root architecture docs, plus `lueyu-work/`, `lueyu-research/`,
   `lueyu-deliverables/` (Lueyu's own notes/reports — the interview gold)
   and `lueyu-notes.md` as the agent's navigation guide. `.env` and other
   secrets excluded (`env.example` is the placeholder template, verified).
2. ~~Pack~~ **done** — `scripts\pack-fc.ps1` → `fc-code.zip` (693 KB, entries
   verified). **Remaining manual step: upload it to the `lueyu-agent`
   function in the Aliyun FC console.** Optional env: `GITHUB_TOKEN`,
   `GITHUB_REPOS` (default `daily-portfolio=lueyu/daily-portfolio`).
3. ~~Site~~ **done** — `npm run deploy` published; CDN verified serving the
   new bundle. Until step 2's upload lands, the live site automatically
   runs in legacy chat mode (`/api/agent` → 404 → v1 `/api/chat`).
