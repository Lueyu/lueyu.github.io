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
}

export const BLOG_POSTS: BlogPostMeta[] = [
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
  },
]

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
