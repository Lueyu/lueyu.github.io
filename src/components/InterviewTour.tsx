import { useCallback, useEffect, useRef, useState } from "react"
import { TOUR_STOPS } from "../lib/tourStops"

interface InterviewTourProps {
  onClose: () => void
  navigate: (to: string) => Promise<unknown> | void
}

export default function InterviewTour({ onClose, navigate }: InterviewTourProps) {
  const [step, setStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevRoute = useRef<string>(window.location.pathname)

  const stop = TOUR_STOPS[step]
  const isLast = step === TOUR_STOPS.length - 1
  const progress = Math.round(((step + 1) / TOUR_STOPS.length) * 100)

  const goToStop = useCallback(
    async (index: number) => {
      const target = TOUR_STOPS[index]
      if (!target) return
      setIsTransitioning(true)

      if (target.route !== window.location.pathname) {
        await navigate(target.route)
      }

      await new Promise((resolve) => setTimeout(resolve, 150))

      if (target.anchor) {
        const el = document.getElementById(target.anchor)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
      setTimeout(() => setIsTransitioning(false), 350)
    },
    [navigate],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowRight" && !isLast && !isTransitioning) {
        setStep((s) => Math.min(s + 1, TOUR_STOPS.length - 1))
      }
      if (event.key === "ArrowLeft" && step > 0 && !isTransitioning) {
        setStep((s) => Math.max(s - 1, 0))
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose, isLast, step, isTransitioning])

  useEffect(() => {
    void goToStop(step)
  }, [step, goToStop])

  function handleNext() {
    if (isTransitioning) return
    if (!isLast) setStep((s) => s + 1)
  }

  function handlePrev() {
    if (isTransitioning) return
    if (step > 0) setStep((s) => s - 1)
  }

  return (
    <div className={`tour-overlay ${isTransitioning ? "tour-transitioning" : ""}`}>
      <div className="tour-card">
        <header className="tour-head">
          <div className="tour-head-left">
            <span className="tour-badge">{stop.badge}</span>
            <div className="tour-progress" aria-hidden="true">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button type="button" className="tour-close" onClick={onClose} aria-label="退出导览">
            ×
          </button>
        </header>

        <div className="tour-body">
          <h3>{stop.title}</h3>
          <ul>
            {stop.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        <footer className="tour-foot">
          <div className="tour-step-info">
            <span>
              {step + 1} / {TOUR_STOPS.length}
            </span>
            <div className="tour-dots" aria-hidden="true">
              {TOUR_STOPS.map((s, i) => (
                <i key={s.id} className={i === step ? "active" : i < step ? "done" : ""} />
              ))}
            </div>
          </div>
          <div className="tour-actions">
            {step > 0 && (
              <button type="button" className="tour-prev" onClick={handlePrev} disabled={isTransitioning}>
                ← 上一站
              </button>
            )}
            {!isLast ? (
              <button type="button" className="tour-next" onClick={handleNext} disabled={isTransitioning}>
                下一站 →
              </button>
            ) : (
              <button type="button" className="tour-next tour-finish" onClick={onClose}>
                谢谢观看 ✓
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
