import { useEffect } from "react"

interface LightboxProps {
  src: string
  alt?: string
  caption?: string
  onClose: () => void
}

export default function Lightbox({ src, alt, caption, onClose }: LightboxProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="px-lightbox" role="dialog" aria-modal="true" aria-label={alt ?? "图片放大查看"} onClick={onClose}>
      <div className="px-lightbox-inner" onClick={(event) => event.stopPropagation()}>
        <img src={src} alt={alt ?? ""} />
        {caption ? <p>{caption}</p> : null}
      </div>
      <button type="button" className="px-lightbox-close" onClick={onClose} aria-label="关闭放大视图">
        ×
      </button>
    </div>
  )
}
