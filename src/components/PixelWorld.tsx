export default function PixelWorld() {
  return <figure className="pixel-world" aria-label="像素世界：程序员站在树木、问号方块和旗帜之间">
    <div className="pixel-world-top"><span><i /> WORLD 1–1</span><span>HELLO, WORLD!</span></div>
    <div className="pixel-world-screen">
      <svg viewBox="0 0 480 280" role="img" aria-label="Lueyu 的像素游戏场景" shapeRendering="crispEdges">
        <defs><pattern id="world-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" strokeOpacity=".045" /></pattern><pattern id="world-ground" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 0H24V24H0Z" fill="#283e35"/><path d="M0 0H24M0 0V24M12 11H24" fill="none" stroke="#4d7355" strokeWidth="2" /></pattern></defs>
        <path className="world-sky" d="M0 0H480V280H0Z"/><path d="M0 0H480V280H0Z" fill="url(#world-grid)"/>
        <g className="world-stars" fill="#e6b94c"><path d="M50 48h4v4h-4zM114 84h3v3h-3zM280 40h3v3h-3zM348 94h4v4h-4zM434 126h3v3h-3z"/><path d="M168 34h4v12h-4zM164 38h12v4h-12zM300 112h4v12h-4zM296 116h12v4h-12z" opacity=".55"/></g>
        <path className="world-sun" d="M399 34h24v8h8v24h-8v8h-24v-8h-8V42h8z" fill="#e6b94c"/>
        <g className="world-moon"><path d="M399 34h24v8h8v24h-8v8h-24v-8h-8V42h8z" fill="#f1e7d2"/><path className="world-moon-cut" d="M411 26h24v40h-16v-8h-8z"/></g>
        <g fill="#92aabc" opacity=".22"><path d="M36 104h16V92h28v12h20v16H36z"/><path d="M266 75h12V63h24v12h20v12h-56z"/></g>
        <path d="M0 214h48v-12h48v12h48v-12h72v12h48v-12h72v12h72v-12h72v52H0Z" fill="#4d7355" opacity=".12"/>
        <g stroke="#15211f" strokeWidth="3"><path d="M70 152h14v88H70z" fill="#96704e"/><path d="M48 110h56v14h14v48h-14v16H48v-16H34v-48h14z" fill="#4d7355"/><path d="M90 125h14v47H90zM48 172h42v13H48z" fill="#3b5944" stroke="none"/><path d="M336 182h10v58h-10z" fill="#96704e"/><path d="M322 155h38v12h10v31h-10v10h-38v-10h-10v-31h10z" fill="#719678"/></g>
        <g stroke="#422d20" strokeWidth="3" fill="#bd7151"><path d="M131 145h32v24h-32zM163 145h32v24h-32zM195 145h32v24h-32z"/><path d="M131 157h96M147 145v12m32 0v12m32-24v12" strokeWidth="2"/></g>
        <g className="world-question"><path d="M245 108h36v36h-36z" fill="#e6b94c" stroke="#624b26" strokeWidth="3"/><path d="M256 118h12v4h-4v5h-4v-8h-4zm4 14h4v4h-4z" fill="#433323"/></g>
        <g className="world-player" stroke="#17212c" strokeWidth="3"><path d="M227 181h25v27h-25z" fill="#c79366"/><path d="M227 181h25v8h-25z" fill="#24241f"/><path d="M240 193h4v5h-4z" fill="#24241f" stroke="none"/><path d="M222 207h34v23h-34z" fill="#7596b5"/><path d="M216 209h7v22h-7zm39 0h7v22h-7z" fill="#c79366"/><path d="M225 230h10v10h-10zm18 0h10v10h-10z" fill="#24241f"/></g>
        <g><path d="M405 112h4v129h-4z" fill="#d8d6bf"/><path d="M401 104h12v12h-12z" fill="#e6b94c"/><path d="M410 122h40v28h-40z" fill="#d6513c"/><path d="M420 129v14m10-14v14m-10-7h10m7-7v14" stroke="#fff2d5" strokeWidth="3"/><path d="M398 237h18v4h-18z" fill="#d8d6bf"/></g>
        <path d="M0 240h480v40H0z" fill="url(#world-ground)"/><path d="M0 240h480v5H0z" fill="#719678"/>
        <g fill="#e6b94c"><path d="M149 227h4v13h-4zM145 230h12v4h-12z"/><path d="M296 228h4v12h-4zM292 231h12v4h-12z" fill="#ed6a55"/></g>
      </svg>
    </div>
    <figcaption><span><i /> BUILDING AI AGENTS</span><span>KEEP EXPLORING →</span></figcaption>
  </figure>
}
