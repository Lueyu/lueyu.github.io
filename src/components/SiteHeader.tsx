import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import ThemeToggle from './ThemeToggle'
import { setTheme } from '../lib/theme'
import '../navigation.css'

export default function SiteHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const openResume = () => { void navigate('/resume') }
    const applyTheme = (event: Event) => { const mode = (event as CustomEvent<string>).detail; if (mode === 'day' || mode === 'night') setTheme(mode) }
    window.addEventListener('lueyu:open-resume', openResume)
    window.addEventListener('lueyu-agent:set-theme', applyTheme)
    return () => { window.removeEventListener('lueyu:open-resume', openResume); window.removeEventListener('lueyu-agent:set-theme', applyTheme) }
  }, [navigate])
  return <>
    <a className="site-skip-link" href={location.pathname === '/' ? '#main-content' : '#project-content'}>跳到正文</a>
    <header className="reading-header"><nav aria-label="主要导航" className="reading-nav">
      <Link className="reading-brand" to="/#home" aria-label="Lueyu 首页"><span aria-hidden="true">L</span><b>LUEYU</b></Link>
      <Link to="/projects" aria-current={location.pathname.startsWith('/projects') ? 'location' : undefined}>项目</Link>
      <Link to="/blog" aria-current={location.pathname === '/blog' ? 'page' : undefined}>博客</Link>
      <Link to="/resume" aria-current={location.pathname === '/resume' ? 'page' : undefined}>简历</Link>
      <span className="reading-nav-divider" aria-hidden="true" />
      <button type="button" className="reading-search" aria-label="搜索网站" title="搜索网站 (/ 或 Ctrl+K)" onClick={() => window.dispatchEvent(new CustomEvent('lueyu:open-search'))}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 3h9v9H3zM12 12l5 5" /></svg><kbd>/</kbd></button>
      <ThemeToggle />
    </nav></header>
  </>
}
