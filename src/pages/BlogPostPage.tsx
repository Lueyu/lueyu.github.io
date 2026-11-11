import { Link, Navigate, useParams } from 'react-router'
import { getBlogPost } from '../lib/blogPosts'
import SquabbleDebateToSilence from '../components/blog/SquabbleDebateToSilence'
import RebuildingSquabbleDaily from '../components/blog/RebuildingSquabbleDaily'
import ZeroBackdoorsAidrK8s from '../components/blog/ZeroBackdoorsAidrK8s'
import '../content-pages.css'
import '../blog-post.css'

const POST_BODIES: Record<string, React.ComponentType> = {
  'squabble-from-debate-to-silence': SquabbleDebateToSilence,
  'rebuilding-squabble-for-daily-use': RebuildingSquabbleDaily,
  'zero-backdoors-aidr-on-kubernetes': ZeroBackdoorsAidrK8s,
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = slug ? getBlogPost(slug) : undefined
  const Body = post ? POST_BODIES[post.slug] : undefined

  if (!post || !Body) {
    return <Navigate to="/blog" replace />
  }

  return (
    <main id="project-content" tabIndex={-1} className="content-page blog-post-page">
      <p className="page-kicker">{post.topic} · FIELD NOTES</p>
      <h1 className="bp-title">{post.title}<span>.</span></h1>
      <p className="bp-page-subtitle">{post.subtitle}</p>
      <div className="bp-meta">
        <span>{post.dateLabel}</span>
        <span>{post.readingTime}</span>
        {post.repo && <a href={post.repo} target="_blank" rel="noopener noreferrer">GITHUB ↗</a>}
        {post.projectSlug && <Link to={`/projects/${post.projectSlug}`}>项目主页 ↗</Link>}
      </div>
      <Body />
      <footer className="bp-footer">
        <div className="bp-footer-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <p>{post.footerNote ?? '研究输出不构成投资建议；模拟盘结果不代表真实收益。'}</p>
      </footer>
      <Link className="page-back" to="/blog">← 回到博客</Link>
    </main>
  )
}
