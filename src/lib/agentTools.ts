import { callServerTool, type ToolResult } from "./agent";
import { getProfile, HOME_SECTIONS, PROJECT_SLUGS, type HomeSectionId } from "./siteProfile";

const HOME_SECTION_IDS: readonly string[] = HOME_SECTIONS.map((section) => section.id);

export type ToolKind = "read" | "act";

const READ_TOOLS = new Set(["read_page", "get_profile", "list_repo_files", "read_repo_file"]);

export function toolKind(name: string): ToolKind {
  return READ_TOOLS.has(name) ? "read" : "act";
}

type RouterLike = { navigate: (to: string) => void | Promise<unknown> };

let activeRouter: RouterLike | null = null;

export function registerRouter(router: RouterLike): void {
  activeRouter = router;
}

type FormLauncher = (draft?: string) => void;

let formLauncher: FormLauncher | null = null;

export function registerFormLauncher(launcher: FormLauncher | null): void {
  formLauncher = launcher;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function visibleHomeSection(): string | null {
  let best: { id: string; overlap: number } | null = null;
  for (const id of HOME_SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const viewport = window.innerHeight;
    const overlap = Math.max(0, Math.min(rect.bottom, viewport) - Math.max(rect.top, 0));
    if (overlap > 0 && (!best || overlap > best.overlap)) best = { id, overlap };
  }
  return best ? best.id : null;
}

async function waitForElement(selector: () => HTMLElement | null, timeoutMs: number): Promise<HTMLElement | null> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const el = selector();
    if (el) return el;
    if (Date.now() >= deadline) return null;
    await sleep(80);
  }
}

function readPage(): ToolResult {
  const onHome = window.location.pathname === "/";
  const theme = document.querySelector(".site-shell")?.classList.contains("night") ? "night" : "day";
  const section = onHome ? visibleHomeSection() : null;
  const view = onHome
    ? `home · viewing #${section ?? "unknown"}`
    : window.location.pathname.startsWith("/projects/")
      ? `project page: ${window.location.pathname.slice("/projects/".length)}`
      : `route ${window.location.pathname}`;
  return {
    ok: true,
    summary: `${view} · ${theme}`,
    data: {
      route: `${window.location.pathname}${window.location.hash}`,
      view,
      section,
      theme,
      title: document.title,
      sections: HOME_SECTIONS.map((entry) => ({ id: entry.id, title: entry.title })),
      projects: PROJECT_SLUGS,
      time: new Date().toISOString(),
    },
  };
}

async function openSection(section: string): Promise<ToolResult> {
  if (!HOME_SECTION_IDS.includes(section)) {
    return { ok: false, summary: `unknown section: ${section}`, data: { sections: HOME_SECTION_IDS } };
  }
  if (window.location.pathname !== "/") {
    if (!activeRouter) return { ok: false, summary: "导航暂时不可用" };
    await activeRouter.navigate("/");
  }
  const el = await waitForElement(() => document.getElementById(section), 2400);
  if (!el) return { ok: false, summary: `#${section} 不在当前页面上` };
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return { ok: true, summary: `→ #${section}` };
}

async function openProject(slug: string): Promise<ToolResult> {
  if (!PROJECT_SLUGS.includes(slug)) {
    return { ok: false, summary: `unknown project: ${slug}`, data: { projects: PROJECT_SLUGS } };
  }
  if (!activeRouter) return { ok: false, summary: "导航暂时不可用" };
  await activeRouter.navigate(`/projects/${slug}`);
  return { ok: true, summary: `→ /projects/${slug}` };
}

function resolveHighlightTarget(target: string): HTMLElement | null {
  if (HOME_SECTION_IDS.includes(target)) return document.getElementById(target);
  if (PROJECT_SLUGS.includes(target)) {
    return document.querySelector(`[data-project-slug="${CSS.escape(target)}"]`) as HTMLElement | null;
  }
  return null;
}

async function highlightTarget(target: string): Promise<ToolResult> {
  const el = resolveHighlightTarget(target);
  if (!el) return { ok: false, summary: `找不到要高亮的区块：${target}` };
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("agent-spotlight");
  window.setTimeout(() => el.classList.remove("agent-spotlight"), 2400);
  return { ok: true, summary: `★ ${target}` };
}

function showMessageForm(draft: unknown): ToolResult {
  const draftText = typeof draft === "string" ? draft.slice(0, 600) : undefined;
  if (!formLauncher) return { ok: false, summary: "留言表单还没准备好" };
  formLauncher(draftText);
  return { ok: true, summary: draftText ? "表单已打开（含草稿）" : "表单已打开" };
}

async function setTheme(mode: unknown): Promise<ToolResult> {
  if (mode !== "day" && mode !== "night") return { ok: false, summary: "mode 只能是 day 或 night" };
  window.dispatchEvent(new CustomEvent("lueyu-agent:set-theme", { detail: mode }));
  await sleep(250);
  const shell = document.querySelector(".site-shell");
  if (!shell) return { ok: false, summary: "主题切换只在首页生效" };
  const applied = shell.classList.contains("night") ? "night" : "day";
  return applied === mode
    ? { ok: true, summary: `theme → ${mode}` }
    : { ok: false, summary: "主题切换没有生效" };
}

function parseArgs(argsJson: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(argsJson || "{}") as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
  return {};
}

export async function executeTool(name: string, argsJson: string): Promise<ToolResult> {
  const args = parseArgs(argsJson);
  switch (name) {
    case "read_page":
      return readPage();
    case "get_profile": {
      const field = typeof args.field === "string" ? args.field : "all";
      return getProfile(field);
    }
    case "open_section":
      return openSection(typeof args.section === "string" ? args.section : "");
    case "open_project":
      return openProject(typeof args.slug === "string" ? args.slug : "");
    case "highlight":
      return highlightTarget(typeof args.target === "string" ? args.target : "");
    case "show_message_form":
      return showMessageForm(args.draft);
    case "set_theme":
      return setTheme(args.mode);
    case "list_repo_files":
    case "read_repo_file":
      return callServerTool(name, args);
    default:
      return { ok: false, summary: `unknown tool: ${name}` };
  }
}

export function formatToolCall(name: string, argsJson: string): string {
  const args = parseArgs(argsJson);
  const rendered = Object.values(args)
    .map((value) => {
      if (typeof value === "string") {
        const shown = value.length > 18 ? `${value.slice(0, 17)}…` : value;
        return `"${shown}"`;
      }
      return JSON.stringify(value);
    })
    .join(", ");
  return `${name}(${rendered.slice(0, 44)})`;
}
