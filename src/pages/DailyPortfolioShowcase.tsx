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
  return (
    <section className="dp-showcase" aria-labelledby="dp-showcase-heading">
      <div className="dp-container">
        <header className="dp-showcase-heading">
          <div>
            <p className="dp-showcase-kicker"><i aria-hidden="true" />PRODUCT SHOWCASE / 产品截图</p>
            <h2 id="dp-showcase-heading">Inside the Terminal.</h2>
            <p>真实工作台截图，展示投研与开发全流程。</p>
          </div>
          <span>PORTFOLIO TERMINAL / FOUR SCREENS</span>
        </header>
        <div className="dp-showcase-grid">
          {screenshots.map((screen) => (
            <article className="dp-showcase-card" key={screen.number}>
              <div className="dp-showcase-chrome">
                <span>{screen.route}</span>
                <img src="/images/daily-portfolio/chrome-dots.svg" width="31" height="7" alt="" />
              </div>
              <div className="dp-showcase-image">
                <img src={screen.image} width="1505" height="1216" alt={`${screen.title}工作台截图`} loading="lazy" />
              </div>
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
        <p className="dp-showcase-note"><i aria-hidden="true" />截图来自本地开发环境，route 标注仅为浏览器地址栏说明，不代表已上线的公开服务。</p>
      </div>
    </section>
  )
}
