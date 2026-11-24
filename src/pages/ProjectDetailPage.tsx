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
          "整套栈（含 LLM 推理）单命令部署进 Kubernetes：vLLM 跑在昇腾 Ascend910B 上，全栈 14 个 Pod 集群内自包含，无任何外部后门依赖。",
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
      "vLLM · Ascend",
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
        bullets: [
          "投资理事会（Council）：7 种成员模板、2–6 人含 1 位经理，讨论室实时辩论，右侧按版本归档研报；结论经 Builder 候选 → 投委会审批 → 模拟盘，审批匹配修订号与价格区间。",
          "财报资料库：双语证据段落排序（bge-small-zh-v1.5 嵌入），财报缺项自动回退 SEC EDGAR，可选 DeepSeek 联网检索交叉校验。",
        ],
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
    next: "agent-interview",
  },
  "agent-interview": {
    id: "agent-interview",
    number: "03",
    eyebrow: "AI AGENT INTERVIEW PREP",
    title: "Agent Interview",
    subtitle: "把 Agent 考点变成可自测的开放题库",
    role: "OPEN QUESTION BANK",
    year: "2026",
    color: "blue",
    overview:
      "AI Agent 的知识点散落在面经、论文和实战里：会背概念，不等于能扛住追问。agent-interview 把这件事工程化——8 大主题、161 道真实考点，每题拆成五模块题卡，再交给 Agent 管道持续采集、生成、校验与发布，让「准备」变成一个可度量、可重复的系统动作。",
    metrics: [
      { value: "161", label: "QUESTIONS" },
      { value: "08", label: "TOPICS" },
      { value: "05", label: "CARD MODULES" },
      { value: "00", label: "BUILD ERRORS" },
    ],
    flow: ["COLLECT", "SPEC", "CARD", "BUILD GATE", "PUBLISH", "EVOLVE"],
    sections: [
      {
        label: "THE PROBLEM",
        title: "面经是消耗品，题库才是资产",
        body: "同一道题在不同面经里的答案质量参差不齐，收藏夹很快失效。真正的准备需要一份结构化、可检索、能自测的题库：每个考点有稳定的编号和固定的拆解结构，新题进来时不会破坏旧题的质量基线。",
      },
      {
        label: "THE FORMAT",
        title: "一题五模块，从电梯稿到自测",
        body: "每道题卡按同一套规格产出，保证任何一页都能被单独理解，也能被串成完整回答。",
        bullets: [
          "30 秒电梯稿：先给结论与关键取舍。",
          "通俗类比：用日常经验建立直觉。",
          "详细拆解：原理、边界与工程细节。",
          "面试官追问：预判下一层问题，展示深度。",
          "术语卡 + 自测题：把概念压成可回忆的卡片，自测即时判分。",
        ],
      },
      {
        label: "THE PIPELINE",
        title: "Agent 管维护，双闸门发布",
        body: "题库不是手工堆出来的。每日面经采集管道挑选 0~3 道尚未覆盖的真实考点，按 SPEC 生成题卡；构建校验与泄漏扫描双闸门必须零错误，才允许发布到线上站点。",
        bullets: [
          "构建脚本校验题卡结构、数据完整性与自测题格式。",
          "泄漏扫描拦截个人数据与凭证，隐私边界先于发布。",
          "全自动发布链：构建 → 加密打包 → 上传 → 线上校验，失败自动回滚。",
        ],
      },
      {
        label: "THE EVOLUTION",
        title: "让题库跟着短板走",
        body: "题库把 8 大主题的掌握度聚合成一张账本：自测正确率、失分记录与自评三源合流。薄弱主题会被加权出题，每日评估引擎再按动量信号决定加题还是减量——题库因此不是静态收藏，而是一个随时间进化的训练系统。学习助手按双档 Auto 路由（Flash / Strong）作答：跨岗位盲测 24 题从 12 道对到 19 道，项目代码行 Recall@8 从 54.5% 升到 78.0%。",
      },
    ],
    stack: [
      "Python",
      "Vanilla JS",
      "GitHub",
      "Aliyun OSS",
      "AES-256-GCM",
      "Agent Pipeline",
    ],
    note: "开源项目（Lueyu/agent-interview）。题库由 Agent 管道维护，每日自动发布到 agent-interview.icu。",
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
