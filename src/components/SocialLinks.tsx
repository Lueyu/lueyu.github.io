import { useEffect, useRef, useState } from 'react'
import './social-links.css'

const WECHAT_ID = 'w13361862255'

function SocialIcon({ kind }: { kind: 'github' | 'email' | 'linkedin' | 'wechat' }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {kind === 'github' && <path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.06c-3.09.67-3.74-1.31-3.74-1.31-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.14 1.7 1.14.99 1.69 2.59 1.2 3.22.92.1-.72.39-1.21.7-1.49-2.47-.28-5.07-1.24-5.07-5.49 0-1.21.43-2.2 1.14-2.97-.12-.28-.5-1.41.11-2.94 0 0 .93-.3 3.05 1.13a10.6 10.6 0 0 1 5.56 0c2.12-1.43 3.05-1.13 3.05-1.13.61 1.53.23 2.66.11 2.94.71.77 1.14 1.76 1.14 2.97 0 4.27-2.6 5.21-5.08 5.49.4.35.75 1.02.75 2.06v3.04c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/>}
    {kind === 'email' && <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="2" y="4.5" width="20" height="15" rx="2"/><path d="m3 6 9 7 9-7"/></g>}
    {kind === 'linkedin' && <path fill="currentColor" fillRule="evenodd" d="M3 1.5h18A1.5 1.5 0 0 1 22.5 3v18a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 21V3A1.5 1.5 0 0 1 3 1.5ZM5 9h3v10H5V9Zm1.5-5A1.75 1.75 0 1 0 6.5 7.5 1.75 1.75 0 0 0 6.5 4ZM10 9h3v1.3c.7-1 1.7-1.6 3-1.6 3 0 3.5 1.9 3.5 4.4V19h-3v-5.2c0-1.3-.2-2.3-1.7-2.3-1.6 0-1.8 1.2-1.8 2.5v5h-3V9Z"/>}
    {kind === 'wechat' && <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M13.8 4.4A8.5 8.5 0 0 0 9 3C4.6 3 1 5.7 1 9c0 1.8 1 3.4 2.7 4.5L3 16l3.1-1.5c.9.3 1.9.5 2.9.5"/><path d="M23 14c0-3-3.1-5.5-7-5.5S9 11 9 14s3.1 5.5 7 5.5c.9 0 1.8-.1 2.6-.4L21 21l-.5-3c1.5-1 2.5-2.4 2.5-4Z"/><g fill="currentColor" stroke="none"><circle cx="6" cy="7" r="1"/><circle cx="11" cy="7" r="1"/><circle cx="13.5" cy="13" r="1"/><circle cx="18.5" cy="13" r="1"/></g></g>}
  </svg>
}

export default function SocialLinks() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus() }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  async function copyWechat() {
    try {
      await navigator.clipboard.writeText(WECHAT_ID)
      setMessage('微信号已复制')
    } catch {
      setMessage('请选中上方微信号手动复制。')
    }
  }

  return <div className="home-socials social-links" ref={containerRef}>
    <a className="social-icon-link" href="https://github.com/Lueyu" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><SocialIcon kind="github"/></a>
    <a className="social-icon-link" href="mailto:lueyuwang@gmail.com" aria-label="Email" title="Email"><SocialIcon kind="email"/></a>
    <a className="social-icon-link" href="https://www.linkedin.com/in/brian-wang-a8132b154/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><SocialIcon kind="linkedin"/></a>
    <button className="social-icon-link" type="button" ref={triggerRef} title="微信" aria-label="微信" aria-expanded={open} aria-controls="wechat-contact" onClick={() => { setOpen(!open); setMessage('') }}><SocialIcon kind="wechat"/></button>
    <span className="home-location">CHINA / EARTH</span>
    {open && <div id="wechat-contact" className="wechat-contact" role="region" aria-label="微信联系方式">
      <p>微信 <span>WeChat</span></p>
      <div className="wechat-copy-row"><code>{WECHAT_ID}</code><button type="button" onClick={() => void copyWechat()}>复制微信号</button></div>
      <span className="wechat-copy-status" role="status">{message || '在微信中搜索此账号添加好友。'}</span>
    </div>}
  </div>
}
