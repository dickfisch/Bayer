import { useState } from 'react'

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

function Footer() {
  const [kultur, setKultur] = useState('')

  return (
    <footer style={{ background: '#edf0f4', marginTop: '60px' }}>

      {/* ── Kultur-Dropdown ── */}
      <div style={{
        background: '#edf0f4',
        padding: '110px 90px 32px',
      }}>
        <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <select
            className="sub-nav-kultur-select !text-2xl !py-5 !pl-9 !pr-16"
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

        {/* Links: Logo + Kontaktinfos */}
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

        {/* Rechts: CTA */}
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

        {/* Links: Folgen Sie uns */}
        <div>
          <div style={{ fontSize: '42px', fontWeight: 300, color: '#1c374d', marginBottom: '28px' }}>
            Folgen Sie uns
          </div>
          <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            {/* Facebook */}
            <a href="#" style={socialStyle} aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" style={socialStyle} aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* YouTube */}
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

          {/* Spalte 1: Bayer Links */}
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

          {/* Spalte 2: Infos */}
          <div>
            <div style={colHeaderStyle}>INFOS</div>
            <div style={subHeaderStyle}>LINKS</div>
            {['Apps', 'Wetter Aktuell'].map(l => <a key={l} href="#" style={colLinkStyle}>{l}</a>)}
            <div style={{ ...subHeaderStyle, marginTop: '16px' }}>BROSCHÜREN</div>
            {['Ackerbau', 'Saatgut', 'Sonderkulturen'].map(l => <a key={l} href="#" style={colLinkStyle}>{l}</a>)}
          </div>

          {/* Spalte 3: Verantwortung & Sorgfalt */}
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

    </footer>
  )
}

const tickerLabelStyle = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#1c374d',
  marginBottom: '6px',
  letterSpacing: '0.02em',
}

const tickerValueStyle = {
  fontSize: '26px',
  fontWeight: 400,
  color: '#1c374d',
  letterSpacing: '-0.01em',
}

const ctaLinkStyle = {
  display: 'block',
  fontSize: '34px',
  fontWeight: 300,
  color: '#1c374d',
  textDecoration: 'none',
  marginBottom: '14px',
  transition: 'color 0.15s',
}

const socialStyle = {
  color: '#1c374d',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.15s',
}

const colHeaderStyle = {
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: '#1c374d',
  marginBottom: '18px',
  textTransform: 'uppercase',
}

const subHeaderStyle = {
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: '#1c374d',
  marginBottom: '8px',
  textTransform: 'uppercase',
}

const colLinkStyle = {
  display: 'block',
  fontSize: '17px',
  fontWeight: 400,
  color: '#1c374d',
  textDecoration: 'none',
  marginBottom: '12px',
  transition: 'color 0.15s',
}

const boldItemStyle = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#1c374d',
  marginBottom: '6px',
}

const bottomLeftStyle = {
  fontSize: '12px',
  fontWeight: 400,
  letterSpacing: '0.06em',
  color: '#1c374d',
  alignSelf: 'center',
}

const bottomLinkStyle = {
  fontSize: '12px',
  fontWeight: 400,
  letterSpacing: '0.05em',
  color: '#1c374d',
  textDecoration: 'none',
  transition: 'color 0.15s',
  whiteSpace: 'nowrap',
}


export default Footer
