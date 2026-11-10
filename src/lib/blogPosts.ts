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
    slug: 'rebuilding-squabble-for-daily-use',
    title: '把 Squabble 改成一个我愿意每天打开的 AI 投研工具',
    subtitle: '沿着每天真实的使用动线，重排账户首页、策略访谈、研究室、日报与数据中心',
    topic: 'SQUABBLE · 产品与工程',
    date: '2026-11-10',
    dateLabel: '2026.11.10',
    readingTime: '约 11 分钟',
    description:
      '导入持仓后首页还是空的、点进报告就忘了从哪来——从这些具体的不顺手出发，重排了账户首页、策略访谈、研究室工作区、可解释的日报和能承接资料的数据中心，也记录了用 Agent 开发时让工作可被检查的方式。',
    tags: ['SQUABBLE', '产品', 'AI AGENTS', '工程实践'],
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
