import { useState } from "react"

const projects = [
  {
    number: "01",
    title: "Agent Lab",
    description: "探索 AI Agent 的规划、工具调用与多智能体协作。",
    tags: ["AGENT", "LLM"],
    color: "red",
  },
  {
    number: "02",
    title: "Engineering",
    description: "来自真实业务场景的软件工程实践与系统思考。",
    tags: ["SYSTEM", "CODE"],
    color: "green",
  },
  {
    number: "03",
    title: "Experiments",
    description: "围绕模型能力、人机协作与开发体验的技术实验。",
    tags: ["AI", "MAKING"],
    color: "blue",
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
  const [isAgentOpen, setIsAgentOpen] = useState(false)

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
              <p className="kicker">WHAT I’M WORKING ON</p>
              <h2>AI QUESTS</h2>
            </div>
          </div>

          <div
            className="project-grid"
            role="region"
            aria-label="项目列表，窄屏时可横向滚动"
            tabIndex={0}
          >
            {projects.map((project) => (
              <article
                className={`project-card ${project.color}`}
                key={project.number}
              >
                <div className="project-top">
                  <span>{project.number}</span>
                  <span className="coin" aria-hidden="true" />
                </div>
                <div className="project-art" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-footer">
                  <div>
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <b aria-hidden="true">↗</b>
                </div>
              </article>
            ))}
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

      <aside className={`floating-agent ${isAgentOpen ? "is-open" : ""}`}>
        <div
          className="agent-panel"
          id="agent-panel"
          aria-hidden={!isAgentOpen}
          inert={!isAgentOpen}
        >
          <div className="agent-panel-head">
            <div className="agent-identity">
              <div className="agent-mini-avatar" aria-hidden="true">
                <i />
                <b />
              </div>
              <div>
                <strong>LUEYU AGENT</strong>
                <span>
                  <i />
                  STANDBY
                </span>
              </div>
            </div>
            <button
              type="button"
              className="agent-close"
              onClick={() => setIsAgentOpen(false)}
              aria-label="关闭 Agent 窗口"
            >
              ×
            </button>
          </div>

          <div className="agent-conversation">
            <p className="agent-message">
              你好，我是 Lueyu 的个人 Agent。
              <br />
              现在还在训练中，很快就能和你聊聊他的工作与想法。
            </p>
            <p className="agent-prompt-label">FUTURE QUESTS</p>
            <div className="agent-quests">
              <span>了解他的工作</span>
              <span>聊聊 AI Agent</span>
              <span>留下联系方式</span>
            </div>
          </div>

          <div className="agent-compose">
            <span>COMING SOON...</span>
            <button type="button" disabled aria-label="发送功能即将开放">
              →
            </button>
          </div>
        </div>

        <div className="agent-hint" aria-hidden={isAgentOpen}>
          <span>MEET MY AGENT</span>
          <i />
        </div>

        <button
          className="agent-trigger"
          type="button"
          onClick={() => setIsAgentOpen((value) => !value)}
          aria-expanded={isAgentOpen}
          aria-controls="agent-panel"
          aria-label={isAgentOpen ? "收起个人 Agent" : "打开个人 Agent"}
        >
          <span className="agent-antenna" aria-hidden="true" />
          <span className="agent-face" aria-hidden="true">
            <i />
            <i />
            <b />
          </span>
          <span className="agent-body" aria-hidden="true">
            AI
          </span>
          <span className="agent-status" aria-hidden="true" />
        </button>
      </aside>
    </div>
  )
}

export default App
