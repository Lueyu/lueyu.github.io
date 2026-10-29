import { useEffect, useRef, useState } from "react";
import {
  AgentError,
  clearWire,
  leaveMessage,
  loadWire,
  saveWire,
  trimWire,
  type ToolResult,
  type WireMessage,
} from "../lib/agent";
import { runAgentTurn, type AgentPhase } from "../lib/agentRuntime";
import { formatToolCall, registerFormLauncher, toolKind } from "../lib/agentTools";

const QUICK_QUESTS = [
  { label: "他是做什么的", question: "Lueyu 是做什么的？给我个快速介绍。" },
  { label: "带我逛逛项目", question: "带我看看他最拿得出手的项目。" },
  { label: "面试官视角", question: "如果我是来招聘他的面试官，说说他项目里最亮眼的部分，最好翻翻他的代码和文档来证明。" },
  { label: "帮我留言", question: "我想给 Lueyu 留言，帮我打开表单。" },
];

const WELCOME_TEXT =
  "你好，我是 Lueyu 的个人 Agent，常驻这个页面右下角。\n我能看懂这个页面，也能操作它——想了解他、想逛项目、想让我翻翻他的代码都行。页面上还有个放大镜，点哪儿我讲哪儿。\n哼，试试就试试。";

interface FormState {
  name: string;
  contact: string;
  body: string;
}

const EMPTY_FORM: FormState = { name: "", contact: "", body: "" };

type PanelItem =
  | { key: string; kind: "user"; text: string; wireIndex: number }
  | { key: string; kind: "agent"; text: string; wireIndex: number }
  | { key: string; kind: "thought"; text: string; wireIndex: number }
  | { key: string; kind: "trace"; label: string; read: boolean; state: "run" | "ok" | "fail"; summary?: string };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function deriveItems(wire: WireMessage[], isRunning: boolean): PanelItem[] {
  const results = new Map<string, ToolResult>();
  for (const message of wire) {
    if (message.role === "tool") {
      try {
        results.set(message.tool_call_id, JSON.parse(message.content) as ToolResult);
      } catch {
        results.set(message.tool_call_id, { ok: false, summary: "结果解析失败" });
      }
    }
  }
  const items: PanelItem[] = [];
  wire.forEach((message, index) => {
    if (message.role === "user") {
      items.push({ key: `u${index}`, kind: "user", text: message.content, wireIndex: index });
      return;
    }
    if (message.role === "assistant") {
      if (message.content.trim()) {
        items.push({
          key: `a${index}`,
          kind: message.tool_calls?.length ? "thought" : "agent",
          text: message.content,
          wireIndex: index,
        });
      }
      for (const call of message.tool_calls ?? []) {
        const result = results.get(call.id);
        const state = result ? (result.ok ? "ok" : "fail") : isRunning ? "run" : "fail";
        items.push({
          key: `t${index}-${call.id}`,
          kind: "trace",
          label: formatToolCall(call.name, call.arguments),
          read: toolKind(call.name) === "read",
          state,
          summary: result?.summary,
        });
      }
    }
  });
  return items;
}

function BubbleAvatar() {
  return (
    <div className="agent-bubble-avatar" aria-hidden="true">
      <i />
      <b />
    </div>
  );
}

