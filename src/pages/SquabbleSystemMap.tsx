const researchSteps = ['FETCH 取数', 'BULL/BEAR 多空辩论', 'CRITIC 审查', 'RISK 风控闸', 'PM 决策']
const paperSteps = ['每日策略', '监控行情', '快速复核', '账本校验', '模拟成交']
const skills = [
  '多空辩论', '批评者审视', '风控硬门', '研究记忆', '失效条件',
  '模拟盘策略', 'MCP 代理下单', '本地 CLI Agent', '多币种折算', '零埋点',
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

export default function SquabbleSystemMap() {
  return (
    <section className="dp-map" id="dp-system" aria-labelledby="dp-map-heading">
      <div className="dp-container">
        <header className="dp-map-heading">
          <div>
            <p className="dp-map-kicker"><i aria-hidden="true" />SYSTEM MAP / DUAL-ENGINE ARCHITECTURE</p>
            <h2 id="dp-map-heading">Squabble / 研究与模拟盘双引擎</h2>
            <p>AI 研报引擎负责辩论与核查，模拟盘引擎负责执行与风控。</p>
          </div>
          <div className="dp-map-legend"><span>SQUABBLE / DUAL-ENGINE ARCHITECTURE</span><span><i aria-hidden="true" /> CORE = RESEARCH &amp; PAPER-TRADING PIPELINES</span></div>
        </header>

        <div className="dp-map-row dp-map-clients">
          <LayerIdentity code="L1 / CLIENTS" title="多形态客户端" note="React 19 · TypeScript" />
          <MapCard title="桌面应用" aside="Windows / macOS"><p>Electron 内置 PostgreSQL 与全部服务，安装即用，数据留在本机</p></MapCard>
          <MapCard title="网页版" aside="Docker Compose"><p>docker compose up -d 一键自托管，支持账号模式与虚构演示数据</p></MapCard>
          <MapCard title="UI &amp; VIZ STACK"><p>React Router · TanStack Query<br />Radix · ECharts · i18next 中英双语</p></MapCard>
        </div>
        <Connector>LOCAL WORKSPACE / ACCOUNT MODE</Connector>

        <div className="dp-map-agents">
          <div className="dp-map-agents-heading"><span className="dp-map-badge">L2 / RESEARCH &amp; TRADING ENGINES CORE</span><p>双引擎共享模型层与事实源，互不越权</p></div>
          <div className="dp-map-agent-grid">
            <div className="dp-map-agent">
              <h3><i aria-hidden="true" />RESEARCH / AI 研报引擎</h3>
              <Pipeline steps={researchSteps} />
              <div className="dp-map-output"><span>14-SECTION DEEP REPORT</span><span>RESEARCH MEMORY</span></div>
              <div className="dp-map-agent-notes"><p>引用核查：无有效依据的论点直接移除</p><p>关键证据缺口强制 Watch/low，不硬给结论</p></div>
            </div>
            <div className="dp-map-agent">
              <h3><i aria-hidden="true" />PAPER / 模拟盘引擎</h3>
              <Pipeline steps={paperSteps} />
              <div className="dp-map-output"><span>PAPER FILLS</span><span>NOTIFICATIONS</span></div>
              <div className="dp-map-agent-notes"><p>风控：日亏损熔断 · 单笔上限 · 只按确认过的策略交易</p><p>暂停即停止全部自动买卖；不连接券商</p></div>
            </div>
          </div>
        </div>
        <Connector>AGENT SURFACE / MCP</Connector>

        <div className="dp-map-row dp-map-two-cards">
          <LayerIdentity code="L3 / AGENT SURFACE" title="智能体接入" note="本地 CLI 与外部 MCP 两条通路" />
          <MapCard title="本地研究 AGENT"><p>Codex · Claude Code · Gemini CLI · Antigravity · OpenCode · Kimi · 豆包 CLI</p><p>只读投研工具与带日期的证据快照；Docker 通过 squabble://pair 配对桌面版</p></MapCard>
          <MapCard title="MCP SERVER / mcp"><p>JSON-RPC 端点：外部 AI 助手可查看持仓与研报、在模拟盘下单</p><p>每个代理独立花费限额、只读/交易权限与审批模式</p></MapCard>
        </div>
        <Connector>NESTJS ORCHESTRATION</Connector>

        <div className="dp-map-row dp-map-two-cards">
          <LayerIdentity code="L4 / SHARED SERVICES &amp; DATA" title="共享服务与数据" note="NestJS 10 编排 · 模块化领域" />
          <MapCard title="NESTJS MODULES"><p>multi-agent · paper-trading · research-memory</p><p>notifications · imports · market-data · settings</p></MapCard>
          <MapCard title="POSTGRESQL + DRIZZLE"><p>业务事实源 · 按 owner 隔离</p><p>API 密钥加密存储，设置接口不回传明文</p></MapCard>
        </div>
        <Connector>EXTERNAL DATA &amp; SERVICES</Connector>

        <div className="dp-map-row dp-map-two-cards dp-map-subrow">
          <LayerIdentity code="EXTERNAL DATA SOURCES" title="外部数据源" note="多市场 / 多币种实时行情" subdued />
          <MapCard title="MARKET SOURCES"><p>TENCENT qt.gtimg.cn<br />YAHOO finance.yahoo.com<br />SINA hq.sinajs.cn<br />FINNHUB 可选：美股财报与新闻</p></MapCard>
          <MapCard title="MODEL &amp; NOTIFY SOURCES"><p>OpenAI 兼容模型 API（用户自己的 key）<br />WEBHOOK · BARK · SERVER酱<br />SMTP 邮件 · TELEGRAM</p></MapCard>
        </div>
        <div className="dp-map-row dp-map-skills dp-map-subrow">
          <LayerIdentity code="AGENT SKILLS &amp; KNOWLEDGE" title="关联技能与知识点" subdued />
          <div className="dp-map-skill-list">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
        <div className="dp-map-decision">
          <div><strong>MODELS ADVISE. HUMANS DECIDE.</strong><p>模型输出进入研究流程，不替代最终投资决策。</p></div>
          <div className="dp-map-decision-flow"><span>RATING + REPORT</span><b>→</b><span className="dp-map-review">HUMAN REVIEW<small>人工审核</small></span><b>→</b><span>YOUR DECISION</span></div>
        </div>
      </div>
    </section>
  )
}
