import { useState } from 'react'
import Lightbox from '../components/Lightbox'

const screenshots = [
  {
    number: '01',
    route: 'squabble.app/dashboard',
    image: '/images/squabble/dashboard.png',
    title: '持仓总览',
    tags: ['美/港/A 股', '多币种', '净值曲线'],
    description: '持仓、现金、盈亏与净值曲线一屏掌握，内置 USD/HKD/CNY 折算。',
  },
  {
    number: '02',
    route: 'squabble.app/today',
    image: '/images/squabble/daily-analysis.png',
    title: '今日研究与讨论',
    tags: ['多空辩论', '研究记忆'],
    description: '研究团队每日讨论：公开步骤与工具结果可展开，报告按日期与来源留存。',
  },
  {
    number: '03',
    route: 'squabble.app/reports',
    image: '/images/squabble/deep-report.png',
    title: '14 节深度研报',
    tags: ['多空辩论', '证据分级', '输者存档'],
    description: '多空辩论、批评者审视与风控硬门沉淀为 14 节报告，输掉的论点原文保留。',
  },
  {
    number: '04',
    route: 'squabble.app/paper',
    image: '/images/squabble/paper-trading.png',
    title: 'AI 模拟盘',
    tags: ['硬性风控', 'MCP 代理', '通知推送'],
    description: '策略确认后自动模拟成交，支持 MCP 代理下单与多渠道通知。',
  },
] as const

export default function SquabbleShowcase() {
  const [zoom, setZoom] = useState<{ src: string; caption: string } | null>(null)

  return (
    <section className="dp-showcase" aria-labelledby="dp-showcase-heading">
      <div className="dp-container">
        <header className="dp-showcase-heading">
          <div>
            <p className="dp-showcase-kicker"><i aria-hidden="true" />PRODUCT SHOWCASE / 产品截图</p>
            <h2 id="dp-showcase-heading">Inside the Workbench.</h2>
            <p>真实工作台截图：投研、记忆与模拟交易全流程。</p>
          </div>
          <a
            className="dp-live-link"
            href="https://github.com/Lueyu/squabble"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>VIEW SOURCE</span>
            <b aria-hidden="true">↗</b>
          </a>
        </header>
        <div className="dp-showcase-grid">
          {screenshots.map((screen) => (
            <article className="dp-showcase-card" key={screen.number}>
              <div className="dp-showcase-chrome">
                <span>{screen.route}</span>
                <img src="/images/squabble/chrome-dots.svg" width="31" height="7" alt="" />
              </div>
              <button type="button" className="dp-showcase-image" onClick={() => setZoom({ src: screen.image, caption: screen.title })} aria-label={`放大查看 ${screen.title} 截图`} title="点击放大">
                <img src={screen.image} width="1440" height="900" alt={`${screen.title}工作台截图`} loading="lazy" />
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
