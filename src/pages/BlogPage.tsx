import BlogPreview from '../components/BlogPreview'
import { Link } from 'react-router'
import '../content-pages.css'
export default function BlogPage() {
  return <main id="project-content" tabIndex={-1} className="content-page blog-page"><p className="page-kicker">FIELD NOTES / WRITING</p><h1>博客<span>.</span></h1><p className="page-lead">关于 AI Agent、软件工程，以及那些值得记录的小实验。</p><BlogPreview /><Link className="page-back" to="/">← 回到首页</Link></main>
}
