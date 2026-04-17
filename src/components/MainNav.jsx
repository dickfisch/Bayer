import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import TransitionLink from './TransitionLink'


const TICKER_ITEMS = [
  { type: 'icon' },
  { type: 'temp', label: '15°' },
  { type: 'plz',  label: '86899' },
]

function WeatherIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function MainNav() {
  const { pathname } = useLocation()
  const beratungActive = pathname === '/beratung-start' || pathname === '/beratung'

  const [menuOpen, setMenuOpen]         = useState(false)
  const [premeoOpen, setPremeoOpen]     = useState(false)
  const [expanded, setExpanded]         = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [activePanel, setActivePanel] = useState('main') // 'main' | 'produkt' | 'pflanzenschutzmittel' | 'premeo'

  // Eltern-Panel je Sub-Panel (für Zurück-Button)
  const PANEL_PARENT = {
    produkt:              'main',
    kulturen:             'produkt',
    pflanzenschutzmittel: 'produkt',
    saatgut:              'produkt',
    premeo:               'main',
  }

  function goBack() { setActivePanel(PANEL_PARENT[activePanel] ?? 'main') }

  function closeMobileMenu() {
    setMobileOpen(false)
    setTimeout(() => setActivePanel('main'), 380)
  }

  // CSS-Klasse je Panel abhängig vom aktiven Panel
  function panelCls(id) {
    if (id === activePanel) return 'mobile-drawer-panel mobile-drawer-panel--active'
    const ancestors = []
    let cur = activePanel
    while (PANEL_PARENT[cur]) { cur = PANEL_PARENT[cur]; ancestors.push(cur) }
    if (ancestors.includes(id)) return 'mobile-drawer-panel mobile-drawer-panel--behind'
    return 'mobile-drawer-panel'
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const [navPlz,    setNavPlz]    = useState(() => sessionStorage.getItem('nav_plz')    || '')
  const [navKultur, setNavKultur] = useState(() => sessionStorage.getItem('nav_kultur') || '')

  useEffect(() => {
    function onUpdate(e) {
      setNavPlz(e.detail.plz)
      setNavKultur(e.detail.kultur)
    }
    window.addEventListener('nav-context-update', onUpdate)
    return () => window.removeEventListener('nav-context-update', onUpdate)
  }, [])

  const [tickerIdx, setTickerIdx] = useState(0)
  const [tickerVisible, setTickerVisible] = useState(true)
  const tickerTimeoutRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerVisible(false)
      tickerTimeoutRef.current = setTimeout(() => {
        setTickerIdx(i => (i + 1) % TICKER_ITEMS.length)
        setTickerVisible(true)
      }, 300)
    }, 4000)
    return () => {
      clearInterval(interval)
      clearTimeout(tickerTimeoutRef.current)
    }
  }, [])

  const expandTimer = useRef(null)
  const pillRef     = useRef(null)

  // Click outside → schließt alle Layer
  useEffect(() => {
    function handleClickOutside(e) {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setMenuOpen(false)
        setPremeoOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleMenu() {
    setMenuOpen(v => !v)
    setPremeoOpen(false)
  }
  function togglePremeo() {
    setPremeoOpen(v => !v)
    setMenuOpen(false)
  }

  function handlePillEnter() {
    clearTimeout(expandTimer.current)
    setExpanded(true)
  }
  function handlePillLeave() {
    expandTimer.current = setTimeout(() => {
      setExpanded(false)
    }, 150)
  }

  const Arrow = ({ open }) => (
    <svg
      width="15" height="15"
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )

  const premeoStyle = {
    display:       premeoOpen ? 'grid' : 'none',
    opacity:       premeoOpen ? 1 : 0,
    transform:     premeoOpen ? 'translateY(0)' : 'translateY(-10px)',
    pointerEvents: premeoOpen ? 'all' : 'none',
    transition:    'opacity 0.25s ease, transform 0.25s ease',
  }

  const menuStyle = {
    display:       menuOpen ? 'grid' : 'none',
    opacity:       menuOpen ? 1 : 0,
    transform:     menuOpen ? 'translateY(0)' : 'translateY(-10px)',
    pointerEvents: menuOpen ? 'all' : 'none',
    transition:    'opacity 0.25s ease, transform 0.25s ease',
  }

  return (
    <>
      {(menuOpen || premeoOpen) && <div className="nav-top-backdrop" />}
      <header className="main-nav">
        {/* Mirror spacer keeps pill centered */}
        <div className="nav-spacer" aria-hidden="true" />

        {/* Pill */}
        <div
          ref={pillRef}
          className={`nav-pill${expanded ? ' nav-pill--expanded' : ''}${(menuOpen || premeoOpen) ? ' nav-pill--open' : ''}`}
          onMouseLeave={handlePillLeave}
        >
          {/* Logo */}
          <TransitionLink className="nav-logo" to="/" style={{ textDecoration: 'none' }}>
            <img
              src="/Corp-Logo_BG_Bayer-Cross_Basic_on-screen_RGB.svg"
              alt="Bayer"
              style={{ width: '44px', height: '44px', objectFit: 'contain', flexShrink: 0 }}
            />
            <div className="nav-logo-text">
              <div className="nav-logo-bottom">Bayer Agrar</div>
              <div className="nav-logo-top">Deutschland</div>
            </div>
          </TransitionLink>

          <div className="main-nav-links">
            {/* Meine Beratung */}
            <TransitionLink to={navKultur ? '/beratung' : '/beratung-start'} state={navKultur ? { plz: navPlz, kultur: navKultur } : undefined} className={beratungActive ? 'active' : ''} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <span className="nav-link-text">Meine Beratung</span>
              {navKultur && (
                <span style={{
                  position: 'absolute',
                  bottom: 5,
                  left: 16,
                  pointerEvents: 'none',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#426b8f', letterSpacing: '0.04em', lineHeight: 1 }}>
                    {navKultur.charAt(0).toUpperCase() + navKultur.slice(1)}
                  </span>
                </span>
              )}
            </TransitionLink>

            {/* Produkte */}
            <div className="nav-dropdown">
              <button className={`nav-dropdown-btn${menuOpen ? ' nav-dropdown-btn--open' : ''}`} onClick={toggleMenu}>
                <span className="nav-dropdown-trigger">
                  Produkte
                  <Arrow open={menuOpen} />
                </span>
              </button>
              <div className="mega-menu" style={menuStyle}>
                <div className="mega-col">
                  <div className="mega-col-title">Produkte nach Kulturen</div>
                  <div className="mega-subtext">Abgestimmt auf die Saison</div>
                  <select className="mega-select">
                    <option value="">Kultur wählen</option>
                    <option value="mais">Mais</option>
                    <option value="getreide">Getreide</option>
                    <option value="raps">Raps</option>
                    <option value="ruebe">Rübe</option>
                    <option value="kartoffel">Kartoffel</option>
                    <option value="obst">Obst</option>
                    <option value="gemuese">Gemüse</option>
                    <option value="weinbau">Weinbau</option>
                    <option value="hopfen">Hopfen</option>
                  </select>
                  <hr className="mega-divider" style={{ marginTop: '32px' }} />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Produkte A-Z</a></div>
                </div>
                <div className="mega-col">
                  <div className="mega-col-title">Pflanzenschutzmittel</div>
                  <a href="#">Akarizide</a>
                  <a href="#">Fungizide</a>
                  <a href="#">Insektizide</a>
                  <a href="#">Molluskizide</a>
                  <a href="#">Saatschutz</a>
                  <a href="#">Wachstumsregler</a>
                  <hr className="mega-divider" />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Produktlisten</a></div>
                  <hr className="mega-divider" />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Broschüren</a></div>
                  <hr className="mega-divider" />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Produktfinder</a></div>
                </div>
                <div className="mega-col">
                  <div className="mega-col-title">Saatgut</div>
                  <a href="#">Raps-Saatgut</a>
                  <a href="#">Mais-Saatgut</a>
                  <hr className="mega-divider" />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Broschüren</a></div>
                  <hr className="mega-divider" />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Produktfinder</a></div>
                  <hr className="mega-divider" />
                  <a href="https://www.vegetables.bayer.com/de/de-de.html" target="_blank" rel="noopener noreferrer" className="mega-col-title" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Gemüsesaatgut / Vegetables Bayer
                    <span style={{ display: 'inline-block', transform: 'rotate(45deg)', fontSize: '1.7em', lineHeight: 1, marginLeft: '8px', verticalAlign: 'middle' }}>↑</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Premeo – immer sichtbar, eigener Layer */}
            <div className="nav-dropdown">
              <button className={`nav-dropdown-btn${premeoOpen ? ' nav-dropdown-btn--open' : ''}`} onClick={togglePremeo}>
                <span className="nav-dropdown-trigger">
                  Premeo
                  <Arrow open={premeoOpen} />
                </span>
              </button>
              <div className="mega-menu" style={{ ...premeoStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="mega-col">
                  <div className="mega-col-title">Saatgut</div>
                  <a href="#">Raps-Saatgut</a>
                  <a href="#">Mais-Saatgut</a>
                  <hr className="mega-divider" />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Broschüren</a></div>
                  <hr className="mega-divider" />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Produktfinder</a></div>
                  <hr className="mega-divider" />
                  <a href="https://www.vegetables.bayer.com/de/de-de.html" target="_blank" rel="noopener noreferrer" className="mega-col-title" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Gemüsesaatgut / Vegetables Bayer
                    <span style={{ display: 'inline-block', transform: 'rotate(45deg)', fontSize: '1.7em', lineHeight: 1, marginLeft: '8px', verticalAlign: 'middle' }}>↑</span>
                  </a>
                </div>
                <div className="mega-col">
                  <div className="mega-col-title">Pflanzenschutzmittel</div>
                  <a href="#">Akarizide</a>
                  <a href="#">Fungizide</a>
                  <a href="#">Insektizide</a>
                  <a href="#">Molluskizide</a>
                  <a href="#">Saatschutz</a>
                  <a href="#">Wachstumsregler</a>
                  <hr className="mega-divider" />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Produktlisten</a></div>
                  <hr className="mega-divider" />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Broschüren</a></div>
                  <hr className="mega-divider" />
                  <div className="mega-col-title"><a href="#" style={{ fontWeight: '700', color: '#1a1a1a', textDecoration: 'none' }}>Produktfinder</a></div>
                </div>
              </div>
            </div>

            {/* Regionales – nur im expanded State */}
            <div className="nav-extra-item">
              <div className="nav-dropdown">
                <button className={`nav-dropdown-btn${menuOpen ? ' nav-dropdown-btn--open' : ''}`} onClick={toggleMenu}>
                  <span className="nav-dropdown-trigger">
                    Regionales
                    <Arrow open={menuOpen} />
                  </span>
                </button>
              </div>
            </div>

            {/* Digital Farming – nur im expanded State */}
            <div className="nav-extra-item">
              <a href="#" className="nav-plain-link"><span className="nav-link-text">Digital Farming</span></a>
            </div>

            {/* Agrar Magazin – nur im expanded State */}
            <div className="nav-extra-item">
              <a href="#" className="nav-plain-link"><span className="nav-link-text">Agrar Magazin</span></a>
            </div>

            {/* Hamburger – verschwindet beim Expand (Desktop) / öffnet Drawer (Mobile) */}
            <button
              className="nav-hamburger-btn"
              aria-label="Menü"
              onPointerEnter={(e) => { if (e.pointerType !== 'touch') handlePillEnter() }}
              onClick={() => setMobileOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Teal icon buttons */}
        <div className="nav-actions">
          <button className="nav-teal-btn" title="Wetter">
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '32px', overflow: 'hidden', transition: 'opacity 0.3s ease', opacity: tickerVisible ? 1 : 0 }}>
              {TICKER_ITEMS[tickerIdx].type === 'icon' && <WeatherIcon />}
              {TICKER_ITEMS[tickerIdx].type === 'temp' && (
                <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1 }}>
                  {TICKER_ITEMS[tickerIdx].label}
                </span>
              )}
              {TICKER_ITEMS[tickerIdx].type === 'plz' && (
                <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1 }}>
                  {TICKER_ITEMS[tickerIdx].label}
                </span>
              )}
            </span>
          </button>
          <button className="nav-teal-btn" title="Suche" onClick={() => {
            sessionStorage.removeItem('nav_plz')
            sessionStorage.removeItem('nav_kultur')
            window.dispatchEvent(new CustomEvent('nav-context-update', { detail: { plz: '', kultur: '' } }))
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer-backdrop${mobileOpen ? ' mobile-drawer-backdrop--open' : ''}`}
        onClick={closeMobileMenu}
      />
      <nav className={`mobile-drawer${mobileOpen ? ' mobile-drawer--open' : ''}`} aria-hidden={!mobileOpen}>

        {/* Header: Logo + Schließen */}
        <div className="mobile-drawer-header">
          <img
            src="/Corp-Logo_BG_Bayer-Cross_Basic_on-screen_RGB.svg"
            alt="Bayer"
            className="mobile-drawer-logo"
          />
          <button className="mobile-drawer-close" aria-label="Schließen" onClick={closeMobileMenu}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Panel-Container: absolut gestapelt, schieben von rechts */}
        <div className="mobile-drawer-panels">

          {/* Panel: Haupt-Navigation */}
          <div className={panelCls('main')}>
            <ul className="mobile-drawer-list">
              <li>
                <TransitionLink className="mobile-drawer-item mobile-drawer-item--plain" to={navKultur ? '/beratung' : '/beratung-start'} state={navKultur ? { plz: navPlz, kultur: navKultur } : undefined} onClick={closeMobileMenu}>
                  Meine Beratung
                </TransitionLink>
              </li>
              <li>
                <button className="mobile-drawer-item" onClick={() => setActivePanel('produkt')}>
                  Produkte
                  <ChevronRight />
                </button>
              </li>
              <li>
                <button className="mobile-drawer-item" onClick={() => setActivePanel('premeo')}>
                  Premeo
                  <ChevronRight />
                </button>
              </li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Regionales</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Digital Farming</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Agrar Magazin</a></li>
            </ul>
          </div>

          {/* Panel: Produkt */}
          <div className={panelCls('produkt')}>
            <button className="mobile-drawer-back" onClick={goBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Zurück
            </button>
            <hr className="mobile-drawer-divider" />
            <ul className="mobile-drawer-list">
              <li>
                <button className="mobile-drawer-item" onClick={() => setActivePanel('kulturen')}>
                  Produkte nach Kulturen
                  <ChevronRight />
                </button>
              </li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Produkte A-Z</a></li>
              <li>
                <button className="mobile-drawer-item" onClick={() => setActivePanel('pflanzenschutzmittel')}>
                  Pflanzenschutzmittel
                  <ChevronRight />
                </button>
              </li>
              <li>
                <button className="mobile-drawer-item" onClick={() => setActivePanel('saatgut')}>
                  Saatgut
                  <ChevronRight />
                </button>
              </li>
            </ul>
          </div>

          {/* Panel: Produkte nach Kulturen */}
          <div className={panelCls('kulturen')}>
            <button className="mobile-drawer-back" onClick={goBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Zurück
            </button>
            <hr className="mobile-drawer-divider" />
            <ul className="mobile-drawer-list">
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Mais</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Getreide</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Raps</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Rübe</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Kartoffel</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Obst</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Gemüse</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Weinbau</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Hopfen</a></li>
            </ul>
          </div>

          {/* Panel: Pflanzenschutzmittel */}
          <div className={panelCls('pflanzenschutzmittel')}>
            <button className="mobile-drawer-back" onClick={goBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Zurück
            </button>
            <hr className="mobile-drawer-divider" />
            <ul className="mobile-drawer-list">
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Akarizide</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Fungizide</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Insektizide</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Molluskizide</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Saatschutz</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Wachstumsregler</a></li>
              <li><hr className="mobile-drawer-divider" /></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Produktlisten</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Broschüren</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Produktfinder</a></li>
            </ul>
          </div>

          {/* Panel: Saatgut */}
          <div className={panelCls('saatgut')}>
            <button className="mobile-drawer-back" onClick={goBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Zurück
            </button>
            <hr className="mobile-drawer-divider" />
            <ul className="mobile-drawer-list">
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Raps-Saatgut</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Mais-Saatgut</a></li>
              <li><hr className="mobile-drawer-divider" /></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Broschüren</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Produktfinder</a></li>
              <li><hr className="mobile-drawer-divider" /></li>
              <li>
                <a className="mobile-drawer-item mobile-drawer-item--plain" href="https://www.vegetables.bayer.com/de/de-de.html" target="_blank" rel="noopener noreferrer">
                  Gemüsesaatgut / Vegetables Bayer
                </a>
              </li>
            </ul>
          </div>

          {/* Panel: Premeo */}
          <div className={panelCls('premeo')}>
            <button className="mobile-drawer-back" onClick={goBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Zurück
            </button>
            <hr className="mobile-drawer-divider" />
            <ul className="mobile-drawer-list">
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Saatgut</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Pflanzenschutzmittel</a></li>
              <li><hr className="mobile-drawer-divider" /></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Broschüren</a></li>
              <li><a className="mobile-drawer-item mobile-drawer-item--plain" href="#">Produktfinder</a></li>
            </ul>
          </div>

        </div>
      </nav>
    </>
  )
}

export default MainNav
