const financeSteps = ['FETCH 取数', 'BULL/BEAR 多空辩论', 'CRITIC 审查', 'RISK 风控闸', 'PM 决策']
const coderSteps = ['REACT LOOP 推理-行动', 'TOOL CALL 工具校验', 'OBSERVE 真实观察', 'VERIFY 版本验证']
const skills = [
  'MCP 工具协议', 'Skills 项目技能', 'ReAct 推理-行动', 'Checkpoint 可逆变更', 'Memory 记忆',
  '多角色辩论', '风控闸门', '三情景定价', '子 Agent 编排', '证据驱动进化',
]

function LayerIdentity({ code, title, note, subdued = false }: { code: string; title: string; note?: string; subdued?: boolean }) {
  return (
    <div className={`dp-map-identity${subdued ? ' dp-map-identity-subdued' : ''}`}>
      <span>{code}</span>
      <strong>{title}</strong>
      {note && <p>{note}</p>}
    </div>
  )
}

function MapCard({ title, children, aside }: { title: string; children: React.ReactNode; aside?: string }) {
  return (
    <div className="dp-map-card">
      <div className="dp-map-card-heading"><strong>{title}</strong>{aside && <small>{aside}</small>}</div>
      <div className="dp-map-card-body">{children}</div>
    </div>
  )
}

function Pipeline({ steps }: { steps: string[] }) {
  return <div className="dp-map-pipeline">{steps.map((step, index) => <span className="dp-map-step-pair" key={step}>{index > 0 && <b aria-hidden="true">→</b>}<span>{step}</span></span>)}</div>
}

function Connector({ children }: { children: React.ReactNode }) {
  return <div className="dp-map-connector" aria-hidden="true">↓ {children}</div>
}

export default function DailyPortfolioSystemMap() {
  return (
    <section className="dp-map" id="dp-system" aria-labelledby="dp-map-heading">
      <div className="dp-container">
        <header className="dp-map-heading">
          <div>
            <p className="dp-map-kicker"><i aria-hidden="true" />SYSTEM MAP / DUAL-AGENT ARCHITECTURE</p>
            <h2 id="dp-map-heading">Portfolio Terminal / 双智能体架构</h2>
            <p>金融 Multi-Agent 负责决策，Coding Agent 负责构建与进化。</p>
          </div>
          <div className="dp-map-legend"><span>PORTFOLIO TERMINAL / DUAL-AGENT ARCHITECTURE</span><span><i aria-hidden="true" /> CORE = FINANCE &amp; CODER AGENT PIPELINES</span></div>
        </header>

        <div className="dp-map-row dp-map-clients">
          <LayerIdentity code="L1 / CLIENTS" title="多端客户端" note="React 19 · Vite" />
          <MapCard title="投资工作台" aside="portfolio.app/"><p>仪表盘 / 持仓 / 分析 / 日志 / 规则，全功能投研工作台</p></MapCard>
          <MapCard title="开发工作台" aside="portfolio.app/dev"><p>Coding Agent 任务、审批与工件</p></MapCard>
          <MapCard title="UI &amp; VIZ STACK"><p>React Router · TanStack Query<br />Tailwind · Radix · ECharts · Framer Motion</p></MapCard>
        </div>
        <Connector>FEISHU LOGIN / CLIENT SDK</Connector>

        <div className="dp-map-agents">
          <div className="dp-map-agents-heading"><span className="dp-map-badge">L2 / AGENT ENGINES CORE</span><p>双智能体引擎，共享模型层分工协作</p></div>
          <div className="dp-map-agent-grid">
            <div className="dp-map-agent">
              <h3><i aria-hidden="true" />FINANCE / 金融 Multi-Agent</h3>
              <Pipeline steps={financeSteps} />
              <div className="dp-map-output"><span>14-SECTION DEEP REPORT</span><span>5-TIER RATING</span></div>
              <div className="dp-map-agent-notes"><p>hard：单公司 25% · 小盘 5% · 杠杆 3% · 跌 20% 重检</p><p>soft：单股 10%（可启停）</p></div>
            </div>
            <div className="dp-map-agent">
              <h3><i aria-hidden="true" />CODER / Coding Agent</h3>
              <Pipeline steps={coderSteps} />
              <div className="dp-map-output"><span>HARNESS 源码工作区</span><span>RUNTIME 容器/终端/浏览器</span></div>
              <div className="dp-map-agent-notes"><p>CHECKPOINTS：每次变更可逆，失败回滚</p><p>WORKERS：隔离子 Agent 与合并</p></div>
            </div>
          </div>
        </div>
        <Connector>SHARED MODELS &amp; SERVICES</Connector>

        <div className="dp-map-row dp-map-two-cards">
          <LayerIdentity code="L3 / SHARED MODELS &amp; SERVICES" title="共享模型与服务" note="NestJS 10 编排 · 模型路由" />
          <MapCard title="MODEL ROUTER"><p>火山方舟 Ark · doubao fast/slow + vision，OpenAI 兼容、重试</p></MapCard>
          <MapCard title="NESTJS ORCHESTRATION"><p>领域模块 + dev-agent 进程编排</p><p>MEMORY · EXTENSIONS：计划 / 记忆 / 审批 / 实时消息</p></MapCard>
        </div>
        <Connector>DATA &amp; EVOLUTION</Connector>

        <div className="dp-map-row dp-map-two-cards">
          <LayerIdentity code="L4 / DATA &amp; EVOLUTION" title="数据与进化" note="业务库 + 本地任务工件" />
          <MapCard title="POSTGRESQL"><p>Drizzle ORM · 按 owner 隔离 · 业务事实源</p></MapCard>
          <MapCard title="AGENT / DATA"><p>任务、checkpoint、对话与工件</p><p>EVOLUTION：证据验证 · 自进化数据基础</p></MapCard>
        </div>

        <div className="dp-map-row dp-map-two-cards dp-map-subrow">
          <LayerIdentity code="EXTERNAL DATA SOURCES" title="外部数据源" note="多时区 / 多币种实时行情" subdued />
          <MapCard title="MARKET SOURCES"><p>TENCENT qt.gtimg.cn<br />YAHOO finance.yahoo.com<br />SINA hq.sinajs.cn</p></MapCard>
          <MapCard title="MODEL &amp; RESEARCH SOURCES"><p>VOLCENGINE ark.cn-beijing.volces.com<br />ALPHA PICKS pickalphas.com</p></MapCard>
        </div>
        <div className="dp-map-row dp-map-skills dp-map-subrow">
          <LayerIdentity code="AGENT SKILLS &amp; KNOWLEDGE" title="关联技能与知识点" subdued />
          <div className="dp-map-skill-list">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
        <div className="dp-map-decision">
          <div><strong>MODELS ADVISE. HUMANS DECIDE.</strong><p>模型输出进入业务流程，不替代最终投资决策。</p></div>
          <div className="dp-map-decision-flow"><span>RATING + REPORT</span><b>→</b><span className="dp-map-review">HUMAN REVIEW<small>人工审核</small></span><b>→</b><span>DECISION</span></div>
        </div>
      </div>
    </section>
  )
}
