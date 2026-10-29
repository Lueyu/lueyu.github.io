import { useEffect } from "react"
import {
  RESUME_EDUCATION,
  RESUME_EXPERIENCE,
  RESUME_META,
  RESUME_PROJECTS,
  RESUME_SKILLS,
  RESUME_SUMMARY,
} from "../lib/resume"

export default function ResumeModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="resume-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="简历预览"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="resume-modal">
        <header className="resume-head">
          <div>
            <strong>{RESUME_META.name}</strong>
            <span>{RESUME_META.role} · {RESUME_META.roleNote}</span>
          </div>
          <div className="resume-head-actions">
            <a
              className="resume-download"
              href={RESUME_META.pdfPath}
              download="Lueyu-Resume.pdf"
            >
              <span>DOWNLOAD PDF</span>
              <b aria-hidden="true">↓</b>
            </a>
            <button type="button" className="resume-close" onClick={onClose} aria-label="关闭简历预览">
              ×
            </button>
          </div>
        </header>

        <div className="resume-body">
          <section className="resume-section" aria-label="概要">
            <h3>概要 / SUMMARY</h3>
            <p>{RESUME_SUMMARY}</p>
            <p className="resume-contact-line">
              {RESUME_META.email} · {RESUME_META.site} · 更新于 {RESUME_META.updated}
            </p>
          </section>

          <section className="resume-section" aria-label="教育经历">
            <h3>教育经历 / EDUCATION</h3>
            {RESUME_EDUCATION.map((edu) => (
              <article className="resume-entry" key={`${edu.school}-${edu.degree}`}>
                <div className="resume-entry-head">
                  <strong>{edu.school}</strong>
                  <span>{edu.degree} · GPA {edu.gpa}</span>
                  <em>{edu.period}</em>
                </div>
              </article>
            ))}
          </section>

          <section className="resume-section" aria-label="实习经历">
            <h3>实习经历 / EXPERIENCE</h3>
            {RESUME_EXPERIENCE.map((job) => (
              <article className="resume-entry" key={job.company}>
                <div className="resume-entry-head">
                  <strong>{job.company}</strong>
                  <span>{job.title}</span>
                  <em>{job.period}</em>
                </div>
                {job.location ? <p className="resume-entry-location">{job.location}</p> : null}
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="resume-tags">
                  {job.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="resume-section" aria-label="代表项目">
            <h3>代表项目 / PROJECTS</h3>
            {RESUME_PROJECTS.map((project) => (
              <article className="resume-entry" key={project.name}>
                <div className="resume-entry-head">
                  <strong>{project.name}</strong>
                  <span>{project.role}</span>
                  <em>{project.period}</em>
                </div>
                <ul>
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="resume-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="resume-section" aria-label="技能">
            <h3>技能 / SKILLS</h3>
            <ul className="resume-skill-list">
              {RESUME_SKILLS.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
