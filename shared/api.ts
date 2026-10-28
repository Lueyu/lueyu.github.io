export interface EdgeRequest extends Request {
  eo?: {
    clientIp?: string;
    [key: string]: unknown;
  };
}

export interface FunctionContext {
  request: EdgeRequest;
  params: Record<string, string>;
  env: Record<string, string | undefined>;
  waitUntil?: (task: Promise<unknown>) => void;
}

export interface WireMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const ALLOWED_ORIGIN_RE = /^https?:\/\/(lueyu\.github\.io|localhost:\d+|127\.0\.0\.1:\d+)$/;
const MAX_HISTORY = 20;
const MAX_CONTENT_CHARS = 2000;

export function corsHeaders(request: EdgeRequest): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-admin-token",
    Vary: "Origin",
  };
  if (origin) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = "";
    }
    const host = request.headers.get("Host") ?? "";
    if (ALLOWED_ORIGIN_RE.test(origin) || (originHost !== "" && originHost === host)) {
      headers["Access-Control-Allow-Origin"] = origin;
    }
  }
  return headers;
}

export function json(data: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors },
  });
}

export function clientIp(request: EdgeRequest): string {
  return request.eo?.clientIp ?? "unknown";
}

export function envNum(env: Record<string, string | undefined>, key: string, fallback: number): number {
  const value = Number(env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

interface Bucket {
  day: string;
  used: number;
}

const buckets = new Map<string, Bucket>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function consume(key: string, limit: number): boolean {
  const day = today();
  if (buckets.size > 10000) {
    for (const [k, b] of buckets) {
      if (b.day !== day) buckets.delete(k);
    }
  }
  let bucket = buckets.get(key);
  if (!bucket || bucket.day !== day) {
    bucket = { day, used: 0 };
    buckets.set(key, bucket);
  }
  if (bucket.used >= limit) return false;
  bucket.used += 1;
  return true;
}

export function remaining(key: string, limit: number): number {
  const bucket = buckets.get(key);
  if (!bucket || bucket.day !== today()) return limit;
  return Math.max(0, limit - bucket.used);
}

export async function ipHashPrefix(ip: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
}

export async function parseBody(request: EdgeRequest): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function normalizeHistory(input: unknown): WireMessage[] | null {
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

export function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max) : "";
}

export async function callDeepSeek(
  apiKey: string,
  messages: WireMessage[],
  maxTokens: number,
): Promise<string> {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
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
