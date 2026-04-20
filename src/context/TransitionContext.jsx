import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { animate, motion } from 'framer-motion'

const TransitionContext = createContext(null)

// --- Shared constants (used by both animations) ---
const LOGO_INIT = 88
const ROT_DUR   = 0.42
const ROT_EASE  = [0.34, 1.56, 0.64, 1]
const EXP_DELAY = 0.36
const EXP_DUR   = 1.4
const EXP_EASE  = [0.4, 0, 1, 1]

function takeSnapshot() {
  const scrollY = window.scrollY
  const root = document.getElementById('root')
  if (!root) return null
  const clone = root.cloneNode(true)
  clone.querySelectorAll('.main-nav, .nav-top-backdrop').forEach(el => {
    el.style.display = 'none'
  })
  // Shift clone up so the currently-visible viewport portion appears at top of the fixed overlay
  clone.style.transform = `translateY(-${scrollY}px)`
  return clone
}

// --- Original animation (kept for reference, currently unused) ---
function LogoReveal({ snapshot, onDone }) {
  const wrapRef    = useRef(null)
  const overlayRef = useRef(null)

  const mountSnapshot = useCallback((node) => {
    overlayRef.current = node
    if (node && snapshot) {
      node.appendChild(snapshot)
    }
  }, [snapshot])

  useEffect(() => {
    const overlay = overlayRef.current
    const wrap    = wrapRef.current
    if (!overlay || !wrap) return

    const maxD = (Math.hypot(window.innerWidth, window.innerHeight) + 50) * 2

    const ctrl = animate(LOGO_INIT, maxD, {
      duration: EXP_DUR,
      ease:     EXP_EASE,
      delay:    EXP_DELAY,
      onUpdate(d) {
        const r = d / 2
        const m = `radial-gradient(circle at 50% 50%, transparent ${r}px, black ${r}px)`
        if (overlay) { overlay.style.maskImage = m; overlay.style.WebkitMaskImage = m }
        if (wrap)    { wrap.style.width = `${d}px`; wrap.style.height = `${d}px` }
      },
      onComplete: onDone,
    })

    return () => ctrl.stop()
  }, [onDone])

  return createPortal(
    <>
      <div
        ref={mountSnapshot}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          pointerEvents: 'none',
          overflow: 'hidden',
          transform: 'scale(1)',
          maskImage:       `radial-gradient(circle at 50% 50%, transparent ${LOGO_INIT / 2}px, black ${LOGO_INIT / 2}px)`,
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${LOGO_INIT / 2}px, black ${LOGO_INIT / 2}px)`,
        }}
      />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div ref={wrapRef} style={{ width: LOGO_INIT, height: LOGO_INIT, flexShrink: 0 }}>
          <motion.img
            src="/Corp-Logo_BG_Bayer-Cross_Basic_on-screen_RGB.svg"
            alt="" aria-hidden
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            initial={{ rotate: -45 }}
            animate={{ rotate: 0 }}
            transition={{ duration: ROT_DUR, ease: ROT_EASE }}
          />
        </div>
      </div>
    </>,
    document.body
  )
}

// --- Weiter-button animation (initially identical to LogoReveal, customise here) ---
function WeiterReveal({ snapshot, onDone }) {
  const wrapRef    = useRef(null)
  const overlayRef = useRef(null)

  const mountSnapshot = useCallback((node) => {
    overlayRef.current = node
    if (node && snapshot) {
      node.appendChild(snapshot)
    }
  }, [snapshot])

  useEffect(() => {
    const overlay = overlayRef.current
    const wrap    = wrapRef.current
    if (!overlay || !wrap) return

    const maxD = (Math.hypot(window.innerWidth, window.innerHeight) + 50) * 2

    const ctrl = animate(LOGO_INIT, maxD, {
      duration: EXP_DUR,
      ease:     EXP_EASE,
      delay:    EXP_DELAY,
      onUpdate(d) {
        const r = d / 2
        const m = `radial-gradient(circle at 50% 50%, transparent ${r}px, black ${r}px)`
        if (overlay) { overlay.style.maskImage = m; overlay.style.WebkitMaskImage = m }
        if (wrap)    { wrap.style.width = `${d}px`; wrap.style.height = `${d}px` }
      },
      onComplete: onDone,
    })

    return () => ctrl.stop()
  }, [onDone])

  return createPortal(
    <>
      <div
        ref={mountSnapshot}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          pointerEvents: 'none',
          overflow: 'hidden',
          transform: 'scale(1)',
          maskImage:       `radial-gradient(circle at 50% 50%, transparent ${LOGO_INIT / 2}px, black ${LOGO_INIT / 2}px)`,
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${LOGO_INIT / 2}px, black ${LOGO_INIT / 2}px)`,
        }}
      />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div ref={wrapRef} style={{ width: LOGO_INIT, height: LOGO_INIT, flexShrink: 0 }}>
          <motion.img
            src="/Corp-Logo_BG_Bayer-Cross_Basic_on-screen_RGB.svg"
            alt="" aria-hidden
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            initial={{ rotate: -45 }}
            animate={{ rotate: 0 }}
            transition={{ duration: ROT_DUR, ease: ROT_EASE }}
          />
        </div>
      </div>
    </>,
    document.body
  )
}

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const [overlay, setOverlay] = useState(null)       // LogoReveal (unused by default now)
  const [weiterOverlay, setWeiterOverlay] = useState(null) // WeiterReveal

  // Kept for potential reuse — not called by TransitionLink anymore
  const triggerTransition = useCallback((path, _x, _y, state) => {
    const snapshot = takeSnapshot()
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    navigate(path, { state })
    setOverlay({ snapshot })
  }, [navigate])

  // Used exclusively by the Weiter button on Home
  const triggerWeiterTransition = useCallback((path, _x, _y, state) => {
    const snapshot = takeSnapshot()
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    navigate(path, { state })
    setWeiterOverlay({ snapshot })
  }, [navigate])

  const onDone        = useCallback(() => setOverlay(null), [])
  const onWeiterDone  = useCallback(() => setWeiterOverlay(null), [])

  return (
    <TransitionContext.Provider value={{ triggerTransition, triggerWeiterTransition, active: !!overlay || !!weiterOverlay }}>
      {children}
      {overlay       && <LogoReveal   snapshot={overlay.snapshot}       onDone={onDone} />}
      {weiterOverlay && <WeiterReveal snapshot={weiterOverlay.snapshot} onDone={onWeiterDone} />}
    </TransitionContext.Provider>
  )
}

export const usePageTransition = () => useContext(TransitionContext)
