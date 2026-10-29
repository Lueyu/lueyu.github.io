const ingestSteps = ['DIFY DB 轮询', 'SNAPSHOT DIFF', 'POST /discovery', 'UPSERT 事务', 'PG 重算']
const otelSteps = ['OTLP span', 'MINIO 原始', 'WORKER 解析', 'CLICKHOUSE 落库']
const riskSteps = ['未标记观察', '规则链判定', 'VERDICT 映射', 'RISK 写回']

function LayerIdentity({ code, title, note, subdued = false }: { code: string; title: string; note?: string; subdued?: boolean }) {
  return (
    <div className={`ad-map-identity${subdued ? ' ad-map-identity-subdued' : ''}`}>
      <span>{code}</span>
      <strong>{title}</strong>
      {note && <p>{note}</p>}
    </div>
  )
}

function MapCard({ title, children, aside }: { title: string; children: React.ReactNode; aside?: string }) {
  return (
    <div className="ad-map-card">
      <div className="ad-map-card-heading"><strong>{title}</strong>{aside && <small>{aside}</small>}</div>
      <div className="ad-map-card-body">{children}</div>
    </div>
  )
}

function Pipeline({ steps }: { steps: string[] }) {
  return <div className="ad-map-pipeline">{steps.map((step, index) => <span key={step}>{index > 0 && <b aria-hidden="true">→</b>}{step}</span>)}</div>
}

function Connector({ children }: { children: React.ReactNode }) {
  return <div className="ad-map-connector" aria-hidden="true">↓ {children}</div>
}

export default function AidrSystemMap() {
  return (
    <section className="ad-map" id="ad-system" aria-labelledby="ad-map-heading">
      <div className="ad-container">
        <header className="ad-map-heading">
          <div>
            <p className="ad-map-kicker"><i aria-hidden="true" />ARCHITECTURE MAP / 16 CONTAINERS, ONE NETWORK</p>
            <h2 id="ad-map-heading">AIDR / 系统架构</h2>
            <p>五层：前端与观测台 → 网关 → 五个领域服务 → 数据与观测栈 → 外部集群。</p>
          </div>
          <div className="ad-map-legend"><span>AIDR PLATFORM TOPOLOGY</span><span><i aria-hidden="true" /> OTLP + REST 全链路真实数据</span></div>
        </header>

        <div className="ad-map-row ad-map-clients">
          <LayerIdentity code="L1 / CLIENTS" title="前端与观测台" note="React 18 · Vite 6173" />
          <MapCard title="AIDR 控制台" aside="localhost:6173"><p>发现面 / 保护组 / 分析 / 恢复 / 系统，react-query 全量走网关 JWT</p></MapCard>
          <MapCard title="Langfuse UI" aside=":3001"><p>原始 OTLP 浏览、span 检索，与 AIDR 分析面互补</p></MapCard>
          <MapCard title="AUTH PATH"><p>POST /auth/login → JWT RS256<br />localStorage + 路由守卫</p></MapCard>
        </div>
        <Connector>JWT RS256 · 路由 · 限流 · 防爆破锁定</Connector>

        <div className="ad-map-row ad-map-gateway">
          <LayerIdentity code="L2 / GATEWAY" title="web-gateway" note=":8080 唯一入口" />
          <MapCard title="API ROUTING"><p>/api/discovery → :8082 · /api/langfuse → :8085 · /system → :8081</p></MapCard>
          <MapCard title="SECURITY"><p>JWT RS256 签名密钥持久卷 · Redis 滑窗限流 · 登录失败锁定</p></MapCard>
        </div>
        <Connector>按路径前缀分发到五个领域服务</Connector>

        <div className="ad-map-row ad-map-services">
          <LayerIdentity code="L3 / DOMAIN SERVICES" title="五个领域服务" note="Java 21 · Spring Boot 3.2" />
          <MapCard title="discovery" aside=":8082"><p>摄取端点 · 集群数据 API · 保护组重算</p></MapCard>
          <MapCard title="protection-restore" aside=":8083"><p>保护组 CRUD · 元数据</p></MapCard>
          <MapCard title="analysis" aside=":8084"><p>漂移检测调度（5s）· risk_level 写回</p></MapCard>
          <MapCard title="langfuse-service" aside=":8085"><p>读时富化 · 三级归属 · ClickHouse+PG 联查</p></MapCard>
          <MapCard title="system" aside=":8081"><p>系统面板 · license/token 用量叠加</p></MapCard>
        </div>
        <Connector>SCHEMA-PER-SERVICE · 各服务独立存储边界</Connector>

        <div className="ad-map-row ad-map-data">
          <LayerIdentity code="L4 / DATA &amp; OBSERVABILITY" title="数据与观测栈" note="AIDR 自有 Langfuse 全套" />
          <MapCard title="POSTGRES"><p>6 schema：auth / discovery / protection_restore / analysis / system / langfuse</p></MapCard>
          <MapCard title="CLICKHOUSE + MINIO"><p>traces · observations 分析库<br />raw OTLP blob 存储</p></MapCard>
          <MapCard title="REDIS · KAFKA"><p>限流与锁定 · KRaft 事件总线（:9092 + :9093）</p></MapCard>
        </div>
        <Connector>外部数据源与两条摄取流</Connector>

        <div className="ad-map-row ad-map-external">
          <LayerIdentity code="L5 / EXTERNAL SOURCES" title="外部集群与接入" note="无 mock，全部真实链路" subdued />
          <MapCard title="DIFY 集群 + dify-connector"><p>60s 轮询 app 配置 → IngestRequest 发布；可选 trace 富化（provider 归属）</p></MapCard>
          <MapCard title="OPENCODE AGENT"><p>官方 Langfuse 插件导出 OTLP（turn / generation / 工具 span）</p></MapCard>
          <MapCard title="RESTIC 仓库"><p>零依赖适配器翻译 4 端点契约：快照→资源 · 去重→用量</p></MapCard>
        </div>

        <div className="ad-map-flows">
          <div className="ad-map-flow"><h4><i aria-hidden="true" />发现摄取流</h4><Pipeline steps={ingestSteps} /></div>
          <div className="ad-map-flow"><h4><i aria-hidden="true" />观测落库流</h4><Pipeline steps={otelSteps} /></div>
          <div className="ad-map-flow"><h4><i aria-hidden="true" />风险检测流（5s）</h4><Pipeline steps={riskSteps} /></div>
        </div>

        <div className="ad-map-decision">
          <div><strong>RESTORE IS A UNIT.</strong><p>恢复以保护组为单位：业务数据与 Agent 上下文在同一时间点原子回滚。</p></div>
          <div className="ad-map-decision-flow"><span>BLAST RADIUS</span><b>→</b><span className="ad-map-review">PROTECTION GROUP<small>稳定哈希</small></span><b>→</b><span>ATOMIC RESTORE</span></div>
        </div>
      </div>
    </section>
  )
}
