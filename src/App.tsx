import { useState } from "react"
import AgentPanel from "./components/AgentPanel"
import { Link } from "react-router"

const featuredProjects = [
  {
    number: "01",
    slug: "aidr",
    eyebrow: "AI DATA RESILIENCE",
    title: "AIDR",
    role: "DEEP CONTRIBUTOR",
    description:
      "面向 AI 智能体时代的数据保护平台：按工具调用图计算爆炸半径，把 Agent 与实际读写的数据组成保护组并原子恢复。",
    highlights: ["打通 Agent 观测、归属与备份闭环", "修复 4 个生产级静默失败问题"],
    details:
      "完成 15 容器生产栈部署、OpenCode × Langfuse 观测链路、restic 备份设备适配器与 K8s 迁移方案；通过独立分支、防回归单测、分层 E2E 和合规报告交付 PR #47–#50。",
    tags: ["OTEL", "LANGFUSE", "RESTIC", "K8S"],
    color: "red",
  },
  {
    number: "02",
    slug: "daily-portfolio",
    eyebrow: "FULL-STACK AGENT APP",
    title: "Daily Portfolio",
    role: "INDEPENDENT PROJECT",
    description:
      "集投资组合管理、AI 投研与 Coding Agent 于一体的全栈工作台，覆盖持仓、交易、研究记录与组合分析。",
    highlights: ["隔离执行、代码检查点与失败恢复", "测试证据与源码版本强绑定"],
    details:
      "多角色模型生成投研分析，再由确定性规则与人工审核进入业务流程。Coding Agent 在容器内修改代码，候选变更经过冲突检查、审阅与独立复验后应用。",
    tags: ["REACT", "NESTJS", "PYTHON", "POSTGRES"],
    color: "green",
  },
  {
    number: "03",
    slug: "next-quest",
    eyebrow: "NEXT QUEST",
    title: "To Be Built",
    role: "RESERVED SLOT",
    description:
      "第三个主要项目正在整理中。这里会留给一个值得完整讲述的问题、过程和结果。",
    highlights: ["问题要真实", "过程可复现"],
    details: "",
    tags: ["SOON", "EXPERIMENT"],
    color: "blue",
  },
]

const otherProjects = [
  {
    period: "2024 — NOW",
    company: "Huawei",
    title: "Infrastructure & Automation",
    description:
      "参与智能数据存储基础设施与关键特性研发，负责测试自动化基础设施、CI/CD 构建链路与团队交付协作。",
    tags: ["KUBERNETES", "C++", "AUTOMATION"],
  },
  {
    period: "2023 — 2024",
    company: "Subaru R&D",
    title: "Driver Research Platform",
    description:
      "构建数据与访问密集型云应用，结合视觉、文本与驾驶模拟进行用户意图分析，支持研究决策。",
    tags: ["PYTHON", "OPENCV", "REACT", "DJANGO"],
  },
  {
    period: "2022 — 2023",
    company: "Earlier Work",
    title: "Internships & Research",
    description:
      "在 Irdelta、CryoHub 与研究实验室完成自动化测试、全栈数据工具及机器学习相关项目。",
    tags: ["APPIUM", "FULL-STACK", "ML"],
  },
]

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
          <PixelCloud className="cloud-one" />
          <PixelCloud className="cloud-two" />
          <div className="tiny-stars" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>

          <div className="hero-copy">
            <p className="eyebrow">
              <span>WORLD 1–1</span>
              <span>HELLO, WORLD!</span>
            </p>
            <h1>
              I BUILD
              <br />
              <span>AI AGENTS</span>
              <br />
              THAT ACT.
            </h1>
            <p className="intro">
              你好，我是 Lueyu。
              <br />
              一名专注 AI Agent 的程序员，曾就职于 Huawei 与 Subaru R&amp;D。
            </p>
            <a className="pixel-button primary-button" href="#work">
              <span>VIEW MY WORK</span>
              <b aria-hidden="true">→</b>
            </a>
          </div>

          <div className="hero-scene" aria-hidden="true">
            <div className="sun" />
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
          <div className="section-label">
            <span>01</span>
            <p>ABOUT ME</p>
          </div>

          <div className="about-copy">
            <p className="large-copy">
              我喜欢做<span>清晰、可靠的系统，</span>
              也对新的交互方式保持好奇。
            </p>
            <div className="about-details">
              <p>
                曾在 Huawei 和 Subaru R&amp;D 从事软件研发。现在主要关注 AI
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

          <div className="about-object" aria-hidden="true">
            <div className="pixel-flower">
              <i className="petal p1" />
              <i className="petal p2" />
              <i className="petal p3" />
              <i className="petal p4" />
              <i className="flower-core" />
              <b />
            </div>
            <span>KEEP GROWING</span>
          </div>
        </section>

        <section className="work" id="work">
          <div className="work-heading section-grid">
            <div className="section-label light">
              <span>02</span>
              <p>SELECTED WORK</p>
            </div>
            <div>
              <p className="kicker">THREE FEATURED PROJECTS</p>
              <h2>MAIN QUESTS</h2>
            </div>
          </div>

          <div className="project-grid">
            {featuredProjects.map((project) => (
              <article
                className={`project-card ${project.color}`}
                key={project.number}
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
        </section>

        <section className="contact" id="contact">
          <div className="contact-art" aria-hidden="true">
            <PixelCloud />
            <div className="pipe">
              <i />
            </div>
          </div>
          <p className="eyebrow">NEXT LEVEL</p>
          <h2>
            LET’S BUILD
            <br />
            THE NEXT AGENT.
          </h2>
          <p>欢迎交流 AI Agent、软件工程，以及正在做的有趣项目。</p>
          <a
            className="pixel-button contact-button"
            href="mailto:lueyuwang@gmail.com"
          >
            <span>SAY HELLO</span>
            <b aria-hidden="true">→</b>
          </a>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} LUEYU. BUILT WITH CARE.</p>
        <p>THANKS FOR PLAYING</p>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>

      <AgentPanel />
    </div>
  )
}

export default App
