import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import MainNav from '../components/MainNav'
import Footer from '../components/Footer'
import Button from '../components/ui/Button'
import './Beratung.css'

/* ══════════════════════════════════════════
   BERATUNG NAV (nur auf Beratung-Seite)
══════════════════════════════════════════ */
const KULTUREN = [
  { value: 'mais',         label: 'Mais' },
  { value: 'getreide',     label: 'Getreide' },
  { value: 'raps',         label: 'Raps' },
  { value: 'ruebe',        label: 'Rübe' },
  { value: 'kartoffel',    label: 'Kartoffel' },
  { value: 'hopfen',       label: 'Hopfen' },
  { value: 'winterweizen', label: 'Winterweizen' },
  { value: 'triticale',    label: 'Triticale' },
  { value: 'winterroggen', label: 'Winterroggen' },
  { value: 'sommerweizen', label: 'Sommerweizen' },
  { value: 'wintergerste', label: 'Wintergerste' },
  { value: 'sommergerste', label: 'Sommergerste' },
  { value: 'zuckerrueben', label: 'Zuckerrüben' },
]

const STICKY_TOP = 16

function BeratungNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const routeState = location.state || {}

  function scrollTo(e, sectionId) {
    e.preventDefault()
    if (location.pathname === '/beratung') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/beratung')
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    }
  }

  const [plz, setPlz] = useState(
    routeState.plz || sessionStorage.getItem('nav_plz') || ''
  )
  const [kultur, setKultur] = useState(
    routeState.kultur || sessionStorage.getItem('nav_kultur') || 'mais'
  )
  const [mode, setMode] = useState('inline') // 'inline' | 'floating'
  const [wrapHeight, setWrapHeight] = useState(0)
  const [activeSection, setActiveSection] = useState(null)
  const wrapRef     = useRef(null)
  const sentinelRef = useRef(null)

  const SECTIONS = ['feldbericht-slider', 'produkte', 'videos', 'termine', 'tools']

  function fireNavUpdate(p, k) {
    sessionStorage.setItem('nav_plz', p)
    sessionStorage.setItem('nav_kultur', k)
    window.dispatchEvent(new CustomEvent('nav-context-update', { detail: { plz: p, kultur: k } }))
  }

  useEffect(() => {
    fireNavUpdate(plz, kultur)
  }, [])

  // Sentinel sits at the doc position of the nav pill. IntersectionObserver
  // toggles mode — robust to mount-time layout/scroll timing (page transitions).
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        const aboveViewport = entry.boundingClientRect.top < STICKY_TOP
        setMode(aboveViewport ? 'floating' : 'inline')
      },
      { rootMargin: `-${STICKY_TOP}px 0px 0px 0px`, threshold: [0, 1] }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  // Measure wrap height so the placeholder in floating mode preserves layout.
  useEffect(() => {
    if (!wrapRef.current) return
    const measure = () => setWrapHeight(wrapRef.current.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (location.pathname !== '/beratung') { setActiveSection(null); return }

    const observers = []
    const visible = new Set()

    function update() {
      const active = SECTIONS.find(id => visible.has(id)) ?? null
      setActiveSection(active)
    }

    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) visible.add(id)
          else visible.delete(id)
          update()
        },
        { threshold: 0.15 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [location.pathname])

  const isFloating = mode === 'floating'

  const navContent = (
    <div className={`beratung-nav${isFloating ? ' beratung-nav--scrolled' : ''}`}>
      <div className="user-widget">
        <div className="user-avatar">
          <img
            src="https://static.wixstatic.com/media/8a20aa_d72e844801ba41b68a8bc0d71264ad51~mv2.png"
            alt="A. Selmayer"
            onError={(e) => { e.target.parentElement.style.background = '#aaa' }}
          />
        </div>
        <div>
          <div className="user-name">A. Selmayer</div>
          <div className="user-role">Vertriebsberater</div>
        </div>
      </div>
      <div className="pill">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
        </svg>
        <input
          className="pill-plz-input"
          type="text"
          inputMode="numeric"
          placeholder="PLZ"
          value={plz}
          maxLength={5}
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 5)
            setPlz(val)
            fireNavUpdate(val, kultur)
          }}
        />
      </div>
      <select
        className="beratung-nav-kultur-select"
        value={kultur}
        onChange={e => {
          setKultur(e.target.value)
          fireNavUpdate(plz, e.target.value)
        }}
      >
        {KULTUREN.map(k => (
          <option key={k.value} value={k.value}>{k.label}</option>
        ))}
      </select>
      <nav className="beratung-nav-links">
        <a href="/beratung#feldbericht-slider" className={activeSection === 'feldbericht-slider' ? 'active' : ''} onClick={e => scrollTo(e, 'feldbericht-slider')}>Feldbericht</a>
        <a href="/beratung#produkte"           className={activeSection === 'produkte'           ? 'active' : ''} onClick={e => scrollTo(e, 'produkte')}>Einsatzempfehlungen</a>
        <a href="/beratung#videos"             className={activeSection === 'videos'             ? 'active' : ''} onClick={e => scrollTo(e, 'videos')}>Videos</a>
        <a href="/beratung#termine"            className={activeSection === 'termine'            ? 'active' : ''} onClick={e => scrollTo(e, 'termine')}>Termine</a>
        <a href="/beratung#tools"              className={activeSection === 'tools'              ? 'active' : ''} onClick={e => scrollTo(e, 'tools')}>Diagnose</a>
        <a href="/beratung#tools"              className={activeSection === 'tools'              ? 'active' : ''} onClick={e => scrollTo(e, 'tools')}>Resistenz</a>
      </nav>
    </div>
  )

  // Sentinel lives inside the wrap at the position of the nav pill so its
  // document Y stays the same whether we're inline or floating.
  return (
    <>
      <div
        ref={wrapRef}
        className="beratung-nav-wrap"
        style={isFloating ? { height: wrapHeight } : undefined}
      >
        <div ref={sentinelRef} aria-hidden="true" className="beratung-nav-sentinel" />
        {!isFloating && navContent}
      </div>
      {isFloating && (
        <div className="beratung-nav-wrap beratung-nav-wrap--scrolled">
          {navContent}
        </div>
      )}
    </>
  )
}

/* ── Produkte: Module-level constants (shared between main setup + cursor hooks) ── */
const ST = [10, 13, 21, 25, 29, 30, 31, 32, 37, 39, 49, 51, 59, 61, 69, 89]
const N  = ST.length - 1
function pos(b) { return (ST.indexOf(b) / N) * 100 }

/* ── Feldbericht: cards data ── */
const cards = [
  {
    avatar: 'https://static.wixstatic.com/media/8a20aa_d72e844801ba41b68a8bc0d71264ad51~mv2.png',
    date: '20. April 2026',
    kultur: 'Mais',
    plz: '85665',
    title: 'Das leistungsstarken Getreidefungizid Delaro® Forte informieren.',
    tags: [
      { label: 'Fungizid', cls: 'fb-tag--fungizid' },
      { label: 'Wichtig!', cls: 'fb-tag--wichtig' },
    ],
    desc: 'Mit der innovativen Kombination aus drei Wirkstoffen und unterschiedlichen Wirkungsweisen sorgt das neue Fungizid Delaro® Forte für gesunde Pflanzen und bekämpft effektiv Blatt- und Abreifekrankheiten ...',
  },
  {
    avatar: 'https://static.wixstatic.com/media/8a20aa_d72e844801ba41b68a8bc0d71264ad51~mv2.png',
    date: '20. April 2026',
    kultur: 'Mais',
    plz: '85665',
    title: 'Das leistungsstarken Getreidefungizid Delaro® Forte informieren.',
    tags: [
      { label: 'Fungizid', cls: 'fb-tag--fungizid' },
      { label: 'Wachstumsregler', cls: 'fb-tag--wachstum' },
      { label: 'Herbizid', cls: 'fb-tag--herbizid' },
    ],
    desc: 'Mit der innovativen Kombination aus drei Wirkstoffen und unterschiedlichen Wirkungsweisen sorgt das neue Fungizid Delaro® Forte für gesunde Pflanzen und bekämpft effektiv Blatt- und Abreifekrankheiten ...',
  },
  {
    avatar: 'https://static.wixstatic.com/media/8a20aa_d72e844801ba41b68a8bc0d71264ad51~mv2.png',
    date: '15. April 2026',
    kultur: 'Weizen',
    plz: '85665',
    title: 'Septoria-Druck in Ihrer Region erhöht – jetzt handeln.',
    tags: [
      { label: 'Fungizid', cls: 'fb-tag--fungizid' },
      { label: 'Wichtig!', cls: 'fb-tag--wichtig' },
    ],
    desc: 'Septoria-Druck in Ihrer Region erhöht. Fungizidmaßnahmen ab BBCH 32 unbedingt einplanen – besonders bei anfälligen Sorten. Frühzeitige Behandlung sichert den Ertrag.',
  },
  {
    avatar: 'https://static.wixstatic.com/media/8a20aa_d72e844801ba41b68a8bc0d71264ad51~mv2.png',
    date: '10. April 2026',
    kultur: 'Raps',
    plz: '85665',
    title: 'Resistenzentwicklung bei Ackerfuchsschwanz: Mittelwechsel einplanen.',
    tags: [
      { label: 'Herbizid', cls: 'fb-tag--herbizid' },
      { label: 'Wachstumsregler', cls: 'fb-tag--wachstum' },
    ],
    desc: 'Neue Situation bei Ackerfuchsschwanz: Resistenzentwicklung schreitet fort. Bitte Mittelwechsel einplanen und frühzeitig behandeln.',
  },
]

const SLIDE_IMAGES = ['/demo_header.jpg', '/key_header_01.jpg', '/key_header_02.jpg', '/wetter_back_2.jpg']

