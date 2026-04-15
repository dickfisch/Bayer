import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

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

function SubNav() {
  const location = useLocation()
  const routeState = location.state || {}

  const [plz, setPlz] = useState(routeState.plz || '85665')
  const [kultur, setKultur] = useState(routeState.kultur || 'mais')
  const [scrolled, setScrolled] = useState(false)
  const [wrapHeight, setWrapHeight] = useState(0)
  const wrapRef = useRef(null)

  // Höhe des Wraps einmalig beim Mount messen (vor erstem Scroll)
  useEffect(() => {
    if (wrapRef.current) {
      setWrapHeight(wrapRef.current.offsetHeight)
    }
  }, [])

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function isActive(path) {
    if (path === '/beratung') return location.pathname === '/beratung'
    return location.pathname === path
  }

  const navContent = (
    <div className={`sub-nav${scrolled ? ' sub-nav--scrolled' : ''}`}>
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
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
        </svg>
        {plz}
      </div>
      <select
        className="sub-nav-kultur-select"
        value={kultur}
        onChange={e => setKultur(e.target.value)}
      >
        {KULTUREN.map(k => (
          <option key={k.value} value={k.value}>{k.label}</option>
        ))}
      </select>
      <nav className="sub-links">
        <Link to="/beratung"    className={isActive('/beratung')    ? 'active' : ''}>Produkt-Empfehlungen</Link>
        <Link to="/feldbericht" className={isActive('/feldbericht') ? 'active' : ''}>Meldungen</Link>
        <Link to="/termine"     className={isActive('/termine')     ? 'active' : ''}>Termine</Link>
        <Link to="/tools"       className={isActive('/tools')       ? 'active' : ''}>Diagnose</Link>
        <Link to="/tools"       className="">Resistenz</Link>
      </nav>
    </div>
  )

  if (scrolled) {
    return (
      <>
        {/* Placeholder hält den Layout-Platz, damit kein Sprung entsteht */}
        <div style={{ height: wrapHeight }} />
        <div className="sub-nav-wrap sub-nav-wrap--scrolled">
          {navContent}
        </div>
      </>
    )
  }

  return (
    <div ref={wrapRef} className="sub-nav-wrap">
      {navContent}
    </div>
  )
}

export default SubNav
