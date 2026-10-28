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

## The personal Agent

The floating Agent panel is a live chatbot with a tsundere persona, powered by
DeepSeek through an Aliyun Function Compute backend. Visitors can ask about
Lueyu's work, get his contact details, and leave a message via the built-in
form.

- Frontend: `src/components/AgentPanel.tsx` (UI), `src/lib/agent.ts` (API
  client, localStorage history, bubble splitting).
- Backend: `fc/index.js` — a zero-dependency Node entry that runs both as an
  FC event handler (`index.handler`) and standalone (`node fc/index.js`).
  Hosted at `https://lueyu-agent-zjbznowktm.cn-beijing.fcapp.run`.
  Visitor messages are stored in Aliyun OSS (one small JSON object per entry).
- Persona: the two-layer prompt (simulation layer + persona layer) lives in
  `fc/index.js`, following the qq-bridge role-card pattern. Edit the prompts
  there, then repack and re-upload (see below).
- Admin console: `https://lueyu.github.io/admin.html` (token login). Lists,
  copies, and deletes visitor messages.
- Abuse protection: 50 chat turns / IP / day, 10 messages / IP / day, 300
  max tokens per turn, history capped at 20 messages.
- A service worker (`public/sw.js`) caches assets and pages for fast repeat
  visits.

`.env` holds `VITE_AGENT_ENDPOINT` (the FC trigger URL) so the github.io build
can call the API cross-origin. It is gitignored.

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
function. Required environment variables: `DEEPSEEK_API_KEY`, `ADMIN_TOKEN`,
`OSS_BUCKET`, `OSS_REGION`, `OSS_ACCESS_KEY_ID`, `OSS_ACCESS_KEY_SECRET`.
The HTTP trigger must use anonymous auth (无需认证).

## Alternative backends (not deployed)

- `worker/` — Cloudflare Workers + KV version, fully tested locally.
- `edge-functions/` + `shared/` — Tencent EdgeOne Pages version, typechecked.

Both speak the same `/api/*` contract, so switching is a deploy away.
