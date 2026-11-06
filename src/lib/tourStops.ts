export interface TourStop {
  id: string
  route: string
  anchor?: string
  badge: string
  title: string
  points: string[]
}

export const TOUR_STOPS: TourStop[] = [
  {
    id: "hero",
    route: "/",
    anchor: "home",
    badge: "STOP 01 / HELLO",
    title: "你好，我是 Lueyu 的数字分身",
    points: [
      "这趟导览约 3 分钟，带你快速看他的核心能力。",
      "他在做 AI Agent 工程——让模型在真实系统里可观测、可验证、可恢复。",
      "每一站我都会告诉你亮点在哪，以及为什么值得追问。",
    ],
  },
  {
    id: "about",
    route: "/resume",
    anchor: "project-content",
    badge: "STOP 02 / BACKGROUND",
    title: "密歇根双学位 + AI Agent 方向",
    points: [
      "密歇根大学安娜堡：电子与计算机工程硕士（GPA 4.0）+ 计算机科学本科（GPA 3.73）。",
      "现于斯巴鲁研究院做 ADAS 计算机视觉，此前在 Irdeto 做端到端自动化测试。",
      "技术栈覆盖 Python/TypeScript/Java/Go，前端到后端到基础设施。",
    ],
  },
  {
    id: "aidr",
    route: "/projects/aidr",
    anchor: "ad-hardening",
    badge: "STOP 03 / AIDR · 4 个静默失败",
    title: "在别人看不到的地方修 bug",
    points: [
      "AIDR 是面向 AI Agent 时代的数据保护平台：按工具调用图计算爆炸半径，把 Agent 和数据组成保护组原子恢复。",
      "他定位并修复了 4 个生产级静默失败（PR #47–#50）：OTLP 事件全部丢弃、评分表 DDL 双违规、轨迹归属缺 fallback、保护组从未生效。",
      "每个修复独立分支 + 防回归单测 + 分层 E2E——不是修了就跑，是修了能证明修好了。",
      "你可以用页面上方的放大镜点任何区块，我会逐条讲解。",
    ],
  },
  {
    id: "aidr-system",
    route: "/projects/aidr",
    anchor: "ad-system",
    badge: "STOP 04 / AIDR · 架构全景",
    title: "16 容器、5 层、3 条数据流",
    points: [
      "这是他参与的生产级架构：React 前端 → JWT 网关 → 5 个领域服务 → Postgres/ClickHouse/Kafka → 外部 Dify 集群。",
      "他负责把这套系统从开发态推到生产：kind K8s 迁移、restic 备份接入、OpenTelemetry 全链路观测。",
      "放大镜点任何一张架构卡都可以追问。",
    ],
  },
  {
    id: "squabble",
    route: "/projects/squabble",
    anchor: "dp-system",
    badge: "STOP 05 / SQUABBLE",
    title: "让 AI 替你吵，你来定",
    points: [
      "独立开发的开源投资研究工作台：多头、空头与批评者围绕持仓辩论，风控规则作为硬门，输出正反论点完整保留的 14 节研报。",
      "研究记忆版本化：论点、依据、反证、失效条件都可追溯；模拟盘只执行你确认过的策略，可接入本地 CLI Agent 与 MCP 助手。",
      "源码开源于 GitHub（Lueyu/squabble），桌面版内置数据库，开箱即用。",
    ],
  },
  {
    id: "resume",
    route: "/",
    anchor: "home",
    badge: "STOP 06 / RESUME",
    title: "一句话总结",
    points: [
      "密歇根硕士 + 斯巴鲁 ADAS + 四个静默失败修复 + Agent 全栈工作台。",
      "简历可从顶部导航进入，页面支持打印或另存为 PDF。",
      "想聊细节？跟右下角的 Agent 对话，它能翻他的仓库、读他的简历、带你逛项目。",
      "联系方式：lueyuwang@gmail.com · lueyuw@umich.edu",
    ],
  },
]
