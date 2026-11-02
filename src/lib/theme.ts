const STORAGE_KEY = "lueyu:theme"

export type Theme = "day" | "night"

let current: Theme = "night"
const listeners = new Set<() => void>()

function readInitial(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "day" || stored === "night") return stored
  } catch {
    // Storage can be unavailable in private or restricted contexts.
  }
  return "night"
}

function apply(theme: Theme): void {
  // Keep these browser colors aligned with the first-paint script in index.html.
  const night = theme === "night"
  const background = night ? "#17212c" : "#f4f0e6"
  document.documentElement.classList.toggle("night", night)
  document.documentElement.style.colorScheme = night ? "dark" : "light"
  document.documentElement.style.backgroundColor = background
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", background)
}

export function initTheme(): void {
  current = readInitial()
  apply(current)
}

export function isNightTheme(): boolean {
  return current === "night"
}

export function toggleTheme(): void {
  current = current === "night" ? "day" : "night"
  persistAndNotify()
}

export function setTheme(mode: Theme): void {
  if (mode !== "day" && mode !== "night") return
  current = mode
  persistAndNotify()
}

function persistAndNotify(): void {
  try {
    localStorage.setItem(STORAGE_KEY, current)
  } catch {
    // The selection still applies for this visit when it cannot be persisted.
  }
  apply(current)
  for (const listener of listeners) listener()
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
