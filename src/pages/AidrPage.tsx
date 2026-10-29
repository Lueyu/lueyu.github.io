import { useState } from 'react'
import { Link } from 'react-router'
import AidrSystemMap from './AidrSystemMap'
import ThemeToggle from '../components/ThemeToggle'
import Lightbox from '../components/Lightbox'
import '../aidr.css'

const foundations = [
  ['Blast radius', 'TOOL-CALL GRAPH → 影响面'],
  ['Protection groups', 'AGENT + 资源，原子恢复单元'],
  ['OTel discovery', '轨迹自动发现与归属'],
  ['Atomic restore', '数据与上下文一起回滚'],
]

const liveStats = [
  ['13', 'AGENTS 发现'],
  ['22', 'TOOLS 工具'],
  ['3', 'PG 保护组'],
  ['122', 'TRACES 轨迹'],
  ['2113', 'SPANS 观察'],
]

const shots = [
  ['/images/aidr/02-discovery.png', 'DISCOVERY / 发现面', '13 个 agent 的自动发现、资产元数据与 OTel 工作台'],
  ['/images/aidr/03-protection-groups.png', 'PROTECTION GROUPS / 保护组', '按爆炸半径形成的三个保护组与备份策略'],
  ['/images/aidr/04-analysis.png', 'ANALYSIS / 行为分析', '122 条真实轨迹、2113 个 span 与风险分级'],
  ['/images/aidr/05-restore.png', 'RESTORE / 恢复', '恢复点时间线、一致性快照与爆炸半径确认'],
  ['/images/aidr/07-detection-policy.png', 'DETECTION POLICY / 检测策略', '可插拔规则链把工具调用实时映射为风险等级'],
  ['/images/aidr/06-system.png', 'SYSTEM / 系统面板', '五个服务的健康度、部署环境与用量'],
]

const mechanism = [
  'INGEST 摄取', 'UPSERT 幂等入库', 'BIPARTITE 二部图', 'BFS 连通分量', 'STABLE HASH 稳定组 ID', 'ATOMIC RESTORE 原子恢复',
]

const silentFailures = [
  ['PR #47', 'Langfuse × ClickHouse 序列化不兼容', 'OTLP 事件全部静默丢弃', '类型映射修复 + 回归测试'],
  ['PR #48', '风险评分表 DDL 双违规', '评分链路整体失效', '迁移修正 + 数据回填'],
  ['PR #49', '轨迹归属表达式缺 fallback', '多平台 trace 落入影子桶', '三级归属 fallback'],
  ['PR #50', 'PG 重算引用死表', '保护组自部署起从未生效', '修表引用 + 端到端重算验证'],
]

const infraWork = [
  ['K8S', 'kind 全流程迁移：8 Pod 全 Running，6 个部署坑（多架构镜像、缺失 Secret、空 env、拉取策略、KRaft 9093、langfuse-service 缺席）逐一实测修复'],
  ['RESTIC', '自写零依赖适配器把 restic 仓库翻译成备份设备契约（4 个 REST 端点）：快照 → 资源、去重存储 → 用量，备份-注册-映射-保护组自动形成全链路跑通'],
  ['OTEL', 'OpenCode × Langfuse 观测链路：官方插件导出 OTLP，Tier-0 按 service.name 自动归属，Agent 真实工作轨迹（138+ span）直接进入分析面'],
  ['E2E', '分层 E2E（EN+ZH 双语）+ 防回归单测 + 合规测试报告，四个修复各自独立分支交付'],
]

const technologies = [
  ['Java 21', 'CORE SERVICES'],
  ['Spring Boot 3.2', 'BACKEND'],
  ['React 18', 'INTERFACE'],
  ['TypeScript', 'LANGUAGE'],
  ['Vite', 'TOOLING'],
  ['PostgreSQL', '6 SCHEMAS'],
  ['ClickHouse', 'TRACE STORE'],
  ['Redis', 'RATE LIMIT'],
  ['Kafka KRaft', 'EVENT BUS'],
  ['Langfuse', 'OBSERVABILITY'],
  ['OpenTelemetry', 'TRACES'],
  ['restic', 'BACKUP ENGINE'],
  ['Docker', '15 CONTAINERS'],
  ['Kubernetes', 'KIND MIGRATION'],
  ['Playwright', 'E2E'],
  ['JWT RS256', 'AUTH'],
]

function StoryIndex({ number, label, note }: { number: string; label: string; note?: string }) {
  return (
    <div className="ad-story-index">
      <span className="ad-story-number">{number}</span>
      <span className="ad-story-label">{label}</span>
      <i aria-hidden="true" />
      {note && <p>{note}</p>}
    </div>
  )
}

