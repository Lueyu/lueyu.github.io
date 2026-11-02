import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { RESUME_EDUCATION, RESUME_EXPERIENCE, RESUME_HONORS, RESUME_META, RESUME_PROJECTS, RESUME_SKILLS, RESUME_SUMMARY } from '../lib/resume'
import '../resume-page.css'

const sections = [
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'honors', label: 'Honors' },
]

export default function ResumePage() {
  const [active, setActive] = useState('summary')
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const visible = sections.filter(section => {
        const element = pageRef.current?.querySelector<HTMLElement>(`#${section.id}`)
        return element && element.getBoundingClientRect().top <= 165
      })
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      setActive(atBottom ? 'honors' : visible.at(-1)?.id ?? 'summary')
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return <main id="project-content" ref={pageRef} tabIndex={-1} className="cv-page">
    <header className="cv-hero">
      <div>
        <p className="cv-eyebrow">LUEYU / RESUME</p>
        <h1>{RESUME_META.name}<span>Lueyu</span></h1>
        <p className="cv-headline"><span>{RESUME_META.role}</span><span>{RESUME_META.roleNote}</span></p>
      </div>
      <div className="cv-contact">
        <a href={RESUME_META.site}>lueyu.github.io</a>
        <a href="https://github.com/Lueyu" target="_blank" rel="noopener noreferrer">github.com/Lueyu</a>
        <a href={`mailto:${RESUME_META.email}`}>{RESUME_META.email}</a>
        <button className="cv-print" type="button" onClick={() => window.print()}>打印 / PDF <span aria-hidden="true">↗</span></button>
      </div>
    </header>
    <div className="cv-layout">
      <nav className="cv-toc" aria-label="简历章节">
        {sections.map(section => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}>{section.label}</a>)}
      </nav>
      <div className="cv-content">
        <section id="summary" aria-labelledby="cv-summary-title">
          <h2 id="cv-summary-title">Summary</h2>
          <p className="cv-summary">{RESUME_SUMMARY}</p>
          <dl className="cv-skills">{RESUME_SKILLS.map(skill => {
            const [label, ...value] = skill.split('：')
            return <div key={label}><dt>{label}</dt><dd>{value.join('：')}</dd></div>
          })}</dl>
        </section>
        <section id="experience" aria-labelledby="cv-experience-title">
          <span id="engineering" className="cv-anchor" aria-hidden="true" />
          <h2 id="cv-experience-title">Experience</h2>
          <ol className="cv-timeline">
            {RESUME_EXPERIENCE.map(job => <li key={job.company} className={job.current ? 'is-current' : undefined}>
              <div className="cv-entry-head"><h3>{job.title} <span>· {job.company}</span></h3><span className="cv-date">{job.period}</span></div>
              {job.location && <p className="cv-location">{job.location}</p>}
              <div className="cv-entry-copy">{job.points.map(point => <p key={point}>{point}</p>)}</div>
            </li>)}
          </ol>
        </section>
        <section id="projects" aria-labelledby="cv-projects-title">
          <h2 id="cv-projects-title">Projects</h2>
          <ol className="cv-timeline">
            {RESUME_PROJECTS.map(project => <li key={project.name} className={project.current ? 'is-current' : undefined}>
              <div className="cv-entry-head"><h3>{project.name} <span>· {project.role}</span></h3><span className="cv-date">{project.period}</span></div>
              <div className="cv-entry-copy">{project.points.map(point => <p key={point}>{point}</p>)}</div>
              {project.href && <Link className="cv-project-link" to={project.href}>查看项目 <span aria-hidden="true">↗</span></Link>}
            </li>)}
          </ol>
        </section>
        <section id="education" aria-labelledby="cv-education-title">
          <h2 id="cv-education-title">Education</h2>
          <ol className="cv-timeline">
            {RESUME_EDUCATION.map(edu => <li key={edu.degree}>
              <div className="cv-entry-head"><h3>{edu.degree} <span>· {edu.school}</span></h3><span className="cv-date">{edu.period}</span></div>
              <p className="cv-location">Ann Arbor, Michigan · GPA {edu.gpa}</p>
            </li>)}
          </ol>
        </section>
        <section id="honors" aria-labelledby="cv-honors-title">
          <h2 id="cv-honors-title">Honors &amp; Awards</h2>
          <ul className="cv-honors">{RESUME_HONORS.map(honor => <li key={honor.name}>
            <span>{honor.name}{honor.name === 'Ingersoll Prize' && <small> · {honor.organization}</small>}</span>
            <span className="cv-date">{honor.year}</span>
          </li>)}</ul>
        </section>
      </div>
    </div>
    <footer className="cv-footer"><span>© {new Date().getFullYear()} Lueyu</span><Link to="/">返回首页 ↗</Link></footer>
  </main>
}
