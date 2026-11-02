import { Link } from 'react-router'
import { useNight } from './components/ThemeToggle'
import PixelWorld from './components/PixelWorld'
import TypedIntro from './components/TypedIntro'
import { FEATURED_PROJECTS } from './lib/siteProfile'
import './home.css'
import BlogPreview from './components/BlogPreview'
import TiltCard from './components/TiltCard'

export default function App() {
  const isNight = useNight()
  const projects = FEATURED_PROJECTS.filter((project) => project.slug !== 'next-quest')
  const nextQuest = FEATURED_PROJECTS.find((project) => project.slug === 'next-quest')
  return (
    <div className={`site-shell portfolio-home ${isNight ? 'night' : ''}`}>
      <main id="main-content" tabIndex={-1} className="home-container">
        <section className="home-hero" id="home" aria-labelledby="home-title">
          <div className="home-identity">
            <p className="home-kicker"><i aria-hidden="true" /> AI AGENT DEVELOPER · LUEYU</p>
            <h1 id="home-title">你好，我是 <span>Lueyu</span><span className="home-period">.</span></h1>
            <TypedIntro />
            <p className="home-lead">一名专注 AI Agent 的程序员。<br />喜欢构建清晰、可靠的系统，<br className="home-desktop-break" />让模型在真实任务中行动。</p>
            <p className="home-background">研发经历 · Huawei / Subaru R&amp;D</p>
            <div className="home-actions">
              <a className="home-button home-button-primary" href="#work">查看项目 <span aria-hidden="true">↗</span></a>
              <Link className="home-button" to="/resume">查看简历 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="home-socials"><a href="https://github.com/Lueyu" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a><a href="mailto:lueyuwang@gmail.com">Email <span aria-hidden="true">↗</span></a><span className="home-location">CHINA / EARTH</span></div>
          </div>
          <PixelWorld />
        </section>
        <div className="home-below">
          <section id="work" className="home-projects" aria-labelledby="projects-title">
            <div className="home-section-heading"><h2 id="projects-title">精选项目 <span>Projects</span></h2><span className="home-section-number">01 / BUILD</span></div>
            <div className="home-project-list">{projects.map((project) => (
              <TiltCard className={`home-project home-project-${project.color}`} key={project.slug} data-project-slug={project.slug}>
                <div className="home-project-meta"><span>{project.eyebrow}</span><span>{project.number}</span></div>
                <Link className="home-project-title" to={`/projects/${project.slug}`}><h3>{project.title}</h3><span aria-hidden="true">↗</span></Link>
                <p className="home-project-description">{project.description}</p>
                <ul className="home-highlights">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                <div className="home-project-foot"><span className="home-role">{project.role}</span><div className="home-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
                <details className="home-case-notes"><summary>项目笔记 <span aria-hidden="true">+</span></summary><p>{project.details}</p><Link to={`/projects/${project.slug}`}>阅读完整项目 →</Link></details>
              </TiltCard>
            ))}</div>
            <Link className="home-text-link" to="/projects">查看项目 →</Link>
            {nextQuest && <Link to={`/projects/${nextQuest.slug}`} className="home-next-quest" data-project-slug={nextQuest.slug}><span className="home-quest-icon" aria-hidden="true">?</span><span><strong>{nextQuest.title} <small>NEXT QUEST</small></strong><span>{nextQuest.description}</span><em>{nextQuest.highlights.join(' · ')}</em></span><b aria-hidden="true">→</b></Link>}
          </section>
          <section id="blog" className="home-blog" aria-labelledby="blog-title">
            <div className="home-section-heading"><h2 id="blog-title">博客 <span>Writing</span></h2><span className="home-section-number">02 / NOTES</span></div>
            <BlogPreview />
            <Link className="home-text-link" to="/blog">查看博客 →</Link>
          </section>
        </div>
        <section className="home-contact" id="contact" aria-labelledby="contact-title">
          <div><p className="home-kicker">NEXT LEVEL</p><h2 id="contact-title">一起构建下一个 Agent<span>.</span></h2><p>欢迎交流 AI Agent、软件工程，以及正在做的有趣项目。</p></div>
          <a className="home-contact-link" href="mailto:lueyuwang@gmail.com">lueyuwang@gmail.com <span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <footer className="home-footer home-container"><div><a href="#home">LUEYU</a><span>© {new Date().getFullYear()} · BUILT WITH CARE</span></div><a href="#home">THANKS FOR PLAYING <span aria-hidden="true">↑</span></a></footer>
    </div>
  )
}
