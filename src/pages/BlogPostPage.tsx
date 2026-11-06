import { Link, Navigate, useParams } from 'react-router'
import { getBlogPost } from '../lib/blogPosts'
import SquabbleDebateToSilence from '../components/blog/SquabbleDebateToSilence'
import '../content-pages.css'
import '../blog-post.css'

const POST_BODIES: Record<string, React.ComponentType> = {
  'squabble-from-debate-to-silence': SquabbleDebateToSilence,
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
        {post.slug === 'squabble-from-debate-to-silence' && <Link to="/projects/squabble">项目主页 ↗</Link>}
      </div>
      <Body />
      <footer className="bp-footer">
        <div className="bp-footer-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <p>研究输出不构成投资建议；文中接口与状态为设计定稿，尚未接入生产实测。</p>
      </footer>
      <Link className="page-back" to="/blog">← 回到博客</Link>
    </main>
  )
}
