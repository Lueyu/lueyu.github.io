import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { searchSite, type SiteSearchResult } from '../lib/siteSearch'
import '../search.css'

const KIND_LABELS: Record<SiteSearchResult['kind'], string> = {
  project: 'PROJECT',
  experience: 'EXPERIENCE',
  page: 'PAGE',
  blog: 'BLOG',
}

function isEditable(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(
    'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]',
  ))
}

export default function SiteSearch() {
  const navigate = useNavigate()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const backdropPointerRef = useRef(false)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const id = useId()
  const results = useMemo(() => searchSite(query), [query])
  const activeResult = results[activeIndex]
  const listId = `${id}-results`

  useEffect(() => {
    const hasOtherDialog = () => Array.from(document.querySelectorAll(
      'dialog[open], [role="dialog"], [role="alertdialog"]',
    )).some((element) => element !== dialogRef.current && element.getClientRects().length > 0)
    const openSearch = () => {
      const dialog = dialogRef.current
      if (!dialog || dialog.open || hasOtherDialog()) return

      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      setQuery('')
      setActiveIndex(0)
      dialog.showModal()
      setIsOpen(true)
      inputRef.current?.focus({ preventScroll: true })
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.repeat || isEditable(event.target)) return
      const slash = event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey
      const commandK = event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey
      if (!slash && !commandK) return
      if (dialogRef.current?.open || hasOtherDialog()) return
      event.preventDefault()
      openSearch()
    }
    window.addEventListener('lueyu:open-search', openSearch)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('lueyu:open-search', openSearch)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && activeResult) {
      document.getElementById(`${id}-${activeResult.id}`)?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeResult, id, isOpen])

  const close = () => dialogRef.current?.close()
  const visit = (result: SiteSearchResult) => {
    close()
    void navigate(result.href)
  }

  return (
    <dialog
      ref={dialogRef}
      className="site-search"
      aria-labelledby={`${id}-title`}
      onKeyDown={(event) => {
        // Search inputs otherwise consume Escape to clear their text first.
        if (event.key === 'Escape' && !event.nativeEvent.isComposing) {
          event.preventDefault()
          event.stopPropagation()
          close()
        }
      }}
      onClose={() => {
        setIsOpen(false)
        if (triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true })
        triggerRef.current = null
      }}
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onPointerDown={(event) => {
        backdropPointerRef.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        if (backdropPointerRef.current && event.target === event.currentTarget) close()
        backdropPointerRef.current = false
      }}
    >
      <div className="site-search-panel">
        <header className="site-search-heading">
          <div>
            <span className="site-search-eyebrow">QUICK FIND</span>
            <h2 id={`${id}-title`}>搜索本站</h2>
          </div>
          <button type="button" className="site-search-close" onClick={close} aria-label="关闭搜索">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="site-search-field">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 3h10v10H3zM13 13h3v3h3v3" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            ref={inputRef}
            id={`${id}-input`}
            type="search"
            role="combobox"
            aria-label="搜索项目、经历与技术标签"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-activedescendant={activeResult ? `${id}-${activeResult.id}` : undefined}
            aria-describedby={`${id}-help`}
            placeholder="项目、经历、技术标签…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault()
                if (!results.length) return
                const direction = event.key === 'ArrowDown' ? 1 : -1
                setActiveIndex((index) => (index + direction + results.length) % results.length)
              } else if (event.key === 'Enter' && activeResult) {
                event.preventDefault()
                visit(activeResult)
              }
            }}
          />
          <kbd aria-hidden="true">/</kbd>
        </div>

        <div className="site-search-summary" role="status" aria-live="polite" aria-atomic="true">
          <span>{query.trim() ? 'SEARCH RESULTS' : 'EXPLORE THE SITE'}</span>
          <span>{results.length} 个结果</span>
        </div>
        <div id={listId} className="site-search-results" role="listbox" aria-label="搜索结果">
          {results.map((result, index) => (
            <button
              key={result.id}
              id={`${id}-${result.id}`}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={index === activeIndex}
              className="site-search-result"
              onPointerMove={() => setActiveIndex(index)}
              onClick={() => visit(result)}
            >
              <span className="site-search-result-heading">
                <strong>{result.title}</strong>
                <span className="site-search-kind">{KIND_LABELS[result.kind]}</span>
              </span>
              <span className="site-search-description">{result.description}</span>
              <span className="site-search-tags">
                {result.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </span>
              <span className="site-search-enter" aria-hidden="true">↵</span>
            </button>
          ))}
        </div>
        {results.length === 0 && (
          <div className="site-search-empty">
            <span aria-hidden="true">[ ? ]</span>
            <strong>还没有找到匹配内容</strong>
            <p>试试 AIDR、React、Python，或减少关键词。</p>
          </div>
        )}
        <footer id={`${id}-help`} className="site-search-help">
          <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
          <span><kbd>Enter</kbd> 打开</span>
          <span><kbd>Esc</kbd> 关闭</span>
          <span className="site-search-shortcut"><kbd>Ctrl / ⌘ K</kbd></span>
        </footer>
      </div>
    </dialog>
  )
}
