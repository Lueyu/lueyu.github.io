import { Link } from 'react-router'
import { useNight } from './components/ThemeToggle'
import PixelWorld from './components/PixelWorld'
import TypedIntro from './components/TypedIntro'
import { FEATURED_PROJECTS, OTHER_EXPERIENCE } from './lib/siteProfile'
import './home.css'

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
              <button className="home-button" onClick={() => window.dispatchEvent(new CustomEvent('lueyu:open-resume'))}>查看简历 <span aria-hidden="true">↓</span></button>
            </div>
            <div className="home-socials"><a href="https://github.com/Lueyu" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a><a href="mailto:lueyuwang@gmail.com">Email <span aria-hidden="true">↗</span></a><span className="home-location">CHINA / EARTH</span></div>
          </div>
          <PixelWorld />
        </section>
        <div className="home-below">
          <section id="work" className="home-projects" aria-labelledby="projects-title">
            <div className="home-section-heading"><h2 id="projects-title">精选项目 <span>Projects</span></h2><span className="home-section-number">01 / BUILD</span></div>
            <div className="home-project-list">{projects.map((project) => (
              <article className={`home-project home-project-${project.color}`} key={project.slug} data-project-slug={project.slug}>
                <div className="home-project-meta"><span>{project.eyebrow}</span><span>{project.number}</span></div>
                <Link className="home-project-title" to={`/projects/${project.slug}`}><h3>{project.title}</h3><span aria-hidden="true">↗</span></Link>
                <p className="home-project-description">{project.description}</p>
                <ul className="home-highlights">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                <div className="home-project-foot"><span className="home-role">{project.role}</span><div className="home-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
                <details className="home-case-notes"><summary>项目笔记 <span aria-hidden="true">+</span></summary><p>{project.details}</p><Link to={`/projects/${project.slug}`}>阅读完整项目 →</Link></details>
              </article>
            ))}</div>
            {nextQuest && <Link to={`/projects/${nextQuest.slug}`} className="home-next-quest" data-project-slug={nextQuest.slug}><span className="home-quest-icon" aria-hidden="true">?</span><span><strong>{nextQuest.title} <small>NEXT QUEST</small></strong><span>{nextQuest.description}</span><em>{nextQuest.highlights.join(' · ')}</em></span><b aria-hidden="true">→</b></Link>}
          </section>
          <section id="experience" className="home-experience" aria-labelledby="experience-title">
            <div className="home-section-heading"><h2 id="experience-title">沿途经历 <span>Experience</span></h2><span className="home-section-number">02 / JOURNEY</span></div>
            <div className="home-experience-list">{OTHER_EXPERIENCE.map((item) => <article className="home-job" key={item.company}><p className="home-job-date">{item.period}</p><h3>{item.company}</h3><p className="home-job-title">{item.title}</p><p className="home-job-description">{item.description}</p><div className="home-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div>
            <button className="home-text-link" onClick={() => window.dispatchEvent(new CustomEvent('lueyu:open-resume'))}>查看完整简历 <span aria-hidden="true">→</span></button>
            <div className="home-growing"><span aria-hidden="true">✳</span><p>KEEP GROWING<small>保持好奇，继续探索。</small></p></div>
          </section>
        </div>
        <section className="home-about" id="about" aria-labelledby="about-title">
          <p className="home-kicker">03 / THE PLAYER BEHIND THE PIXELS</p><h2 id="about-title">关于我 <span>Who am I?</span></h2>
          <p className="home-about-lead">我喜欢做<span>清晰、可靠的系统，</span><br />也对新的交互方式保持好奇。</p>
          <p>我有 Huawei 与 Subaru R&amp;D 的研发经历，现在主要关注 AI Agent，以及大模型在实际任务中的应用。从基础设施与自动化，到全栈应用与工具调用，我在意的是一个系统如何真正运转，以及在出错之后如何恢复。</p>
          <div className="home-focus"><span>CURRENTLY EXPLORING</span><ul><li>Agent 规划、工具调用与多智能体协作</li><li>可观测、可验证、可恢复的软件系统</li><li>模型能力、人机协作与新的开发体验</li></ul></div>
          <a className="home-text-link" href="#work">看看我正在做的项目 →</a>
        </section>
        <section className="home-contact" id="contact" aria-labelledby="contact-title">
          <div><p className="home-kicker">NEXT LEVEL</p><h2 id="contact-title">一起构建下一个 Agent<span>.</span></h2><p>欢迎交流 AI Agent、软件工程，以及正在做的有趣项目。</p></div>
          <a className="home-contact-link" href="mailto:lueyuwang@gmail.com">lueyuwang@gmail.com <span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <footer className="home-footer home-container"><div><a href="#home">LUEYU</a><span>© {new Date().getFullYear()} · BUILT WITH CARE</span></div><a href="#home">THANKS FOR PLAYING <span aria-hidden="true">↑</span></a></footer>
    </div>
  )
}
