import { useEffect, useRef, useState } from "react";
import { AgentError, requestLensExplain } from "../lib/agent";

interface LensPopoverState {
  x: number;
  below: boolean;
  edge: number;
  title: string;
}

interface PopoverBox {
  left: number;
  top: number;
  width?: number;
  height?: number;
}

function guessTitle(el: HTMLElement): string {
  const heading = el.querySelector("h1, h2, h3, h4, .project-section-label, .eyebrow, strong");
  const text = heading?.textContent?.replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 24);
  return el.tagName.toLowerCase();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const MIN_WIDTH = 280;
const MIN_HEIGHT = 180;

export default function PageLens() {
  const [isActive, setIsActive] = useState(false);
  const [popover, setPopover] = useState<LensPopoverState | null>(null);
  const [box, setBox] = useState<PopoverBox | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shown, setShown] = useState(0);
  const requestIdRef = useRef(0);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ pointerId: number; dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  useEffect(() => {
    if (!isActive) return;
    document.body.classList.add("lens-active");
    return () => document.body.classList.remove("lens-active");
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsActive(false);
        setPopover(null);
        setBox(null);
        setExpanded(false);
      }
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || typeof target.closest !== "function") return;
      if (target.closest(".floating-agent, .lens-popover, .lens-button, .lens-mode-hint")) return;
      if (target.closest("a, button, input, textarea, select, label, details, summary")) return;
      const selection = window.getSelection?.()?.toString();
      if (selection && selection.trim()) return;
      const section = target.closest("section, article, header, footer");
      if (!section) return;
      const el = section as HTMLElement;
      const title = guessTitle(el);
      const text = (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 1500);
      if (!text) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerWidth;
      const width = Math.min(340, viewport - 32);
      const x = Math.min(Math.max(rect.left + rect.width / 2, width / 2 + 16), viewport - width / 2 - 16);
      const below = rect.bottom + 300 <= window.innerHeight || rect.top < 320;
      const edge = below ? rect.bottom + 12 : window.innerHeight - rect.top + 12;
      const id = requestIdRef.current + 1;
      requestIdRef.current = id;
      setPopover({ x, below, edge, title });
      setBox(null);
      setExpanded(false);
      dragRef.current = null;
      resizeRef.current = null;
      setAnswer("");
      setShown(0);
      setIsLoading(true);
      void (async () => {
        try {
          const reply = await requestLensExplain(title, text);
          if (requestIdRef.current !== id) return;
          setAnswer(reply);
        } catch (error) {
          if (requestIdRef.current !== id) return;
          setAnswer(error instanceof AgentError ? error.message : "这块我一时讲不明白，再点一次试试。");
        } finally {
          if (requestIdRef.current === id) setIsLoading(false);
        }
      })();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
    };
  }, [isActive]);

  useEffect(() => {
    if (!answer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(answer.length);
      return;
    }
    const total = answer.length;
    const delay = Math.max(6, Math.min(20, Math.round(2600 / Math.max(total, 1))));
    let current = 0;
    const timer = window.setInterval(() => {
      current = Math.min(total, current + 2);
      setShown(current);
      if (current >= total) window.clearInterval(timer);
    }, delay);
    return () => window.clearInterval(timer);
  }, [answer]);

  function handleDragStart(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    const el = popoverRef.current;
    if (!el || event.button !== 0) return;
    const rect = el.getBoundingClientRect();
    setBox((prev) => (prev ? { ...prev, width: prev.width ?? rect.width } : { left: rect.left, top: rect.top, width: rect.width }));
    setExpanded(false);
    dragRef.current = { pointerId: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDragMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const width = popoverRef.current?.getBoundingClientRect().width ?? 340;
    const left = clamp(event.clientX - drag.dx, 0, Math.max(0, window.innerWidth - width));
    const top = clamp(event.clientY - drag.dy, 0, Math.max(0, window.innerHeight - 44));
    setBox((prev) => ({ left, top, width: prev?.width, height: prev?.height }));
  }

  function handleDragEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
  }

  function handleResizeStart(event: React.PointerEvent<HTMLDivElement>) {
    const el = popoverRef.current;
    if (!el || event.button !== 0) return;
    const rect = el.getBoundingClientRect();
    setBox((prev) => (prev ? { ...prev, width: prev.width ?? rect.width } : { left: rect.left, top: rect.top, width: rect.width }));
    setExpanded(false);
    resizeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startW: rect.width,
      startH: rect.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  }

  function handleResizeMove(event: React.PointerEvent<HTMLDivElement>) {
    const resize = resizeRef.current;
    if (!resize || resize.pointerId !== event.pointerId) return;
    const width = clamp(resize.startW + (event.clientX - resize.startX), MIN_WIDTH, window.innerWidth - 16);
    const height = clamp(resize.startH + (event.clientY - resize.startY), MIN_HEIGHT, window.innerHeight - 16);
    setBox((prev) => {
      let left = prev?.left ?? 0;
      let top = prev?.top ?? 0;
      if (left + width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - 8 - width);
      if (top + height > window.innerHeight - 8) top = Math.max(8, window.innerHeight - 8 - height);
      return { left, top, width, height };
    });
  }

  function handleResizeEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (resizeRef.current?.pointerId !== event.pointerId) return;
    resizeRef.current = null;
  }

  function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    if (next) setBox((prev) => (prev ? { left: prev.left, top: prev.top } : prev));
  }

  const popoverStyle: React.CSSProperties = box
    ? {
        left: box.left,
        top: box.top,
        ...(box.width ? { width: box.width } : {}),
        ...(box.height ? { height: box.height } : {}),
      }
    : popover?.below
      ? { left: popover.x, top: popover.edge }
      : { left: popover?.x, bottom: popover?.edge };

  return (
    <>
      <button
        type="button"
        className={`lens-button ${isActive ? "is-active" : ""}`}
        aria-pressed={isActive}
        aria-label={isActive ? "退出放大镜模式" : "打开放大镜：点选页面区块听 AI 讲解"}
        onClick={() => {
          setIsActive((value) => !value);
          setPopover(null);
          setBox(null);
          setExpanded(false);
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="2.5" />
          <path d="M15 15 L21 21" stroke="currentColor" strokeWidth="3" />
        </svg>
      </button>

      {isActive && !popover ? (
        <div className="lens-mode-hint" role="status">
          <i aria-hidden="true" />
          LENS MODE · 点选任意区块，Esc 退出
        </div>
      ) : null}

      {popover ? (
        <div
          ref={popoverRef}
          className={`lens-popover ${box ? "is-floating" : ""} ${box?.height ? "is-sized" : ""} ${expanded ? "is-expanded" : ""}`}
          style={popoverStyle}
          role="dialog"
          aria-label={`区块讲解：${popover.title}`}
        >
          <div
            className={`lens-popover-head ${isDragging ? "is-dragging" : ""}`}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
          >
            <span>LENS · {popover.title}</span>
            <span className="lens-popover-actions">
              <button
                type="button"
                onClick={toggleExpanded}
                aria-label={expanded ? "还原大小" : "放大"}
                title={expanded ? "还原大小" : "放大"}
              >
                {expanded ? "↙" : "↗"}
              </button>
              <button type="button" onClick={() => setPopover(null)} aria-label="关闭讲解" title="关闭讲解">
                ×
              </button>
            </span>
          </div>
          <div className="lens-popover-body" aria-live="polite">
            {isLoading ? (
              <p className="lens-loading">
                <i />
                <i />
                <i />
                正在解析这个区块…
              </p>
            ) : (
              answer.slice(0, shown)
            )}
          </div>
          <div
            className="lens-popover-resize"
            onPointerDown={handleResizeStart}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            onPointerCancel={handleResizeEnd}
            aria-hidden="true"
            title="拖动调整大小"
          />
        </div>
      ) : null}
    </>
  );
}
