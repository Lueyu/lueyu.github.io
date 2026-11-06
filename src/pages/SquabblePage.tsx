import { Link } from 'react-router'
import SquabbleShowcase from './SquabbleShowcase'
import SquabbleSystemMap from './SquabbleSystemMap'
import '../daily-portfolio.css'
import '../daily-portfolio-updates.css'
import '../project-reading.css'

const engineeringPractices = [
  ['VERSIONED', '论点、依据、反证与失效条件按版本演进。'],
  ['FALSIFIABLE', '每条论点必须挂可核验的依据与失效条件。'],
  ['AUDITABLE', '每轮研究实际发送了哪些记忆可复查。'],
  ['SEPARATED', 'Agent 审核通过与你的个人确认分开记录。'],
]

const technologies = [
  ['TypeScript', 'LANGUAGE'],
  ['React', 'INTERFACE'],
  ['NestJS', 'BACKEND'],
  ['PostgreSQL', 'DATABASE'],
  ['Drizzle', 'ORM'],
  ['Electron', 'DESKTOP'],
  ['Docker', 'SELF-HOSTING'],
  ['MCP', 'AGENT API'],
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

export default function SquabblePage() {
  return (
    <div className="dp-page">
      <header className="dp-nav dp-container">
        <Link to="/">← BACK TO HOME</Link>
        <span>PROJECT FILE / 02</span>
        <span>2026</span>
      </header>

      <main id="project-content" tabIndex={-1}>
        <section className="dp-intro">
          <div className="dp-container">
            <div className="dp-hero">
              <div className="dp-identity">
                <p className="dp-classification"><i aria-hidden="true" /> <span>OPEN-SOURCE AGENT WORKBENCH</span> <small>/ INDEPENDENT PROJECT</small></p>
                <h1>Squabble<br />吵股</h1>
                <p className="dp-subtitle">开源投资研究工作台 · 让 AI 替你吵，你来定</p>
                <nav className="dp-hero-links" aria-label="页面章节">
                  <a href="#dp-system">EXPLORE SYSTEM ↓</a>
                  <a href="#dp-engineering">/ RESEARCH MEMORY</a>
                  <a href="https://github.com/Lueyu/squabble" target="_blank" rel="noopener noreferrer">/ SOURCE CODE ↗</a>
                </nav>
              </div>
              <div className="dp-cover" aria-label="Squabble 项目封面">
                <div className="dp-cover-grid" aria-hidden="true" />
                <span className="dp-cover-top">INVESTING WORKBENCH</span>
                <i className="dp-cover-marker dp-cover-marker-top" aria-hidden="true" />
                <img className="dp-cover-diamonds" src="/images/squabble/nested-diamonds.svg" width="366" height="326" alt="" />
                <strong>02</strong>
                <i className="dp-cover-marker dp-cover-marker-bottom" aria-hidden="true" />
                <span className="dp-cover-bottom">DEBATE. VERIFY. DECIDE.</span>
              </div>
            </div>

            <div className="dp-overview">
              <span>OVERVIEW</span>
              <p>多头、空头和批评者审视你的想法，风控规则作为硬门把关，输出正反论点完整保留的 14 节研报；研究记忆按版本沉淀论点、依据与失效条件；模拟盘只执行你确认过的策略。美股 · 港股 · A 股，中英双语，自托管，零埋点。</p>
            </div>
            <div className="dp-foundations">
              <div><strong>Bull × Bear</strong><span>多空辩论 + 批评者</span></div>
              <div><strong>Research Memory</strong><span>版本化论点与失效条件</span></div>
              <div><strong>Paper Trading</strong><span>硬风控 + 自动模拟成交</span></div>
              <div><strong>Self-hosted</strong><span>桌面版 · Docker · 零埋点</span></div>
            </div>
          </div>
        </section>

        <SquabbleShowcase />

        <section className="dp-story-section dp-product">
          <div className="dp-container dp-story-grid">
            <StoryIndex number="01" label="THE PRODUCT" />
            <div className="dp-story-content">
              <h2>让 AI 替你吵，你来定</h2>
              <p>持仓管理、AI 研报、研究记忆与模拟炒股共用一条流水线：行情和持仓进入多空辩论，批评者移除站不住脚的论点，确定性风控规则作为硬门，最终报告交给你拍板。</p>
              <div className="dp-ledger">
                <div><span>DEBATE</span><strong>多空与批评者</strong><p>输掉的论点原文保留</p></div>
                <div><span>VERIFY</span><strong>风控与证据</strong><p>缺数据就写缺数据</p></div>
                <div><span>DECIDE</span><strong>你来拍板</strong><p>报告进入决策，不替代决策</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="dp-story-section dp-engineering" id="dp-engineering">
          <div className="dp-container dp-story-grid">
            <StoryIndex number="02" label="RESEARCH MEMORY" note="研究记忆与研究流水线共享同一份论点版本" />
            <div className="dp-story-content">
              <h2>论点有版本，记忆可审计</h2>
              <p>研究记忆按版本保存论点、依据、反证、失效条件和时间边界。每轮研究实际发送了哪些记忆、省略了什么、为什么省略，全部可以复查；Agent 审核通过与你的个人确认分开记录，未知来源永远不会变成已核验事实。</p>
              <div className="dp-engineering-details">
                <ul>{engineeringPractices.map(([name, description]) => <li key={name}><strong>{name}</strong><span>{description}</span></li>)}</ul>
                <div className="dp-protocol">
                  <span>RESEARCH MEMORY PROTOCOL</span>
                  <ol><li>THESIS</li><li>EVIDENCE</li><li>COUNTER</li><li>INVALID_IF</li><li>ARCHIVE</li></ol>
                  <small>↶ TRIGGERED CONDITIONS STAY IN HISTORY</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dp-story-section dp-principle">
          <div className="dp-container dp-story-grid">
            <StoryIndex number="03" label="DESIGN PRINCIPLE" />
            <div className="dp-story-content">
              <h2>模型建议，<br />你拍板</h2>
              <p>生成与执行被明确分开：模型负责辩论与提出策略，确定性规则负责风控硬门与账本校验，自动执行只发生在模拟盘，策略应用沿用「应用到模拟盘」的授权机制。</p>
              <strong className="dp-motto"><i aria-hidden="true" /> MODELS ADVISE. HUMANS DECIDE.</strong>
            </div>
          </div>
        </section>

        <SquabbleSystemMap />

        <section className="dp-toolbox">
          <div className="dp-container dp-toolbox-grid">
            <div className="dp-toolbox-heading"><span>TOOLBOX</span><h2>Stack &amp;<br />systems.</h2><i aria-hidden="true" /></div>
            <div className="dp-tech-grid">{technologies.map(([name, role]) => <div key={name}><strong>{name}</strong><span>{role}</span></div>)}</div>
          </div>
        </section>

        <footer className="dp-footer dp-container">
          <p className="dp-disclaimer"><i aria-hidden="true" />开源项目（Lueyu/squabble · MIT）。研究输出不构成投资建议；模拟盘结果不代表真实收益。页面展示的是系统边界与工程方法。</p>
          <Link className="dp-next-project" to="/projects/next-quest"><span>NEXT PROJECT</span><strong>To Be Built</strong><b aria-hidden="true">→</b></Link>
          <div className="dp-footer-meta"><span>SQUABBLE / PROJECT FILE 02</span><span>LET AI ARGUE. YOU DECIDE.</span></div>
        </footer>
      </main>
    </div>
  )
}
