import { useState } from 'react'
import './pixel-world.css'

export default function PixelWorld() {
  const [paused, setPaused] = useState(false)
  return <figure className={`pixel-world${paused ? ' is-paused' : ''}`} aria-label="欢迎来到 Lueyu 的像素世界">
    <div className="pixel-world-top">
      <span><i /> WORLD 1–1</span>
      <button className="world-motion-toggle" type="button" onClick={() => setPaused(!paused)} aria-label={paused ? '播放欢迎动画' : '暂停欢迎动画'} aria-pressed={paused}>
        <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span> {paused ? '播放' : '暂停'}
      </button>
    </div>
    <div className="pixel-world-screen">
      <svg viewBox="0 0 600 340" role="img" aria-label="像素角色跳起顶问号方块，弹出 WELCOME 欢迎字样" shapeRendering="crispEdges">
        <defs>
          <pattern id="world-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" strokeOpacity=".035" /></pattern>
          <pattern id="world-ground" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M0 0H28V28H0Z" fill="#263f35"/><path d="M0 0H28M0 0V28M14 14H28" fill="none" stroke="#486c52" strokeWidth="2" /></pattern>
          <g id="world-cloud"><path d="M0 24h12V12h16V0h24v8h16v12h16v20H0Z"/><path d="M0 32h84v8H0Z" fill="currentColor" opacity=".14"/></g>
        </defs>
        <path className="world-sky" d="M0 0H600V340H0Z"/>
        <path d="M0 0H600V340H0Z" fill="url(#world-grid)"/>
        <g className="world-stars" fill="#e9c86b"><path d="M174 39h3v3h-3zM426 49h3v3h-3zM550 136h3v3h-3zM46 157h3v3h-3z"/><path className="world-twinkle" d="M380 28h4v12h-4zM376 32h12v4h-12zM156 126h4v12h-4zM152 130h12v4h-12z"/></g>
        <g className="world-sun" fill="#e6b94c"><path d="M504 34h24v8h8v24h-8v8h-24v-8h-8V42h8z"/></g>
        <path className="world-moon" d="M518 30h16v8h-16v8h-8v24h8v8h16v8h-24v-8h-8v-8h-8V46h8v-8h16z" fill="#f3d88b"/>
        <g className="world-clouds"><use href="#world-cloud" x="55" y="55"/><use href="#world-cloud" x="406" y="102"/></g>
        <path d="M0 270h32v-24h32v-24h40v24h32v24h40v16H0ZM386 286v-30h28v-26h32v-20h32v20h32v26h40v30Z" fill="#52765e" opacity=".16"/>
        <path d="M0 284h88v-16h50v16h76v-10h50v12h96v-18h64v16h76v-12h100v34H0Z" fill="#52765e" opacity=".12"/>
        <g stroke="#1a3027" strokeWidth="3">
          <path d="M91 219h13v67H91Z" fill="#a67d53"/>
          <path d="M66 183h16v-14h32v14h16v17h12v30h-14v13H68v-13H54v-30h12Z" fill="#608568"/>
          <path d="M68 230h60v13H68ZM114 185h14v45h-14Z" fill="#426249" stroke="none"/>
          <path d="M457 246h10v40h-10Z" fill="#a67d53"/>
          <path d="M443 219h12v-12h22v12h12v12h8v25h-12v10h-42v-10h-10v-25h10Z" fill="#82a583"/>
        </g>
        <g stroke="#4b352a" strokeWidth="3" fill="#b87556">
          <path d="M244 166h36v36h-36zM320 166h36v36h-36z"/>
          <path d="M244 184h36M262 166v18m-10 0v18M320 184h36M338 166v18m-10 0v18" strokeWidth="2"/>
        </g>
        <g className="world-reward">
          <path d="M197 89h206v40H197z" fill="#0d191f" opacity=".8"/>
          <text x="300" y="118" textAnchor="middle" className="world-welcome">WELCOME</text>
          <path d="M185 101h4v12h-4zM181 105h12v4h-12zM413 97h4v12h-4zM409 101h12v4h-12z" fill="#e9c86b"/>
        </g>
        <g className="world-question">
          <path d="M282 166h36v36h-36z" fill="#edbd51" stroke="#77582c" strokeWidth="3"/>
          <path d="M287 171h26M287 171v26" fill="none" stroke="#ffe294" strokeWidth="2"/>
          <path d="M293 175h14v4h-4v7h-5v-7h-5zm5 16h5v4h-5z" fill="#604626"/>
        </g>
        <g className="world-player" stroke="#182b30" strokeWidth="2">
          <path d="M290 245h20v20h-20z" fill="#d3a078"/>
          <path d="M288 242h20v5h6v4h-26z" fill="#e46b52"/>
          <path d="M303 252h3v4h-3z" fill="#26383c" stroke="none"/>
          <path d="M287 264h26v16h-26z" fill="#7ca3bf"/>
          <path d="M283 265h5v13h-5zm30 0h5v13h-5z" fill="#d3a078"/>
          <path d="M288 280h9v6h-9zm15 0h10v6h-10z" fill="#e7d8bb"/>
        </g>
        <g>
          <path d="M530 175h4v111h-4Z" fill="#ddd8bc"/>
          <path d="M526 167h12v12h-12Z" fill="#edbd51"/>
          <path d="M534 184h38v30h-38Z" fill="#db6850"/>
          <text x="553" y="205" textAnchor="middle" fill="#fff1d4" fontFamily="var(--pixel)" fontSize="20">HI</text>
          <path d="M523 282h18v5h-18Z" fill="#ddd8bc"/>
        </g>
        <path d="M0 286h600v54H0Z" fill="url(#world-ground)"/>
        <path d="M0 286h600v6H0Z" fill="#7b9f78"/>
        <path d="M0 292h600v4H0Z" fill="#35523d"/>
        <g fill="#edbd51"><path d="M180 273h4v13h-4zM176 277h12v4h-12z"/><path d="M386 273h4v13h-4zM382 277h12v4h-12z" fill="#e87b64"/></g>
      </svg>
    </div>
    <figcaption><span><i /> BUILDING AI AGENTS</span><span>LET’S BUILD SOMETHING.</span></figcaption>
  </figure>
}
