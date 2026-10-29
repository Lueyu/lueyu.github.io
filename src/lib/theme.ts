const STORAGE_KEY = "lueyu:theme"

export type Theme = "day" | "night"

let current: Theme = "day"
const listeners = new Set<() => void>()

function readInitial(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "day" || stored === "night") return stored
  } catch {
    return "day"
  }
  const hour = new Date().getHours()
  return hour >= 18 || hour < 6 ? "night" : "day"
}

function apply(theme: Theme): void {
  document.documentElement.classList.toggle("night", theme === "night")
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
    return
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
