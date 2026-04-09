import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

function MainNav() {
  const { pathname } = useLocation()
  const beratungActive = pathname === '/beratung-start' || pathname === '/beratung'
  const [menuOpen, setMenuOpen] = useState(false)
  const timerRef = useRef(null)

  function handleDropdownEnter() {
    clearTimeout(timerRef.current)
    setMenuOpen(true)
  }

  function handleDropdownLeave() {
    timerRef.current = setTimeout(() => {
      setMenuOpen(false)
    }, 100)
  }

  const menuStyle = {
    display: menuOpen ? 'grid' : 'none',
    opacity: menuOpen ? 1 : 0,
    transform: menuOpen ? 'translateY(0)' : 'translateY(-10px)',
    pointerEvents: menuOpen ? 'all' : 'none',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
  }

  return (
    <header className="main-nav">
      <Link className="nav-logo" to="/" style={{textDecoration: 'none'}}>

        <img src="/Corp-Logo_BG_Bayer-Cross_Basic_on-screen_RGB.svg" alt="Bayer" style={{width: '48px', height: '48px', objectFit: 'contain'}} />
        <div>
          <div className="nav-logo-bottom">Bayer Agrar</div>
          <div className="nav-logo-top">Deutschland</div>
        </div>
      </Link>

      <div className="main-nav-links">
        <Link to="/beratung-start" className={beratungActive ? 'active' : ''}>Meine Beratung</Link>

        {/* Mega-Dropdown */}
        <div
          className="nav-dropdown"
          id="produkteDropdown"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          <button className="nav-dropdown-btn" id="produkteBtn">
            Produkte
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div
            className="mega-menu"
            id="megaMenu"
            style={menuStyle}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="mega-col">
              <div className="mega-col-title">Pflanzenschutzmittel</div>
              <a href="#">Akarizide</a>
              <a href="#">Fungizie</a>
              <a href="#">Insektizide</a>
              <a href="#">Molluskizide</a>
              <a href="#">Saatschutz</a>
              <a href="#">Wachstumsregler</a>
              <hr className="mega-divider" />
              <div className="mega-col-title"><a href="#" style={{fontWeight:'700',color:'#1a1a1a',textDecoration:'none'}}>Produktlisten</a></div>
              <hr className="mega-divider" />
              <div className="mega-col-title"><a href="#" style={{fontWeight:'700',color:'#1a1a1a',textDecoration:'none'}}>Broschüren</a></div>
              <hr className="mega-divider" />
              <div className="mega-col-title"><a href="#" style={{fontWeight:'700',color:'#1a1a1a',textDecoration:'none'}}>Produktfinder</a></div>
            </div>
            <div className="mega-col">
              <div className="mega-col-title">Saatgut</div>
              <a href="#">Raps-Saatgut</a>
              <a href="#">Mais-Saatgut</a>
              <hr className="mega-divider" />
              <div className="mega-col-title"><a href="#" style={{fontWeight:'700',color:'#1a1a1a',textDecoration:'none'}}>Broschüren</a></div>
              <hr className="mega-divider" />
              <div className="mega-col-title"><a href="#" style={{fontWeight:'700',color:'#1a1a1a',textDecoration:'none'}}>Produktfinder</a></div>
              <hr className="mega-divider" />
              <a href="https://www.vegetables.bayer.com/de/de-de.html" target="_blank" rel="noopener noreferrer" className="mega-col-title" style={{fontWeight:'700',color:'#1a1a1a',textDecoration:'none',display:'flex',alignItems:'center',gap:'4px'}}>Gemüsesaatgut / Vegetables Bayer <span style={{display:'inline-block',transform:'rotate(45deg)',fontSize:'1.7em',lineHeight:1,marginLeft:'8px',verticalAlign:'middle'}}>↑</span></a>
            </div>
            <div className="mega-col">
              <div className="mega-col-title">Produkte nach Kulturen</div>
              <div className="mega-subtext">Abgestimmt auf die Saison</div>
              <select className="mega-select" id="megaSelectKultur">
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
            </div>
            <div className="mega-col">
              <div className="mega-col-title">Produkte A-Z</div>
              <div className="mega-subtext">Abgestimmt auf die Saison</div>
              <select className="mega-select" id="megaSelectProdukt">
                <option value="">Produkt wählen</option>
                <option value="ascra">Ascra Xpro</option>
                <option value="atlantis">Atlantis Flex</option>
                <option value="attribut">Attribut</option>
                <option value="delaro">Delaro Forte</option>
                <option value="husar">Husar Plus</option>
                <option value="incelo">Incelo Komplett</option>
                <option value="input">Input Triple</option>
                <option value="prosaro">Prosaro</option>
                <option value="skyway">Skyway Xpro</option>
              </select>
            </div>
          </div>
        </div>

        <a href="#">Regionales
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </a>
        <a href="#">Premeo
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </a>
        <a href="#">Digital Farming</a>
      </div>

      <div className="nav-right">
        <button className="nav-icon-btn" title="Helligkeit">
          <img src="/icons_website_dummy_wetter.svg" alt="Wetter" style={{width: '26px', height: '26px', objectFit: 'contain'}} />
        </button>
        <button className="nav-icon-btn" title="Lesezeichen">
          <img src="/icons_website_dummy_magazin.svg" alt="Magazin" style={{width: '26px', height: '26px', objectFit: 'contain'}} />
        </button>
        <button className="nav-icon-btn" title="Video">
          <img src="/icons_website_dummy_video.svg" alt="Video" style={{width: '26px', height: '26px', objectFit: 'contain'}} />
        </button>
        <button className="nav-icon-btn" title="Suche">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>
    </header>
  )
}

export default MainNav