export default function AgentPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [wire, setWire] = useState<WireMessage[]>(() => loadWire());
  const [notes, setNotes] = useState<{ id: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [phase, setPhase] = useState<AgentPhase | null>(null);
  const [typing, setTyping] = useState<{ index: number; shown: number } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const wireRef = useRef(wire);

  useEffect(() => {
    saveWire(wire);
    wireRef.current = wire;
  }, [wire]);

  useEffect(() => {
    registerFormLauncher((draft) => {
      setShowForm(true);
      if (draft) setForm((prev) => ({ ...prev, body: draft }));
    });
    return () => registerFormLauncher(null);
  }, []);

  const items = deriveItems(wire, isSending);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [items.length, notes.length, showForm, isSending, typing?.shown]);

  function pushNote(text: string) {
    setNotes((prev) => [...prev, { id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text }]);
  }

  async function typeOut(text: string, wireIndex: number) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const total = text.length;
    if (total === 0) return;
    const delay = Math.max(6, Math.min(26, Math.round(4200 / total)));
    setTyping({ index: wireIndex, shown: 0 });
    for (let shown = 0; shown < total; ) {
      await sleep(delay);
      shown = Math.min(total, shown + 1 + Math.floor(Math.random() * 2));
      setTyping({ index: wireIndex, shown });
    }
    setTyping(null);
  }

  async function ask(question: string): Promise<void> {
    const text = question.trim();
    if (!text || isSending) return;
    setInput("");
    setIsSending(true);
    setPhase("thinking");
    wireRef.current = trimWire(wireRef.current);
    try {
      const result = await runAgentTurn(wireRef.current, text, {
        onWire: (messages) => {
          wireRef.current = [...wireRef.current, ...messages];
          setWire(wireRef.current);
        },
        onPhase: (next) => setPhase(next),
      });
      setPhase("done");
      await typeOut(result.reply, wireRef.current.length - 1);
    } catch (error) {
      const message = error instanceof AgentError ? error.message : "线路似乎不太对劲，你等会儿再发。";
      pushNote(message);
    } finally {
      setTyping(null);
      setPhase(null);
      setIsSending(false);
    }
  }

  function handleQuestClick(quest: (typeof QUICK_QUESTS)[number]): void {
    void ask(quest.question);
  }

  async function submitForm(): Promise<void> {
    const body = form.body.trim();
    if (body.length < 5) {
      setFormError("留言内容至少 5 个字。");
      return;
    }
    setIsSubmitting(true);
    setFormError("");
    try {
      await leaveMessage({ name: form.name.trim(), contact: form.contact.trim(), body });
      setForm(EMPTY_FORM);
      setShowForm(false);
      pushNote("哼、勉强帮你转交了。他要是回你，记得感谢本 Agent。");
    } catch (error) {
      const message = error instanceof AgentError ? error.message : "留言没送出去，等会儿再试。";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClear(): void {
    if (!window.confirm("清空聊天记录？")) return;
    clearWire();
    wireRef.current = [];
    setWire([]);
    setNotes([]);
    setShowForm(false);
  }

  const statusText = phase === "thinking" ? "THINKING" : phase === "acting" ? "ACTING" : typing ? "TYPING" : isSending ? "WORKING" : "ONLINE";
  const showTypingDots = isSending && !typing;

  function renderBubbleText(item: Extract<PanelItem, { kind: "agent" | "thought" }>) {
    if (item.kind === "agent" && typing && typing.index === item.wireIndex) {
      return item.text.slice(0, typing.shown);
    }
    return item.text;
  }

  return (
    <aside className={`floating-agent ${isOpen ? "is-open" : ""}`}>
      <div className="agent-panel" aria-hidden={!isOpen} inert={!isOpen}>
        <div className="agent-panel-head">
          <div className="agent-identity">
            <div className="agent-mini-avatar" aria-hidden="true">
              <i />
              <b />
            </div>
            <div>
              <strong>LUEYU AGENT</strong>
              <span>
                <i />
                {statusText}
              </span>
            </div>
          </div>
          <div className="agent-tools">
            <button type="button" className="agent-tool-btn" onClick={() => setShowForm((v) => !v)}>
              留言
            </button>
            <button type="button" className="agent-tool-btn" onClick={handleClear}>
              清空
            </button>
            <button
              type="button"
              className="agent-close"
              onClick={() => setIsOpen(false)}
              aria-label="关闭 Agent 窗口"
            >
              ×
            </button>
          </div>
        </div>

        <div className="agent-thread" ref={threadRef}>
          {items.length === 0 ? (
            <div className="agent-row agent">
              <BubbleAvatar />
              <p className="agent-bubble agent">{WELCOME_TEXT}</p>
            </div>
          ) : null}

          {items.map((item) => {
            if (item.kind === "user") {
              return (
                <div className="agent-row user" key={item.key}>
                  <p className="agent-bubble user">{item.text}</p>
                </div>
              );
            }
            if (item.kind === "trace") {
              return (
                <div className={`agent-trace ${item.read ? "read" : "act"} ${item.state}`} key={item.key}>
                  <span className="trace-mark" aria-hidden="true" />
                  <code>{item.label}</code>
                  <span className="trace-summary">
                    {item.state === "run" ? "…" : item.state === "ok" ? `✓ ${item.summary ?? ""}` : `✗ ${item.summary ?? ""}`}
                  </span>
                </div>
              );
            }
            return (
              <div className="agent-row agent" key={item.key}>
                <BubbleAvatar />
                <p className={`agent-bubble agent ${item.kind === "thought" ? "thought" : ""}`}>{renderBubbleText(item)}</p>
              </div>
            );
          })}

          {notes.map((note) => (
            <div className="agent-row agent" key={note.id}>
              <BubbleAvatar />
              <p className="agent-bubble agent">{note.text}</p>
            </div>
          ))}

          {showTypingDots ? (
            <div className="agent-row agent">
              <BubbleAvatar />
              <p className="agent-bubble agent typing" aria-label="正在输入">
                <i />
                <i />
                <i />
              </p>
            </div>
          ) : null}

          {showForm ? (
            <div className="agent-form agent-form-card">
              <p className="agent-prompt-label">给 LUEYU 留言</p>
              <label className="agent-form-field">
                <span>称呼</span>
                <input
                  type="text"
                  value={form.name}
                  maxLength={100}
                  placeholder="怎么称呼你（可不填）"
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label className="agent-form-field">
                <span>联系方式</span>
                <input
                  type="text"
                  value={form.contact}
                  maxLength={100}
                  placeholder="邮箱 / 微信 / 手机（可不填）"
                  onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                />
              </label>
              <label className="agent-form-field">
                <span>留言内容</span>
                <textarea
                  rows={4}
                  value={form.body}
                  maxLength={1000}
                  placeholder="想对他说什么、想聊什么合作……"
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                />
              </label>
              {formError ? <p className="agent-error">{formError}</p> : null}
              <div className="agent-form-actions">
                <button type="button" className="agent-form-cancel" onClick={() => setShowForm(false)} disabled={isSubmitting}>
                  取消
                </button>
                <button type="button" className="agent-form-submit" onClick={() => void submitForm()} disabled={isSubmitting}>
                  {isSubmitting ? "转交中…" : "交给 AGENT"}
                </button>
              </div>
            </div>
          ) : null}

          {items.length === 0 && !isSending ? (
            <div className="agent-quest-block">
              <p className="agent-prompt-label">快捷问题</p>
              <div className="agent-quests">
                {QUICK_QUESTS.map((quest) => (
                  <button
                    type="button"
                    className="agent-chip"
                    key={quest.label}
                    onClick={() => handleQuestClick(quest)}
                    disabled={isSending}
                  >
                    {quest.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="agent-compose">
          <input
            type="text"
            value={input}
            placeholder="和 Agent 说说…"
            maxLength={2000}
            disabled={isSending}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void ask(input);
              }
            }}
          />
          <button
            type="button"
            className="agent-send"
            onClick={() => void ask(input)}
            disabled={isSending || !input.trim()}
            aria-label="发送消息"
          >
            →
          </button>
        </div>
      </div>

      <div className="agent-hint" aria-hidden={isOpen}>
        <span>MEET MY AGENT</span>
        <i />
      </div>

      <button
        className="agent-trigger"
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-controls="agent-panel"
        aria-label={isOpen ? "收起个人 Agent" : "打开个人 Agent"}
      >
        <span className="agent-antenna" aria-hidden="true" />
        <span className="agent-face" aria-hidden="true">
          <i />
          <i />
          <b />
        </span>
        <span className="agent-body" aria-hidden="true">
          AI
        </span>
        <span className="agent-status" aria-hidden="true" />
      </button>
    </aside>
  );
}
