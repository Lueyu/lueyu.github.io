import { FEATURED_PROJECTS, OTHER_EXPERIENCE } from './siteProfile'

export interface SiteSearchResult {
  id: string
  title: string
  description: string
  tags: string[]
  kind: 'project' | 'experience' | 'page'
  href: string
}

export const SITE_SEARCH_INDEX: SiteSearchResult[] = [
  ...FEATURED_PROJECTS.map((project) => ({
    id: `project-${project.slug}`,
    title: project.title,
    description: `${project.eyebrow} · ${project.description}`,
    tags: project.tags,
    kind: 'project' as const,
    href: `/projects/${project.slug}`,
  })),
  ...OTHER_EXPERIENCE.map((experience, index) => ({
    id: `experience-${index}`,
    title: `${experience.company} · ${experience.title}`,
    description: `${experience.period} · ${experience.description}`,
    tags: experience.tags,
    kind: 'experience' as const,
    href: '/#experience',
  })),
  {
    id: 'about',
    title: 'About · 关于我',
    description: '认识 Lueyu：专注 AI Agent、软件工程与系统思考的程序员。',
    tags: ['PROFILE', '个人介绍'],
    kind: 'page',
    href: '/#about',
  },
  {
    id: 'contact',
    title: 'Contact · 联系我',
    description: '交流项目、想法与合作机会，发送邮件或留言。',
    tags: ['EMAIL', '邮件', '联系'],
    kind: 'page',
    href: '/#contact',
  },
]

function normalize(value: string): string {
  return value.normalize('NFKC').toLowerCase().trim()
}

/** Match every query term, prioritizing titles over tags and descriptions. */
export function searchSite(
  query: string,
  items: readonly SiteSearchResult[] = SITE_SEARCH_INDEX,
): SiteSearchResult[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return [...items]

  return items
    .map((item, index) => {
      const title = normalize(item.title)
      const tags = item.tags.map(normalize)
      const description = normalize(item.description)
      let score = 0
      for (const term of terms) {
        if (title === term) score += 120
        else if (title.startsWith(term)) score += 90
        else if (title.includes(term)) score += 65
        else if (tags.some((tag) => tag === term)) score += 45
        else if (tags.some((tag) => tag.includes(term))) score += 30
        else if (description.includes(term)) score += 12
        else return { item, index, score: 0 }
      }
      return { item, index, score }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item)
}
