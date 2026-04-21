import { useState } from 'react'
import { createPortal } from 'react-dom'

export default function JarvisWidget() {
  const [open, setOpen] = useState(false)

  return createPortal(
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
            <div className="jarvis-modal-bar">
              <button
                type="button"
                className="jarvis-close"
                aria-label="Schließen"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <iframe
              src="/jarvis/index.html"
              className="jarvis-iframe"
              title="Jarvis KI"
              allow="autoplay; microphone"
            />
          </div>
        </div>
      )}
    </>,
    document.body
  )
}
