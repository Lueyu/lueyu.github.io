import { corsHeaders, json, type FunctionContext } from "../../../shared/api";

interface StoredMessage {
  key: string;
  ts: number;
  name: string;
  contact: string;
  body: string;
  ipHash: string;
}

export function onRequestOptions(context: FunctionContext): Response {
  return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

export async function onRequestGet(context: FunctionContext): Promise<Response> {
  const cors = corsHeaders(context.request);
  const token = context.request.headers.get("x-admin-token") ?? new URL(context.request.url).searchParams.get("token") ?? "";
  if (!token || token !== (context.env.ADMIN_TOKEN ?? "")) {
    return json({ error: "unauthorized" }, 401, cors);
  }

  const keys: string[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < 5; page += 1) {
    const result = await MESSAGES_KV.list({ prefix: "msg_", limit: 256, cursor: cursor ?? undefined });
    keys.push(...result.keys.map((k) => k.key));
    cursor = result.cursor;
    if (result.complete || !cursor || keys.length >= 200) break;
  }
  keys.sort().reverse();

  const messages: StoredMessage[] = [];
  for (const key of keys.slice(0, 200)) {
    const raw = await MESSAGES_KV.get(key, { type: "text" });
    if (typeof raw !== "string") continue;
    try {
      const parsed = JSON.parse(raw) as Omit<StoredMessage, "key">;
      messages.push({ key, ...parsed });
    } catch {
      continue;
    }
  }
  return json({ messages }, 200, cors);
}
