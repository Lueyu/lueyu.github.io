import {
  cleanText,
  clientIp,
  consume,
  corsHeaders,
  envNum,
  ipHashPrefix,
  json,
  parseBody,
  type FunctionContext,
} from "../../shared/api";

export function onRequestOptions(context: FunctionContext): Response {
  return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

export async function onRequestPost(context: FunctionContext): Promise<Response> {
  const cors = corsHeaders(context.request);
  const ip = clientIp(context.request);
  const limit = envNum(context.env, "MESSAGE_DAILY_LIMIT", 10);
  if (!consume(`msg:${ip}`, limit)) {
    return json({ error: "daily limit reached" }, 429, cors);
  }
  const body = await parseBody(context.request);
  if (!body) return json({ error: "invalid body" }, 400, cors);

  const text = cleanText(body.body, 1000);
  const name = cleanText(body.name, 100);
  const contact = cleanText(body.contact, 100);
  if (text.length < 5) return json({ error: "message too short" }, 400, cors);

  const ts = Date.now();
  const key = `msg_${ts}_${crypto.randomUUID().replace(/-/g, "").slice(0, 6)}`;
  const record = { ts, name, contact, body: text, ipHash: await ipHashPrefix(ip) };
  await MESSAGES_KV.put(key, JSON.stringify(record));
  return json({ ok: true }, 200, cors);
}
