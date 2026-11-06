import { useState } from 'react'
import { Link } from 'react-router'
import TiltCard from '../components/TiltCard'
import { FEATURED_PROJECTS } from '../lib/siteProfile'
import '../content-pages.css'
const categories = ['全部', 'Agent 应用', '基础设施'] as const
export default function ProjectsPage() {
  const [category, setCategory] = useState<string>('全部')
  const projects = FEATURED_PROJECTS.filter(project => project.slug !== 'next-quest')
  const matches = (slug: string, filter: string) => filter === '全部' || (filter === '基础设施' ? slug === 'aidr' : slug === 'squabble')
  return <main id="project-content" tabIndex={-1} className="content-page projects-page">
    <p className="page-kicker">SELECTED QUESTS / PROJECTS</p><h1>项目<span>.</span></h1><p className="page-lead">真实的问题、可复现的过程，以及正在构建的系统。</p>
    <div className="project-filters" role="group" aria-label="筛选项目">{categories.map(filter => <button key={filter} aria-pressed={category === filter} onClick={() => setCategory(filter)}>{filter}<span>{projects.filter(project => matches(project.slug, filter)).length}</span></button>)}</div>
    <p className="project-count" role="status">{projects.filter(project => matches(project.slug, category)).length} 个项目</p>
    <div className="projects-index-grid">{projects.filter(project => matches(project.slug, category)).map(project => <TiltCard className={`project-index-card project-index-${project.color}`} key={project.slug}>
      <div className="project-index-art" aria-hidden="true"><span>{project.number}</span><i /><i /><b>{project.slug === 'aidr' ? '↺' : '↗'}</b></div>
      <p className="page-kicker">{project.eyebrow}</p><h2><Link to={`/projects/${project.slug}`}>{project.title}<span aria-hidden="true">↗</span></Link></h2>
      <p>{project.description}</p><div className="project-index-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><Link className="project-index-open" to={`/projects/${project.slug}`}>阅读项目 <span aria-hidden="true">→</span></Link>
    </TiltCard>)}</div><p className="projects-next">NEXT QUEST / 更多项目正在整理中。</p><Link className="page-back" to="/">← 回到首页</Link>
  </main>
}