export default function AidrPage() {
  const [zoom, setZoom] = useState<{ src: string; caption: string } | null>(null)

  return (
    <div className="ad-page">
      <header className="ad-nav ad-container">
        <Link to="/">← BACK TO HOME</Link>
        <span>PROJECT FILE / 01</span>
        <span>2026</span>
        <ThemeToggle />
      </header>

      <main>
        <section className="ad-intro">
          <div className="ad-container">
            <div className="ad-hero">
              <div className="ad-identity">
                <p className="ad-classification"><i aria-hidden="true" /> <span>AI DATA RESILIENCE PLATFORM</span> <small>/ DEEP CONTRIBUTOR</small></p>
                <h1>AIDR</h1>
                <p className="ad-subtitle">按工具调用图计算爆炸半径，<br />把 Agent 与数据作为一个原子单元保护。</p>
                <nav className="ad-hero-links" aria-label="页面章节">
                  <a href="#ad-shots">LIVE SCREENS ↓</a>
                  <a href="#ad-system">/ ARCHITECTURE MAP</a>
                  <a href="#ad-hardening">/ ENGINEERING NOTES</a>
                </nav>
              </div>
              <div className="ad-cover" aria-label="AIDR 项目封面">
                <div className="ad-cover-grid" aria-hidden="true" />
                <span className="ad-cover-top">RESILIENCE CONSOLE</span>
                <i className="ad-cover-shield" aria-hidden="true"><b /><b /><b /></i>
                <strong>01</strong>
                <span className="ad-cover-bottom">BLAST-RADIUS-AWARE BACKUP</span>
              </div>
            </div>

            <div className="ad-overview">
              <span>OVERVIEW</span>
              <p>AI Agent 在生产中同时读写业务数据和自己的上下文（memory、checkpoint）。传统备份只管文件和数据库——恢复之后 Agent 会“失忆”甚至带着错误的记忆继续运行。AIDR 用 OpenTelemetry 把 Agent、工具、备份资源连成一张图，按工具调用边计算爆炸半径，形成“保护组”作为原子的恢复单元。我负责把它从开发态推到生产：15 容器栈部署、观测链路、restic 备份接入、K8s 迁移，以及修复四个静默失败 bug（PR #47–#50）。</p>
            </div>
            <div className="ad-foundations">
              {foundations.map(([name, description]) => (
                <div key={name}><strong>{name}</strong><span>{description}</span></div>
              ))}
            </div>
          </div>
        </section>

        <section className="ad-shots" id="ad-shots">
          <div className="ad-container">
            <header className="ad-shots-heading">
              <p className="ad-map-kicker"><i aria-hidden="true" />LIVE SCREENS / REAL DATA, NO MOCKS</p>
              <h2>Running instance.</h2>
              <p>以下全部来自本机正在运行的 AIDR 实例——真实 Dify 集群、真实 opencode 轨迹、真实 restic 备份资源。</p>
            </header>
            <div className="ad-shot-grid">
              {shots.map(([src, title, caption]) => (
                <figure className="ad-shot" key={src}>
                  <button type="button" className="ad-shot-frame" onClick={() => setZoom({ src, caption: title })} aria-label={`放大查看 ${title} 截图`} title="点击放大">
                    <img src={src} alt={`${title}界面截图`} loading="lazy" />
                  </button>
                  <figcaption><strong>{title}</strong><span>{caption}</span></figcaption>
                </figure>
              ))}
            </div>
            <div className="ad-stats-strip">
              {liveStats.map(([value, label]) => (
                <div key={label}><strong>{value}</strong><span>{label}</span></div>
              ))}
            </div>
          </div>
        </section>

        <section className="ad-story-section ad-problem">
          <div className="ad-container ad-story-grid">
            <StoryIndex number="01" label="THE PROBLEM" />
            <div className="ad-story-content">
              <h2>备份只管数据，<br />不管 Agent</h2>
              <p>一个会写数据库、又会调 memory 工具的 Agent 出了事故，你恢复数据库备份，它的记忆还是坏的；你回滚了它的记忆，业务数据又对不上。数据与 AI 上下文必须作为一个单元一起恢复——但没有任何备份产品知道“这个 Agent 到底动过哪些数据”。</p>
              <p>AIDR 的回答：从观测里拿真相。工具调用图（谁、调了什么工具、落在哪个资源上）就是爆炸半径。</p>
            </div>
          </div>
        </section>

        <section className="ad-story-section ad-mechanism">
          <div className="ad-container ad-story-grid">
            <StoryIndex number="02" label="THE MECHANISM" note="在每次摄取事务末尾同步重算，60 秒内全图收敛" />
            <div className="ad-story-content">
              <h2>从调用图到保护组</h2>
              <p>dify-connector 每 60 秒发布集群快照；discovery-service 幂等入库后立即重算保护组：agent 与资源构成二部图，工具映射是边，BFS 求连通分量；每个分量用排序后 ID 的 SHA-256 前 16 位做稳定组 ID——成员不变则 ID 不变、元数据保留；成员变化则原子换组。</p>
              <div className="ad-pipeline">{mechanism.map((step, index) => <span key={step}>{index > 0 && <b aria-hidden="true">→</b>}{step}</span>)}</div>
              <strong className="ad-motto"><i aria-hidden="true" /> SAME GROUP, SAME RECOVERY UNIT</strong>
            </div>
          </div>
        </section>

        <AidrSystemMap />

        <section className="ad-story-section ad-observability">
          <div className="ad-container ad-story-grid">
            <StoryIndex number="03" label="OBSERVABILITY" />
            <div className="ad-story-content">
              <h2>Agent 的每一步都留下痕迹</h2>
              <p>OpenTelemetry 贯穿全链路：opencode 官方 Langfuse 插件导出 OTLP，经 langfuse-web 入 Minio、worker 解析进 ClickHouse。分析服务每 5 秒跑一遍漂移检测——可插拔规则链把工具调用实时映射成 LOW / MEDIUM / HIGH 风险等级写回轨迹；轨迹归属用三级 fallback（元数据 → dify_app_id → 工具重合度评分），任何平台都不会落进影子桶。</p>
              <div className="ad-risk-flow">
                <div><span>TOOL CALL</span><p>观察 span（工具名 / 参数 / 输出）</p></div>
                <div><span>RULE CHAIN</span><p>破坏性效果 · 高频 · 错误率 · 数据量异常</p></div>
                <div><span>VERDICT</span><p>DENY → HIGH · ESCALATE → MEDIUM</p></div>
                <div><span>RISK LEVEL</span><p>写回 ClickHouse，前端即时标红</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="ad-story-section ad-hardening" id="ad-hardening">
          <div className="ad-container ad-story-grid">
            <StoryIndex number="04" label="HARDENING" note="独立分支 · 防回归单测 · 分层 E2E · 合规报告" />
            <div className="ad-story-content">
              <h2>四个静默失败，<br />和一场 K8s 迁移</h2>
              <p>接手时系统“看起来一切正常”：界面能开、接口能通，但观测数据在静默丢弃、保护组从未真正形成。我逐一定位并修复了四个生产级静默失败，每个都带测试报告交付。</p>
              <ul className="ad-failures">
                {silentFailures.map(([pr, cause, symptom, fix]) => (
                  <li key={pr}>
                    <strong>{pr}</strong>
                    <div><b>{cause}</b><span>{symptom}</span></div>
                    <em>{fix}</em>
                  </li>
                ))}
              </ul>
              <div className="ad-infra-grid">
                {infraWork.map(([tag, text]) => (
                  <div key={tag}><strong>{tag}</strong><p>{text}</p></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="ad-toolbox">
          <div className="ad-container ad-toolbox-grid">
            <div className="ad-toolbox-heading"><span>TOOLBOX</span><h2>Stack &amp;<br />systems.</h2><i aria-hidden="true" /></div>
            <div className="ad-tech-grid">{technologies.map(([name, role]) => <div key={name}><strong>{name}</strong><span>{role}</span></div>)}</div>
          </div>
        </section>

        <footer className="ad-footer ad-container">
          <p className="ad-disclaimer"><i aria-hidden="true" />页面截图来自本机运行的实例；数字（13 agents / 122 traces / 2113 spans / 3 保护组）均为 2026-10 实时数据，可溯源。</p>
          <Link className="ad-next-project" to="/projects/daily-portfolio"><span>NEXT PROJECT</span><strong>Daily Portfolio</strong><b aria-hidden="true">→</b></Link>
          <div className="ad-footer-meta"><span>AIDR / PROJECT FILE 01</span><span>DATA + CONTEXT, OR NOTHING.</span></div>
        </footer>
        {zoom && <Lightbox src={zoom.src} alt={zoom.caption} caption={zoom.caption} onClose={() => setZoom(null)} />}
      </main>
    </div>
  )
}
