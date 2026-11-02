import { useEffect, useState } from 'react'

const lines = ['I BUILD AI AGENTS THAT ACT.', 'CLEAR SYSTEMS. CURIOUS MIND.', 'STILL BUILDING. KEEP EXPLORING.']
export default function TypedIntro() {
  const [text, setText] = useState(lines[0])
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer: ReturnType<typeof setTimeout>
    let line = 0
    let length = lines[0].length
    let deleting = true
    function tick() {
      if (deleting) { length--; if (length === 0) { deleting = false; line = (line + 1) % lines.length } }
      else { length++; if (length === lines[line].length) deleting = true }
      setText(lines[line].slice(0, length))
      timer = setTimeout(tick, deleting && length === lines[line].length ? 3500 : length === 0 ? 300 : deleting ? 30 : 65)
    }
    function sync() {
      clearTimeout(timer)
      setText(lines[0]); line = 0; length = lines[0].length; deleting = true
      if (!motion.matches) timer = setTimeout(tick, 3500)
    }
    sync(); motion.addEventListener('change', sync)
    return () => { clearTimeout(timer); motion.removeEventListener('change', sync) }
  }, [])
  return <p className="home-terminal"><span className="home-sr-only">I build AI agents that act.</span><span aria-hidden="true"><b>$</b> {text}<i /></span></p>
}
