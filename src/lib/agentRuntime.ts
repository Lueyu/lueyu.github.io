import { agentCall, AgentError, legacyChat, trimWire, type WireMessage } from "./agent";
import { executeTool } from "./agentTools";

export type AgentPhase = "thinking" | "acting" | "done";

const MAX_TOOL_ROUNDS = 3;
const PAYLOAD_LIMIT = 24;

export interface TurnHooks {
  onWire: (messages: WireMessage[]) => void;
  onPhase?: (phase: AgentPhase) => void;
}

export interface TurnResult {
  wire: WireMessage[];
  reply: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runRound(wire: WireMessage[], allowTools: boolean) {
  return agentCall({ messages: trimWire(wire, PAYLOAD_LIMIT), allowTools });
}

export async function runAgentTurn(base: WireMessage[], userText: string, hooks: TurnHooks): Promise<TurnResult> {
  const wire: WireMessage[] = [...base];
  const push = (messages: WireMessage[]) => {
    wire.push(...messages);
    hooks.onWire(messages);
  };

  push([{ role: "user", content: userText }]);

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round += 1) {
    const isFinalRound = round === MAX_TOOL_ROUNDS;
    hooks.onPhase?.("thinking");
    const response = await runRound(wire, !isFinalRound);

    if (response === null) {
      const reply = await legacyChat(trimWire(wire, PAYLOAD_LIMIT));
      push([{ role: "assistant", content: reply }]);
      hooks.onPhase?.("done");
      return { wire, reply };
    }

    if (response.tool_calls && response.tool_calls.length > 0) {
      push([{ role: "assistant", content: response.narration ?? "", tool_calls: response.tool_calls }]);
      hooks.onPhase?.("acting");
      for (const call of response.tool_calls) {
        const result = await executeTool(call.name, call.arguments);
        push([{ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) }]);
        await sleep(220);
      }
      continue;
    }

    const reply = response.reply ?? "";
    if (!reply) throw new AgentError(502, "线路似乎不太对劲，你等会儿再发。");
    push([{ role: "assistant", content: reply }]);
    hooks.onPhase?.("done");
    return { wire, reply };
  }

  throw new AgentError(500, "本 Agent 绕晕了，你再说一遍。");
}
