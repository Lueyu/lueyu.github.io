import { corsHeaders, json, type FunctionContext } from "../../../shared/api";

export function onRequestOptions(context: FunctionContext): Response {
  return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

export async function onRequestDelete(context: FunctionContext): Promise<Response> {
  const cors = corsHeaders(context.request);
  const key = String(context.params.id ?? "");
  if (!/^msg_\d+_[a-f0-9]{6}$/.test(key)) return json({ error: "invalid key" }, 400, cors);
  const token = context.request.headers.get("x-admin-token") ?? new URL(context.request.url).searchParams.get("token") ?? "";
  if (!token || token !== (context.env.ADMIN_TOKEN ?? "")) {
    return json({ error: "unauthorized" }, 401, cors);
  }
  await MESSAGES_KV.delete(key);
  return json({ ok: true }, 200, cors);
}
