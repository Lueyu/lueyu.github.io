import '../aidr-architecture.css'
import { useNight } from './ThemeToggle'
import desktopDark from '../assets/aidr-architecture/desktop-dark.svg?raw'
import desktopLight from '../assets/aidr-architecture/desktop-light.svg?raw'
import mobileDark from '../assets/aidr-architecture/mobile-dark.svg?raw'
import mobileLight from '../assets/aidr-architecture/mobile-light.svg?raw'

const description = 'AIDR 架构：Agent 的真实工具调用进入 AIDR Core，自动推导保护组；保护组交给可插拔备份引擎，原子恢复 Agent 与数据。行为轨迹同时进入观测与风险分级链路。'

function Flow({ mobile }: { mobile: boolean }) {
  return (
    <svg className="ad-architecture-motion" viewBox={mobile ? '0 0 440 1800' : '0 0 1600 900'} aria-hidden="true" focusable="false">
      {mobile ? (
        <>
          <rect width="7" height="7" fill="var(--arch-green)"><animateMotion dur="10s" repeatCount="indefinite" path="M232 328 V374" /></rect>
          <rect width="7" height="7" fill="var(--arch-red)"><animateMotion dur="10s" repeatCount="indefinite" path="M232 804 V850 M232 1102 V1148 M232 1356 V1402" /></rect>
          <rect width="7" height="7" fill="var(--arch-blue)"><animateMotion dur="10s" repeatCount="indefinite" path="M342 308 H424 V762 H412" /></rect>
          <rect width="7" height="7" fill="var(--arch-red)"><animateMotion dur="10s" repeatCount="indefinite" path="M44 1564 H16 V274 H44" /></rect>
        </>
      ) : (
        <>
          <rect width="8" height="8" fill="var(--arch-green)"><animateMotion dur="10s" repeatCount="indefinite" path="M226 421 H300" /></rect>
          <rect width="8" height="8" fill="var(--arch-red)"><animateMotion dur="10s" repeatCount="indefinite" path="M810 421 H888 M1088 421 H1151 M1314 421 H1381" /></rect>
          <rect width="8" height="8" fill="var(--arch-blue)"><animateMotion dur="10s" repeatCount="indefinite" path="M136 520 V716 H300" /></rect>
          <rect width="8" height="8" fill="var(--arch-red)"><animateMotion dur="10s" repeatCount="indefinite" path="M1551 438 H1574 V770 H136 V520" /></rect>
        </>
      )}
    </svg>
  )
}

export default function AidrPixelMap() {
  const isNight = useNight()

  return (
    <section className="ad-architecture" id="ad-system" aria-label="AIDR 原理架构图">
      <div className="ad-architecture-figure" role="img" aria-label={description}>
        {/* Inline the trusted Figma SVGs so their text uses this site's Pixelify and Noto fonts. */}
        <div className="ad-architecture-desktop" aria-hidden="true" dangerouslySetInnerHTML={{ __html: isNight ? desktopDark : desktopLight }} />
        <div className="ad-architecture-mobile" aria-hidden="true" dangerouslySetInnerHTML={{ __html: isNight ? mobileDark : mobileLight }} />
        <Flow mobile={false} />
        <Flow mobile />
      </div>
    </section>
  )
}