function SeasonViewModal({ onClose }) {
  const [slideIdx, setSlideIdx] = useState(0)
  const intervalRef = useRef(null)

  function goToSlide(i) {
    setSlideIdx(i)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setSlideIdx(n => (n + 1) % SLIDE_IMAGES.length), 3500)
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => setSlideIdx(i => (i + 1) % SLIDE_IMAGES.length), 3500)
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          display: 'flex', borderRadius: '20px', overflow: 'hidden',
          width: '100%', maxWidth: '1100px', maxHeight: '90vh',
          background: '#1c1c1e',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left panel */}
        <div style={{
          flex: '0 0 46%', padding: '40px 36px 32px',
          display: 'flex', flexDirection: 'column', gap: '0',
          color: '#fff', overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <svg viewBox="0 0 289.1 289.1" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
            <style>{`.mb1{fill:#ffffff;}.mb2{fill:#89D329;}.mb3{fill:#00BCFF;}`}</style>
            <path className="mb1" d="M136.2,44.9h16.3c1.8,0,3.3-1.5,3.3-3.3c0-1.8-1.5-3.3-3.3-3.3h-16.3V44.9z M136.2,60.8H153c2.1,0,3.7-1.7,3.7-3.7c0-2.1-1.7-3.7-3.7-3.7h-16.8V60.8z M162.4,48.8c2.2,2.2,3.6,5.2,3.6,8.5c0,6.6-5.3,11.9-11.9,11.9h-27.3V30l26.9,0c6.3,0,11.4,5.1,11.4,11.4C165.1,44.2,164.1,46.8,162.4,48.8z"/>
            <path className="mb1" d="M168.7,115.9h-10l-3.2-6.5h-21.9l-3.2,6.5h-10L140,76.7h9.1L168.7,115.9z M144.6,86.7l-6.9,14.2h13.8L144.6,86.7z"/>
            <polygon className="mb1" points="157.9,124.3 169.1,124.3 149.2,149.8 149.2,163.5 139.9,163.5 139.9,149.8 120,124.3 131.3,124.3 144.6,142.1"/>
            <polygon className="mb1" points="209.9,124.3 209.9,132.7 183.7,132.7 183.7,139.2 208.9,139.2 208.9,147.6 183.7,147.6 183.7,155.1 209.9,155.1 209.9,163.5 174.4,163.5 174.4,124.3"/>
            <path className="mb1" d="M238.7,148.6h-7v14.9h-9.3v-39.2h23.8c6.7,0,12.1,5.5,12.1,12.1c0,5.5-3.7,10.2-8.7,11.6l11.5,15.4h-11.2L238.7,148.6z M245.3,132.7h-13.6v7.5h13.6c2.1,0,3.7-1.7,3.7-3.7C249,134.4,247.3,132.7,245.3,132.7z"/>
            <path className="mb1" d="M124.4,163.5h-10l-3.2-6.5H89.3l-3.2,6.5h-10l19.6-39.2h9.1L124.4,163.5z M100.2,134.3l-6.9,14.2h13.8L100.2,134.3z"/>
            <path className="mb1" d="M41,139.3h16.3c1.8,0,3.3-1.5,3.3-3.3c0-1.8-1.5-3.3-3.3-3.3l-16.3,0V139.3z M41,155.1h16.8c2.1,0,3.7-1.7,3.7-3.7c0-2.1-1.7-3.7-3.7-3.7H41V155.1z M67.3,143.1c2.2,2.2,3.6,5.2,3.6,8.5c0,6.6-5.3,11.9-11.9,11.9H31.7v-39.2h26.9c6.3,0,11.4,5.1,11.4,11.4C70,138.5,69,141.1,67.3,143.1z"/>
            <polygon className="mb1" points="162.3,171.9 162.3,180.3 136.2,180.3 136.2,186.8 161.4,186.8 161.4,195.2 136.2,195.2 136.2,202.7 162.3,202.7 162.3,211.1 126.8,211.1 126.8,171.9"/>
            <path className="mb1" d="M155.8,232.6c0-2.1-1.7-3.7-3.7-3.7h-15.9v7.5h15.9C154.1,236.3,155.8,234.6,155.8,232.6z M126.8,259.6v-39.2H153c6.7,0,12.1,5.5,12.1,12.2c0,5.1-3.1,9.4-7.5,11.3l11.8,15.8h-11.2l-11.2-14.9h-10.7v14.9H126.8z"/>
            <path className="mb2" d="M286.1,135.8c-4.5-74.2-66.1-133-141.5-133C69.3,2.8,7.7,61.6,3.1,135.8c0.2,3,0.4,5.9,0.8,8.8C7,169.3,16.4,192,30.5,211c25.8,35,67.3,57.7,114.1,57.7c-65.5,0-119.3-51-123.9-115.4c-0.2-2.9-0.3-5.8-0.3-8.8c0-3,0.1-5.9,0.3-8.8C25.3,71.4,79.1,20.4,144.6,20.4c46.8,0,88.3,22.7,114.1,57.7c14.1,19.1,23.5,41.8,26.5,66.6c0.4,2.9,0.6,5.8,0.8,8.7c0.2-2.9,0.3-5.8,0.3-8.8C286.3,141.6,286.2,138.7,286.1,135.8"/>
            <path className="mb3" d="M3.1,153.3c4.5,74.2,66.1,133,141.5,133c75.3,0,136.9-58.8,141.5-133c-0.2-3-0.4-5.9-0.8-8.8c-3.1-24.7-12.5-47.4-26.5-66.4c-25.8-35-67.3-57.7-114.1-57.7c65.5,0,119.3,51,123.9,115.4c0.2,2.9,0.3,5.8,0.3,8.8c0,3-0.1,5.9-0.3,8.8c-4.5,64.4-58.3,115.4-123.9,115.4c-46.8,0-88.3-22.7-114.1-57.7C16.4,191.9,7,169.2,4,144.5c-0.4-2.9-0.6-5.8-0.8-8.7c-0.2,2.9-0.3,5.8-0.3,8.8C2.9,147.5,3,150.4,3.1,153.3"/>
          </svg>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 700, textAlign: 'center', margin: '0 0 12px', lineHeight: 1.15 }}>
            Season View<br />abonnieren
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', textAlign: 'center', margin: '0 0 28px', lineHeight: 1.6 }}>
            Schnell anmelden und sofort in deine Saisonansicht einsteigen.
          </p>

          {[
            { letter: 'G', color: '#4285F4', label: 'Weiter mit Google' },
            { letter: 'A', color: '#fff',    label: 'Weiter mit Apple' },
            { letter: 'M', color: '#00A4EF', label: 'Weiter mit Microsoft' },
          ].map(({ letter, color, label }) => (
            <button key={label} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              width: '100%', padding: '14px 20px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px', color: '#fff', cursor: 'pointer',
              marginBottom: '10px', fontSize: '14px', fontWeight: 600,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '16px', fontWeight: 800, color, width: '20px', textAlign: 'center' }}>{letter}</span>
              <span style={{ flex: 1, textAlign: 'center' }}>{label}</span>
            </button>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '6px 0 16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>ODER</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
          </div>

          <button style={{
            width: '100%', padding: '14px 20px',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px', color: '#fff', cursor: 'pointer',
            fontSize: '14px', fontWeight: 600, transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Weiter mit Email
          </button>

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
            SSO optional für Business- und Enterprise-Zugänge.
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: 'auto', paddingTop: '16px', lineHeight: 1.6 }}>
            Mit dem Fortfahren bestätigst du Datenschutz, Nutzungsbedingungen und die Verarbeitung deiner Kontodaten zur Anmeldung in Season View.
          </p>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, position: 'relative', minHeight: '500px', overflow: 'hidden' }}>
          {SLIDE_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Season View"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: i === slideIdx ? 1 : 0,
                transition: 'opacity 0.8s ease',
              }}
            />
          ))}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
          }} />

          {/* Close button */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '40px', height: '40px', borderRadius: '0',
            background: 'rgba(255,255,255,0.95)',
            border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>

          {/* Bottom overlay content */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 16px rgba(0,0,0,0.15)',
              color: '#fff', fontSize: '12px', fontWeight: 600,
              padding: '5px 12px', borderRadius: '20px', marginBottom: '14px',
            }}>Standortbasierte Saisonansicht</span>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.5px' }}>SEASON </span>
              <span style={{ fontSize: '36px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.5px' }}>VIEW</span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '20px' }}>
              Wetter, BBCH-Verlauf, Produktempfehlungen und betriebliche Entscheidungen in einer kompakten Oberfläche für die laufende Saison.
            </p>
            <div style={{ display: 'flex', gap: '0', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px' }}>
              {['Wetterfenster', 'BBCH Status', 'Produktempfehlung', 'Betriebsprofil'].map((tab, i) => (
                <span key={tab} onClick={() => goToSlide(i)} style={{
                  flex: 1, fontSize: '11px', color: i === slideIdx ? '#fff' : 'rgba(255,255,255,0.45)',
                  fontWeight: i === slideIdx ? 700 : 400, textAlign: 'center', paddingBottom: '8px',
                  borderBottom: i === slideIdx ? '2px solid #fff' : '2px solid transparent',
                  cursor: 'pointer', transition: 'color 0.2s',
                }}>{tab}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Beratung() {
  /* ── Produkte state ── */
  const [activeTab, setActiveTab] = useState(0)
  const [showSeasonModal, setShowSeasonModal] = useState(false)
  const [cursorIdx, setCursorIdx] = useState(ST.indexOf(32)) // BBCH 32 = index 7

  const ticksRef    = useRef(null)
  const bubbleRef   = useRef(null)
  const gradFadeRef = useRef(null)

  const { scrollYProgress: gradFadeProgress } = useScroll({
    target: gradFadeRef,
    offset: ['end 0.55', 'end 0.2'],
  })
  const gradFadeOpacity = useTransform(gradFadeProgress, [0, 1], [0, 1])

  /* Derived positioning values */
  const TICK_INSET = 16 // px – must match the JS constant below
  const cursorPct = cursorIdx / N * 100
  const cursorLeft = cursorIdx === 0 ? `${TICK_INSET}px` : cursorIdx === N ? `calc(100% - ${TICK_INSET}px)` : `${cursorPct}%`
  /* Left of the vertical line inside gantt-inner (200px label col + proportional track) */
  const lineLeft  = `calc(${(200 * (1 - cursorIdx / N)).toFixed(2)}px + ${cursorPct.toFixed(2)}%)`

  /* ── Aktuelle Kultur + PLZ aus Nav-Kontext ── */
  const [navKultur, setNavKultur] = useState(() => sessionStorage.getItem('nav_kultur') || '')
  const [navPlz, setNavPlz] = useState(() => sessionStorage.getItem('nav_plz') || '')
  useEffect(() => {
    function onUpdate(e) { setNavKultur(e.detail.kultur); setNavPlz(e.detail.plz) }
    window.addEventListener('nav-context-update', onUpdate)
    return () => window.removeEventListener('nav-context-update', onUpdate)
  }, [])

  /* ── Feldbericht-Slider state ── */
  const fbsTrackRef = useRef(null)
  function fbsScroll(dir) {
    const track = fbsTrackRef.current
    if (!track) return
    const card = track.querySelector('.fbs-card')
    const step = card ? card.offsetWidth + 20 : 320
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  /* ── Feldbericht-Slider: Mouse drag-to-scroll ── */
  useEffect(() => {
    const el = fbsTrackRef.current
    if (!el) return
    let isDragging = false
    let startX = 0
    let startScrollLeft = 0

    function onMouseDown(e) {
      isDragging = true
      startX = e.clientX
      startScrollLeft = el.scrollLeft
      el.style.cursor = 'grabbing'
      el.style.userSelect = 'none'
    }

    function onMouseMove(e) {
      if (!isDragging) return
      const delta = e.clientX - startX
      el.scrollLeft = startScrollLeft - delta
    }

    function onMouseUp() {
      isDragging = false
      el.style.cursor = 'grab'
      el.style.userSelect = ''
    }

    el.style.cursor = 'grab'
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  /* ── Termine state ── */
  const [activeChip, setActiveChip] = useState(0)
  const chips = ['Alle', 'Vor Ort', 'Online', 'Nachlese']

  /* ── Produkte: Sync active tick dots / labels whenever cursorIdx changes ── */
  useEffect(() => {
    document.querySelectorAll('.gantt-tick-dot').forEach((d, i) => {
      d.classList.toggle('active', i === cursorIdx)
    })
    document.querySelectorAll('.gantt-tick-label').forEach((l, i) => {
      l.classList.toggle('active', i === cursorIdx)
    })
  }, [cursorIdx])

  /* ── Produkte: Drag + Tick-click (single effect, refs never change) ── */
  useEffect(() => {
    const ticks  = ticksRef.current
    const bubble = bubbleRef.current
    if (!ticks || !bubble) return

    function nearestIdx(pct) {
      let best = 0, bestD = Infinity
      for (let i = 0; i <= N; i++) {
        const d = Math.abs(i / N * 100 - pct)
        if (d < bestD) { bestD = d; best = i }
      }
      return best
    }

    let dragging = false

    function startDrag(e) {
      e.preventDefault()
      dragging = true
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('touchmove', onDrag, { passive: false })
      document.addEventListener('mouseup',   endDrag)
      document.addEventListener('touchend',  endDrag)
    }

    function onDrag(e) {
      if (!dragging) return
      e.preventDefault()
      const rect    = ticks.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const pct     = Math.max(0, Math.min(100, (clientX - rect.left) / rect.width * 100))
      setCursorIdx(nearestIdx(pct))
    }

    function endDrag() {
      dragging = false
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('touchmove', onDrag)
      document.removeEventListener('mouseup',   endDrag)
      document.removeEventListener('touchend',  endDrag)
    }

    function onTickClick(e) {
      const tick = e.target.closest('.gantt-tick')
      if (!tick) return
      const rect = ticks.getBoundingClientRect()
      const pct  = (tick.getBoundingClientRect().left + 4 - rect.left) / rect.width * 100
      setCursorIdx(nearestIdx(pct))
    }

    bubble.addEventListener('mousedown',  startDrag)
    bubble.addEventListener('touchstart', startDrag, { passive: false })
    ticks.addEventListener('click',       onTickClick)

    return () => {
      bubble.removeEventListener('mousedown',  startDrag)
      bubble.removeEventListener('touchstart', startDrag)
      ticks.removeEventListener('click',       onTickClick)
      endDrag()
    }
  }, [])

  /* ── Produkte: Main Gantt setup (imperative DOM: ticks, phases, bars, overlays) ── */
  useEffect(() => {
    (function() {

      /* ── BBCH Plant SVGs ── */
      var PLANT_SVG = {
        tiller: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200"><g fill="none" stroke="#2D7D3A" stroke-linecap="round" stroke-linejoin="round"><!-- ground --><line x1="10" y1="182" x2="90" y2="182" stroke="#c5d9b0" stroke-width="1.5"/><!-- central stem --><path d="M50 182 C50 162 50 145 50 110" stroke-width="3.5"/><!-- left tiller --><path d="M47 172 C40 160 28 148 18 135" stroke-width="2.5"/><!-- left tiller leaf --><path d="M18 135 C10 126 8 115 14 108" stroke-width="2"/><!-- right tiller --><path d="M53 168 C62 156 74 146 83 133" stroke-width="2.5"/><!-- right tiller leaf --><path d="M83 133 C91 123 92 112 86 106" stroke-width="2"/><!-- left leaf --><path d="M50 148 C38 140 26 134 17 128" stroke-width="2.5"/><!-- right leaf --><path d="M50 136 C62 130 74 125 82 119" stroke-width="2.5"/><!-- apical bud --></g><ellipse cx="50" cy="104" rx="7" ry="10" fill="#3a9648"/></svg>',
        shoot:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200"><g fill="none" stroke="#2D7D3A" stroke-linecap="round" stroke-linejoin="round"><!-- ground --><line x1="10" y1="188" x2="90" y2="188" stroke="#c5d9b0" stroke-width="1.5"/><!-- central stem --><path d="M50 188 C50 168 50 140 50 70" stroke-width="3.5"/><!-- node 1 dot --></g><circle cx="50" cy="155" r="4" fill="#2D7D3A"/><!-- node 2 --><circle cx="50" cy="118" r="4" fill="#2D7D3A"/><!-- left leaf node1 --><path d="M50 155 C36 150 22 140 14 130" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- right leaf node2 --><path d="M50 118 C65 114 78 106 86 96" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- left low tiller --><path d="M48 178 C38 168 25 160 16 152" stroke="#2D7D3A" stroke-width="2" fill="none" stroke-linecap="round"/><!-- bud --><ellipse cx="50" cy="62" rx="7" ry="12" fill="#3a9648"/></svg>',
        flag:   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200"><g fill="none" stroke="#2D7D3A" stroke-linecap="round" stroke-linejoin="round"><!-- ground --><line x1="10" y1="192" x2="90" y2="192" stroke="#c5d9b0" stroke-width="1.5"/><!-- stem --><path d="M50 192 L50 32" stroke-width="3.5"/><!-- nodes --></g><circle cx="50" cy="160" r="4" fill="#2D7D3A"/><circle cx="50" cy="120" r="4" fill="#2D7D3A"/><circle cx="50" cy="80" r="4" fill="#2D7D3A"/><!-- flag leaf --><path d="M50 80 C60 74 76 64 82 52" stroke="#2D7D3A" stroke-width="3" fill="none" stroke-linecap="round"/><!-- leaf 2 --><path d="M50 120 C38 114 24 106 16 96" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- leaf 3 --><path d="M50 160 C64 155 76 148 83 140" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- base leaf --><path d="M48 178 C36 170 22 164 14 158" stroke="#2D7D3A" stroke-width="2" fill="none" stroke-linecap="round"/><!-- bud emerging --><ellipse cx="50" cy="25" rx="7" ry="11" fill="#3a9648"/></svg>',
        ear:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200"><g fill="none" stroke="#2D7D3A" stroke-linecap="round" stroke-linejoin="round"><!-- ground --><line x1="10" y1="192" x2="90" y2="192" stroke="#c5d9b0" stroke-width="1.5"/><!-- stem --><path d="M50 192 L50 25" stroke-width="3.5"/><!-- nodes --></g><circle cx="50" cy="165" r="4" fill="#2D7D3A"/><circle cx="50" cy="130" r="4" fill="#2D7D3A"/><!-- flag leaf --><path d="M50 90 C62 82 78 72 85 60" stroke="#2D7D3A" stroke-width="3" fill="none" stroke-linecap="round"/><!-- leaf 2 --><path d="M50 130 C37 124 23 116 15 106" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- leaf 3 --><path d="M50 165 C63 160 76 154 83 146" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- ear shape --><path d="M50 88 C50 72 50 50 50 22" stroke="#2D7D3A" stroke-width="3" fill="none"/><!-- spikelets left --><path d="M50 70 C44 66 38 62 35 56" stroke="#2D7D3A" stroke-width="2" fill="none"/><!-- awn 1 --><path d="M35 56 C32 50 32 44 34 38" stroke="#2D7D3A" stroke-width="1.5" fill="none"/><!-- spikelets right --><path d="M50 62 C56 58 62 54 65 48" stroke="#2D7D3A" stroke-width="2" fill="none"/><!-- spikelets right 2 --><path d="M50 76 C44 72 38 69 35 64" stroke="#2D7D3A" stroke-width="1.8" fill="none"/><!-- awn tip --><path d="M50 22 C50 16 51 10 52 4" stroke="#2D7D3A" stroke-width="1.5" fill="none"/></svg>'
      };

      var DATA = {
        f1: { cat: 'fungizid',  crop: 'Winter- / Sommerweizen',  label: 'T1 \u2014 Halmkrankheiten', plant: 'shoot', img: 'productimage.image.png',
              from: 29, to: 32,
              products: [{n:'Input Triple', d:'1,0 l/ha'},{n:'Delaro Forte', d:'1,5 l/ha', alt:true}],
              targets: ['Septoria','Halmbruch','Mehltau','Rostarten','DTR','Fusarium','DON-Reduktion'],
              note: 'CCC 720 in diesem Stadium als Wachstumsregler kombinierbar. Verbessert Stresstoleranz.' },
        f2: { cat: 'fungizid',  crop: 'Winter- / Sommerweizen',  label: 'T2 \u2014 Blatt & Abreife', plant: 'flag', img: 'productimage.image.png',
              from: 37, to: 51,
              products: [{n:'Ascra Xpro', d:'1,2 \u2013 1,5 l/ha'}],
              targets: ['Septoria','Rostarten','DTR','Fusarium','Blattfleckenkrankheiten'],
              note: 'Cerone\u00ae 660 kombinierbar. Abverkauf bis 15.05.2026 \u00b7 Aufbrauchfrist bis 15.05.2027' },
        f3: { cat: 'fungizid',  crop: 'Winter- / Sommerweizen',  label: 'T3 \u2014 \u00c4hrenkrankheiten', plant: 'ear', img: 'productimage.image.png',
              from: 59, to: 69,
              products: [{n:'Prosaro', d:'1,0 l/ha'},{n:'Skyway Xpro', d:'1,0 \u2013 1,25 l/ha', alt:true}],
              targets: ['\u00c4hrenfusarium','DON-Reduktion','\u00c4hrenseptoria'],
              note: null },
        h1: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'Winterweizen \u00b7 Triticale', label: 'Ackerfuchsschwanz normal',
              from: 21, to: 37,
              products: [{n:'Incelo Komplett', d:'Incelo 300 g/ha + Biopower 1,0 l/ha + Husar OD 0,1 l/ha'}],
              targets: ['Ackerfuchsschwanz','Weidelgr\u00e4ser','Windhalm','Rispen','Flughafer','Mischverunkrautung'],
              note: '+30 l/ha AHL oder +10 kg/ha SSA zur Wirkungsverst\u00e4rkung (nur WW & Triticale, nicht bei Winterhartweizen)' },
        h2: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'WW \u00b7 WHW \u00b7 Triticale',  label: 'Ackerfuchsschwanz extrem & Trespen',
              from: 21, to: 37,
              products: [{n:'Atlantis Flex', d:'Atlantis Flex 330 g/ha + Biopower 1,0 l/ha'}],
              targets: ['Ackerfuchsschwanz','Trespen-Arten','Flughafer','Windhalm','Kamille','Ausfallraps','Hirtent\u00e4schel','Vogelmiere'],
              note: 'Keine ausreichende Wirkung auf Clearfield (reg.)-Sorten bei Ausfallraps' },
        h3: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'Winterweizen', label: 'Trespen \u2014 kein Rapsnachbau',
              from: 25, to: 37,
              products: [{n:'Attribut**', d:'100 g/ha + Additiv*'}],
              targets: ['Trespen-Arten'],
              note: '* M\u00f6gliche Additive: Break-Thru, Kantor, Mero (Gebrauchsanleitung beachten)\n** Einsatz ab BBCH 20' },
        h4: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'Winterweizen', label: 'Trespen \u2014 mit Rapsnachbau',
              from: 21, to: 37,
              products: [{n:'Atlantis Flex', d:'Atlantis Flex 330 g/ha + Biopower 1,0 l/ha'}],
              targets: ['Trespen-Arten'],
              note: null },
        h5: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'WW \u2014 Windhalmstandorte', label: 'Windhalm & Mischverunkrautung + AHL',
              from: 29, to: 37,
              products: [{n:'Husar Plus**', d:'0,2 l/ha + AHL'}],
              targets: ['Windhalm','Rispe','Weidelgr\u00e4ser','Klettenlabkraut','Kamille','Stief m\u00fctterchen','Erdrauch','Hundskerbel'],
              note: '** Kein Zusatz von Mero bei AHL-Anwendung!' },
        h6: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'WW \u00b7 Roggen \u00b7 Triticale', label: 'Windhalm \u2014 Standardbehandlung',
              from: 29, to: 37,
              products: [{n:'Husar Plus', d:'0,2 l/ha'},{n:'Metro', d:'1,0 l/ha'},{n:'Pointer SK 35 g/ha', d:'bei Kornblume'}],
              targets: ['Windhalm','Rispe','Weidelgr\u00e4ser','Klettenlabkraut','Kamille','Kerbel','Kornblume'],
              note: 'F\u00fcr Winterweizen, Winterroggen und Wintertriticale auf Windhalm-Standorten.',
              formulierung: 'Emulsionskonzentrat / \u00d6lige Dispersion',
              wirkstoffe: ['81\u00a0% Rapsp\u00f6lmethylester','50\u00a0g/l Iodosulfuron-methyl-natrium','7,5\u00a0g/l Mesosulfuron-methyl','250\u00a0g/l Mefenpyr-diethyl (Safener)'],
              chart: { title: 'Wirkung gegen Einj\u00e4hrige Rispe', b1: { val: 70.5, label: 'VGM 0,13\u00a0kg/ha\nNetzmittel VGM\u00a01\u00a05,6\u00a0l/ha' }, b2: { val: 94.8, label: 'Husar\u00a0Plus\u00a00,2\u00a0l/ha\nMero\u00a01,0\u00a0l/ha' }, source: 'Husar Plus, n=16 Versuche (2012\u20132023)' },
              artikel: [
                { name: 'in Husar Plus + Mero', size: '1\u00a0l Flasche' },
                { name: 'in Husar Plus + Mero', size: '3\u00a0l Kanister' }
              ] }
      };

      var ROWS = ['f1','f2','f3','h1','h2','h3','h4','h5','h6'];

      /* Build scale ticks (dots) */
      var ticksEl = document.getElementById('ganttTicks');
      if (!ticksEl) return;
      /* Clear any previously injected ticks (StrictMode double-mount) — keep React-managed cursor */
      ticksEl.querySelectorAll('.gantt-tick').forEach(function(el) { el.remove(); });

      var TICK_INSET = 16; /* px padding at left / right edges */
      ST.forEach(function(b, i) {
        var t = document.createElement('div');
        t.className = 'gantt-tick';
        var isFirst = i === 0;
        var isLast  = i === ST.length - 1;
        var transform = isFirst ? 'translateX(0)' : isLast ? 'translateX(-100%)' : 'translateX(-50%)';
        var leftVal = isFirst ? TICK_INSET + 'px' : isLast ? 'calc(100% - ' + TICK_INSET + 'px)' : (i / N * 100) + '%';
        t.style.cssText = 'position:absolute; top:0; left:' + leftVal + ';';
        t.innerHTML = '<div class="gantt-tick-label" id="lbl_' + i + '" style="transform:' + transform + '; display:block;">' + b + '</div>' +
                      '<div class="gantt-tick-dot" id="dot_' + i + '"></div>';
        ticksEl.appendChild(t);
      });

      /* Build phase labels */
      var PHASES = [
        { label: 'Herbst /\nBlattentwicklung', from: 10, to: 21 },
        { label: 'Bestockung',                  from: 21, to: 29 },
        { label: 'Schossen bis\nFahnenblatt',  from: 29, to: 51 },
        { label: '\u00c4hrenschieben\nbis Bl\u00fcte', from: 51, to: 69 },
        { label: 'Kornf\u00fcllung\nbis Reife', from: 69, to: 89 }
      ];
      var phasesTrack = document.getElementById('ganttPhasesTrack');
      if (phasesTrack) {
        phasesTrack.innerHTML = '';
        PHASES.forEach(function(ph) {
          var l = pos(ph.from), w = pos(ph.to) - l;
          var box = document.createElement('div');
          box.className = 'gantt-phase-box';
          box.style.left  = 'calc(' + l + '% + 4px)';
          box.style.width = 'calc(' + w + '% - 8px)';
          box.innerHTML = ph.label.replace(/\n/g, '<br>');
          phasesTrack.appendChild(box);
        });
      }

      /* Build grid lines + bars per row */
      ROWS.forEach(function(id) {
        var d    = DATA[id];
        var glEl = document.getElementById('gg_' + id);
        if (!glEl) return;
        glEl.innerHTML = '';
        ST.forEach(function(b, i) {
          var line = document.createElement('div');
          line.className = 'gantt-gl-line';
          line.style.left = (i / N * 100) + '%';
          glEl.appendChild(line);
        });
        var trk   = document.getElementById('gt_' + id);
        /* remove previously injected bars */
        var existingBar = trk.querySelector('.gantt-bar');
        if (existingBar) existingBar.remove();
        var left  = pos(d.from);
        var width = pos(d.to) - left;
        var bar   = document.createElement('div');
        bar.className = 'gantt-bar gantt-bar-' + d.cat;
        bar.style.left  = left + '%';
        bar.style.width = width + '%';
        var barLabel = d.products[0].n;
        bar.innerHTML = '<span class="gantt-bar-text">' + barLabel + '</span>';
        bar.onclick = (function(rowId) {
          return function(e) { e.stopPropagation(); window.ganttOpen(rowId); };
        })(id);
        trk.appendChild(bar);
      });

      window.ganttOpen = function(id) {
        var d = DATA[id];
        window._ganttCurrentProduct = d;
        var cat = d.cat;
        var isFung = cat === 'fungizid';
        var badgeLabel = isFung ? 'Fungizid' : 'Herbizid';
        var accentColor = isFung ? '#2D7D3A' : '#E8590C';
        var accentBg    = isFung ? 'rgba(45,125,58,0.08)' : 'rgba(232,89,12,0.08)';
        var accentGrad  = isFung
            ? 'linear-gradient(135deg,rgba(45,125,58,0.15),rgba(45,125,58,0.45))'
            : 'linear-gradient(135deg,rgba(232,89,12,0.15),rgba(232,89,12,0.45))';

        /* Tags */
        var tagsHtml = d.targets.map(function(t) {
            return '<span style="border:1px solid rgba(0,0,0,0.15);border-radius:999px;padding:8px 16px;font-size:15px;font-weight:500;display:inline-flex;align-items:center;">' + t + '</span>';
        }).join('');

        /* Products table rows */
        var prodRows = d.products.map(function(pr) {
            return '<tr><td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.07);font-size:16px;color:#1d1d1f;">' + pr.n +
                   '</td><td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.07);font-size:16px;font-weight:700;text-align:right;color:#1d1d1f;">' + pr.d + '</td></tr>';
        }).join('');

        /* Product SVG illustration */
        var plantSvg = d.plant ? PLANT_SVG[d.plant] : '';

        /* Note */
        var noteText = d.note
            ? d.note.replace(/\n/g, '<br>')
            : '\u2013';

        /* ── Bar chart HTML ── */
        var chartHtml = '';
        if (d.chart) {
          var cH = 130;
          var b1h = Math.round(d.chart.b1.val / 100 * cH);
          var b2h = Math.round(d.chart.b2.val / 100 * cH);
          var cHFull = 300;
          var b1hFull = Math.round(d.chart.b1.val / 100 * cHFull);
          var b2hFull = Math.round(d.chart.b2.val / 100 * cHFull);
          chartHtml =
            /* beige Outer-Box */
            '<div style="background:#eef0f4;border-radius:16px;padding:24px;margin-top:24px;">' +
              '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;margin-bottom:16px;">Versuchsergebnis</div>' +
              /* weisses Inner-Card */
              '<div style="background:#fff;border-radius:12px;padding:24px 24px 24px;">' +
                '<div style="font-size:20px;font-weight:700;color:#c8a050;margin-bottom:24px;">' + d.chart.title + '</div>' +
                /* Chart */
                '<div style="display:flex;gap:8px;">' +
                  /* Y-Achse */
                  '<div style="position:relative;height:' + cHFull + 'px;width:32px;flex-shrink:0;">' +
                    ['100','80','60','40','20','0'].map(function(v,i) {
                      return '<span style="position:absolute;right:0;top:' + (i*20) + '%;transform:translateY(-50%);font-size:12px;color:#bbb;white-space:nowrap;">' + v + '</span>';
                    }).join('') +
                  '</div>' +
                  /* Balken-Bereich */
                  '<div style="flex:1;display:flex;flex-direction:column;">' +
                    /* Nur Balken – feste Höhe */
                    '<div style="height:' + cHFull + 'px;display:flex;align-items:flex-end;gap:16px;border-bottom:1px solid rgba(0,0,0,0.08);">' +
                      /* Bar 1 */
                      '<div class="chart-bar" style="flex:1;height:' + b1hFull + 'px;background:#aaa;display:flex;align-items:center;justify-content:center;">' +
                        '<span style="font-size:18px;font-weight:700;color:#fff;">' + d.chart.b1.val + '</span>' +
                      '</div>' +
                      /* Badge Mitte */
                      '<div style="flex-shrink:0;display:flex;align-items:center;align-self:center;">' +
                        '<div style="background:' + accentColor + ';border-radius:20px;padding:8px 16px;text-align:center;white-space:nowrap;">' +
                          '<span style="font-size:13px;font-weight:700;color:#fff;">&gt;20% mehr Wirkung</span>' +
                        '</div>' +
                      '</div>' +
                      /* Bar 2 */
                      '<div class="chart-bar chart-bar--delay" style="flex:1;height:' + b2hFull + 'px;background:#c8a050;display:flex;align-items:center;justify-content:center;">' +
                        '<span style="font-size:18px;font-weight:700;color:#fff;">' + d.chart.b2.val + '</span>' +
                      '</div>' +
                    '</div>' +
                    /* Labels – separate Zeile unter den Balken */
                    '<div style="display:flex;gap:16px;margin-top:10px;">' +
                      '<div style="flex:1;font-size:12px;color:#6e6e73;text-align:left;line-height:1.5;">' + d.chart.b1.label.replace(/\n/g,'<br>') + '</div>' +
                      '<div style="flex-shrink:0;visibility:hidden;padding:8px 16px;white-space:nowrap;font-size:13px;">&gt;20% mehr Wirkung</div>' +
                      '<div style="flex:1;font-size:12px;color:#6e6e73;text-align:left;line-height:1.5;">' + d.chart.b2.label.replace(/\n/g,'<br>') + '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                /* Quelle */
                '<div style="font-size:12px;color:#8e8e93;margin-top:16px;line-height:1.5;">' + d.chart.source + '<br>Quelle: Deutschlandweite Bayer-eigene Versuche</div>' +
              '</div>' + /* end weisses Inner-Card */
            '</div>'; /* end beige Outer-Box */
        }

        /* ── Action buttons ── */
        var buttonsHtml =
          '<div style="display:flex;flex-direction:column;gap:8px;margin-top:24px;overflow:visible;">' +
            '<div class="sheet-btn-row">' +
              '<button class="sheet-btn sheet-btn--primary" onclick="window.openOrderModal()">' +
                '<span class="sheet-btn-left">' +
                  '<svg class="sheet-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
                  '<span class="sheet-btn-text">Jetzt bestellen</span>' +
                '</span>' +
                '<span class="sheet-btn-right"><span class="sheet-btn-slash">/</span><span class="sheet-btn-arrow">\u203a</span></span>' +
              '</button>' +
              '<button class="sheet-btn sheet-btn--primary">' +
                '<span class="sheet-btn-left">' +
                  '<svg class="sheet-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
                  '<span class="sheet-btn-text">Zur Detailseite</span>' +
                '</span>' +
                '<span class="sheet-btn-right"><span class="sheet-btn-slash">/</span><span class="sheet-btn-arrow">\u203a</span></span>' +
              '</button>' +
            '</div>' +
            '<div class="sheet-btn-row">' +
              '<button class="sheet-btn sheet-btn--outline">' +
                '<span class="sheet-btn-left">' +
                  '<svg class="sheet-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>' +
                  '<span class="sheet-btn-text">Vergleichen</span>' +
                '</span>' +
                '<span class="sheet-btn-right"><span class="sheet-btn-slash">/</span><span class="sheet-btn-arrow">\u203a</span></span>' +
              '</button>' +
              '<button class="sheet-btn sheet-btn--outline">' +
                '<span class="sheet-btn-left">' +
                  '<svg class="sheet-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
                  '<span class="sheet-btn-text">Merken</span>' +
                '</span>' +
                '<span class="sheet-btn-right"><span class="sheet-btn-slash">/</span><span class="sheet-btn-arrow">\u203a</span></span>' +
              '</button>' +
            '</div>' +
          '</div>';

        /* ── Wetter-Prognosedaten ── */
        var WX_DAYS = [
          { abbr:'MO', date:'14.04.', score:91, st:'optimal',
            sum:'Heute ideale Bedingungen. Temperatur, Wind und Luftfeuchte im Optimalbereich. Blattoberfläche seit 5\u00a0h trocken \u2013 maximale Wirkstoffhaftung. Kein Regen in Sicht. Breites Fenster von 8 bis 18\u00a0Uhr nutzbar.',
            badge:'OPTIMALE BEDINGUNGEN', crit:'6\u00a0/\u00a06 Kriterien erf\u00fcllt', critNote:'Alle Parameter im sicheren Bereich.',
            m:[
              {l:'TEMP.',        v:'16\u00a0\u00b0C', lim:'zul.\u00a08\u201325\u00a0\u00b0C',  pill:'im Einsatzfenster',           pct:47,  pc:'#3a7a2f'},
              {l:'WIND',         v:'6\u00a0km/h',     lim:'zul.\u00a0\u2264\u00a015\u00a0km/h', pill:'sicherer Bereich',            pct:40,  pc:'#3a7a2f'},
              {l:'B\u00d6EN',    v:'11\u00a0km/h',    lim:'zul.\u00a0\u2264\u00a025\u00a0km/h', pill:'technisch tragf\u00e4hig',    pct:44,  pc:'#3a7a2f'},
              {l:'REL. FEUCHTE', v:'62\u00a0%',       lim:'zul.\u00a0\u2264\u00a085\u00a0%',    pill:'innerhalb Leitfaden',         pct:73,  pc:'#3a7a2f'},
              {l:'TROCKEN VOR',  v:'5\u00a0h',        lim:'mind.\u00a03\u00a0h',                pill:'Minimum erf\u00fcllt \u2713', pct:85,  pc:'#3a7a2f'},
              {l:'REGEN NACH',   v:'0\u00a0mm',       lim:'0\u00a0mm empfohlen',                pill:'trockenes Fenster',           pct:5,   pc:'#3a7a2f'},
            ],
            prof:[8,8,8,8,8,8,8,40,82,88,92,95,95,94,93,91,89,42,72,10,8,8,8,8],
            winT:'08:00\u00a0\u2013\u00a018:00', winN:'Idealtag\u00a0\u00b7 Blattn\u00e4sse fr\u00fch morgens pr\u00fcfen'
          },
          { abbr:'DI', date:'15.04.', score:58, st:'bedingt',
            sum:'Brauchbares Fenster am Nachmittag. Wind am Vormittag noch zu hoch, sinkt ab 12\u00a0Uhr auf Limitniveau. Temperatur und Luftfeuchte g\u00fcnstig. Trockenfenster ab Mittag nutzbar.',
            badge:'EINGESCHR\u00c4NKT GEEIGNET', crit:'4\u00a0/\u00a06 Kriterien erf\u00fcllt', critNote:'Wind vm. noch zu stark. Nachmittagsfenster ab 12\u00a0Uhr nutzbar.',
            m:[
              {l:'TEMP.',        v:'14\u00a0\u00b0C', lim:'zul.\u00a08\u201325\u00a0\u00b0C',  pill:'im Einsatzfenster',                  pct:35,  pc:'#3a7a2f'},
              {l:'WIND',         v:'17\u00a0km/h',    lim:'zul.\u00a0\u2264\u00a015\u00a0km/h', pill:'+2\u00a0km/h \u00b7 f\u00e4llt ab 12h', pct:100, pc:'#e8a020'},
              {l:'B\u00d6EN',    v:'22\u00a0km/h',    lim:'zul.\u00a0\u2264\u00a025\u00a0km/h', pill:'knapp im Limit',                     pct:88,  pc:'#e8a020'},
              {l:'REL. FEUCHTE', v:'68\u00a0%',       lim:'zul.\u00a0\u2264\u00a085\u00a0%',    pill:'innerhalb Leitfaden',                pct:80,  pc:'#3a7a2f'},
              {l:'TROCKEN VOR',  v:'3\u00a0h',        lim:'mind.\u00a03\u00a0h',                pill:'Minimum erf\u00fcllt \u2713',        pct:60,  pc:'#3a7a2f'},
              {l:'REGEN NACH',   v:'0\u00a0mm',       lim:'0\u00a0mm empfohlen',                pill:'trockenes Fenster',                  pct:5,   pc:'#3a7a2f'},
            ],
            prof:[8,8,8,8,8,8,8,8,8,8,38,42,45,50,70,74,75,72,40,8,8,8,8,8],
            winT:'12:00\u00a0\u2013\u00a017:00', winN:'Wind f\u00e4llt ab 12h\u00a0\u00b7 Nachmittagsfenster nutzen'
          },
          { abbr:'MI', date:'16.04.', score:14, st:'nogo',
            sum:'Nicht ausfahren. Temperatur unter Minimum, Wind weit \u00fcber Limit, Dauerregen ganztags. K\u00e4ltestress blockiert Stomata \u2013 Wirkstoffaufnahme auch bei trockenem Blatt stark reduziert. Pflanzenstoffwechsel eingestellt.',
            badge:'NICHT GEEIGNET', crit:'0\u00a0/\u00a06 Kriterien erf\u00fcllt', critNote:'Dauerregen + Wind + K\u00e4lte. Alle Grenzwerte \u00fcberschritten.',
            m:[
              {l:'TEMP.',        v:'7\u00a0\u00b0C',  lim:'zul.\u00a08\u201325\u00a0\u00b0C',  pill:'\u22121\u00a0\u00b0C zu kalt',        pct:30,  pc:'#cc2200'},
              {l:'WIND',         v:'21\u00a0km/h',    lim:'zul.\u00a0\u2264\u00a015\u00a0km/h', pill:'+6\u00a0km/h \u00fcber Limit',       pct:100, pc:'#cc2200'},
              {l:'B\u00d6EN',    v:'38\u00a0km/h',    lim:'zul.\u00a0\u2264\u00a025\u00a0km/h', pill:'+13\u00a0km/h \u00fcber Limit',      pct:100, pc:'#cc2200'},
              {l:'REL. FEUCHTE', v:'94\u00a0%',       lim:'zul.\u00a0\u2264\u00a085\u00a0%',    pill:'+9\u00a0% zu feucht',               pct:100, pc:'#cc2200'},
              {l:'TROCKEN VOR',  v:'0\u00a0h',        lim:'mind.\u00a03\u00a0h',                pill:'3\u00a0h fehlen',                    pct:10,  pc:'#cc2200'},
              {l:'REGEN NACH',   v:'22\u00a0mm',      lim:'0\u00a0mm empfohlen',                pill:'Auswaschung sicher',                 pct:100, pc:'#cc2200'},
            ],
            prof:[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
            winT:'Nicht m\u00f6glich', winN:'Triple-No-Go: Temperatur + Wind + Dauerregen'
          },
          { abbr:'DO', date:'17.04.', score:52, st:'bedingt',
            sum:'Nachmittag abwarten. Windgeschwindigkeit f\u00e4llt erst ab 14:00\u00a0Uhr unter Limit. Boden nach gestrigem Regen noch feucht \u2013 Trockenperiode vor Applikation ab 14\u00a0Uhr erf\u00fcllt. Fenster 14\u201318\u00a0Uhr technisch nutzbar.',
            badge:'EINGESCHR\u00c4NKT GEEIGNET', crit:'3\u00a0/\u00a06 Kriterien erf\u00fcllt', critNote:'Wind vm. zu stark. Nachmittagsfenster ab 14\u00a0Uhr nutzbar.',
            m:[
              {l:'TEMP.',        v:'13\u00a0\u00b0C', lim:'zul.\u00a08\u201325\u00a0\u00b0C',  pill:'im Einsatzfenster',                  pct:29,  pc:'#3a7a2f'},
              {l:'WIND',         v:'16\u00a0km/h',    lim:'zul.\u00a0\u2264\u00a015\u00a0km/h', pill:'+1\u00a0km/h \u00b7 f\u00e4llt ab 14h', pct:100, pc:'#e8a020'},
              {l:'B\u00d6EN',    v:'27\u00a0km/h',    lim:'zul.\u00a0\u2264\u00a025\u00a0km/h', pill:'+2\u00a0km/h \u00fcber Limit',       pct:100, pc:'#e8a020'},
              {l:'REL. FEUCHTE', v:'66\u00a0%',       lim:'zul.\u00a0\u2264\u00a085\u00a0%',    pill:'innerhalb Leitfaden',                pct:78,  pc:'#3a7a2f'},
              {l:'TROCKEN VOR',  v:'4\u00a0h',        lim:'mind.\u00a03\u00a0h',                pill:'Minimum erf\u00fcllt \u2713',        pct:70,  pc:'#3a7a2f'},
              {l:'REGEN NACH',   v:'0\u00a0mm',       lim:'0\u00a0mm empfohlen',                pill:'trockenes Fenster',                  pct:5,   pc:'#3a7a2f'},
            ],
            prof:[8,8,8,8,8,8,8,8,8,8,8,8,8,8,42,48,72,68,40,8,8,8,8,8],
            winT:'14:00\u00a0\u2013\u00a018:00', winN:'Wind f\u00e4llt ab 14h\u00a0\u00b7 Trockenheit nachmittags sicher'
          },
          { abbr:'FR', date:'18.04.', score:90, st:'optimal',
            sum:'Ausgezeichnetes Fenster. Alle 6 Kriterien erf\u00fcllt. Optimale Bedingungen den ganzen Tag \u2013 windstill, trocken, Temperatur perfekt f\u00fcr Wirkstoffaufnahme und Antrocknung.',
            badge:'OPTIMALE BEDINGUNGEN', crit:'6\u00a0/\u00a06 Kriterien erf\u00fcllt', critNote:'Alle Parameter im sicheren Bereich.',
            m:[
              {l:'TEMP.',        v:'17\u00a0\u00b0C', lim:'zul.\u00a08\u201325\u00a0\u00b0C',  pill:'im Einsatzfenster',           pct:53,  pc:'#3a7a2f'},
              {l:'WIND',         v:'7\u00a0km/h',     lim:'zul.\u00a0\u2264\u00a015\u00a0km/h', pill:'sicherer Bereich',            pct:47,  pc:'#3a7a2f'},
              {l:'B\u00d6EN',    v:'13\u00a0km/h',    lim:'zul.\u00a0\u2264\u00a025\u00a0km/h', pill:'technisch tragf\u00e4hig',    pct:52,  pc:'#3a7a2f'},
              {l:'REL. FEUCHTE', v:'59\u00a0%',       lim:'zul.\u00a0\u2264\u00a085\u00a0%',    pill:'innerhalb Leitfaden',         pct:69,  pc:'#3a7a2f'},
              {l:'TROCKEN VOR',  v:'6\u00a0h',        lim:'mind.\u00a03\u00a0h',                pill:'Minimum erf\u00fcllt \u2713', pct:90,  pc:'#3a7a2f'},
              {l:'REGEN NACH',   v:'0\u00a0mm',       lim:'0\u00a0mm empfohlen',                pill:'trockenes Fenster',           pct:5,   pc:'#3a7a2f'},
            ],
            prof:[8,8,8,8,8,8,8,8,85,90,93,96,97,96,95,93,90,45,78,10,8,8,8,8],
            winT:'08:00\u00a0\u2013\u00a018:00', winN:'Bestes Fenster der Woche\u00a0\u00b7 Fr\u00fch starten empfohlen'
          },
        ];
        var WX_ACTIVE = 3;
        var buildWxTabsHtml = function(ai) {
          var out = '<div style="display:flex;gap:8px;margin-bottom:16px;">';
          for (var i = 0; i < WX_DAYS.length; i++) {
            var w = WX_DAYS[i];
            var sc  = w.st==='optimal' ? '#3a7a2f' : w.st==='bedingt' ? '#b85c00' : '#cc2200';
            var bg  = w.st==='optimal' ? 'rgba(58,122,47,0.08)' : w.st==='bedingt' ? 'rgba(232,160,32,0.10)' : 'rgba(204,34,0,0.08)';
            var isSel = i === ai;
            out += '<div class="wx-tab" onclick="window.switchWeatherDay(' + i + ')" ' +
              'style="position:relative;flex:1;padding:16px 8px;border-radius:' + (isSel ? '12px 12px 0 0' : '12px') + ';cursor:pointer;text-align:center;' +
              'background:' + bg + ';' +
              'border:none;' +
              'user-select:none;-webkit-tap-highlight-color:transparent;">' +
              '<div style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#1d1d1f;">' + w.abbr + ', ' + w.date + '</div>' +
              '<div style="font-size:18px;font-weight:700;color:' + sc + ';line-height:1.3;margin:8px 0 4px;">' + w.winT + '</div>' +
              '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.3px;color:' + sc + ';">' +
                (w.st==='optimal' ? 'OPTIMAL' : w.st==='bedingt' ? 'BEDINGT' : 'NO-GO') +
              '</div>' +
              (isSel ? '<div class="wx-tab-connector" style="position:absolute;left:0;right:0;bottom:-16px;height:16px;background:' + bg + ';pointer-events:none;"></div>' : '') +
            '</div>';
          }
          return out + '</div>';
        };
        var buildWxDetailHtml = function(w) {
          var sc      = w.st==='optimal' ? '#3a7a2f' : w.st==='bedingt' ? '#b85c00' : '#cc2200';
          var badgeBg = w.st==='optimal' ? 'rgba(58,122,47,0.08)' : w.st==='bedingt' ? 'rgba(232,160,32,0.10)' : 'rgba(204,34,0,0.08)';
          var profColors = ['#3a7a2f', '#e8a020', '#cc2200'];
          var profColor  = function(s) { return s > 65 ? '#3a7a2f' : s > 25 ? '#e8a020' : '#cc2200'; };
          var profBarH   = function(s) { return Math.max(10, Math.round(s / 100 * 40)); };
          var metricsHtml = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">' +
            w.m.map(function(m) {
              var pillBg = m.pc==='#3a7a2f' ? 'rgba(58,122,47,0.12)' : m.pc==='#e8a020' ? 'rgba(232,160,32,0.14)' : 'rgba(204,34,0,0.10)';
              return '<div style="background:#fff;border-radius:12px;padding:16px;">' +
                '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:#8e8e93;margin-bottom:4px;">' + m.l + '</div>' +
                '<div style="font-size:18px;font-weight:700;color:#1d1d1f;line-height:1;">' + m.v + '</div>' +
                '<div style="font-size:14px;color:#8e8e93;margin:4px 0 8px;">' + m.lim + '</div>' +
                '<div style="display:inline-block;background:' + pillBg + ';color:' + m.pc + ';border-radius:999px;padding:4px 8px;font-size:11px;font-weight:600;margin-bottom:8px;">' + m.pill + '</div>' +
                '<div style="height:4px;background:rgba(0,0,0,0.08);border-radius:2px;">' +
                  '<div style="height:4px;width:' + Math.min(m.pct, 100) + '%;background:' + m.pc + ';border-radius:2px;"></div>' +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>';
          var profHours = ['0h','','','','','','6h','','','','','','12h','','','','','','18h','','','','',''];
          var profBars =
            '<div style="display:flex;gap:4px;height:40px;align-items:flex-end;">' +
              w.prof.map(function(s) {
                return '<div style="flex:1;height:' + profBarH(s) + 'px;background:' + profColor(s) + ';border-radius:3px 3px 0 0;"></div>';
              }).join('') +
            '</div>' +
            '<div style="display:flex;margin-top:4px;">' +
              profHours.map(function(lbl) {
                return '<div style="flex:1;text-align:center;font-size:14px;color:#1d1d1f;">' + lbl + '</div>';
              }).join('') +
            '</div>';
          return '<div style="background:' + badgeBg + ';border-radius:0 0 16px 16px;padding:24px;">' +
            '<div style="margin-bottom:16px;">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
                '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:#8e8e93;">24-Stunden-Profil</div>' +
                '<div style="display:flex;gap:8px;align-items:center;">' +
                  ['Ausbringen', 'Eingeschr\u00e4nkt', 'Nicht'].map(function(lbl, li) {
                    return '<div style="display:flex;align-items:center;gap:4px;">' +
                      '<div style="width:8px;height:8px;border-radius:2px;background:' + profColors[li] + ';"></div>' +
                      '<span style="font-size:10px;color:#8e8e93;">' + lbl + '</span>' +
                    '</div>';
                  }).join('') +
                '</div>' +
              '</div>' +
              profBars +
            '</div>' +
            metricsHtml +
            '<div style="display:flex;justify-content:center;margin-top:32px;padding-bottom:16px;">' +
              '<button class="sheet-btn sheet-btn--outline" style="flex:none;">' +
                '<span class="sheet-btn-left">' +
                  '<svg class="sheet-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' +
                  '<span class="sheet-btn-text">Produktinfo per E-Mail erhalten</span>' +
                '</span>' +
                '<span class="sheet-btn-right"><span class="sheet-btn-slash">/</span><span class="sheet-btn-arrow">\u203a</span></span>' +
              '</button>' +
            '</div>' +
          '</div>';
        };

        document.getElementById('ganttSheetContent').innerHTML =

          /* ══ OBEN: VOLLE BREITE – Info-Karten ══ */

          /* 3-Spalten-Info: Wirkt gegen | BBCH | Einsatzhinweis */
          '<div style="display:grid;grid-template-columns:1fr 240px 0.7fr;gap:24px;margin-bottom:40px;">' +
            '<div style="background:#fff;border:1px solid rgba(0,0,0,0.09);border-radius:16px;padding:24px;">' +
              '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;margin-bottom:8px;">Wirkt gegen</div>' +
              '<div style="display:flex;flex-wrap:wrap;gap:8px;">' + tagsHtml + '</div>' +
            '</div>' +
            '<div style="background:#fff;border:1px solid rgba(0,0,0,0.09);border-radius:16px;padding:24px;">' +
              '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;margin-bottom:8px;">Anwendungsfenster BBCH</div>' +
              '<div style="font-size:56px;font-weight:600;letter-spacing:-2px;color:#1d1d1f;line-height:1;">' + d.from + '\u2013' + d.to + '</div>' +
              '<div onclick="window.openBbchLightbox()" style="cursor:zoom-in;border-radius:8px;overflow:hidden;margin-top:12px;position:relative;">' +
                '<img src="/bbch_real.jpg" style="width:100%;height:60px;object-fit:cover;object-position:center;display:block;" />' +
                '<div style="position:absolute;bottom:7px;right:7px;width:28px;height:28px;background:rgba(0,0,0,0.45);border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:none;">' +
                  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div style="background:#fff;border:1px solid rgba(0,0,0,0.09);border-radius:16px;padding:24px;">' +
              '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;margin-bottom:8px;">Einsatzhinweis</div>' +
              '<div style="font-size:15px;color:#3a3a3c;line-height:1.6;">' + noteText + '</div>' +
            '</div>' +
          '</div>' +

          /* ══ PRODUKTKARTE – weisse Outer-Card ══ */
          '<div style="background:#fff;border-radius:16px;padding:32px;border:1px solid rgba(0,0,0,0.07);margin-bottom:24px;">' +

            /* Heading oben links */
            '<div style="margin-bottom:24px;">' +
              '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;margin-bottom:4px;">Produktkarte</div>' +
              '<div style="font-size:20px;font-weight:700;color:#1d1d1f;">Produkt, Details &amp; Downloads</div>' +
            '</div>' +

            /* 2-SPALTEN: Produktbild (links, beige) | Info-Rechts ══ */
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;">' +

              /* LINKS: beige Box */
              '<div style="position:sticky;top:120px;align-self:start;background:#eef0f4;border-radius:16px;padding:24px;">' +
                /* PREMEO-Badge – weiße Mini-Card oben rechts */
                '<div style="display:flex;justify-content:flex-end;margin-bottom:16px;">' +
                  '<div style="display:inline-flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:12px 16px;box-shadow:0 2px 12px rgba(0,0,0,0.08);">' +
                    '<div style="text-align:left;line-height:1.4;">' +
                      '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#6e6e73;">Premeo</div>' +
                      '<div style="font-size:16px;font-weight:600;color:#1d1d1f;">Bonusprogramm</div>' +
                    '</div>' +
                    '<img src="/icons_bonus.svg" style="width:52px;height:auto;flex-shrink:0;" />' +
                  '</div>' +
                '</div>' +
                /* Produktbild */
                '<div style="display:flex;align-items:center;justify-content:center;min-height:510px;">' +
                  (d.img ? '<img src="/' + d.img + '" style="max-width:95%;max-height:460px;object-fit:contain;">' : '') +
                '</div>' +
                /* Buttons direkt darunter */
                buttonsHtml +
              '</div>' +

              /* RECHTS: kein eigenes Card-Wrapper, sitzt auf weissem Hintergrund */
              '<div>' +

              /* Aufwandmengen – beige Outer-Box */
              '<div style="background:#eef0f4;border-radius:16px;padding:16px 20px;margin-bottom:20px;">' +
                '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;margin-bottom:12px;">Aufwandmengen je Kombination</div>' +
                /* weisses Inner-Card */
                '<div style="background:#fff;border-radius:12px;overflow:hidden;">' +
                  /* Column headers */
                  '<div style="display:grid;grid-template-columns:1fr auto;gap:8px;padding:12px 16px;border-bottom:1px solid rgba(0,0,0,0.06);">' +
                    '<span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:#8e8e93;">Produkt</span>' +
                    '<span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:#8e8e93;">Aufwandmenge</span>' +
                  '</div>' +
                  d.products.map(function(pr) {
                    return '<div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:16px;border-bottom:1px solid rgba(0,0,0,0.05);">' +
                      '<span style="font-size:16px;color:#1d1d1f;">' + pr.n + '</span>' +
                      '<span style="font-size:15px;font-weight:600;color:#1d1d1f;background:#eef0f4;border-radius:20px;padding:8px 16px;white-space:nowrap;">' + pr.d + '</span>' +
                    '</div>';
                  }).join('') +
                '</div>' + /* end weisses Inner-Card */
              '</div>' + /* end beige Outer-Box Aufwandmengen */

              /* Formulierung & Wirkstoff – Akkordeon */
              '<div style="background:#eef0f4;border-radius:16px;margin-top:12px;overflow:hidden;">' +
                '<div onclick="window.toggleAccordion(\'fw\')" style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;cursor:pointer;">' +
                  '<span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;">Formulierung &amp; Wirkstoff</span>' +
                  '<span id="fw-icon" style="font-size:20px;color:#8e8e93;line-height:1;font-weight:300;">' + (d.formulierung ? '\u2212' : '+') + '</span>' +
                '</div>' +
                '<div id="fw-body" style="display:' + (d.formulierung ? 'block' : 'none') + ';padding:0 12px 12px;">' +
                  '<div style="background:#fff;border-radius:12px;padding:16px 18px;">' +
                    (d.formulierung ? (
                      '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;margin-bottom:6px;">Formulierung</div>' +
                      '<div style="font-size:17px;font-weight:600;color:#1d1d1f;margin-bottom:16px;">' + d.formulierung + '</div>'
                    ) : '') +
                    (d.wirkstoffe ? (
                      '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;margin-bottom:8px;">Wirkstoff</div>' +
                      '<div style="display:flex;flex-direction:column;gap:6px;">' +
                        d.wirkstoffe.map(function(w) {
                          return '<div style="background:#eef0f4;border-radius:8px;padding:12px 16px;font-size:15px;color:#1d1d1f;">' + w + '</div>';
                        }).join('') +
                      '</div>'
                    ) : '<div style="font-size:15px;color:#8e8e93;">Keine Daten verf\u00fcgbar</div>') +
                  '</div>' +
                '</div>' +
              '</div>' + /* end Formulierung Akkordeon */

              /* Downloads – beige Outer-Box */
              '<div style="background:#eef0f4;border-radius:16px;padding:16px 20px;margin-top:12px;">' +
                '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;margin-bottom:12px;">Downloads</div>' +
                '<div style="display:flex;flex-direction:column;gap:6px;">' +
                  ['Sicherheitsdatenblatt','Gebrauchsanleitung','Leistungsprofil','L\u00fcckenindikationen','Abst\u00e4nde Gew\u00e4sser, Saumstrukturen und Hangneigung'].map(function(dl) {
                    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:#fff;border-radius:12px;cursor:pointer;">' +
                      '<span style="font-size:16px;color:#1d1d1f;">' + dl + '</span>' +
                      '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 13L13 3M13 3H6M13 3v7" stroke="#8e8e93" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                    '</div>';
                  }).join('') +
                '</div>' +
              '</div>' + /* end Downloads beige box */

              /* Artikel & Logistik – Akkordeon */
              '<div style="background:#eef0f4;border-radius:16px;margin-top:12px;overflow:hidden;">' +
                '<div onclick="window.toggleAccordion(\'al\')" style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;cursor:pointer;">' +
                  '<span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#8e8e93;">Artikel &amp; Logistik</span>' +
                  '<span id="al-icon" style="font-size:20px;color:#8e8e93;line-height:1;font-weight:300;">' + (d.artikel ? '\u2212' : '+') + '</span>' +
                '</div>' +
                '<div id="al-body" style="display:' + (d.artikel ? 'block' : 'none') + ';padding:0 16px 16px;">' +
                  '<div style="background:#fff;border-radius:12px;padding:24px;">' +
                    (d.artikel ? (
                      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">' +
                        '<span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:#8e8e93;">Artikelnummer</span>' +
                        '<span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:#8e8e93;">Verpackungsgr\u00f6\u00dfe</span>' +
                      '</div>' +
                      d.artikel.map(function(a) {
                        return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px 0;border-top:1px solid rgba(0,0,0,0.06);">' +
                          '<span style="font-size:15px;font-weight:700;color:#1d1d1f;">' + a.name + '</span>' +
                          '<span style="font-size:15px;color:#1d1d1f;">' + a.size + '</span>' +
                        '</div>';
                      }).join('')
                    ) : '<div style="font-size:15px;color:#8e8e93;">Keine Daten verf\u00fcgbar</div>') +
                  '</div>' +
                '</div>' +
              '</div>' + /* end Artikel Akkordeon */

              chartHtml +

            '</div>' + /* end rechte Spalte */

          '</div>' + /* end 2-Spalten */

        '</div>' + /* end weisse Outer-Card Produktkarte */

          /* ══ UNTEN: VOLLE BREITE – Einsatzprognose ══ */

          '<div style="background:#fff;border-radius:16px;padding:32px;border:1px solid rgba(0,0,0,0.07);margin-top:32px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:24px;">' +
              '<div style="font-size:24px;font-weight:800;color:#1d1d1f;">Einsatzprognose</div>' +
              '<div style="font-size:12px;color:#8e8e93;">PLZ\u00a030519 Hannover\u00a0\u00b7\u00a014.\u201318.\u00a0April 2025</div>' +
            '</div>' +

            /* Ausbringungskriterien */
            '<div style="border-radius:16px;padding:24px;margin-bottom:24px;background:rgba(37,99,235,0.03);">' +
              '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#8e8e93;margin-bottom:16px;">Ausbringungskriterien \u2014 Grenzwerte laut Produktleitfaden</div>' +
              '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px;">' +
                [
                  ['Temperatur', '8\u00a0\u2013\u00a025\u00a0\u00b0C', 'Aktiver Pflanzenstoffwechsel n\u00f6tig\u00a0\u00b7 Kein Wachstumsstress'],
                  ['Wind', '\u2264\u00a015\u00a0km/h', 'Abdriftrisiko\u00a0\u00b7 Gew\u00e4sserabstand\u00a0\u00b7 Nachbarkulturen'],
                  ['B\u00f6en', '\u2264\u00a025\u00a0km/h', 'Spitzen bestimmen effektiven Abdrifteintrag'],
                  ['Rel. Luftfeuchte', '\u2264\u00a085\u00a0%', 'H\u00f6her: Blattn\u00e4sse, verd\u00fannte Spritzbrühe\u00a0\u00b7 Niedriger: Antrocknung'],
                ].map(function(c) {
                  return '<div style="background:#fff;border-radius:12px;padding:16px;">' +
                    '<div style="font-size:13px;font-weight:700;color:#1d1d1f;margin-bottom:4px;">' + c[0] + '</div>' +
                    '<div style="font-size:18px;font-weight:700;color:#2563eb;margin-bottom:8px;">' + c[1] + '</div>' +
                    '<div style="font-size:12px;color:#6e6e73;line-height:1.5;">' + c[2] + '</div>' +
                  '</div>';
                }).join('') +
              '</div>' +
              '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">' +
                [
                  ['Trocken vor Applikation', 'mind.\u00a03\u00a0Stunden', 'Trockene Blattfl\u00e4che f\u00fcr optimale Wirkstoffhaftung'],
                  ['Regenfrei nach Applikation', 'mind.\u00a02\u00a0Stunden', 'Blattaufnahme des ALS-Hemmers ben\u00f6tigt 2\u00a0h Einwirkzeit'],
                  ['Frost', 'Kein Frost\u00a0\u00b1\u00a024\u00a0h', 'K\u00e4ltestress blockiert Stomata\u00a0\u00b7 Wirkstofftransport gestoppt'],
                ].map(function(c) {
                  return '<div style="background:#fff;border-radius:12px;padding:16px;">' +
                    '<div style="font-size:13px;font-weight:700;color:#1d1d1f;margin-bottom:4px;">' + c[0] + '</div>' +
                    '<div style="font-size:18px;font-weight:700;color:#2563eb;margin-bottom:8px;">' + c[1] + '</div>' +
                    '<div style="font-size:12px;color:#6e6e73;line-height:1.5;">' + c[2] + '</div>' +
                  '</div>';
                }).join('') +
              '</div>' +
            '</div>' +

            buildWxTabsHtml(WX_ACTIVE) +
            '<div id="wx-prognose-card" style="background:' + (WX_DAYS[WX_ACTIVE].st==='optimal' ? 'rgba(58,122,47,0.08)' : WX_DAYS[WX_ACTIVE].st==='bedingt' ? 'rgba(232,160,32,0.10)' : 'rgba(204,34,0,0.08)') + ';border-radius:12px 12px 0 0;padding:16px 24px;margin-bottom:0;">' +
              '<div id="wx-prognose-label" style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#8e8e93;margin-bottom:8px;">Prognosetext</div>' +
              '<div id="wx-summary-text" style="font-size:15px;color:#1d1d1f;line-height:1.65;">' + WX_DAYS[WX_ACTIVE].sum + '</div>' +
            '</div>' +
            '<div id="wx-detail-slot">' + buildWxDetailHtml(WX_DAYS[WX_ACTIVE]) + '</div>' +
          '</div>'; /* end Einsatzprognose */

        /* ── Chart-Balken per IntersectionObserver animieren ── */
        (function() {
          var sheet = document.getElementById('ganttSheet');
          var bars = document.querySelectorAll('#ganttSheetContent .chart-bar');
          if (!bars.length) return;
          var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
              }
            });
          }, { root: sheet, threshold: 0.3 });
          bars.forEach(function(bar) { observer.observe(bar); });
        })();

        window.switchWeatherDay = function(idx) {
          WX_ACTIVE = idx;
          document.querySelectorAll('.wx-tab').forEach(function(tab, i) {
            var w = WX_DAYS[i];
            var bg = w.st==='optimal' ? 'rgba(58,122,47,0.08)' : w.st==='bedingt' ? 'rgba(232,160,32,0.10)' : 'rgba(204,34,0,0.08)';
            tab.style.background   = bg;
            tab.style.border       = 'none';
            tab.style.borderRadius = i===idx ? '12px 12px 0 0' : '12px';
            var existing = tab.querySelector('.wx-tab-connector');
            if (i === idx) {
              if (!existing) {
                var c = document.createElement('div');
                c.className = 'wx-tab-connector';
                c.style.cssText = 'position:absolute;left:0;right:0;bottom:-16px;height:16px;pointer-events:none;';
                tab.appendChild(c);
                existing = c;
              }
              existing.style.background = bg;
            } else if (existing) {
              existing.remove();
            }
          });
          var cardEl = document.getElementById('wx-prognose-card');
          if (cardEl) cardEl.style.background = WX_DAYS[idx].st==='optimal' ? 'rgba(58,122,47,0.08)' : WX_DAYS[idx].st==='bedingt' ? 'rgba(232,160,32,0.10)' : 'rgba(204,34,0,0.08)';
          var sumEl = document.getElementById('wx-summary-text');
          if (sumEl) sumEl.textContent = WX_DAYS[idx].sum;
          var detailEl = document.getElementById('wx-detail-slot');
          if (detailEl) detailEl.innerHTML = buildWxDetailHtml(WX_DAYS[idx]);
        };

        /* ── Sticky liquid-glass header befüllen ── */
        var stickyInfo = document.getElementById('ganttStickyInfo');
        var stickyHeader = document.getElementById('ganttStickyHeader');
        stickyInfo.innerHTML =
          '<div class="gsh-block">' +
            '<span class="gsh-badge" style="background:' + accentColor + ';color:#fff;">' + badgeLabel + '</span>' +
            '<span class="gsh-title">' + d.products[0].n + '</span>' +
            '<span class="gsh-crop">' + d.crop + '</span>' +
          '</div>';

        var sheet = document.getElementById('ganttSheet');
        sheet.scrollTop = 0;
        stickyHeader.classList.remove('g-sticky-scrolled');
        function sheetScrollHandler() {
          stickyHeader.classList.toggle('g-sticky-scrolled', sheet.scrollTop > 70);
        }
        sheet.addEventListener('scroll', sheetScrollHandler, { passive: true });
        window._ganttSheetScrollHandler = sheetScrollHandler;

        function sheetWheelHandler(e) {
          e.stopPropagation();
          var atTop    = sheet.scrollTop === 0 && e.deltaY < 0;
          var atBottom = sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 1 && e.deltaY > 0;
          if (!atTop && !atBottom) e.preventDefault();
          sheet.scrollTop += e.deltaY;
        }
        sheet.addEventListener('wheel', sheetWheelHandler, { passive: false });
        window._ganttSheetWheelHandler = sheetWheelHandler;

        document.getElementById('ganttOv').classList.add('on');
        document.getElementById('ganttSheet').classList.add('on');
      };

      /* Sync horizontal scroll: sticky head slides with gantt-wrap */
      (function() {
        var wrapEl = document.getElementById('ganttWrap');
        var ganttInnerHead = document.getElementById('ganttInnerHead');
        if (!wrapEl || !ganttInnerHead) return;
        wrapEl.addEventListener('scroll', function() {
          ganttInnerHead.style.marginLeft = '-' + wrapEl.scrollLeft + 'px';
        });
      })();

      window.openBbchLightbox = function() {
        var overlay = document.createElement('div');
        overlay.id = 'bbchLightbox';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:24px;';
        overlay.innerHTML =
          '<img src="/bbch_real.jpg" style="max-width:100%;max-height:100%;border-radius:12px;object-fit:contain;box-shadow:0 24px 80px rgba(0,0,0,0.6);" />' +
          '<button onclick="window.closeBbchLightbox()" style="position:fixed;top:20px;right:20px;width:44px;height:44px;border-radius:50%;background:rgba(240,240,240,0.95);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.2);">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>';
        overlay.addEventListener('click', function(e) { if (e.target === overlay) window.closeBbchLightbox(); });
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
      };
      window.closeBbchLightbox = function() {
        var el = document.getElementById('bbchLightbox');
        if (el) el.remove();
        document.body.style.overflow = '';
      };

      window.openOrderModal = function() {
        var d = window._ganttCurrentProduct;
        if (!d) return;
        var isFung = d.cat === 'fungizid';
        var badgeLabel = isFung ? 'Fungizid' : 'Herbizid';
        var accentColor = isFung ? '#2D7D3A' : '#E8590C';
        var dealers = [
          { name: 'AGRAVIS Technik & Beratung', km: '12 km', status: 'sofort verfügbar', statusColor: '#2D7D3A', lieferzeit: 'Lieferung in 1–2 Werktagen', versand: 'Spedition / regionaler Handel', badge: 'verfügbar', badgeBg: '#e6f4ea', badgeC: '#2D7D3A', highlight: true },
          { name: 'Raiffeisen Markt Region West', km: '28 km', status: 'begrenzter Bestand', statusColor: '#b8274a', lieferzeit: 'Lieferung in 2–3 Werktagen', versand: 'Abholung oder Zustellung', badge: 'verfügbar', badgeBg: '#e6f4ea', badgeC: '#2D7D3A', highlight: false },
          { name: 'BayWa Agrar Vertrieb', km: '34 km', status: 'auf Anfrage', statusColor: '#8e8e93', lieferzeit: 'Lieferung in 3–5 Werktagen', versand: 'Direktversand ab Lager', badge: 'verfügbar', badgeBg: '#e6f4ea', badgeC: '#2D7D3A', highlight: false },
        ];
        var dealersHtml = dealers.map(function(dl, idx) {
          return '<div data-dealer="' + idx + '" onclick="window.selectDealer(' + idx + ')" style="border:1.5px solid ' + (dl.highlight ? '#b8274a' : 'rgba(0,0,0,0.09)') + ';border-radius:14px;padding:18px 20px;margin-bottom:12px;background:' + (dl.highlight ? '#fdf2f5' : '#fff') + ';cursor:pointer;transition:border-color 0.18s,background 0.18s;">' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
              '<span style="font-size:16px;font-weight:700;color:#1d1d1f;flex:1;">' + dl.name + '</span>' +
              '<span style="font-size:12px;font-weight:700;background:#b8274a;color:#fff;border-radius:20px;padding:4px 10px;">' + dl.km + '</span>' +
              '<span style="font-size:12px;font-weight:600;background:' + dl.badgeBg + ';color:' + dl.badgeC + ';border-radius:20px;padding:4px 12px;">' + dl.badge + '</span>' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" stroke-width="2" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>' +
            '</div>' +
            '<div style="font-size:13px;font-weight:700;color:' + dl.statusColor + ';margin-bottom:4px;">' + dl.status + '</div>' +
            '<div style="font-size:13px;color:#6e6e73;line-height:1.5;">Lieferzeit: ' + dl.lieferzeit + '<br>Versandart: ' + dl.versand + '</div>' +
          '</div>';
        }).join('');
        var overlay = document.createElement('div');
        overlay.id = 'orderModal';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;padding:24px;';
        overlay.innerHTML =
          '<div style="background:#f5f5f7;border-radius:24px;max-width:920px;width:100%;max-height:90vh;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr;box-shadow:0 32px 80px rgba(0,0,0,0.35);position:relative;">' +

            /* ── LINKS ── */
            '<div style="padding:40px 36px;border-right:1px solid rgba(0,0,0,0.08);display:flex;flex-direction:column;">' +
              '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#8e8e93;margin-bottom:12px;">Produkt jetzt bestellen</div>' +
              '<div style="font-size:32px;font-weight:700;color:#1d1d1f;line-height:1.15;margin-bottom:32px;">Händler wählen<br><span style="background:linear-gradient(to right,#5a4861,#b8274a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Lieferzeit prüfen</span></div>' +

              /* Produkt-Card */
              '<div style="background:#fff;border-radius:16px;padding:24px 20px 20px;display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:28px;">' +
                (d.img ? '<img src="/' + d.img + '" style="width:160px;height:160px;object-fit:contain;margin-bottom:16px;" />' : '') +
                '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:' + accentColor + ';margin-bottom:6px;">' + badgeLabel + '</div>' +
                '<div style="font-size:22px;font-weight:700;color:#1d1d1f;margin-bottom:4px;">' + (d.products[0] ? d.products[0].n : d.label) + '</div>' +
                '<div style="font-size:13px;color:#6e6e73;">' + d.label + '</div>' +
              '</div>' +

              /* Wichtige Hinweise */
              '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#8e8e93;margin-bottom:8px;">Wichtige Hinweise</div>' +
              '<div style="font-size:13px;color:#6e6e73;line-height:1.65;">Verfügbarkeit, Lieferzeit und Versandart können je Händler variieren. Preise, Staffelungen und Rückfragen zur Beratung werden im nächsten Schritt direkt beim ausgewählten Partner geklärt.</div>' +
              '<div style="display:flex;justify-content:flex-end;margin-top:auto;padding-top:24px;">' +
                '<button class="sheet-btn sheet-btn--outline" onclick="window.closeOrderModal()" style="white-space:nowrap;min-width:220px;flex:none;">' +
                  '<span class="sheet-btn-left"><span class="sheet-btn-text">Beratung anfragen</span></span>' +
                  '<span class="sheet-btn-right"><span class="sheet-btn-slash">/</span><span class="sheet-btn-arrow">›</span></span>' +
                '</button>' +
              '</div>' +
            '</div>' +

            /* ── RECHTS ── */
            '<div style="padding:40px 36px;display:flex;flex-direction:column;">' +
              '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#8e8e93;margin-bottom:8px;">Händlerauswahl</div>' +
              '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:24px;">' +
                '<div style="font-size:24px;font-weight:700;color:#1d1d1f;line-height:1.2;">Händler<br>auswählen</div>' +
                '<div style="font-size:13px;font-weight:600;color:#8e8e93;text-align:right;">3 Händler<br>verfügbar</div>' +
              '</div>' +
              dealersHtml +
              '<div style="flex:1;"></div>' +
              '<div style="display:flex;justify-content:flex-end;margin-top:24px;">' +
                '<button class="sheet-btn sheet-btn--primary" onclick="window.closeOrderModal()" style="white-space:nowrap;min-width:220px;flex:none;">' +
                  '<span class="sheet-btn-left"><span class="sheet-btn-text">Händler auswählen</span></span>' +
                  '<span class="sheet-btn-right"><span class="sheet-btn-slash">/</span><span class="sheet-btn-arrow">\u203a</span></span>' +
                '</button>' +
              '</div>' +
            '</div>' +

            /* Close */
            '<button onclick="window.closeOrderModal()" style="position:absolute;top:20px;right:20px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.08);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
          '</div>';
        overlay.addEventListener('click', function(e) { if (e.target === overlay) window.closeOrderModal(); });
        document.body.appendChild(overlay);
      };
      window.closeOrderModal = function() {
        var el = document.getElementById('orderModal');
        if (el) el.remove();
      };
      window.selectDealer = function(idx) {
        var cards = document.querySelectorAll('#orderModal [data-dealer]');
        cards.forEach(function(card) {
          var i = parseInt(card.getAttribute('data-dealer'));
          card.style.borderColor = i === idx ? '#b8274a' : 'rgba(0,0,0,0.09)';
          card.style.background = i === idx ? '#fdf2f5' : '#fff';
        });
      };

      window.ganttClose = function() {
        document.getElementById('ganttOv').classList.remove('on');
        document.getElementById('ganttSheet').classList.remove('on');
        var sheet = document.getElementById('ganttSheet');
        if (window._ganttSheetScrollHandler) {
          sheet.removeEventListener('scroll', window._ganttSheetScrollHandler);
          window._ganttSheetScrollHandler = null;
        }
        if (window._ganttSheetWheelHandler) {
          sheet.removeEventListener('wheel', window._ganttSheetWheelHandler);
          window._ganttSheetWheelHandler = null;
        }
        var sh = document.getElementById('ganttStickyHeader');
        var si = document.getElementById('ganttStickyInfo');
        if (sh) sh.classList.remove('g-sticky-scrolled');
        if (si) si.classList.remove('g-sticky-info-visible');
        sheet.scrollTop = 0;
      };

      window.toggleAccordion = function(id) {
        var body = document.getElementById(id + '-body');
        var icon = document.getElementById(id + '-icon');
        if (!body || !icon) return;
        var open = body.style.display !== 'none';
        body.style.display = open ? 'none' : 'block';
        icon.textContent   = open ? '+' : '\u2212';
      };

      window.applyDropdownFilter = function() {
        var unkraut   = document.getElementById('filterUnkraut').value.toLowerCase();
        var krankheit = document.getElementById('filterKrankheit').value.toLowerCase();
        document.querySelectorAll('.gantt-row').forEach(function(row) {
          var id = row.dataset.id;
          var d = DATA[id];
          if (!d) { row.classList.remove('g-hidden'); return; }
          var targets = d.targets.map(function(t){ return t.toLowerCase(); });
          var okU = !unkraut   || targets.some(function(t){ return t.indexOf(unkraut) !== -1; });
          var okK = !krankheit || targets.some(function(t){ return t.indexOf(krankheit) !== -1; });
          row.classList.toggle('g-hidden', !(okU && okK));
        });
        /* Hide groups where all rows are hidden */
        document.querySelectorAll('.gantt-group').forEach(function(grp) {
          var rows = grp.querySelectorAll('.gantt-row');
          var anyVisible = Array.prototype.some.call(rows, function(r) { return !r.classList.contains('g-hidden'); });
          grp.style.display = anyVisible ? '' : 'none';
        });
      };
      window.ganttFilter = window.applyDropdownFilter;
    })();

    return () => {
      delete window.ganttOpen;
      delete window.ganttClose;
      delete window.switchWeatherDay;
      delete window.applyDropdownFilter;
      delete window.ganttFilter;
      delete window.openBbchLightbox;
      delete window.closeBbchLightbox;
      delete window.openOrderModal;
      delete window.closeOrderModal;
      delete window.selectDealer;
      delete window._ganttCurrentProduct;
      delete window.refreshCursorLine;
    };
  }, [])

  /* ── Beratung: Sticky BBCH bar scroll logic ── */
  useEffect(() => {
    let bbchFixed = false

    function applyFixed(topPx = 0) {
      const head = document.getElementById('ganttStickyHead')
      const wrap = document.getElementById('ganttWrap')
      if (!head) return
      if (!bbchFixed) {
        bbchFixed = true
        const rect = head.getBoundingClientRect()
        head.style.setProperty('position', 'fixed',          'important')
        head.style.setProperty('left',     rect.left + 'px', 'important')
        head.style.setProperty('width',    rect.width + 'px','important')
        head.style.setProperty('z-index',  '100',            'important')
        head.style.setProperty('overflow', 'visible',        'important')
        if (wrap) wrap.style.marginTop = rect.height + 'px'
      }
      head.style.setProperty('top', topPx + 'px', 'important')
    }

    function removeFixed() {
      const head = document.getElementById('ganttStickyHead')
      const wrap = document.getElementById('ganttWrap')
      if (!head || !bbchFixed) return
      bbchFixed = false
      head.style.removeProperty('position')
      head.style.removeProperty('top')
      head.style.removeProperty('left')
      head.style.removeProperty('width')
      head.style.removeProperty('z-index')
      head.style.removeProperty('overflow')
      if (wrap) wrap.style.marginTop = ''
    }

    let lastScrollY = window.scrollY

    function showBeratungNav(wrap) {
      if (!wrap) return
      wrap.classList.remove('beratung-nav-wrap--hidden')
    }

    function hideBeratungNav(wrap) {
      if (!wrap) return
      wrap.classList.add('beratung-nav-wrap--hidden')
    }

    function onScroll() {
      const trigger  = document.getElementById('bbch-trigger')
      const nav      = document.querySelector('.main-nav')
      if (!trigger || !nav) return

      const currentScrollY  = window.scrollY
      const scrollingDown   = currentScrollY > lastScrollY
      lastScrollY           = currentScrollY

      const triggerTop   = trigger.getBoundingClientRect().top
      const ganttOuter   = document.getElementById('ganttOuterContainer')
      const ganttBottom  = ganttOuter ? ganttOuter.getBoundingClientRect().bottom : 0

      const beratungNavWrap = document.querySelector('.beratung-nav-wrap--scrolled')

      // Im BBCH-Gantt-Bereich: beide Navis verstecken
      const inGanttZone = triggerTop <= 115 && ganttBottom > 0

      if (inGanttZone) {
        nav.classList.add('main-nav--hidden')
        hideBeratungNav(beratungNavWrap)
      } else if (currentScrollY <= 10) {
        nav.classList.remove('main-nav--hidden')
        hideBeratungNav(beratungNavWrap)
      } else if (scrollingDown) {
        nav.classList.add('main-nav--hidden')
        showBeratungNav(beratungNavWrap)
      } else {
        nav.classList.remove('main-nav--hidden')
        hideBeratungNav(beratungNavWrap)
      }

      // BBCH-Bar fixieren: wenn Trigger oben raus
      const head = document.getElementById('ganttStickyHead')
      const headH = head ? head.offsetHeight : 60
      if (triggerTop <= 0 && ganttBottom > 0) {
        // Normaler Fall: Bar oben fixiert
        // Wenn Chart-Boden näher als Bar-Höhe → Bar hochschieben (ganttBottom - headH wird negativ)
        const topOffset = Math.min(0, ganttBottom - headH)
        applyFixed(topOffset)
      } else {
        removeFixed()
      }
    }

    function onResize() {
      // Breite bei fixed aktualisieren
      if (!bbchFixed) return
      const head = document.getElementById('ganttStickyHead')
      const outer = head?.parentElement
      if (!head || !outer) return
      const rect = outer.getBoundingClientRect()
      head.style.setProperty('left',  rect.left + 'px',  'important')
      head.style.setProperty('width', rect.width + 'px', 'important')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      removeFixed()
    }
  }, [])

  function handleTabClick(idx) {
    setActiveTab(idx)
  }

  return (
    <>
      {showSeasonModal && <SeasonViewModal onClose={() => setShowSeasonModal(false)} />}
      <MainNav />
      <div
        className="beratung-content"
      >

        {/* ── GRADIENT WRAP (BeratungNav + Feldbericht + Produkte) ── */}
        <div className="dark-gradient-wrap" ref={gradFadeRef}>
        <BeratungNav />

        {/* ── FELDBERICHT SLIDER ── */}
        <section className="screen-section" id="feldbericht-slider">
          <div className="section-inner">
            <div className="section-header-row">
              <div>
                <div className="section-tag">{[navPlz, navKultur ? navKultur.charAt(0).toUpperCase() + navKultur.slice(1) : ''].filter(Boolean).join(', ')}</div>
                <div className="section-heading">Feldbericht</div>
              </div>
              <Button
                variant="white"
                onClick={() => setShowSeasonModal(true)}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                }
              >
                Season View abonnieren
              </Button>
            </div>

            <div className="fbs-scroll-outer" ref={fbsTrackRef}>
            <div className="fbs-track">
              {cards.map((c, i) => (
                <motion.div
                  className="fbs-card"
                  key={i}
                  initial={{ opacity: 0, y: 200 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.8 + i * 0.1 }}
                >

                  {/* Top: Avatar links, Meta rechts */}
                  <div className="fb-card-top">
                    <div className="fb-card-avatar">
                      <img src={c.avatar} alt="Berater" onError={(e) => { e.target.parentElement.style.background = '#ccc' }} />
                    </div>
                    <div className="fb-card-meta">
                      <span className="fb-card-date">{c.date}</span>
                      <span className="fb-card-kultur">{c.kultur}</span>
                      <span className="fb-card-plz">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        {c.plz}
                      </span>
                    </div>
                  </div>

                  {/* Titel */}
                  <div className="fb-card-title">{c.title}</div>

                  {/* Tags */}
                  <div className="fb-card-tags">
                    {c.tags.map((t, j) => (
                      <span key={j} className={`fb-tag ${t.cls}`}>{t.label}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="fb-card-footer">
                    <span className="fb-card-arrow">/ <span className="agrar-arrow-chevron">›</span></span>
                  </div>

                </motion.div>
              ))}
            </div>
            </div>

            <div className="fbs-nav">
              <button className="fbs-nav-btn" onClick={() => fbsScroll(-1)} aria-label="Zurück">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button className="fbs-nav-btn" onClick={() => fbsScroll(1)} aria-label="Weiter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

          </div>
        </section>

        {/* ── PRODUKTE ── */}
        <>
          <section className="screen-section" id="produkte">
            <div className="section-inner">
              <h1 className="page-title">Produkte im Einsatz nach <span className="produkte-gradient">BBCH-Stadien</span></h1>

              <div className="filter-dropdowns" style={{ padding: '24px 0' }}>
                <div className="fc-card">
                  <div className="fc-eyebrow">Filter</div>
                  <div className="fc-cardtitle">Unkräuter / Gräser</div>
                  <div className="fc-selectwrap">
                    <select className="filter-select" id="filterUnkraut" onChange={() => window.applyDropdownFilter && window.applyDropdownFilter()}>
                      <option value="">Alle Unkräuter und Gräser</option>
                      <option>Ackerfuchsschwanz</option>
                      <option>Windhalm</option>
                      <option>Trespen-Arten</option>
                      <option>Weidelgräser</option>
                      <option>Rispen</option>
                      <option>Flughafer</option>
                      <option>Mischverunkrautung</option>
                    </select>
                    <div className="fc-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg></div>
                  </div>
                </div>
                <div className="fc-card">
                  <div className="fc-eyebrow">Filter</div>
                  <div className="fc-cardtitle">Krankheiten / Schaderreger</div>
                  <div className="fc-selectwrap">
                    <select className="filter-select" id="filterKrankheit" onChange={() => window.applyDropdownFilter && window.applyDropdownFilter()}>
                      <option value="">Alle Krankheiten und Schaderreger</option>
                      <option>Septoria</option>
                      <option>Halmbruch</option>
                      <option>Mehltau</option>
                      <option>Rostarten</option>
                      <option>DTR</option>
                      <option>Fusarium</option>
                      <option>Ährenfusarium</option>
                      <option>DON-Reduktion</option>
                    </select>
                    <div className="fc-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg></div>
                  </div>
                </div>
              </div>

{/* Sentinel: BBCH sticky trigger */}
              <div id="bbch-trigger" />

              {/* Gantt Chart – outer container */}
              <div className="gantt-outer-container" id="ganttOuterContainer">

                {/* Sticky BBCH Header (scale + phases) */}
                <div className="gantt-sticky-head" id="ganttStickyHead">
                  <div className="gantt-inner-head" id="ganttInnerHead">
                    {/* Scale row */}
                    <div className="gantt-scale" style={{overflow:'visible',position:'relative'}}>
                      <div className="gantt-scale-label" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                        <span>BBCH</span>
                        <div
                          onClick={() => window.openBbchLightbox && window.openBbchLightbox()}
                          style={{ cursor: 'zoom-in', width: '26px', height: '26px', background: 'rgba(255,255,255,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                        </div>
                      </div>
                      <div className="gantt-scale-ticks" id="ganttTicks" ref={ticksRef}>
                        {/* React-controlled cursor bubble */}
                        <div
                          className="bbch-cursor"
                          style={{ left: cursorLeft }}
                        >
                          <div ref={bubbleRef} className="bbch-cursor-bubble">
                            <span className="bbch-cursor-label">BBCH</span>
                            <strong className="bbch-cursor-val">{ST[cursorIdx]}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Phase Labels Row */}
                    <div className="gantt-phases" id="ganttPhases">
                      <div className="gantt-phases-spacer" style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '19px', paddingLeft: '18px' }}>
                        {navKultur && (
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#ffffff', letterSpacing: '0.04em', textTransform: 'capitalize' }}>
                            {navKultur.charAt(0).toUpperCase() + navKultur.slice(1)}
                          </span>
                        )}
                      </div>
                      <div className="gantt-phases-track" id="ganttPhasesTrack"></div>
                      {/* Cursor line – inside gantt-phases so JS won't clear it */}
                      <div className="bbch-phase-cursor-line" style={{ left: lineLeft }} />
                    </div>
                  </div>
                </div>

                {/* Scrollable rows */}
                <div className="gantt-wrap" id="ganttWrap">
                  <div className="gantt-inner" id="ganttInner">
                    {/* React-controlled vertical cursor line */}
                    <div className="bbch-cursor-line" style={{ left: lineLeft }} />

                    {/* FUNGIZIDE GROUP */}
                    <div className="gantt-group gantt-group-fungizid">
                      <div className="gantt-group-hd">
                        <div className="gantt-group-hd-left">
                          <div className="gantt-group-title">Fungizid, <span className="gantt-group-sub">Krankheitsbekämpfung</span></div>
                        </div>
                        <span className="gantt-group-count">3 MASSNAHMEN</span>
                      </div>
                      <div className="gantt-group-rows">
                        <div className="gantt-row" data-id="f1" data-cat="fungizid" onClick={() => window.ganttOpen && window.ganttOpen('f1')}>
                          <div className="gantt-row-label">
                            <div className="gantt-row-bbch">BBCH 29–32</div>
                            <div className="gantt-row-name">T1 — Halmkrankheiten</div>
                            <div className="gantt-row-cat">Winter- / Sommerweizen</div>
                          </div>
                          <div className="gantt-track" id="gt_f1"><div className="gantt-gl" id="gg_f1"></div></div>
                        </div>
                        <div className="gantt-row" data-id="f2" data-cat="fungizid" onClick={() => window.ganttOpen && window.ganttOpen('f2')}>
                          <div className="gantt-row-label">
                            <div className="gantt-row-bbch">BBCH 37–51</div>
                            <div className="gantt-row-name">T2 — Blatt &amp; Abreife</div>
                            <div className="gantt-row-cat">Winter- / Sommerweizen</div>
                          </div>
                          <div className="gantt-track" id="gt_f2"><div className="gantt-gl" id="gg_f2"></div></div>
                        </div>
                        <div className="gantt-row" data-id="f3" data-cat="fungizid" onClick={() => window.ganttOpen && window.ganttOpen('f3')}>
                          <div className="gantt-row-label">
                            <div className="gantt-row-bbch">BBCH 59–69</div>
                            <div className="gantt-row-name">T3 — Ährenkrankheiten</div>
                            <div className="gantt-row-cat">Winter- / Sommerweizen</div>
                          </div>
                          <div className="gantt-track" id="gt_f3"><div className="gantt-gl" id="gg_f3"></div></div>
                        </div>
                      </div>
                    </div>

                    {/* HERBIZIDE GROUP */}
                    <div className="gantt-group gantt-group-herbizid">
                      <div className="gantt-group-hd">
                        <div className="gantt-group-hd-left">
                          <div className="gantt-group-title">Herbizid, <span className="gantt-group-sub">Gräser- und Unkrautkontrolle</span></div>
                        </div>
                        <span className="gantt-group-count">6 MASSNAHMEN</span>
                      </div>
                      <div className="gantt-group-rows">
                        <div className="gantt-row" data-id="h1" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h1')}>
                          <div className="gantt-row-label">
                            <div className="gantt-row-bbch">BBCH 21–37</div>
                            <div className="gantt-row-name">Ackerfuchsschwanz normal</div>
                            <div className="gantt-row-cat">Winterweizen · Triticale</div>
                          </div>
                          <div className="gantt-track" id="gt_h1"><div className="gantt-gl" id="gg_h1"></div></div>
                        </div>
                        <div className="gantt-row" data-id="h2" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h2')}>
                          <div className="gantt-row-label">
                            <div className="gantt-row-bbch">BBCH 21–37</div>
                            <div className="gantt-row-name">Ackerfuchsschwanz extrem &amp; Trespen</div>
                            <div className="gantt-row-cat">WW · WHW · Triticale</div>
                          </div>
                          <div className="gantt-track" id="gt_h2"><div className="gantt-gl" id="gg_h2"></div></div>
                        </div>
                        <div className="gantt-row" data-id="h3" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h3')}>
                          <div className="gantt-row-label">
                            <div className="gantt-row-bbch">BBCH 25–37</div>
                            <div className="gantt-row-name">Trespen — kein Rapsnachbau</div>
                            <div className="gantt-row-cat">Winterweizen</div>
                          </div>
                          <div className="gantt-track" id="gt_h3"><div className="gantt-gl" id="gg_h3"></div></div>
                        </div>
                        <div className="gantt-row" data-id="h4" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h4')}>
                          <div className="gantt-row-label">
                            <div className="gantt-row-bbch">BBCH 21–37</div>
                            <div className="gantt-row-name">Trespen — mit Rapsnachbau</div>
                            <div className="gantt-row-cat">Winterweizen</div>
                          </div>
                          <div className="gantt-track" id="gt_h4"><div className="gantt-gl" id="gg_h4"></div></div>
                        </div>
                        <div className="gantt-row" data-id="h5" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h5')}>
                          <div className="gantt-row-label">
                            <div className="gantt-row-bbch">BBCH 29–37</div>
                            <div className="gantt-row-name">Windhalm &amp; Mischverunkrautung + AHL</div>
                            <div className="gantt-row-cat">WW — Windhalmstandorte</div>
                          </div>
                          <div className="gantt-track" id="gt_h5"><div className="gantt-gl" id="gg_h5"></div></div>
                        </div>
                        <div className="gantt-row" data-id="h6" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h6')}>
                          <div className="gantt-row-label">
                            <div className="gantt-row-bbch">BBCH 29–37</div>
                            <div className="gantt-row-name">Windhalm — Standardbehandlung</div>
                            <div className="gantt-row-cat">WW · Roggen · Triticale</div>
                          </div>
                          <div className="gantt-track" id="gt_h6"><div className="gantt-gl" id="gg_h6"></div></div>
                        </div>
                      </div>
                    </div>

                  </div>{/* /gantt-inner */}
                </div>{/* /gantt-wrap */}
              </div>{/* /gantt-outer-container */}

              {/* Season View CTA */}
              <motion.div
                style={{ display: 'flex', justifyContent: 'center', marginTop: '132px', marginBottom: '96px' }}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.8 }}
              >
                <Button
                  variant="white"
                  onClick={() => setShowSeasonModal(true)}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  }
                >
                  Season View abonnieren
                </Button>
              </motion.div>

              {/* Legende */}

            </div>
          </section>

          {/* GANTT OVERLAY + BOTTOM SHEET */}
          <div className="g-overlay" id="ganttOv" onClick={() => window.ganttClose && window.ganttClose()}></div>
          <div className="g-sheet" id="ganttSheet">
            <button className="g-sheet-close" onClick={() => window.ganttClose && window.ganttClose()}>&#x2715;</button>
            <div className="g-drag-handle"></div>
            <div className="g-sticky-header" id="ganttStickyHeader">
              <div id="ganttStickyInfo"></div>
              <button className="sheet-btn sheet-btn--outline g-sheet-resistenz">
                <span className="sheet-btn-left">
                  <svg className="sheet-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0h10m-10 0a2 2 0 0 0 2 2h6a2 2 0 0 1 2 2v1M9 14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1m0 0h18"/></svg>
                  <span className="sheet-btn-text">Resistenz bestimmen</span>
                </span>
                <span className="sheet-btn-right"><span className="sheet-btn-slash">/</span><span className="sheet-btn-arrow">&#x203a;</span></span>
              </button>
              <button className="g-sheet-close g-sheet-close--sticky" onClick={() => window.ganttClose && window.ganttClose()}>&#x2715;</button>
            </div>
            <div id="ganttSheetContent"></div>
          </div>
        </>

          {/* ── FADE TO WHITE OVERLAY ── */}
          <motion.div style={{
            position: 'absolute', inset: 0,
            background: '#ffffff',
            pointerEvents: 'none',
            opacity: gradFadeOpacity,
          }} />

        </div>{/* end dark-gradient-wrap */}

        {/* ── VIDEOS ── */}
        <section className="screen-section" id="videos">
          <div className="section-inner">
            <div className="videos-header-row">
              <div>
                <div className="section-tag">Agrar TV</div>
                <div className="section-heading">Videoanalysen<br />aus ihrer Region</div>
              </div>
            </div>
            <div className="video-grid">
              <div className="video-card">
                <div className="video-thumb">
                  <img src="https://static.wixstatic.com/media/8a20aa_814a095165fb4ff990088bcd5b0165f2~mv2.jpg" alt="Video 1" loading="lazy" />
                  <div className="video-play-overlay"><div className="play-btn"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M6 4.5L19 12L6 19.5Z" fill="white" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/></svg></div></div>
                  <div className="video-duration">11:03</div>
                </div>
                <div className="video-body">
                  <div className="video-meta-row"><div className="video-category">Aus der Praxis</div><div className="video-date">03.10.2025</div></div>
                  <div className="video-title">Hier steht eine längere Überschrift</div>
                </div>
              </div>
              <div className="video-card">
                <div className="video-thumb">
                  <img src="https://static.wixstatic.com/media/8a20aa_3632aded684c4b18a0abf35223791592~mv2.jpg" alt="Video 2" loading="lazy" />
                  <div className="video-play-overlay"><div className="play-btn"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M6 4.5L19 12L6 19.5Z" fill="white" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/></svg></div></div>
                  <div className="video-duration">11:03</div>
                </div>
                <div className="video-body">
                  <div className="video-meta-row"><div className="video-category">Aus der Praxis</div><div className="video-date">03.10.2025</div></div>
                  <div className="video-title">Hier steht eine längere Überschrift</div>
                </div>
              </div>
              <div className="video-card">
                <div className="video-thumb">
                  <img src="https://static.wixstatic.com/media/8a20aa_8329fb339a3f41e4bfcab1a6bdcb8f59~mv2.jpg" alt="Video 3" loading="lazy" />
                  <div className="video-play-overlay"><div className="play-btn"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M6 4.5L19 12L6 19.5Z" fill="white" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/></svg></div></div>
                  <div className="video-duration">11:03</div>
                </div>
                <div className="video-body">
                  <div className="video-meta-row"><div className="video-category">Aus der Praxis</div><div className="video-date">03.10.2025</div></div>
                  <div className="video-title">Hier steht eine längere Überschrift</div>
                </div>
              </div>
            </div>
            <div className="videos-footer-row">
              <a href="#">Weitere Videos auf Agrar TV &#8594;</a>
              <a href="#">Premeo learn &amp; earn &#8594;</a>
            </div>
          </div>
        </section>

        {/* ── TERMINE ── */}
        <section className="screen-section" id="termine">
          <div className="section-inner">
            <div className="section-tag">85665 (Umkreis 50 km)</div>
            <div className="section-heading">Termine in<br />ihrer Region</div>
            <div className="filter-row" style={{marginTop:'22px'}}>
              {chips.map((chip, i) => (
                <button
                  key={chip}
                  className={'filter-chip' + (activeChip === i ? ' active' : '')}
                  onClick={() => setActiveChip(i)}
                >{chip}</button>
              ))}
            </div>
            <div className="termine-cards">
              <div className="event-card">
                <div className="event-img"><img src="https://static.wixstatic.com/media/8a20aa_8329fb339a3f41e4bfcab1a6bdcb8f59~mv2.jpg" alt="Feldtag" loading="lazy" /></div>
                <div className="event-body">
                  <div className="event-cat">Feldtag</div>
                  <div className="event-title">Neue Herausforderungen im Getreide- und Mais ...</div>
                  <div className="event-location-row"><span className="event-location-label">Ort</span><span>85447, Grucking</span></div>
                  <div className="event-footer"><span className="event-date">03.04.2026</span><div className="event-arrow">&#8594;</div></div>
                </div>
              </div>
              <div className="event-card">
                <div className="event-img"><img src="https://static.wixstatic.com/media/8a20aa_8329fb339a3f41e4bfcab1a6bdcb8f59~mv2.jpg" alt="Feldtag" loading="lazy" /></div>
                <div className="event-body">
                  <div className="event-cat">Feldtag</div>
                  <div className="event-title">Hier steht eine längere Überschrift</div>
                  <div className="event-location-row"><span className="event-location-label">Ort</span><span>85447, Grucking</span></div>
                  <div className="event-footer"><span className="event-date">03.10.2025</span><div className="event-arrow">&#8594;</div></div>
                </div>
              </div>
              <div className="event-card">
                <div className="event-img"><img src="https://static.wixstatic.com/media/8a20aa_8329fb339a3f41e4bfcab1a6bdcb8f59~mv2.jpg" alt="Feldtag Online" loading="lazy" /></div>
                <div className="event-body">
                  <div className="event-cat">Feldtag</div>
                  <div className="event-title">Hier steht eine längere Überschrift</div>
                  <div className="event-location-row"><span className="event-location-label">Ort</span><span>Online</span></div>
                  <div className="event-footer"><span className="event-date">03.10.2025</span><div className="event-arrow">&#8594;</div></div>
                </div>
              </div>
              <div className="event-card">
                <div className="event-img"><img src="https://static.wixstatic.com/media/8a20aa_8329fb339a3f41e4bfcab1a6bdcb8f59~mv2.jpg" alt="Feldtag Online" loading="lazy" /></div>
                <div className="event-body">
                  <div className="event-cat">Feldtag</div>
                  <div className="event-title">Hier steht eine längere Überschrift</div>
                  <div className="event-location-row"><span className="event-location-label">Ort</span><span>Online</span></div>
                  <div className="event-footer"><span className="event-date">03.10.2025</span><div className="event-arrow">&#8594;</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TOOLS ── */}
        <section className="tools-section" id="tools">
          <div className="tools-section-label">Wichtige Tools</div>
          <div className="tools-grid">
            <div className="tool-card">
              <img className="tool-card-img" src="https://static.wixstatic.com/media/8a20aa_814a095165fb4ff990088bcd5b0165f2~mv2.jpg" alt="Resistenzmanagement" loading="lazy" />
              <div className="tool-card-overlay">
                <div className="tool-tag">Resistenzmanagement</div>
                <div className="tool-title">Ist der Wirkstoff noch<br />wirksam? Jetzt prüfen.</div>
                <button className="tool-btn">Resistenz bestimmen</button>
              </div>
              <div className="tool-help">Hilfe</div>
            </div>
            <div className="tool-card">
              <img className="tool-card-img" src="https://static.wixstatic.com/media/8a20aa_3632aded684c4b18a0abf35223791592~mv2.jpg" alt="Diagnose" loading="lazy" />
              <div className="tool-card-overlay">
                <div className="tool-tag">Diagnose</div>
                <div className="tool-title">Schaderreger bestimmen.<br />Passende Lösung finden.</div>
                <button className="tool-btn">Diagnose starten</button>
              </div>
              <div className="tool-help">Hilfe</div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

export default Beratung
