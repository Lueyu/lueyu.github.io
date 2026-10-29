export interface ToolResult {
  ok: boolean;
  summary: string;
  data?: unknown;
}

export interface WireToolCall {
  id: string;
  name: string;
  arguments: string;
}

export type WireMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; tool_calls?: WireToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

export class AgentError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const WIRE_KEY = "lueyu-agent:wire-v1";
const LEGACY_KEY = "lueyu-agent:history";
const WIRE_LIMIT = 40;
const PAYLOAD_LIMIT = 24;

const GITHUB_PAGES_ENDPOINT = "https://lueyu-agent-zjbznowktm.cn-beijing.fcapp.run";

export const ENDPOINT: string =
  import.meta.env.VITE_AGENT_ENDPOINT?.trim() ||
  (window.location.hostname === "lueyu.github.io" ? GITHUB_PAGES_ENDPOINT : "");

function errorText(status: number): string {
  if (status === 429) return "哼、今天说太多了，明天再来找本 Agent。";
  if (status === 400) return "说人话，太长了我看不懂。";
  if (status === 0) return "网好像断了，你等会儿再发。";
  return "线路似乎不太对劲，你等会儿再发。";
}

interface LegacyMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  ts: number;
}

function isWireMessage(value: unknown): value is WireMessage {
  if (!value || typeof value !== "object") return false;
  const role = (value as { role?: unknown }).role;
  if (role === "user" || role === "assistant") {
    return typeof (value as { content?: unknown }).content === "string";
  }
  if (role === "tool") {
    return typeof (value as { tool_call_id?: unknown }).tool_call_id === "string";
  }
  return false;
}

export function trimWire(wire: WireMessage[], limit: number = WIRE_LIMIT): WireMessage[] {
  if (wire.length <= limit) return wire;
  const window = wire.slice(-limit);
  const start = window.findIndex((message) => message.role === "user");
  return start === -1 ? window : window.slice(start);
}

export function loadWire(): WireMessage[] {
  try {
    const raw = localStorage.getItem(WIRE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.filter(isWireMessage);
    }
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw) as unknown;
      if (Array.isArray(parsed)) {
        const wire: WireMessage[] = [];
        for (const item of parsed as LegacyMessage[]) {
          if (!item || typeof item !== "object") continue;
          if (item.role !== "user" && item.role !== "agent") continue;
          if (typeof item.text !== "string" || !item.text.trim()) continue;
          if (item.role === "agent" && typeof item.id === "string" && item.id.startsWith("welcome-")) continue;
          wire.push(item.role === "user" ? { role: "user", content: item.text } : { role: "assistant", content: item.text });
        }
        saveWire(wire);
        localStorage.removeItem(LEGACY_KEY);
        return wire;
      }
    }
  } catch {
    return [];
  }
  return [];
}

export function saveWire(wire: WireMessage[]): void {
  try {
    localStorage.setItem(WIRE_KEY, JSON.stringify(trimWire(wire)));
  } catch {
    return;
  }
}

export function clearWire(): void {
  try {
    localStorage.removeItem(WIRE_KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    return;
  }
}

export interface AgentTurnResponse {
  narration: string | null;
  tool_calls: WireToolCall[] | null;
  reply: string | null;
  remaining: number;
}

let agentEndpointMissing = false;

function stripRawToolMarks(text: string): string {
  return text
    .replace(/<｜[^>]*>/g, "")
    .replace(/<\/?[^>]*(?:tool[\s_]*call[\s_]*s?|invoke|parameter|DSML)[^>]*>/gi, "")
    .trim();
}

export async function agentCall(input: {
  messages: WireMessage[];
  allowTools?: boolean;
  surface?: "panel" | "lens";
  lens?: { title: string; text: string };
}): Promise<AgentTurnResponse | null> {
  if (agentEndpointMissing) return null;
  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}/api/agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new AgentError(0, errorText(0));
  }
  if (res.status === 404) {
    agentEndpointMissing = true;
    return null;
  }
  if (!res.ok) throw new AgentError(res.status, errorText(res.status));
  let data: {
    reply?: unknown;
    narration?: unknown;
    tool_calls?: unknown;
    remaining?: unknown;
  };
  try {
    data = (await res.json()) as typeof data;
  } catch {
    throw new AgentError(502, errorText(502));
  }
  const rawReply = typeof data.reply === "string" && data.reply ? data.reply : null;
  const rawNarration = typeof data.narration === "string" && data.narration ? data.narration : null;
  const reply = rawReply ? stripRawToolMarks(rawReply) : null;
  const narration = rawNarration ? stripRawToolMarks(rawNarration) : null;
  const tool_calls = Array.isArray(data.tool_calls)
    ? (data.tool_calls as unknown[]).filter(
        (call): call is WireToolCall =>
          !!call &&
          typeof call === "object" &&
          typeof (call as WireToolCall).id === "string" &&
          typeof (call as WireToolCall).name === "string" &&
          typeof (call as WireToolCall).arguments === "string",
      )
    : [];
  if (!reply && tool_calls.length === 0) throw new AgentError(502, errorText(502));
  return {
    narration,
    tool_calls: tool_calls.length ? tool_calls : null,
    reply,
    remaining: typeof data.remaining === "number" ? data.remaining : 0,
  };
}

export async function legacyChat(wire: WireMessage[]): Promise<string> {
  const turns: { role: "user" | "assistant"; content: string }[] = [];
  for (const message of wire) {
    if (message.role === "tool") continue;
    const content = message.content.trim();
    if (!content) continue;
    turns.push({ role: message.role === "user" ? "user" : "assistant", content });
  }
  const res = await fetch(`${ENDPOINT}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: turns.slice(-20) }),
  });
  if (!res.ok) throw new AgentError(res.status, errorText(res.status));
  const data = (await res.json()) as { reply?: string };
  if (!data.reply) throw new AgentError(502, errorText(502));
  return data.reply;
}

export async function requestLensExplain(title: string, text: string): Promise<string> {
  const viaAgent = await agentCall({ messages: [], surface: "lens", lens: { title, text }, allowTools: false });
  if (viaAgent) {
    if (!viaAgent.reply) throw new AgentError(502, errorText(502));
    return viaAgent.reply;
  }
  return legacyChat([
    {
      role: "user",
      content: `访客用放大镜点中了页面上的区块「${title}」，内容摘录：\n${text}\n\n请解释这个区块讲了什么，3~6 句，专业一点，可以带点俏皮。`,
    },
  ]);
}

export async function callServerTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const res = await fetch(`${ENDPOINT}/api/tool`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, args }),
    });
    if (res.status === 429) return { ok: false, summary: "工具今天用太多次了，明天再翻。" };
    if (!res.ok) return { ok: false, summary: `工具服务出错（${res.status}）` };
    const data = (await res.json()) as ToolResult;
    if (typeof data?.ok !== "boolean" || typeof data?.summary !== "string") {
      return { ok: false, summary: "工具返回了奇怪的东西。" };
    }
    return data;
  } catch {
    return { ok: false, summary: "工具服务连不上。" };
  }
}

export async function leaveMessage(input: { name: string; contact: string; body: string }): Promise<void> {
  const res = await fetch(`${ENDPOINT}/api/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new AgentError(res.status, errorText(res.status));
}
