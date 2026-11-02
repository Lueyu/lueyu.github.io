import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import ResumeModal from './ResumeModal'
import ThemeToggle from './ThemeToggle'
import { setTheme } from '../lib/theme'
import '../navigation.css'

export default function SiteHeader() {
  const [resumeOpen, setResumeOpen] = useState(false)
  const location = useLocation()
  useEffect(() => {
    const openResume = () => setResumeOpen(true)
    const applyTheme = (event: Event) => { const mode = (event as CustomEvent<string>).detail; if (mode === 'day' || mode === 'night') setTheme(mode) }
    window.addEventListener('lueyu:open-resume', openResume)
    window.addEventListener('lueyu-agent:set-theme', applyTheme)
    return () => { window.removeEventListener('lueyu:open-resume', openResume); window.removeEventListener('lueyu-agent:set-theme', applyTheme) }
  }, [])
  return <>
    <a className="site-skip-link" href={location.pathname === '/' ? '#main-content' : '#project-content'}>跳到正文</a>
    <header className="reading-header"><nav aria-label="主要导航" className="reading-nav">
      <Link className="reading-brand" to="/#home" aria-label="Lueyu 首页"><span aria-hidden="true">L</span><b>LUEYU</b></Link>
      <Link to="/#work" aria-current={location.pathname.startsWith('/projects/') || location.hash === '#work' ? 'location' : undefined}>项目</Link>
      <Link to="/#about" aria-current={location.hash === '#about' ? 'location' : undefined}>关于</Link>
      <button type="button" onClick={() => setResumeOpen(true)}>简历</button>
      <span className="reading-nav-divider" aria-hidden="true" />
      <button type="button" className="reading-search" aria-label="搜索网站" title="搜索网站 (/ 或 Ctrl+K)" onClick={() => window.dispatchEvent(new CustomEvent('lueyu:open-search'))}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 3h9v9H3zM12 12l5 5" /></svg><kbd>/</kbd></button>
      <ThemeToggle />
    </nav></header>
    {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}
  </>
}
