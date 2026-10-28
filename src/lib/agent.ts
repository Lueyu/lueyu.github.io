export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  ts: number;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export class AgentError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const STORAGE_KEY = "lueyu-agent:history";
const HISTORY_LIMIT = 60;

const GITHUB_PAGES_ENDPOINT = "https://lueyu-agent-zjbznowktm.cn-beijing.fcapp.run";

export const ENDPOINT: string =
  import.meta.env.VITE_AGENT_ENDPOINT?.trim() ||
  (window.location.hostname === "lueyu.github.io" ? GITHUB_PAGES_ENDPOINT : "");

export function welcomeMessage(): ChatMessage {
  return {
    id: `welcome-${Date.now()}`,
    role: "agent",
    text: "你好，我是 Lueyu 的个人 Agent。\n想了解他的工作、联系方式都可以问我，点下面的快捷问题开始。哼，别客气。",
    ts: Date.now(),
  };
}

export function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [welcomeMessage()];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [welcomeMessage()];
    return parsed;
  } catch {
    return [welcomeMessage()];
  }
}

export function saveHistory(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-HISTORY_LIMIT)));
  } catch {
    return;
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}

export function toTurns(messages: ChatMessage[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  for (const message of messages) {
    if (message.role === "agent" && message.id.startsWith("welcome-")) continue;
    const role: ChatTurn["role"] = message.role === "user" ? "user" : "assistant";
    const last = turns[turns.length - 1];
    if (last && last.role === role) {
      last.content = `${last.content}\n${message.text}`;
    } else {
      turns.push({ role, content: message.text });
    }
  }
  return turns.slice(-20);
}

export async function sendChat(turns: ChatTurn[]): Promise<{ reply: string; remaining: number }> {
  const res = await fetch(`${ENDPOINT}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: turns }),
  });
  if (!res.ok) throw new AgentError(res.status, errorText(res.status));
  const data = (await res.json()) as { reply?: string; remaining?: number };
  if (!data.reply) throw new AgentError(502, errorText(502));
  return { reply: data.reply, remaining: data.remaining ?? 0 };
}

export async function leaveMessage(input: { name: string; contact: string; body: string }): Promise<void> {
  const res = await fetch(`${ENDPOINT}/api/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new AgentError(res.status, errorText(res.status));
}

function errorText(status: number): string {
  if (status === 429) return "哼、今天说太多了，明天再来找本 Agent。";
  if (status === 400) return "说人话，太长了我看不懂。";
  if (status === 0) return "网好像断了，你等会儿再发。";
  return "线路似乎不太对劲，你等会儿再发。";
}

export function splitReply(text: string): string[] {
  const normalized = text.trim();
  if (!normalized) return [];
  const pieces = normalized
    .split(/(?:\r?\n)+/)
    .flatMap((line) => line.split(/(?<=[。！？!?…~])/))
    .map((piece) => piece.trim())
    .filter(Boolean);
  if (pieces.length <= 4) return pieces;
  const head = pieces.slice(0, 3);
  const tail = pieces.slice(3).join("");
  return [...head, tail];
}
