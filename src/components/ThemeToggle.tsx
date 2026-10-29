import { useSyncExternalStore } from "react"
import { isNightTheme, subscribeTheme, toggleTheme } from "../lib/theme"

export function useNight(): boolean {
  return useSyncExternalStore(subscribeTheme, isNightTheme)
}

function SunIcon() {
  return (
    <svg className="mode-icon-svg" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="5" y="5" width="8" height="8" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="2" />
      <rect x="7" y="0" width="4" height="3" fill="var(--ink)" />
      <rect x="7" y="15" width="4" height="3" fill="var(--ink)" />
      <rect x="0" y="7" width="3" height="4" fill="var(--ink)" />
      <rect x="15" y="7" width="3" height="4" fill="var(--ink)" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="mode-icon-svg" viewBox="0 0 12 12" aria-hidden="true" shapeRendering="crispEdges">
      <path
        d="M3 2 h5 v2 h-3 v4 h3 v2 h-5 z"
        fill="var(--yellow)"
        stroke="var(--ink)"
        strokeWidth="1"
        strokeLinejoin="miter"
      />
      <rect x="3" y="4" width="1" height="1" fill="var(--ink)" opacity="0.35" />
      <rect x="3.5" y="7" width="1" height="1" fill="var(--ink)" opacity="0.25" />
    </svg>
  )
}

export default function ThemeToggle() {
  const isNight = useNight()
  return (
    <button
      type="button"
      className="mode-button"
      onClick={toggleTheme}
      aria-label={isNight ? "切换到白天模式" : "切换到夜晚模式"}
    >
      {isNight ? <SunIcon /> : <MoonIcon />}
      <span>{isNight ? "DAY" : "NIGHT"}</span>
    </button>
  )
}
