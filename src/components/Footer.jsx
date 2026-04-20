import { useState, useEffect, useRef } from 'react'

const KULTUREN = [
  { value: 'winterweizen', label: 'Winterweizen' },
  { value: 'triticale',    label: 'Triticale' },
  { value: 'winterroggen', label: 'Winterroggen' },
  { value: 'sommerweizen', label: 'Sommerweizen' },
  { value: 'wintergerste', label: 'Wintergerste' },
  { value: 'sommergerste', label: 'Sommergerste' },
  { value: 'raps',         label: 'Raps' },
  { value: 'mais',         label: 'Mais' },
  { value: 'zuckerrueben', label: 'Zuckerrüben' },
]

const KONTAKT = [
  { label: 'WhatsApp / Beratung', value: 'T. +49 (0)174 346 564 1' },
  { label: 'Notfall',             value: 'T. +49 (0)214 / 30-20220' },
]

function MobileNavSection({ header, links }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{
        fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
        color: '#1c374d', marginBottom: '18px', textTransform: 'uppercase',
      }}>
        {header}
      </div>
      {links.map(l => (
        <a key={l} href="#" style={{
          display: 'block', fontSize: '20px', fontWeight: 400,
          color: '#1c374d', textDecoration: 'none', marginBottom: '16px',
        }}>
          {l}
        </a>
      ))}
    </div>
  )
}

