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
const EXP_DUR   = 0.5
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

// --- Weiter-button animation ---
// Phase 1: button (masked circle) slides to screen center
// Phase 2: circle expands; arrow cutout reveals new page; snapshot masks old page outside
function WeiterReveal({ snapshot, buttonRect, onDone }) {
  const overlayRef = useRef(null)
  const btnWrapRef = useRef(null)
  const [phase, setPhase] = useState('move')

  const mountSnapshot = useCallback((node) => {
    overlayRef.current = node
    if (node && snapshot) node.appendChild(snapshot)
  }, [snapshot])

  const cx = window.innerWidth  / 2
  const cy = window.innerHeight / 2
  const bx = buttonRect.left + buttonRect.width  / 2
  const by = buttonRect.top  + buttonRect.height / 2
  const bs = buttonRect.width

  useEffect(() => {
    if (phase !== 'expand') return
    const overlay = overlayRef.current
    const wrap    = btnWrapRef.current
    if (!overlay || !wrap) return

    const maxD = (Math.hypot(window.innerWidth, window.innerHeight) + 50) * 2

    const ctrl = animate(bs, maxD, {
      duration: EXP_DUR,
      ease:     EXP_EASE,
      onUpdate(d) {
        const r = d / 2
        const m = `radial-gradient(circle at 50% 50%, transparent ${r}px, black ${r}px)`
        overlay.style.maskImage       = m
        overlay.style.WebkitMaskImage = m
        wrap.style.width  = `${d}px`
        wrap.style.height = `${d}px`
      },
      onComplete: onDone,
    })

    return () => ctrl.stop()
  }, [phase, onDone, bs])

  return createPortal(
    <>
      {/* Old-page snapshot: fully visible in move phase, masked outside circle in expand phase */}
      <div
        ref={mountSnapshot}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          pointerEvents: 'none', overflow: 'hidden', transform: 'scale(1)',
          ...(phase === 'expand' ? {
            maskImage:       `radial-gradient(circle at 50% 50%, transparent ${bs / 2}px, black ${bs / 2}px)`,
            WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${bs / 2}px, black ${bs / 2}px)`,
          } : {}),
        }}
      />

      {/* Dark circle with arrow cutout — new page visible through arrow hole */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <motion.div
          ref={btnWrapRef}
          style={{ flexShrink: 0, width: bs, height: bs }}
          initial={{ x: bx - cx, y: by - cy }}
          animate={{ x: 0, y: 0 }}
          transition={{ duration: 0.38, ease: [0.32, 0, 0.18, 1] }}
          onAnimationComplete={() => { if (phase === 'move') setPhase('expand') }}
        >
          <svg
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              <linearGradient id="weiterGrad" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#10384f" />
                <stop offset="1" stopColor="#00617f" />
              </linearGradient>
              <mask id="weiterArrowCutout">
                <rect width="24" height="24" fill="white" />
                <polyline
                  points="9 18 15 12 9 6"
                  stroke="black"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </mask>
            </defs>
            <circle cx="12" cy="12" r="12" fill="url(#weiterGrad)" mask="url(#weiterArrowCutout)" />
          </svg>
        </motion.div>
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
  const triggerWeiterTransition = useCallback((path, buttonRect, state) => {
    const snapshot = takeSnapshot()
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    navigate(path, { state })
    setWeiterOverlay({ snapshot, buttonRect })
  }, [navigate])

  const onDone        = useCallback(() => setOverlay(null), [])
  const onWeiterDone  = useCallback(() => setWeiterOverlay(null), [])

  return (
    <TransitionContext.Provider value={{ triggerTransition, triggerWeiterTransition, active: !!overlay || !!weiterOverlay }}>
      {children}
      {overlay       && <LogoReveal   snapshot={overlay.snapshot}       onDone={onDone} />}
      {weiterOverlay && <WeiterReveal snapshot={weiterOverlay.snapshot} buttonRect={weiterOverlay.buttonRect} onDone={onWeiterDone} />}
    </TransitionContext.Provider>
  )
}

export const usePageTransition = () => useContext(TransitionContext)
