import { Link } from 'react-router'
import DailyPortfolioShowcase from './DailyPortfolioShowcase'
import DailyPortfolioSystemMap from './DailyPortfolioSystemMap'
import ThemeToggle from '../components/ThemeToggle'
import '../daily-portfolio.css'
import '../daily-portfolio-updates.css'

const engineeringPractices = [
  ['ISOLATE', '使用容器隔离 Agent 的代码执行环境。'],
  ['RECOVER', '为每次修改保留代码检查点与失败恢复路径。'],
  ['REVIEW', '支持子任务合并、冲突检查和候选变更审阅。'],
  ['VERIFY', '将目标测试与回归测试绑定到当前源码版本，拒绝过期证据。'],
]

const technologies = [
  ['TypeScript', 'LANGUAGE'],
  ['React', 'INTERFACE'],
  ['NestJS', 'BACKEND'],
  ['PostgreSQL', 'DATABASE'],
  ['Python', 'TOOLING'],
  ['Docker', 'ISOLATION'],
  ['Playwright', 'VERIFICATION'],
  ['LLM Tool Calling', 'AGENT TOOLS'],
]

function StoryIndex({ number, label, note }: { number: string; label: string; note?: string }) {
  return (
    <div className="dp-story-index">
      <span className="dp-story-number">{number}</span>
      <span className="dp-story-label">{label}</span>
      <i aria-hidden="true" />
      {note && <p>{note}</p>}
    </div>
  )
}

export default function DailyPortfolioPage() {
  return (
    <div className="dp-page">
      <header className="dp-nav dp-container">
        <Link to="/">← BACK TO HOME</Link>
        <span>PROJECT FILE / 02</span>
        <span>2025</span>
        <ThemeToggle />
      </header>

      <main>
        <section className="dp-intro">
          <div className="dp-container">
            <div className="dp-hero">
              <div className="dp-identity">
                <p className="dp-classification"><i aria-hidden="true" /> <span>FULL-STACK AGENT APP</span> <small>/ INDEPENDENT PROJECT</small></p>
                <h1>Daily<br />Portfolio</h1>
                <p className="dp-subtitle">投资组合分析与 Agent 工作台</p>
                <nav className="dp-hero-links" aria-label="页面章节">
                  <a href="#dp-system">EXPLORE SYSTEM ↓</a>
                  <a href="#dp-engineering">/ ENGINEERING NOTES</a>
                </nav>
              </div>
              <div className="dp-cover" aria-label="Daily Portfolio 项目封面">
                <div className="dp-cover-grid" aria-hidden="true" />
                <span className="dp-cover-top">PORTFOLIO TERMINAL</span>
                <i className="dp-cover-marker dp-cover-marker-top" aria-hidden="true" />
                <img className="dp-cover-diamonds" src="/images/daily-portfolio/nested-diamonds.svg" width="366" height="326" alt="" />
                <strong>02</strong>
                <i className="dp-cover-marker dp-cover-marker-bottom" aria-hidden="true" />
                <span className="dp-cover-bottom">REASON. CHECK. REVIEW.</span>
              </div>
            </div>

            <div className="dp-overview">
              <span>OVERVIEW</span>
              <p>一个集投资组合管理、AI 投研与 Coding Agent 于一体的全栈项目。除了让模型生成分析，我更关心 Agent 如何在真实软件工程中安全地行动、失败和被验收。</p>
            </div>
            <div className="dp-foundations">
              <div><strong>TypeScript</strong><span>END-TO-END TYPES</span></div>
              <div><strong>Multi-agent</strong><span>INVESTMENT REASONING</span></div>
              <div><strong>PostgreSQL</strong><span>OWNER-ISOLATED DATA</span></div>
              <div><strong>Human review</strong><span>BEFORE EVERY DECISION</span></div>
            </div>
          </div>
        </section>

        <DailyPortfolioShowcase />

        <section className="dp-story-section dp-product">
          <div className="dp-container dp-story-grid">
            <StoryIndex number="01" label="THE PRODUCT" />
            <div className="dp-story-content">
              <h2>把投资记录变成可复查的工作流</h2>
              <p>应用支持持仓、交易、研究记录与投资组合分析。行情和持仓进入投研流水线，多角色模型形成分析，再由确定性规则校验和人工审核进入业务流程。</p>
              <div className="dp-ledger">
                <div><span>INPUT</span><strong>持仓与行情</strong><p>保留输入与来源</p></div>
                <div><span>REASON</span><strong>分析与证据</strong><p>让结论可被复查</p></div>
                <div><span>REVIEW</span><strong>规则与人工</strong><p>让决策有据可循</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="dp-story-section dp-engineering" id="dp-engineering">
          <div className="dp-container dp-story-grid">
            <StoryIndex number="02" label="AGENT ENGINEERING" note="本地 Coding Agent 工作台独立于上方投研推理引擎" />
            <div className="dp-story-content">
              <h2>让 Coding Agent 的每一步都可以撤回</h2>
              <p>本地 Agent 工作台用于协助迭代项目源码。Agent 在隔离环境中修改代码，验证结果与源码版本绑定，候选改动只有经过审阅和重新验收后才会应用。</p>
              <div className="dp-engineering-details">
                <ul>{engineeringPractices.map(([name, description]) => <li key={name}><strong>{name}</strong><span>{description}</span></li>)}</ul>
                <div className="dp-protocol">
                  <span>LOCAL CHANGE PROTOCOL</span>
                  <ol><li>SOURCE CHECKPOINT</li><li>ISOLATED CHANGE</li><li>TEST + REVIEW</li><li>RE-VERIFY → APPLY</li></ol>
                  <small>↶ FAILURE → CHECKPOINT</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dp-story-section dp-principle">
          <div className="dp-container dp-story-grid">
            <StoryIndex number="03" label="DESIGN PRINCIPLE" />
            <div className="dp-story-content">
              <h2>模型可以提出改动，<br />系统负责证明它</h2>
              <p>生成能力与验收能力被明确分开：模型负责探索候选方案，确定性工具负责检查，最终应用仍需要可追溯的证据与人工确认。</p>
              <strong className="dp-motto"><i aria-hidden="true" /> GENERATION ≠ VERIFICATION</strong>
            </div>
          </div>
        </section>

        <DailyPortfolioSystemMap />

        <section className="dp-toolbox">
          <div className="dp-container dp-toolbox-grid">
            <div className="dp-toolbox-heading"><span>TOOLBOX</span><h2>Stack &amp;<br />systems.</h2><i aria-hidden="true" /></div>
            <div className="dp-tech-grid">{technologies.map(([name, role]) => <div key={name}><strong>{name}</strong><span>{role}</span></div>)}</div>
          </div>
        </section>

        <footer className="dp-footer dp-container">
          <p className="dp-disclaimer"><i aria-hidden="true" />个人独立开发项目，仍在持续迭代。页面展示的是系统边界与工程方法，而不是投资建议。</p>
          <Link className="dp-next-project" to="/projects/next-quest"><span>NEXT PROJECT</span><strong>To Be Built</strong><b aria-hidden="true">→</b></Link>
          <div className="dp-footer-meta"><span>DAILY PORTFOLIO / PROJECT FILE 02</span><span>BUILT TO BE UNDERSTOOD.</span></div>
        </footer>
      </main>
    </div>
  )
}
