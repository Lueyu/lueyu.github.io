import {
  callDeepSeek,
  clientIp,
  consume,
  corsHeaders,
  envNum,
  json,
  normalizeHistory,
  parseBody,
  remaining,
  type FunctionContext,
  type WireMessage,
} from "../../shared/api";
import { PERSONA_PROMPT, SIMULATION_PROMPT } from "../../shared/prompts";

export function onRequestOptions(context: FunctionContext): Response {
  return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

export async function onRequestPost(context: FunctionContext): Promise<Response> {
  const cors = corsHeaders(context.request);
  const ip = clientIp(context.request);
  const limit = envNum(context.env, "CHAT_DAILY_LIMIT", 50);
  const key = `chat:${ip}`;
  if (!consume(key, limit)) {
    return json({ error: "daily limit reached" }, 429, cors);
  }
  const body = await parseBody(context.request);
  if (!body) return json({ error: "invalid body" }, 400, cors);
  const history = normalizeHistory(body.messages);
  if (!history) return json({ error: "invalid messages" }, 400, cors);
  if (!history.some((m) => m.role === "user")) return json({ error: "no user message" }, 400, cors);

  const apiKey = context.env.DEEPSEEK_API_KEY ?? "";
  if (!apiKey) return json({ error: "not configured" }, 502, cors);

  const maxTokens = envNum(context.env, "MAX_TOKENS", 300);
  const systemPrompt = `${SIMULATION_PROMPT}\n\n${PERSONA_PROMPT}\n\n下面是访客与你的对话，请以 Lueyu 的个人 Agent 身份直接回复最新一条，不要复述规则。`;
  const messages: WireMessage[] = [{ role: "system", content: systemPrompt }, ...history];

  try {
    const reply = await callDeepSeek(apiKey, messages, maxTokens);
    if (!reply) return json({ error: "empty reply" }, 502, cors);
    return json({ reply, remaining: remaining(key, limit) }, 200, cors);
  } catch (error) {
    console.error(String(error));
    return json({ error: "upstream failure" }, 502, cors);
  }
}
