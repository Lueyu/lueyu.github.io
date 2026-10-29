import { useEffect, useState } from "react"
import { Link } from "react-router"
import { FEATURED_PROJECTS, OTHER_EXPERIENCE } from "./lib/siteProfile"

const featuredProjects = FEATURED_PROJECTS

const otherProjects = OTHER_EXPERIENCE

function PixelCloud({ className = "" }: { className?: string }) {
  return (
    <div className={`pixel-cloud ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </div>
  )
}

function App() {
  const [isNight, setIsNight] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add("js-anim")
    const elements = document.querySelectorAll("[data-reveal]")
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-revealed"))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed")
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onSetTheme = (event: Event) => {
      const mode = (event as CustomEvent<string>).detail
      setIsNight(mode === "night")
    }
    window.addEventListener("lueyu-agent:set-theme", onSetTheme)
    return () => window.removeEventListener("lueyu-agent:set-theme", onSetTheme)
  }, [])

  const [showMoreWork, setShowMoreWork] = useState(false)

  return (
    <div className={`site-shell ${isNight ? "night" : ""}`}>
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="回到首页">
          <span className="mark-block" aria-hidden="true">
            L
          </span>
          <span>LUEYU</span>
        </a>

        <nav className="nav" aria-label="主要导航">
          <a href="#about">ABOUT</a>
          <a href="#work">WORK</a>
          <a href="#contact">CONTACT</a>
        </nav>

        <button
          className="mode-button"
          type="button"
          onClick={() => setIsNight((value) => !value)}
          aria-label={isNight ? "切换到白天模式" : "切换到夜晚模式"}
        >
          <span className="mode-icon" aria-hidden="true" />
          <span>{isNight ? "DAY" : "NIGHT"}</span>
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-sky" aria-hidden="true">
            <PixelCloud className="cloud-one" />
            <PixelCloud className="cloud-two" />
            <PixelCloud className="cloud-three" />
            <PixelCloud className="cloud-four" />
            <div className="sun" />
          </div>
          <div className="tiny-stars" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>

          <div className="hero-copy">
            <p className="eyebrow" data-reveal>
              <span>WORLD 1–1</span>
              <span>HELLO, WORLD!</span>
            </p>
            <h1 data-reveal>
              I BUILD
              <br />
              <span>AI AGENTS</span>
              <br />
              THAT ACT.
            </h1>
            <p className="intro" data-reveal>
              你好，我是 Lueyu。
              <br />
              一名专注 AI Agent 的程序员，曾就职于 Huawei 与 Subaru R&amp;D。
            </p>
            <a className="pixel-button primary-button" href="#work" data-reveal>
              <span>VIEW MY WORK</span>
              <b aria-hidden="true">→</b>
            </a>
          </div>

          <div className="hero-scene" aria-hidden="true">
            <div className="pixel-tree tree-back">
              <i />
              <b />
            </div>
            <div className="question-block">?</div>
            <div className="brick-row">
              <i />
              <i />
              <i />
            </div>
            <div className="pixel-person">
              <div className="person-head">
                <i />
              </div>
              <div className="person-body" />
              <div className="person-leg left" />
              <div className="person-leg right" />
            </div>
            <div className="pixel-tree tree-front">
              <i />
              <b />
            </div>
            <div className="flag">
              <i />
              <b>HI</b>
            </div>
            <div className="ground">
              {Array.from({ length: 18 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
          </div>

          <a className="scroll-cue" href="#about">
            <span>SCROLL TO START</span>
            <i aria-hidden="true">↓</i>
          </a>
        </section>

        <section className="about section-grid" id="about">
          <div className="section-label" data-reveal>
            <span>01</span>
            <p>ABOUT ME</p>
          </div>

          <div className="about-copy" data-reveal>
            <p className="large-copy">
              我喜欢做<span>清晰、可靠的系统，</span>
              也对新的交互方式保持好奇。
            </p>
            <div className="about-details">
              <p>
                在 Huawei 从事软件研发。现在主要关注 AI
                Agent，以及大模型在实际任务中的应用。
              </p>
              <dl>
                <div>
                  <dt>BASED IN</dt>
                  <dd>CHINA / EARTH</dd>
                </div>
                <div>
                  <dt>CURRENTLY</dt>
                  <dd>BUILDING AI AGENTS</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="about-object" aria-hidden="true" data-reveal>
            <div className="pixel-flower">
              <i className="petal p1" />
              <i className="petal p2" />
              <i className="petal p3" />
              <i className="petal p4" />
              <i className="flower-core" />
              <b />
            </div>
            <div className="pixel-flower flower-two">
              <i className="petal p1" />
              <i className="petal p2" />
              <i className="petal p3" />
              <i className="petal p4" />
              <i className="flower-core" />
              <b />
            </div>
            <div className="pixel-bush">
              <i />
              <i />
            </div>
            <div className="pixel-bee" />
            <span>KEEP GROWING</span>
          </div>

          <a className="scroll-cue section-next" href="#work">
            <span>NEXT PAGE</span>
            <i aria-hidden="true">↓</i>
          </a>
        </section>

        <section className="work" id="work">
          <div className="work-heading section-grid">
            <div className="section-label light" data-reveal>
              <span>02</span>
              <p>SELECTED WORK</p>
            </div>
            <div data-reveal>
              <p className="kicker">THREE FEATURED PROJECTS</p>
              <h2>MAIN QUESTS</h2>
            </div>
          </div>

          <div className="project-grid">
            {featuredProjects.map((project) => (
              <article
                className={`project-card ${project.color}`}
                key={project.number}
                data-reveal
                data-project-slug={project.slug}
              >
                <div className="project-top">
                  <span>{project.number}</span>
                  <span>{project.role}</span>
                </div>
                <div className="project-art" aria-hidden="true">
                  <i />
                  <i />
                  <b>{project.number}</b>
                </div>
                <p className="project-eyebrow">{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <ul className="project-highlights">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                {project.details && (
                  <details className="project-details">
                    <summary>
                      CASE NOTES <span>＋</span>
                    </summary>
                    <p>{project.details}</p>
                  </details>
                )}
                <div className="project-footer">
                  <div>
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <Link
                    className="project-link"
                    to={`/projects/${project.slug}`}
                    aria-label={`打开 ${project.title} 项目详情`}
                  >
                    OPEN <b aria-hidden="true">↗</b>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="more-work">
            <div className="more-work-heading">
              <div>
                <p className="kicker">MORE FROM THE JOURNEY</p>
                <h3>OTHER PROJECTS &amp; EXPERIENCE</h3>
              </div>
              <button
                type="button"
                className="more-work-button"
                onClick={() => setShowMoreWork((value) => !value)}
                aria-expanded={showMoreWork}
                aria-controls="other-projects"
              >
                <span>{showMoreWork ? "HIDE ARCHIVE" : "OPEN ARCHIVE"}</span>
                <b aria-hidden="true">{showMoreWork ? "−" : "+"}</b>
              </button>
            </div>

            <div
              className={`other-projects ${showMoreWork ? "is-visible" : ""}`}
              id="other-projects"
            >
              {otherProjects.map((project, index) => (
                <article className="other-project" key={project.company}>
                  <div className="other-project-index">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <i aria-hidden="true" />
                  </div>
                  <p className="other-project-period">{project.period}</p>
                  <div className="other-project-copy">
                    <p>{project.company}</p>
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                  </div>
                  <div className="other-project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <a className="scroll-cue section-next" href="#contact">
            <span>NEXT PAGE</span>
            <i aria-hidden="true">↓</i>
          </a>
        </section>

        <section className="contact" id="contact">
          <div className="contact-art" aria-hidden="true">
            <PixelCloud />
            <div className="pipe">
              <i />
            </div>
          </div>
          <p className="eyebrow" data-reveal>NEXT LEVEL</p>
          <h2 data-reveal>
            LET’S BUILD
            <br />
            THE NEXT AGENT.
          </h2>
          <p data-reveal>欢迎交流 AI Agent、软件工程，以及正在做的有趣项目。</p>
          <a
            className="pixel-button contact-button"
            href="mailto:lueyuwang@gmail.com"
            data-reveal
          >
            <span>SAY HELLO</span>
            <b aria-hidden="true">→</b>
          </a>
          <a className="scroll-cue section-next" href="#home">
            <span>BACK TO START</span>
            <i aria-hidden="true">↑</i>
          </a>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} LUEYU. BUILT WITH CARE.</p>
        <p>THANKS FOR PLAYING</p>
      </footer>
    </div>
  )
}

export default App