function Footer() {
  const [kultur, setKultur] = useState('')
  const svgMobileRef = useRef(null)
  const svgDesktopRef = useRef(null)
  const footerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return
      const rect = footerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      // progress: 0 when footer enters viewport bottom, 1 when it leaves at top
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height)
      const clampedProgress = Math.max(0, Math.min(1, progress))
      const offset = (clampedProgress - 0.5) * 400
      if (svgMobileRef.current) {
        svgMobileRef.current.style.transform = `translateY(${offset}px)`
      }
      if (svgDesktopRef.current) {
        svgDesktopRef.current.style.transform = `translateY(${offset}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <footer ref={footerRef} style={{
      backgroundColor: '#edf0f4',
      marginTop: '60px',
      position: 'relative',
      overflow: 'visible',
    }}>

      {/* ══════════════════════════════════════
          MOBILE FOOTER  (versteckt ab md)
      ══════════════════════════════════════ */}
      <div className="md:hidden" style={{ padding: '64px 20px 0', position: 'relative', overflow: 'clip' }}>

        {/* SVG Hintergrund */}
        <img
          ref={svgMobileRef}
          src="/code_1.svg"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '160px',
            left: '-40px',
            width: '480px',
            pointerEvents: 'none',
            zIndex: 0,
            mixBlendMode: 'linear-light',
            opacity: 0.6,
            willChange: 'transform',
          }}
        />

        {/* Alle Inhalte über dem SVG */}
        <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Kultur-Dropdown */}
        <div style={{ marginBottom: '56px' }}>
          <select
            className="beratung-nav-kultur-select footer-kultur-select"
            style={{ width: '100%', fontSize: '18px', padding: '22px 56px 22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
            value={kultur}
            onChange={e => setKultur(e.target.value)}
          >
            <option value="" disabled>Produkte A – Z</option>
            {KULTUREN.map(k => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </select>
        </div>

        {/* Logo */}
        <img
          src="/Corp-Logo_BG_Bayer-Cross_Basic_on-screen_RGB.svg"
          alt="Bayer"
          style={{ width: '90px', height: '90px', objectFit: 'contain', marginBottom: '28px' }}
        />

        {/* Headline */}
        <h2 style={{
          fontSize: '38px', fontWeight: 300, color: '#1c374d',
          lineHeight: 1.2, marginBottom: '24px',
        }}>
          <span style={{
            fontWeight: 700,
            background: 'linear-gradient(to right, #3d7a2e, #2a7ab5)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Fragen?</span>{' '}
          Wir sind für Sie da.
        </h2>

        {/* CTA Links */}
        <a href="#" style={mobileCTALink}>Ihren Vertriebsberater finden &rsaquo;</a>
        <a href="#" style={mobileCTALink}>Kontakt &rsaquo;</a>

        {/* Divider */}
        <div style={mobileDivider} />

        {/* Kontaktinfos */}
        {KONTAKT.map(k => (
          <div key={k.label} style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1c374d', marginBottom: '6px', letterSpacing: '0.02em' }}>
              {k.label}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 400, color: '#1c374d', letterSpacing: '-0.01em' }}>
              {k.value}
            </div>
          </div>
        ))}

        {/* Divider */}
        <div style={mobileDivider} />

        {/* Follow Us */}
        <h3 style={{ fontSize: '28px', fontWeight: 300, color: '#1c374d', marginBottom: '24px' }}>
          Folgen Sie uns
        </h3>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center', marginBottom: '32px' }}>
          {/* Facebook */}
          <a href="#" style={mobileSocial} aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" style={mobileSocial} aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          {/* YouTube */}
          <a href="#" style={mobileSocial} aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#edf0f4"/>
            </svg>
          </a>
        </div>

        {/* Divider */}
        <div style={mobileDivider} />

        {/* Navigationsabschnitte – gestapelt (Desktop-Inhalte) */}
        <div style={{ paddingTop: '4px' }}>
          <MobileNavSection
            header="BAYER LINKS"
            links={[
              'Bayer Global',
              'Bayer CropScience World',
              'Bayer Karriere',
              'Bayer CropScience Austria',
              'Bayer CropScience Schweiz',
              'Presse',
              'Vegetables Deutschland',
            ]}
          />
          <MobileNavSection
            header="INFOS"
            links={['Apps', 'Wetter Aktuell', 'Ackerbau', 'Saatgut', 'Sonderkulturen']}
          />
          <MobileNavSection
            header="VERANTWORTUNG"
            links={[
              'PAMIRA – Sammelstellen und Termine',
              'PRE – Sammelstellen und Termine',
            ]}
          />
        </div>

        {/* Divider */}
        <div style={mobileDivider} />

        {/* Legal Bottom */}
        <div style={{ padding: '20px 0 36px' }}>
          <div style={mobileBottomText}>COPYRIGHT © BAYER CROPSCIENCE DEUTSCHLAND GMBH</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginTop: '12px' }}>
            {[
              'ALLGEMEINE NUTZUNGSBEDINGUNGEN',
              'DATENSCHUTZERKLÄRUNG',
              'IMPRESSUM',
              'GEBRAUCHSHINWEISE',
            ].map(l => (
              <a key={l} href="#" style={mobileBottomLink}>{l}</a>
            ))}
          </div>
        </div>

        </div>{/* end zIndex wrapper */}
      </div>
      {/* Ende Mobile Footer */}


      {/* ══════════════════════════════════════
          DESKTOP FOOTER  (versteckt auf mobile)
      ══════════════════════════════════════ */}
      <div className="hidden md:block" style={{ position: 'relative', overflow: 'visible' }}>
        <img
          ref={svgDesktopRef}
          src="/code_1.svg"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '90px',
            left: '-80px',
            width: '720px',
            pointerEvents: 'none',
            zIndex: 0,
            mixBlendMode: 'linear-light',
            opacity: 0.6,
            willChange: 'transform',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ── Kultur-Dropdown ── */}
          <div style={{ background: 'transparent', padding: '110px 90px 32px' }}>
            <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
              <select
                className="beratung-nav-kultur-select footer-kultur-select !text-2xl !py-5 !pl-9 !pr-16"
                style={{ minWidth: '540px', fontSize: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
                value={kultur}
                onChange={e => setKultur(e.target.value)}
              >
                <option value="" disabled>Produkte A – Z</option>
                {KULTUREN.map(k => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Oberer Bereich: Logo + Kontakt  |  CTA ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '38% 62%',
            padding: '56px 90px 48px',
            maxWidth: '1800px',
            margin: '0 auto',
            gap: '40px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <img
                src="/Corp-Logo_BG_Bayer-Cross_Basic_on-screen_RGB.svg"
                alt="Bayer"
                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
              />
              <div>
                <div style={tickerLabelStyle}>WhatsApp / Beratung</div>
                <div style={tickerValueStyle}>T. +49 (0)174 346 564 1</div>
              </div>
              <div>
                <div style={tickerLabelStyle}>Notfall</div>
                <div style={tickerValueStyle}>T. +49 (0)214 / 30-20220</div>
              </div>
            </div>

            <div style={{ paddingTop: '8px' }}>
              <h2 style={{ fontSize: '54px', fontWeight: 300, color: '#1c374d', lineHeight: 1.15, marginBottom: '36px' }}>
                <span style={{ fontWeight: 700, background: 'linear-gradient(to right, #3d7a2e, #2a7ab5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Fragen?</span>{' '}
                Wir sind für Sie da.
              </h2>
              <a href="#" style={ctaLinkStyle}>Ihren Vertriebsberater finden &rsaquo;</a>
              <a href="#" style={ctaLinkStyle}>Kontakt &rsaquo;</a>
            </div>
          </div>

          {/* ── Trennlinie ── */}
          <div style={{ borderTop: '1px solid #cdd1d9', margin: '0 24px' }} />

          {/* ── Mittlerer Bereich: Folgen Sie uns | Link-Spalten ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '38% 62%',
            padding: '48px 90px 48px',
            maxWidth: '1800px',
            margin: '0 auto',
            gap: '40px',
          }}>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 300, color: '#1c374d', marginBottom: '28px' }}>
                Folgen Sie uns
              </div>
              <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
                <a href="#" style={socialStyle} aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" style={socialStyle} aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href="#" style={socialStyle} aria-label="YouTube">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#edf0f4"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Rechts: 3 Link-Spalten */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
              <div>
                <div style={colHeaderStyle}>BAYER LINKS</div>
                {[
                  'Bayer Global',
                  'Bayer CropScience World',
                  'Bayer Karriere',
                  'Bayer CropScience Austria',
                  'Bayer CropScience Schweiz',
                  'Presse',
                  'Vegetables Deutschland',
                ].map(l => <a key={l} href="#" style={colLinkStyle}>{l}</a>)}
              </div>

              <div>
                <div style={colHeaderStyle}>INFOS</div>
                <div style={subHeaderStyle}>LINKS</div>
                {['Apps', 'Wetter Aktuell'].map(l => <a key={l} href="#" style={colLinkStyle}>{l}</a>)}
                <div style={{ ...subHeaderStyle, marginTop: '16px' }}>BROSCHÜREN</div>
                {['Ackerbau', 'Saatgut', 'Sonderkulturen'].map(l => <a key={l} href="#" style={colLinkStyle}>{l}</a>)}
              </div>

              <div>
                <div style={colHeaderStyle}>VERANTWORTUNG</div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={boldItemStyle}>PAMIRA – Packmittelrücknahme</div>
                  <a href="#" style={colLinkStyle}>Sammelstellen und Termine</a>
                </div>
                <div>
                  <div style={boldItemStyle}>PRE – Chemikalien sicher entsorgen</div>
                  <a href="#" style={colLinkStyle}>Sammelstellen und Termine</a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Trennlinie ── */}
          <div style={{ borderTop: '1px solid #cdd1d9', margin: '0 24px' }} />

          {/* ── Bottom-Leiste ── */}
          <div style={{
            maxWidth: '1800px',
            margin: '0 auto',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div style={bottomLeftStyle}>© BAYER CROPSCIENCE DEUTSCHLAND GMBH</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'flex-end' }}>
                {['ALLGEMEINE NUTZUNGSBEDINGUNGEN', 'DATENSCHUTZERKLÄRUNG', 'IMPRESSUM', 'GEBRAUCHSHINWEISE'].map(l => (
                  <a key={l} href="#" style={bottomLinkStyle}>{l}</a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* Ende Desktop Footer */}

    </footer>
  )
}

/* ── shared desktop styles (unverändert) ── */
const tickerLabelStyle = {
  fontSize: '14px', fontWeight: 700, color: '#1c374d', marginBottom: '6px', letterSpacing: '0.02em',
}
const tickerValueStyle = {
  fontSize: '26px', fontWeight: 400, color: '#1c374d', letterSpacing: '-0.01em',
}
const ctaLinkStyle = {
  display: 'block', fontSize: '34px', fontWeight: 300, color: '#1c374d',
  textDecoration: 'none', marginBottom: '14px', transition: 'color 0.15s',
}
const socialStyle = {
  color: '#1c374d', textDecoration: 'none', display: 'flex',
  alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s',
}
const colHeaderStyle = {
  fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', color: '#1c374d',
  marginBottom: '18px', textTransform: 'uppercase',
}
const subHeaderStyle = {
  fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#1c374d',
  marginBottom: '8px', textTransform: 'uppercase',
}
const colLinkStyle = {
  display: 'block', fontSize: '17px', fontWeight: 400, color: '#1c374d',
  textDecoration: 'none', marginBottom: '12px', transition: 'color 0.15s',
}
const boldItemStyle = {
  fontSize: '15px', fontWeight: 700, color: '#1c374d', marginBottom: '6px',
}
const bottomLeftStyle = {
  fontSize: '12px', fontWeight: 400, letterSpacing: '0.06em', color: '#1c374d', alignSelf: 'center',
}
const bottomLinkStyle = {
  fontSize: '12px', fontWeight: 400, letterSpacing: '0.05em', color: '#1c374d',
  textDecoration: 'none', transition: 'color 0.15s', whiteSpace: 'nowrap',
}

/* ── mobile-only styles ── */
const mobileDivider = { borderTop: '1px solid #cdd1d9', margin: '24px 0' }
const mobileCTALink = {
  display: 'block', fontSize: '22px', fontWeight: 400, color: '#1c374d',
  textDecoration: 'none', marginBottom: '16px',
}
const mobileSocial = {
  color: '#1c374d', textDecoration: 'none', display: 'flex',
  alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s',
}
const mobileBottomText = {
  fontSize: '12px', fontWeight: 400, letterSpacing: '0.06em', color: '#1c374d',
}
const mobileBottomLink = {
  fontSize: '11px', fontWeight: 400, letterSpacing: '0.05em', color: '#1c374d',
  textDecoration: 'none',
}

export default Footer
