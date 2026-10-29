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
    route: "/",
    anchor: "about",
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
    id: "daily-portfolio",
    route: "/projects/daily-portfolio",
    anchor: "dp-system",
    badge: "STOP 05 / DAILY PORTFOLIO",
    title: "生成 ≠ 验证：Agent 工程闭环",
    points: [
      "独立开发的全栈工作台：投资组合 + 多角色 AI 投研 + Coding Agent，一条产品线跑通 Agent 工程。",
      "核心设计原则：模型可以提出改动，确定性工具负责证明它。测试证据与源码版本强绑定。",
      "有在线 Demo 可以直接体验（页面顶部 TRY IT LIVE）。",
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
      "简历可从右上角 RESUME 按钮预览和下载 PDF。",
      "想聊细节？跟右下角的 Agent 对话，它能翻他的仓库、读他的简历、带你逛项目。",
      "联系方式：lueyuwang@gmail.com · lueyuw@umich.edu",
    ],
  },
]
