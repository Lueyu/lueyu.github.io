import { Link } from 'react-router'
import '../daily-portfolio.css'

const domainModules = [
  ['DASHBOARD', 'KPI / 信号 / 盈亏'],
  ['HOLDINGS', '持仓 / 分组 / 敞口'],
  ['WATCHLIST', '关注 / 买入信号'],
  ['ANALYSIS', '每日分析 / 快照'],
  ['JOURNAL', '五段式投资日志'],
  ['CASH · FX', '多币种 / 汇率折算'],
  ['TRANSACTIONS', '交易记录 / 复盘'],
  ['QUOTE', '实时行情聚合'],
  ['ALPHA-PICKS', '外部研报同步'],
]

const reasoningStages = [
  { number: '01', name: 'FETCH', role: '数据取数', description: '行情 / 估值 / 财报 / 新闻；附来源时间戳。' },
  { number: '02', name: 'BULL vs BEAR', role: '多空辩论', description: '各自引用证据，独立论证多空观点。' },
  { number: '03', name: 'CRITIC', role: '审查员', description: '核查数据时效与估值假设。' },
  { number: '04', name: 'RISK GATE', role: '风控闸门', description: '逐条对照已启用的 hard / soft 规则。', highlighted: true },
  { number: '05', name: 'PM', role: '基金经理', description: '输出评级、置信度与可执行操作。' },
]

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

function LayerConnector({ children }: { children: React.ReactNode }) {
  return <div className="dp-layer-connector" aria-hidden="true">↓ {children}</div>
}

export default function DailyPortfolioPage() {
  return (
    <div className="dp-page">
      <header className="dp-nav dp-container">
        <Link to="/">← BACK TO HOME</Link>
        <span>PROJECT FILE / 02</span>
        <span>2025</span>
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

        <section className="dp-system" id="dp-system">
          <div className="dp-container">
            <header className="dp-system-heading">
              <div>
                <p className="dp-system-kicker">SYSTEM MAP / HOW IT FLOWS</p>
                <h2>Inside the terminal.</h2>
                <p>一个会自主分析、评级与风控的多智能体投资终端。</p>
              </div>
              <div className="dp-system-key">
                <strong>PORTFOLIO TERMINAL / SYSTEM ARCHITECTURE</strong>
                <span>REQUEST / REASONING · READ / WRITE</span>
                <span><i aria-hidden="true" /> CORE = INVESTMENT AGENT PIPELINE</span>
              </div>
            </header>

            <div className="dp-layer dp-layer-clients">
              <div className="dp-layer-identity"><span>L1 / CLIENTS</span><strong>多端客户端</strong><p>React 19 · Vite</p></div>
              <div><strong>DESKTOP WEB</strong><p>仪表盘 / 持仓 / 分析 / 规则<br />全功能工作台</p></div>
              <div><strong>MOBILE WEB</strong><p>响应式查看评级与告警<br />桌面 / 手机同账号</p></div>
              <div><strong>UI &amp; VIZ STACK</strong><p>React Router · TanStack Query<br />Tailwind · Radix UI · ECharts<br />Framer Motion</p></div>
            </div>
            <LayerConnector>FEISHU LOGIN / CLIENT SDK</LayerConnector>

            <div className="dp-layer dp-layer-auth">
              <div className="dp-layer-identity"><span>L2 / AUTH &amp; BRIDGE</span><strong>认证与桥接</strong><p>飞书 aPaaS 全栈框架</p></div>
              <div><strong>FEISHU OAUTH</strong><p>飞书账号登录授权<br />无需独立密码</p></div>
              <div><strong>window.__pt BRIDGE</strong><p>客户端 SDK 桥<br />统一异步读写云端</p></div>
              <div><strong>OWNER ISOLATION</strong><p>登录态与数据隔离<br />所有数据按账号 owner 隔离，互不可见。</p></div>
            </div>
            <LayerConnector>RESTful API</LayerConnector>

            <div className="dp-services">
              <div className="dp-backend">
                <div className="dp-backend-heading"><span>L3 / NESTJS BACKEND</span><span>NestJS 10 · 领域模块 + Agent 网关</span></div>
                <div className="dp-domain-grid">
                  {domainModules.map(([name, description]) => <div key={name}><strong>{name}</strong><p>{description}</p></div>)}
                </div>
                <div className="dp-gateway"><strong>MULTI-AGENT GATEWAY</strong><span>编排多角色推理 / 深度报告 / 评级回写 ↓</span></div>
              </div>
              <div className="dp-data-connector" aria-hidden="true"><img src="/images/daily-portfolio/data-access.svg" width="32.4578" height="19.1625" alt="" /></div>
              <div className="dp-data">
                <span>L5 / DATA</span>
                <strong>PostgreSQL</strong>
                <p>Drizzle ORM · 按 owner 隔离</p>
                <div className="dp-data-divider" />
                <p>holdings / watchlist / analysis / snapshots / journal / transactions / strategy_rules / cash_accounts / fx / deep_reports</p>
                <small>业务读写 / 报告保存</small>
              </div>
            </div>
            <LayerConnector>GATEWAY ORCHESTRATION · 评级与报告回写业务层</LayerConnector>

            <div className="dp-engine-core">
              <div className="dp-core-heading">
                <div><span>L4 / MULTI-AGENT ENGINE</span><h3>从证据，到可审查的判断。</h3></div>
                <span className="dp-core-badge">REASONING CORE</span>
              </div>
              <div className="dp-external-inputs">
                <div className="dp-source-card">
                  <span>EXTERNAL INPUTS → FETCH / QUOTE / ALPHA-PICKS</span>
                  <div><p>Tencent Quotes · qt.gtimg.cn<br />Yahoo Finance · query1.finance.yahoo.com</p><p>Sina Finance · hq.sinajs.cn<br />Alpha Picks · pickalphas.com</p></div>
                </div>
                <div className="dp-source-card">
                  <span>LLM PROVIDER → MODEL REASONING</span>
                  <strong>VOLCENGINE ARK / 火山方舟</strong>
                  <p>doubao fast / slow 双档模型<br />ark.cn-beijing.volces.com</p>
                </div>
              </div>
              <div className="dp-stages">
                {reasoningStages.map((stage) => (
                  <div className={`dp-stage ${stage.highlighted ? 'dp-stage-highlight' : ''}`} key={stage.number}>
                    <span>{stage.number} /</span><strong>{stage.name}</strong><b>{stage.role}</b><p>{stage.description}</p>
                  </div>
                ))}
              </div>
              <div className="dp-core-rules">
                <div><strong>DETERMINISTIC RULES / 确定性校验</strong><p>Hard 硬规则：单公司 25% · 小盘 5% · 杠杆 ETF 3% · 跌超 20% 重检<br />Soft 软规则：单股 10%（可启停）</p></div>
                <div><strong>14-SECTION DEEP REPORT / 5-TIER RATING</strong><p>单只 14 板块深度报告，独立保存与展示。<br />Strong Buy / Buy / Hold / Sell / Strong Sell</p></div>
              </div>
            </div>

            <div className="dp-decision">
              <div><strong>MODELS ADVISE. HUMANS DECIDE.</strong><p>模型输出进入业务流程，不替代最终投资决策。</p></div>
              <div className="dp-decision-flow"><span>RATING + REPORT</span><b>→</b><span className="dp-human-review">HUMAN REVIEW<small>人工审核</small></span><b>→</b><span>DECISION</span></div>
            </div>
          </div>
        </section>

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
