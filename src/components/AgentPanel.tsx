import { useEffect, useRef, useState } from "react";
import {
  AgentError,
  type ChatMessage,
  clearHistory,
  leaveMessage,
  loadHistory,
  saveHistory,
  sendChat,
  splitReply,
  toTurns,
  welcomeMessage,
} from "../lib/agent";

const QUICK_QUESTS = [
  { label: "了解他的工作", question: "Lueyu 是做什么的？" },
  { label: "聊聊 AI Agent", question: "聊聊 AI Agent 吧" },
  { label: "留下联系方式", question: "" },
];

interface FormState {
  name: string;
  contact: string;
  body: string;
}

const EMPTY_FORM: FormState = { name: "", contact: "", body: "" };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeMessage(role: ChatMessage["role"], text: string): ChatMessage {
  return { id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, role, text, ts: Date.now() };
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
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory());
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const savedMessages = useRef(messages);

  useEffect(() => {
    saveHistory(messages);
    savedMessages.current = messages;
  }, [messages]);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages, isTyping, showForm]);

  function pushMessage(message: ChatMessage) {
    setMessages((prev) => [...prev, message]);
  }

  async function ask(question: string): Promise<void> {
    const text = question.trim();
    if (!text || isSending) return;
    setInput("");
    setIsSending(true);
    pushMessage(makeMessage("user", text));
    setIsTyping(true);
    try {
      const turns = toTurns([...savedMessages.current, makeMessage("user", text)]);
      const { reply } = await sendChat(turns);
      const chunks = splitReply(reply);
      for (let i = 0; i < chunks.length; i += 1) {
        if (i > 0) await sleep(400 + Math.random() * 500);
        setIsTyping(false);
        pushMessage(makeMessage("agent", chunks[i]));
        if (i < chunks.length - 1) setIsTyping(true);
      }
      setIsTyping(false);
    } catch (error) {
      setIsTyping(false);
      const message = error instanceof AgentError ? error.message : "线路似乎不太对劲，你等会儿再发。";
      pushMessage(makeMessage("agent", message));
    } finally {
      setIsSending(false);
    }
  }

  function handleQuestClick(quest: (typeof QUICK_QUESTS)[number]): void {
    if (!quest.question) {
      setShowForm(true);
      return;
    }
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
      pushMessage(makeMessage("agent", "哼、勉强帮你转交了。他要是回你，记得感谢本 Agent。"));
    } catch (error) {
      const message = error instanceof AgentError ? error.message : "留言没送出去，等会儿再试。";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClear(): void {
    if (!window.confirm("清空聊天记录？")) return;
    clearHistory();
    setMessages([welcomeMessage()]);
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
                {isSending || isTyping ? "TYPING" : "ONLINE"}
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

        {showForm ? (
          <div className="agent-form">
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
        ) : (
          <>
            <div className="agent-thread" ref={threadRef}>
              {messages.map((message) =>
                message.role === "user" ? (
                  <div className="agent-row user" key={message.id}>
                    <p className="agent-bubble user">{message.text}</p>
                  </div>
                ) : (
                  <div className="agent-row agent" key={message.id}>
                    <BubbleAvatar />
                    <p className="agent-bubble agent">{message.text}</p>
                  </div>
                ),
              )}
              {isTyping ? (
                <div className="agent-row agent">
                  <BubbleAvatar />
                  <p className="agent-bubble agent typing" aria-label="正在输入">
                    <i />
                    <i />
                    <i />
                  </p>
                </div>
              ) : null}
              {messages.length <= 1 && !isTyping ? (
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
          </>
        )}
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
