import '../content-pages.css'
export const BLOG_EXAMPLES = [
  { title: '从工具调用到真正完成任务', topic: 'AI AGENT', description: '这里将记录 Agent 规划、工具调用与工程实践。' },
  { title: '让系统可靠，也让过程可见', topic: 'ENGINEERING', description: '这里将分享可观测性、测试与失败恢复的思考。' },
  { title: '一些小实验，一些新想法', topic: 'FIELD NOTES', description: '这里将存放开发过程中的实验、笔记与灵感。' },
]
export default function BlogPreview() {
  return <div className="blog-preview"><p className="blog-placeholder-note">写作空间正在准备中。以下为示例占位，尚未发布。</p>{BLOG_EXAMPLES.map((post, index) => <article className="blog-example" key={post.title}><div className="blog-example-meta"><span>{post.topic}</span><span>示例 {String(index + 1).padStart(2, '0')}</span></div><h3>{post.title}</h3><p>{post.description}</p><span className="blog-coming">待发布</span></article>)}</div>
}
