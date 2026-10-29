import { useState } from 'react'
import Lightbox from '../components/Lightbox'

const screenshots = [
  {
    number: '01',
    route: 'portfolio.app/dashboard',
    image: '/images/daily-portfolio/dashboard.png',
    title: '投资仪表盘',
    tags: ['实时数据感知', '多币种', '净值曲线'],
    description: '账户总览、AI 分析状态、多空信号与净值盈亏，一屏掌握全局。',
  },
  {
    number: '02',
    route: 'portfolio.app/analysis',
    image: '/images/daily-portfolio/analysis.png',
    title: 'Multi-Agent 每日分析',
    tags: ['多角色辩论', 'PM决策'],
    description: '多空辩论→审查→风控→PM 评级，组合复盘与个股结论。',
  },
  {
    number: '03',
    route: 'portfolio.app/analysis/deep-report',
    image: '/images/daily-portfolio/deep-report.png',
    title: '14 板块深度报告',
    tags: ['三情景定价', '证据分级', '14 板块'],
    description: '三情景目标价与概率、多空质询、估值与催化剂。',
  },
  {
    number: '04',
    route: 'portfolio.app/dev',
    image: '/images/daily-portfolio/coding-agent.png',
    title: 'Coding Agent',
    tags: ['MCP', 'ReAct', 'Checkpoint'],
    description: 'ReAct 推理-行动，调用终端/浏览器/预览，验证后提交补丁待审批。',
  },
] as const

export default function DailyPortfolioShowcase() {
  const [zoom, setZoom] = useState<{ src: string; caption: string } | null>(null)

  return (
    <section className="dp-showcase" aria-labelledby="dp-showcase-heading">
      <div className="dp-container">
        <header className="dp-showcase-heading">
          <div>
            <p className="dp-showcase-kicker"><i aria-hidden="true" />PRODUCT SHOWCASE / 产品截图</p>
            <h2 id="dp-showcase-heading">Inside the Terminal.</h2>
            <p>真实工作台截图，展示投研与开发全流程。</p>
          </div>
          <a
            className="dp-live-link"
            href="https://4m3ksb6knp0wc.doubaoapps.com/app/app_17en1wnqecc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>TRY IT LIVE</span>
            <b aria-hidden="true">↗</b>
          </a>
        </header>
        <div className="dp-showcase-grid">
          {screenshots.map((screen) => (
            <article className="dp-showcase-card" key={screen.number}>
              <div className="dp-showcase-chrome">
                <span>{screen.route}</span>
                <img src="/images/daily-portfolio/chrome-dots.svg" width="31" height="7" alt="" />
              </div>
              <button type="button" className="dp-showcase-image" onClick={() => setZoom({ src: screen.image, caption: screen.title })} aria-label={`放大查看 ${screen.title} 截图`} title="点击放大">
                <img src={screen.image} width="1505" height="1216" alt={`${screen.title}工作台截图`} loading="lazy" />
              </button>
              <div className="dp-showcase-caption">
                <div className="dp-showcase-caption-heading">
                  <div><span>{screen.number}</span><h3>{screen.title}</h3></div>
                  {Number(screen.number) < 3 && <ul>{screen.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
                </div>
                {Number(screen.number) > 2 && <ul className="dp-showcase-tags">{screen.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
                <p>{screen.description}</p>
              </div>
            </article>
          ))}
        </div>
        {zoom && <Lightbox src={zoom.src} alt={zoom.caption} caption={zoom.caption} onClose={() => setZoom(null)} />}
      </div>
    </section>
  )
}
