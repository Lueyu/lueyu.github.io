import { useState } from 'react'
import Lightbox from '../Lightbox'

export function BpTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="bp-table-wrap">
      <table className="bp-table">
        <thead>
          <tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function BpSection({ number, title, children }: { number?: string; title: string; children: React.ReactNode }) {
  return (
    <section className="bp-section">
      <h2>{number && <span className="bp-no">{number}</span>}{title}</h2>
      {children}
    </section>
  )
}

export function BpQuote({ tone = 'ok', children }: { tone?: 'ok' | 'bad'; children: React.ReactNode }) {
  return <blockquote className={`bp-quote${tone === 'bad' ? ' bp-quote-bad' : ''}`}>{children}</blockquote>
}

export function BpCode({ label, children }: { label?: string; children: string }) {
  return (
    <figure className="bp-code">
      {label && <figcaption>{label}</figcaption>}
      <pre><code>{children}</code></pre>
    </figure>
  )
}

export function BpFigure({ src, caption, alt, narrow = false }: { src: string; caption: string; alt: string; narrow?: boolean }) {
  const [zoom, setZoom] = useState(false)
  return (
    <figure className={`bp-figure${narrow ? ' bp-figure-narrow' : ''}`}>
      <button type="button" className="bp-figure-image" onClick={() => setZoom(true)} aria-label={`放大查看：${caption}`} title="点击放大">
        <img src={src} alt={alt} loading="lazy" />
      </button>
      <figcaption>{caption}</figcaption>
      {zoom && <Lightbox src={src} alt={alt} caption={caption} onClose={() => setZoom(false)} />}
    </figure>
  )
}
