import { useState } from 'react'

export default function JarvisWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="ki-fab"
        aria-label="KI öffnen"
        onClick={() => setOpen(true)}
      >
        <span className="ki-fab-label">KI</span>
      </button>

      {open && (
        <div className="jarvis-overlay" onClick={() => setOpen(false)}>
          <div className="jarvis-modal" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="jarvis-close"
              aria-label="Schließen"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <iframe
              src="/jarvis/index.html"
              className="jarvis-iframe"
              title="Jarvis KI"
            />
          </div>
        </div>
      )}
    </>
  )
}
