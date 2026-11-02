import type { ComponentPropsWithoutRef } from 'react'
import '../project-motion.css'
export default function TiltCard({ className = '', children, ...props }: ComponentPropsWithoutRef<'article'>) {
  const reset = (element: HTMLElement) => {
    for (const property of ['--tilt-x', '--tilt-y', '--shine-x', '--shine-y']) element.style.removeProperty(property)
  }
  return <article {...props} className={`project-tilt ${className}`} onPointerMove={(event) => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    element.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`)
    element.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`)
    element.style.setProperty('--shine-x', `${x * 100}%`)
    element.style.setProperty('--shine-y', `${y * 100}%`)
  }} onPointerLeave={(event) => reset(event.currentTarget)} onPointerCancel={(event) => reset(event.currentTarget)}>{children}</article>
}
