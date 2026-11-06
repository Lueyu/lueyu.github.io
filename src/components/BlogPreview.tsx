import { Link } from 'react-router'
import { BLOG_POSTS } from '../lib/blogPosts'
import '../content-pages.css'

export default function BlogPreview() {
  if (BLOG_POSTS.length === 0) {
    return (
      <div className="blog-preview">
        <p className="blog-placeholder-note">写作空间正在准备中，第一篇文章很快会在这里出现。</p>
      </div>
    )
  }
  return (
    <div className="blog-preview">
      {BLOG_POSTS.map((post) => (
        <article className="blog-example" key={post.slug}>
          <div className="blog-example-meta"><span>{post.topic}</span><span>{post.dateLabel}</span></div>
          <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
          <p>{post.description}</p>
          <div className="blog-post-foot"><span className="blog-coming">已发布</span><Link className="blog-post-open" to={`/blog/${post.slug}`}>阅读全文 <span aria-hidden="true">→</span></Link></div>
        </article>
      ))}
    </div>
  )
}
