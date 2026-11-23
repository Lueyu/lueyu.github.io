export interface BlogPostMeta {
  slug: string
  title: string
  subtitle: string
  topic: string
  date: string
  dateLabel: string
  readingTime: string
  description: string
  tags: string[]
  repo?: string
  projectSlug?: string
  footerNote?: string
}

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: 'careerpilot-streaming-polish',
    title: '流式体验不是“字在动”：把学习助手的 60 秒空白修到 0.7 秒首字',
    subtitle: '三把尺子定位延迟，两个设计取舍修好“假流式”——推理模型的 thinking 是信号不是噪音',
    topic: 'CAREERPILOT · 流式与推理模型',
    date: '2026-11-24',
    dateLabel: '2026.11.24',
    readingTime: '约 9 分钟',
    description:
      'AI 面试教练的聊天回复从“等 30–60 秒空白、然后一块块跳”修到“0.7 秒内思考面板亮起、正文 60ms 级流出”。根因是推理模型的 reasoning_content 被流式解析器当噪音丢弃、思考 token 吃满输出预算导致截断重试、0.5 秒数据库轮询加整段 markdown 重渲染造成卡顿。',
    tags: ['STREAMING', 'REASONING MODEL', 'SSE', 'UX', 'CAREERPILOT'],
    repo: 'https://github.com/Lueyu/agent-interview',
    projectSlug: 'agent-interview',
    footerNote: 'CareerPilot 本地个人实例；未发布为公开服务，文中数据来自本机真实模型链路验证。',
  },
  {
    slug: 'zero-backdoors-aidr-on-kubernetes',
    title: '零后门：我把整套 AI 平台搬进了 Kubernetes',
    subtitle: '能回答“系统真的跑在这里吗”的测试只有一个：把集群之外的一切全部停掉，看还剩什么活着',
    topic: 'AIDR · KUBERNETES',
    date: '2026-11-11',
    dateLabel: '2026.11.11',
    readingTime: '约 12 分钟',
    description:
      '16 容器 14 Pod 全部迁入单节点 kind 集群，拆除观测数据的无 selector Service 后门；三个上线以来从未真正工作过的缺陷被全新集群一次挖出；vLLM-Ascend 昇腾推理闭环，357 个 E2E 用例在 compose 完全停止的状态下通过。',
    tags: ['KUBERNETES', 'AIDR', '基础设施', '可观测性'],
    repo: 'https://github.com/rainbow0432-dev/aidr-server',
    projectSlug: 'aidr',
    footerNote: 'PR #51 与 #55 开放评审；部署基座面向单节点 kind，代价与继承妥协见正文「代价清单」。',
  },
  {
    slug: 'rebuilding-squabble-for-daily-use',
    title: '把 Squabble 改成一个我愿意每天打开的 AI 投研工具',
    subtitle: '按真实使用动线的架构重构：估值语义、版本化研究技能与来源可追溯的数据中心',
    topic: 'SQUABBLE · 架构与实现',
    date: '2026-11-10',
    dateLabel: '2026.11.10',
    readingTime: '约 8 分钟',
    description:
      '按每天真实的使用动线重排产品与架构：多账户估值语义分离、自然语言策略编译成可检查的结构化规则、九个带版本的研究技能，以及贯穿报告与记忆的资料来源链。回归 1010 项后端与 443 项前端测试。',
    tags: ['SQUABBLE', 'ARCHITECTURE', 'AI AGENTS', '工程实践'],
    repo: 'https://github.com/Lueyu/squabble',
    projectSlug: 'squabble',
    footerNote: '研究输出不构成投资建议；模拟盘结果不代表真实收益。',
  },
  {
    slug: 'squabble-from-debate-to-silence',
    title: 'Squabble: From Debate to Silence',
    subtitle: '一个投研 Multi-Agent 是怎么把“讨论”关进报告里的',
    topic: 'MULTI-AGENT · 投研',
    date: '2026-11-06',
    dateLabel: '2026.11.06',
    readingTime: '约 18 分钟',
    description:
      '几个本地 Agent 依次汇报的投研工作台，经过群聊、决策链两次失败，最终落定为两条互不污染的链路：严肃研究沉进报告，频道只消费报告批准过的事实，用审核过的模板编译出短句。',
    tags: ['MULTI-AGENT', 'SQUABBLE', '发布契约', '人机交互'],
    repo: 'https://github.com/Lueyu/squabble',
    projectSlug: 'squabble',
    footerNote: '研究输出不构成投资建议；文中接口与状态为设计定稿，尚未接入生产实测。',
  },
]

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
