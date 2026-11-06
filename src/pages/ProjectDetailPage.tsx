import { Link, Navigate, useParams } from "react-router"

type ProjectDetail = {
  id: string
  number: string
  eyebrow: string
  title: string
  subtitle: string
  role: string
  year: string
  color: string
  overview: string
  metrics: Array<{ value: string; label: string }>
  flow: string[]
  sections: Array<{
    label: string
    title: string
    body: string
    bullets?: string[]
  }>
  stack: string[]
  note: string
  next: string
}

const projects: Record<string, ProjectDetail> = {
  aidr: {
    id: "aidr",
    number: "01",
    eyebrow: "AI DATA RESILIENCE",
    title: "AIDR",
    subtitle: "让备份系统第一次理解智能体",
    role: "DEEP CONTRIBUTOR",
    year: "2025",
    color: "red",
    overview:
      "AI 智能体每天通过工具读写几十个数据源，传统备份却看不见「智能体」为何物。AIDR 用一张真实的工具调用图回答一个新问题：一个 Agent 出事时，到底要一起恢复哪些东西。",
    metrics: [
      { value: "60s", label: "RADIUS RECOMPUTE" },
      { value: "01", label: "RECOVERY UNIT" },
      { value: "03", label: "FUSED PLANES" },
      { value: "00", label: "MOCK DATA" },
    ],
    flow: [
      "AGENT",
      "TOOL CALLS",
      "TRACE GRAPH",
      "BLAST RADIUS",
      "PROTECTION GROUP",
      "ATOMIC RECOVERY",
    ],
    sections: [
      {
        label: "THE BLIND SPOT",
        title: "AI 生产数据，不在任何备份地图上",
        body: "企业备份保护的是数据库、卷和目录——它们假设「被保护对象」是静止的存储资产。但 Agent 的数据世界是动态的：它今天写这个代码库、明天接那个 API，它的上下文、任务状态与知识引用散落在几十个系统里。没有任何 CMDB 记录这种依赖，单独恢复任何一块存储，都无法让 Agent 回到可工作的状态。",
      },
      {
        label: "THE CONCEPT",
        title: "爆炸半径，就是保护边界",
        body: "Agent 每一次工具调用都会留下一条边：用了什么工具、碰了什么数据。把这些边连起来是一张真实的依赖图。对图求连通分量，每个分量就是一个保护组——一个 Agent 连同它的整个数据世界。半径会自己生长：Agent 开始使用新工具的下一个周期，保护组自动扩容收敛，不需要任何人工登记。",
      },
      {
        label: "AGENT CONCEPTS",
        title: "把 Agent 当一等公民来建模",
        body: "这个平台围绕四个 Agent 时代的核心概念构建，而不是把 AI 当成普通负载。",
        bullets: [
          "Agent 是自主干活的软件员工：规划、调用工具、留下轨迹。",
          "工具调用图是依赖关系的唯一真相源，自动推导而非人工登记。",
          "轨迹与归属：每笔行为通过 OpenTelemetry 归到具体 Agent，行为可审计。",
          "原子恢复：保护组一次恢复，Agent 复活不失忆——上下文与数据同时回来。",
        ],
      },
      {
        label: "WHY IT WINS",
        title: "三个传统备份给不出的答案",
        body: "它的竞争力不在更快的备份速度，而在保护单位与观测方式的根本改变。",
        bullets: [
          "保护单位从「存储对象」升级为「Agent 的数据世界」，恢复不再残缺。",
          "依赖从真实行为自动推导，不依赖会过时的人工配置。",
          "观测与保护共享同一张图：分析页看到的行为异常，就是保护页要兜底的半径；备份引擎可插拔，企业存储与开源方案走同一套契约。",
        ],
      },
    ],
    stack: [
      "OpenTelemetry",
      "Langfuse",
      "ClickHouse",
      "restic",
      "PostgreSQL",
      "Kubernetes",
    ],
    note: "开源项目（rainbow0432-dev/aidr-server）。本页聚焦平台的概念与架构。"
    ,
    next: "squabble",
  },
  squabble: {
    id: "squabble",
    number: "02",
    eyebrow: "OPEN-SOURCE AGENT WORKBENCH",
    title: "Squabble",
    subtitle: "让 AI 替你吵，你来定",
    role: "INDEPENDENT PROJECT",
    year: "2025",
    color: "green",
    overview:
      "自托管的开源投资研究工作台：多头、空头与批评者围绕你的持仓辩论，风控规则作为硬门把关，输出正反论点完整保留的 14 节研报与版本化研究记忆；模拟盘只执行你确认过的策略。",
    metrics: [
      { value: "03", label: "MARKETS 美/港/A" },
      { value: "14", label: "REPORT SECTIONS" },
      { value: "01", label: "SOURCE OF TRUTH" },
      { value: "00", label: "TELEMETRY 埋点" },
    ],
    flow: [
      "HOLDINGS",
      "BULL/BEAR DEBATE",
      "CRITIC",
      "RISK GATES",
      "HUMAN REVIEW",
      "PAPER TRADE",
    ],
    sections: [
      {
        label: "THE PRODUCT",
        title: "让 AI 替你吵，你来定",
        body: "持仓管理、AI 研报、研究记忆与模拟炒股共用一条流水线：行情和持仓进入多空辩论，批评者移除站不住脚的论点，确定性风控规则作为硬门，最终报告交给你拍板。",
      },
      {
        label: "RESEARCH MEMORY",
        title: "论点有版本，记忆可审计",
        body: "研究记忆按版本保存论点、依据、反证、失效条件和时间边界；每轮研究实际发送了哪些记忆可查；Agent 审核通过与你的个人确认分开记录。",
        bullets: [
          "论点、依据、反证、失效条件按版本演进。",
          "每轮研究实际发送的记忆条目与省略原因可复查。",
          "Agent 验收与用户确认分别记录，未知来源不会变成已核验事实。",
          "触发过的条件永久留在该论点版本的历史中。",
        ],
      },
      {
        label: "DESIGN PRINCIPLE",
        title: "模型建议，你拍板",
        body: "生成与执行被明确分开：模型负责辩论与提出策略，确定性规则负责风控硬门与账本校验，自动执行只发生在模拟盘，最终应用仍需要你的确认。",
      },
    ],
    stack: [
      "TypeScript",
      "React",
      "NestJS",
      "PostgreSQL",
      "Drizzle ORM",
      "Electron",
      "Docker",
      "MCP",
    ],
    note: "开源项目（Lueyu/squabble），MIT 协议。研究输出不构成投资建议；模拟盘结果不代表真实收益。",
    next: "next-quest",
  },
  "next-quest": {
    id: "next-quest",
    number: "03",
    eyebrow: "NEXT QUEST",
    title: "To Be Built",
    subtitle: "为下一个值得完整讲述的项目留白",
    role: "RESERVED SLOT",
    year: "SOON",
    color: "blue",
    overview:
      "这里不是一张为了凑数的项目卡片。第三个位置会留给一个问题足够真实、过程可以复现、结果经得起追问的项目。",
    metrics: [
      { value: "01", label: "REAL PROBLEM" },
      { value: "01", label: "WORKING SYSTEM" },
      { value: "01", label: "HONEST RETROSPECTIVE" },
      { value: "00", label: "DECORATIVE CLAIMS" },
    ],
    flow: ["QUESTION", "PROTOTYPE", "FAILURE", "REVISION", "EVIDENCE", "STORY"],
    sections: [
      {
        label: "SELECTION RULE",
        title: "不是所有实验都需要成为作品",
        body: "一个项目进入这里之前，至少需要有明确的问题、真实的约束、可运行的系统和可以被验证的结果。",
      },
      {
        label: "CURRENT STATUS",
        title: "UNDER CONSTRUCTION",
        body: "项目正在筛选与整理中。完成后，这一页会保留设计过程、关键失败、工程取舍和最终证据，而不仅是功能列表。",
        bullets: [
          "问题必须来自真实场景。",
          "核心路径必须能够独立运行。",
          "关键选择需要说明为什么。",
          "结果需要能够复现或验证。",
        ],
      },
    ],
    stack: ["AI AGENT", "SYSTEM DESIGN", "EVALUATION", "TBD"],
    note: "This slot is intentionally left open.",
    next: "aidr",
  },
}

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const project = projectId && Object.prototype.hasOwnProperty.call(projects, projectId) ? projects[projectId] : undefined

  if (!project) {
    return <Navigate to="/404" replace />
  }

  const nextProject = projects[project.next]

  return (
    <div className={`project-page project-page-${project.color}`}>
      <header className="project-nav">
        <Link className="project-home-link" to="/">
          <span aria-hidden="true">←</span>
          <span>BACK TO HOME</span>
        </Link>
        <p>PROJECT FILE / {project.number}</p>
        <p>{project.year}</p>
      </header>

      <main id="project-content" tabIndex={-1}>
        <section className="project-hero">
          <div className="project-hero-meta">
            <p>{project.eyebrow}</p>
            <span>{project.role}</span>
          </div>
          <div className="project-hero-title">
            <span>{project.number}</span>
            <h1>{project.title}</h1>
            <p>{project.subtitle}</p>
          </div>
          <div className="project-blueprint" aria-hidden="true">
            <div className="blueprint-orbit">
              <i />
              <i />
              <i />
              <b>{project.number}</b>
            </div>
            <p>SYSTEM ONLINE</p>
          </div>
        </section>

        <section className="project-overview">
          <p className="project-section-label">OVERVIEW</p>
          <p className="project-overview-copy">{project.overview}</p>
          <div className="project-metrics">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="project-system">
          <div className="project-section-heading">
            <p className="project-section-label">SYSTEM MAP</p>
            <h2>HOW IT FLOWS</h2>
          </div>
          <div className="system-flow">
            {project.flow.map((step, index) => (
              <div className="system-node" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
                {index < project.flow.length - 1 && <b aria-hidden="true">→</b>}
              </div>
            ))}
          </div>
        </section>

        <section className="project-story">
          {project.sections.map((section, index) => (
            <article className="story-section" key={section.label}>
              <div className="story-index">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{section.label}</p>
              </div>
              <div className="story-copy">
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="project-stack">
          <div>
            <p className="project-section-label">TOOLBOX</p>
            <h2>STACK &amp; SYSTEMS</h2>
          </div>
          <div className="stack-list">
            {project.stack.map((item, index) => (
              <span key={item}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                {item}
              </span>
            ))}
          </div>
          <p className="project-note">{project.note}</p>
        </section>

        <Link className="next-project" to={`/projects/${nextProject.id}`}>
          <span>NEXT PROJECT</span>
          <strong>{nextProject.title}</strong>
          <b aria-hidden="true">→</b>
        </Link>
      </main>
    </div>
  )
}
