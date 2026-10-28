import { consume, remaining, type Env } from "./limiter";
import { SIMULATION_PROMPT } from "./prompts/simulation";
import { PERSONA_PROMPT } from "./prompts/persona";
import { ADMIN_HTML } from "./admin-html";

const SITE_ORIGIN = "https://lueyu.github.io";
const LOCAL_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const MAX_HISTORY = 20;
const MAX_CONTENT_CHARS = 2000;

interface WireMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function json(data: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors },
  });
}

function corsFor(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = SITE_ORIGIN === origin || LOCAL_ORIGIN_RE.test(origin) ? origin : SITE_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-admin-token",
    "Vary": "Origin",
  };
}

function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? "unknown";
}

async function ipHashPrefix(ip: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
}

function numeric(env: Env, key: "CHAT_DAILY_LIMIT" | "MESSAGE_DAILY_LIMIT" | "MAX_TOKENS", fallback: number): number {
  const value = Number(env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

async function parseBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function normalizeHistory(input: unknown): WireMessage[] | null {
  if (!Array.isArray(input)) return null;
  const out: WireMessage[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") return null;
    const role = (raw as WireMessage).role;
    const content = (raw as WireMessage).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const trimmed = content.trim();
    if (!trimmed) return null;
    if (trimmed.length > MAX_CONTENT_CHARS) return null;
    out.push({ role, content: trimmed });
  }
  return out.slice(-MAX_HISTORY);
}

async function callDeepSeek(env: Env, messages: WireMessage[], maxTokens: number): Promise<string> {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature: 0.9,
      max_tokens: maxTokens,
    }),
  });
  if (!res.ok) {
    throw new Error(`deepseek upstream ${res.status}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

async function handleChat(request: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  const ip = clientIp(request);
  const limit = numeric(env, "CHAT_DAILY_LIMIT", 50);
  const key = `chat:${ip}`;
  if (!consume(key, limit)) {
    return json({ error: "daily limit reached" }, 429, cors);
  }
  const body = await parseBody(request);
  if (!body) return json({ error: "invalid body" }, 400, cors);
  const history = normalizeHistory(body.messages);
  if (!history) return json({ error: "invalid messages" }, 400, cors);
  if (!history.some((m) => m.role === "user")) return json({ error: "no user message" }, 400, cors);

  const maxTokens = numeric(env, "MAX_TOKENS", 300);
  const systemPrompt = `${SIMULATION_PROMPT}\n\n${PERSONA_PROMPT}\n\n下面是访客与你的对话，请以 Lueyu 的个人 Agent 身份直接回复最新一条，不要复述规则。`;
  const messages: WireMessage[] = [{ role: "system", content: systemPrompt }, ...history];

  try {
    const reply = await callDeepSeek(env, messages, maxTokens);
    if (!reply) return json({ error: "empty reply" }, 502, cors);
    return json({ reply, remaining: remaining(key, limit) }, 200, cors);
  } catch (error) {
    console.error(String(error));
    return json({ error: "upstream failure" }, 502, cors);
  }
}

async function handleLeaveMessage(request: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  const ip = clientIp(request);
  const limit = numeric(env, "MESSAGE_DAILY_LIMIT", 10);
  if (!consume(`msg:${ip}`, limit)) {
    return json({ error: "daily limit reached" }, 429, cors);
  }
  const body = await parseBody(request);
  if (!body) return json({ error: "invalid body" }, 400, cors);

  const clean = (value: unknown, max: number): string =>
    typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max) : "";

  const text = clean(body.body, 1000);
  const name = clean(body.name, 100);
  const contact = clean(body.contact, 100);
  if (text.length < 5) return json({ error: "message too short" }, 400, cors);

  const ts = Date.now();
  const key = `msg:${ts}:${crypto.randomUUID().replace(/-/g, "").slice(0, 6)}`;
  const record = { ts, name, contact, body: text, ipHash: await ipHashPrefix(ip) };
  await env.MESSAGES.put(key, JSON.stringify(record));
  return json({ ok: true }, 200, cors);
}

function adminToken(request: Request, url: URL): string {
  return request.headers.get("x-admin-token") ?? url.searchParams.get("token") ?? "";
}

function authorized(request: Request, url: URL, env: Env): boolean {
  const token = adminToken(request, url);
  return token.length > 0 && token === env.ADMIN_TOKEN;
}

async function handleListMessages(request: Request, env: Env, cors: Record<string, string>, url: URL): Promise<Response> {
  if (!authorized(request, url, env)) return json({ error: "unauthorized" }, 401, cors);
  const list = await env.MESSAGES.list({ prefix: "msg:" });
  const keys = list.keys.map((k) => k.name).sort().reverse().slice(0, 200);
  const entries = await Promise.all(
    keys.map(async (key) => {
      const raw = await env.MESSAGES.get(key);
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        return { key, ...parsed };
      } catch {
        return null;
      }
    }),
  );
  const messages = entries.filter((e): e is { key: string } & Record<string, unknown> => e !== null);
  return json({ messages }, 200, cors);
}

async function handleDeleteMessage(request: Request, env: Env, cors: Record<string, string>, key: string): Promise<Response> {
  if (!/^msg:\d+:[a-f0-9]{6}$/.test(key)) return json({ error: "invalid key" }, 400, cors);
  const url = new URL(request.url);
  if (!authorized(request, url, env)) return json({ error: "unauthorized" }, 401, cors);
  await env.MESSAGES.delete(key);
  return json({ ok: true }, 200, cors);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsFor(request);
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (method === "GET" && url.pathname === "/admin") {
      return new Response(ADMIN_HTML, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex", ...cors },
      });
    }

    if (method === "POST" && url.pathname === "/api/chat") {
      return handleChat(request, env, cors);
    }

    if (method === "POST" && url.pathname === "/api/message") {
      return handleLeaveMessage(request, env, cors);
    }

    if (method === "GET" && url.pathname === "/api/messages") {
      return handleListMessages(request, env, cors, url);
    }

    if (method === "DELETE" && url.pathname.startsWith("/api/messages/")) {
      const key = decodeURIComponent(url.pathname.slice("/api/messages/".length));
      return handleDeleteMessage(request, env, cors, key);
    }

    return json({ error: "not found" }, 404, cors);
  },
};
