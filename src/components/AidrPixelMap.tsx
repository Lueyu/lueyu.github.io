import '../aidr.css'

type SpriteColorMap = Record<string, string>

const BOT: string[] = [
  '.....22.....',
  '....2112....',
  '.....22.....',
  '..22222222..',
  '.2211111122.',
  '.2113311122.',
  '.2113311122.',
  '.2211111122.',
  '..22222222..',
  '...22..22...',
  '...22..22...',
  '..222..222..',
]

const BOT_COLORS: SpriteColorMap = {
  '1': 'var(--paper)',
  '2': 'var(--ink)',
  '3': 'var(--red)',
}

const TAPE: string[] = [
  '..222222222..',
  '.21111111112.',
  '.21333333312.',
  '.21333333312.',
  '.21111111112.',
  '.21111111112.',
  '.21333333312.',
  '.21333333312.',
  '.21111111112.',
  '..222222222..',
]

const TAPE_COLORS: SpriteColorMap = {
  '1': 'var(--paper)',
  '2': 'var(--ink)',
  '3': 'var(--blue)',
}

const GEM: string[] = [
  '..333..',
  '.33333.',
  '3333333',
  '.33333.',
  '..333..',
  '...3...',
]

const GEM_COLORS: SpriteColorMap = {
  '3': 'var(--red)',
}

function PixelSprite({ pixels, colors, x, y, scale = 3, className }: {
  pixels: string[]
  colors: SpriteColorMap
  x: number
  y: number
  scale?: number
  className?: string
}) {
  return (
    <g className={className} transform={`translate(${x},${y})`}>
      {pixels.map((row, ry) =>
        row.split('').map((cell, rx) =>
          cell === '.' ? null : (
            <rect
              key={`${rx}-${ry}`}
              x={rx * scale}
              y={ry * scale}
              width={scale}
              height={scale}
              fill={colors[cell]}
            />
          ),
        ),
      )}
    </g>
  )
}

function ZoneLabel({ x, y, num, title, sub }: { x: number; y: number; num: string; title: string; sub?: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text className="px-num" x="0" y="14">{num}</text>
      <text className="px-title" x="26" y="14">{title}</text>
      {sub && <text className="px-sub" x="26" y="27">{sub}</text>}
    </g>
  )
}

