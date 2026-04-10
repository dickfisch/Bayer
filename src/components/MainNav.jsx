import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

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

function MainNav() {
  const { pathname } = useLocation()
  const beratungActive = pathname === '/beratung-start' || pathname === '/beratung'

  const [menuOpen, setMenuOpen]     = useState(false)
  const [premeoOpen, setPremeoOpen] = useState(false)
  const [expanded, setExpanded]     = useState(false)

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
          <Link className="nav-logo" to="/" style={{ textDecoration: 'none' }}>
            <img
              src="/Corp-Logo_BG_Bayer-Cross_Basic_on-screen_RGB.svg"
              alt="Bayer"
              style={{ width: '44px', height: '44px', objectFit: 'contain', flexShrink: 0 }}
            />
            <div className="nav-logo-text">
              <div className="nav-logo-bottom">Bayer Agrar</div>
              <div className="nav-logo-top">Deutschland</div>
            </div>
          </Link>

          <div className="main-nav-links">
            {/* Meine Beratung */}
            <Link to="/beratung-start" className={beratungActive ? 'active' : ''}>
              Meine Beratung
            </Link>

            {/* Produkte */}
            <div className="nav-dropdown">
              <button className="nav-dropdown-btn" onClick={toggleMenu}>
                <span className="nav-dropdown-trigger">
                  Produkt
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
              <button className="nav-dropdown-btn" onClick={togglePremeo}>
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
                <button className="nav-dropdown-btn" onClick={toggleMenu}>
                  <span className="nav-dropdown-trigger">
                    Regionales
                    <Arrow open={menuOpen} />
                  </span>
                </button>
              </div>
            </div>

            {/* Digital Farming – nur im expanded State */}
            <div className="nav-extra-item">
              <a href="#" className="nav-plain-link">Digital Farming</a>
            </div>

            {/* Agrar Magazin – nur im expanded State */}
            <div className="nav-extra-item">
              <a href="#" className="nav-plain-link">Agrar Magazin</a>
            </div>

            {/* Hamburger – verschwindet beim Expand */}
            <button className="nav-hamburger-btn" aria-label="Menü" onMouseEnter={handlePillEnter}>
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
          <button className="nav-teal-btn" title="Suche">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </header>
    </>
  )
}

export default MainNav