export default function AidrPixelMap() {
  return (
    <section className="ad-pixelmap" id="ad-system" aria-labelledby="px-map-heading">
      <div className="ad-container">
        <header className="ad-map-heading">
          <div>
            <p className="ad-map-kicker"><i aria-hidden="true" />ARCHITECTURE MAP / ONE GRAPH, THREE PLANES</p>
            <h2 id="px-map-heading">AIDR / 一张图</h2>
            <p>Agent 的每一步流进同一张图：调用边画出爆炸半径，轨迹给出行为证据，保护组把两者固化成原子恢复单元。</p>
          </div>
          <div className="ad-map-legend">
            <span>BLAST-RADIUS PIPELINE</span>
            <span><i className="px-led px-led-green" aria-hidden="true" /> 实时流动 · steps 逐格动效</span>
          </div>
        </header>

        <div className="px-frame">
          <svg viewBox="0 0 960 430" role="img" aria-label="AIDR 架构图：Agent 的工具调用与轨迹进入 AIDR 核心，形成保护组后交给可插拔备份引擎，原子恢复让 Agent 与数据一起回滚">
            <rect className="px-bg" x="0" y="0" width="960" height="430" />

            <text className="px-banner" x="24" y="30">AIDR // BLAST-RADIUS-AWARE BACKUP</text>
            <text className="px-banner-right" x="936" y="30">LEVEL 01</text>
            <line className="px-rule" x1="16" y1="42" x2="944" y2="42" />

            <line className="px-divider" x1="292" y1="56" x2="292" y2="384" />
            <line className="px-divider" x1="668" y1="56" x2="668" y2="384" />

            <ZoneLabel x={24} y={72} num="01" title="AGENT" sub="自主干活的软件员工" />
            <PixelSprite pixels={BOT} colors={BOT_COLORS} x={64} y={100} scale={6} className="px-blink" />
            <text className="px-tag px-tag-ink" x="150" y="130">opencode / dify / ...</text>
            <text className="px-tag" x="150" y="146">规划 · 调工具 · 留轨迹</text>

            <text className="px-flow-label px-flow-green" x="24" y="216">TOOL CALLS ▸</text>
            <text className="px-flow-label px-flow-blue" x="24" y="300">OTLP TRACES ▸</text>
            <text className="px-note" x="24" y="234">谁 · 调了什么工具 · 碰了什么数据</text>
            <text className="px-note" x="24" y="318">每一步行为证据，可审计</text>

            <line className="px-wire px-wire-green" x1="120" y1="224" x2="292" y2="150" />
            <line className="px-wire px-wire-blue" x1="120" y1="308" x2="292" y2="272" />
            <rect className="px-packet px-packet-green" x="196" y="180" width="7" height="7" />
            <rect className="px-packet px-packet-blue" x="196" y="288" width="7" height="7" />

            <ZoneLabel x={312} y={72} num="02" title="AIDR CORE" sub="发现 · 观测 · 保护 共享一张图" />

            <g className="px-graph">
              <text className="px-chip" x="312" y="128">TOOL-CALL GRAPH</text>
              <line className="px-edge" x1="352" y1="170" x2="420" y2="150" />
              <line className="px-edge" x1="420" y1="150" x2="488" y2="172" />
              <line className="px-edge" x1="488" y1="172" x2="556" y2="146" />
              <rect className="px-node" x="344" y="162" width="16" height="16" />
              <rect className="px-node" x="412" y="142" width="16" height="16" />
              <rect className="px-node" x="480" y="164" width="16" height="16" />
              <rect className="px-node px-node-hot" x="548" y="138" width="16" height="16" />
              <circle className="px-ripple" cx="556" cy="146" r="10" />
              <text className="px-node-label" x="352" y="196">agent</text>
              <text className="px-node-label" x="412" y="176">tool</text>
              <text className="px-node-label" x="484" y="198">resource</text>
              <text className="px-node-label px-node-label-hot" x="540" y="128">BFS</text>
            </g>
            <text className="px-note" x="312" y="216">连通分量 = 一个保护组的边界</text>

            <line className="px-rule px-rule-faint" x1="312" y1="238" x2="648" y2="238" />

            <text className="px-chip px-chip-blue" x="312" y="264">OBSERVE / OTLP</text>
            <rect className="px-tile" x="312" y="276" width="60" height="24" />
            <text className="px-tile-text" x="342" y="292" textAnchor="middle">OTLP</text>
            <text className="px-arrow" x="380" y="292">▸▸</text>
            <rect className="px-tile" x="396" y="276" width="72" height="24" />
            <text className="px-tile-text" x="432" y="292" textAnchor="middle">CLICKHOUSE</text>
            <text className="px-arrow" x="476" y="292">▸▸</text>
            <rect className="px-tile px-tile-red" x="492" y="276" width="60" height="24" />
            <text className="px-tile-text px-tile-text-red" x="522" y="292" textAnchor="middle">RISK</text>
            <text className="px-note" x="312" y="330">langfuse-service：三级归属 + 风险分级写回轨迹</text>
            <text className="px-note px-note-strong" x="312" y="352">观测与保护共享同一张图</text>

            <ZoneLabel x={688} y={72} num="03" title="PROTECT" sub="可插拔的执行面" />

            <g className="px-group-box">
              <rect className="px-group" x="700" y="96" width="200" height="86" />
              <PixelSprite pixels={BOT} colors={BOT_COLORS} x={716} y={112} scale={3} />
              <PixelSprite pixels={GEM} colors={GEM_COLORS} x={790} y={120} scale={4} />
              <text className="px-tag" x="836" y="130">DATA</text>
              <text className="px-tag px-tag-ink" x="716" y="170">PROTECTION GROUP</text>
            </g>

            <line className="px-wire px-wire-red" x1="800" y1="182" x2="800" y2="212" />
            <text className="px-flow-label px-flow-red" x="688" y="204">60s RECOMPUTE ▼</text>

            <PixelSprite pixels={TAPE} colors={TAPE_COLORS} x={700} y={222} scale={4} />
            <text className="px-chip" x="766" y="240">BACKUP ENGINE</text>
            <text className="px-note" x="766" y="254">restic | 企业存储 | ...</text>
            <text className="px-tag px-tag-ink" x="700" y="286">同一套 4 端点契约</text>

            <line className="px-wire px-wire-red" x1="800" y1="292" x2="800" y2="316" />
            <rect className="px-tile px-tile-red px-blink" x="700" y="318" width="200" height="28" />
            <text className="px-tile-text px-tile-text-red px-restore-text" x="800" y="337" textAnchor="middle">ATOMIC RESTORE ▸</text>

            <path className="px-restore-path" d="M 700 332 L 430 332 L 430 396 L 120 396 L 120 260" />
            <text className="px-restore-label" x="250" y="390">恢复 = Agent 与数据世界一起回滚，复活不失忆</text>

            <rect className="px-ground" x="16" y="406" width="928" height="6" />
            <rect className="px-ground px-ground-dim" x="16" y="412" width="928" height="2" />
            <g className="px-leds">
              <rect className="px-led px-led-green" x="700" y="398" width="10" height="10" />
              <text className="px-led-label" x="718" y="407">OBSERVE</text>
              <rect className="px-led px-led-red" x="790" y="398" width="10" height="10" />
              <text className="px-led-label" x="808" y="407">PROTECT</text>
              <rect className="px-led px-led-blue" x="880" y="398" width="10" height="10" />
              <text className="px-led-label" x="898" y="407">RECOVER</text>
            </g>

            <rect className="px-scanline" x="0" y="0" width="4" height="430" />
          </svg>
        </div>
      </div>
    </section>
  )
}
