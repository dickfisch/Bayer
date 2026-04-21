import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import ProductSphere from '../components/ProductSphere'
import MagneticGrid from '../components/MagneticGrid'
import './Produkte.css'

const NUM_ROWS = 10
const COLS = 9
const BASE_SIZE = 96
const SCALE_MAX = 1.0
const SCALE_MIN = 0.35
const MIDDLE_ROW = (NUM_ROWS - 1) / 2

const KULTUREN_KEYWORDS = [
  'Weizen', 'Winterweizen', 'Sommerweizen', 'Hartweizen',
  'Gerste', 'Wintergerste', 'Sommergerste',
  'Roggen', 'Triticale', 'Dinkel',
  'Raps', 'Sonnenblumen', 'Mais',
  'Rüben', 'Zuckerrüben', 'Kartoffeln',
  'Erdbeere', 'Hopfen', 'Apfel', 'Birne',
  'Getreide', 'Gemüse', 'Zierpflanzen',
  'Ackerbohne', 'Erbse', 'Soja', 'Lupine',
]

function getKulturenForProduct(desc) {
  const lower = desc.toLowerCase()
  return KULTUREN_KEYWORDS.filter(k => lower.includes(k.toLowerCase()))
}

function parseWirkstoffe(wirkstoff) {
  if (!wirkstoff) return []
  return wirkstoff.split(',').map(w => {
    const m = w.trim().match(/[\d,.]+\s*g\/[lk]g\s+(.+)/)
    return m ? m[1].trim() : w.trim()
  }).filter(Boolean)
}

function localSrc(localImage) {
  return localImage.replace('public/', '/')
}

function splitIntoRows(items) {
  const rows = []
  for (let i = 0; i < NUM_ROWS; i++) {
    rows.push(items.slice(i * COLS, i * COLS + COLS))
  }
  return rows
}

function buildRectRows(items, cols) {
  const rows = []
  for (let i = 0; i < items.length; i += cols) {
    rows.push(items.slice(i, i + cols))
  }
  return rows
}

function buildDiamondRows(items) {
  const n = items.length
  if (n === 0) return []
  if (n < 10) return [items]
  const weights = [0.45, 0.7, 0.85, 1.0, 1.0, 1.0, 1.0, 1.0, 0.85, 0.7, 0.45]
  const sum = weights.reduce((a, b) => a + b, 0)
  const counts = weights.map(w => Math.max(1, Math.round((w / sum) * n)))
  let diff = n - counts.reduce((a, b) => a + b, 0)
  const order = [5, 4, 6, 3, 7, 2, 8, 1, 9, 0, 10]
  let k = 0
  while (diff !== 0) {
    const idx = order[k % order.length]
    if (diff > 0) { counts[idx] += 1; diff -= 1 }
    else if (counts[idx] > 1) { counts[idx] -= 1; diff += 1 }
    k += 1
  }
  const rows = []
  let i = 0
  for (const c of counts) { rows.push(items.slice(i, i + c)); i += c }
  return rows
}

export default function Produkte() {
  const [products, setProducts] = useState([])
  const [openFilter, setOpenFilter] = useState(null)
  const [aktiveKultur, setAktiveKultur] = useState(null)
  const [aktiveKategorie, setAktiveKategorie] = useState(null)
  const [aktiverWirkstoff, setAktiverWirkstoff] = useState(null)
  const [galleryCategory, setGalleryCategory] = useState(null)
  const filterBarRef = useRef(null)

  useEffect(() => {
    fetch('/data/products.json').then(r => r.json()).then(setProducts)
  }, [])

  useEffect(() => {
    const close = e => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target))
        setOpenFilter(null)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const allKulturen = [...new Set(products.flatMap(p => getKulturenForProduct(p.description)))].sort()
  const allKategorien = [...new Set(products.flatMap(p => p.category.split(',').map(c => c.trim())))].sort()
  const allWirkstoffe = [...new Set(products.flatMap(p => parseWirkstoffe(p.wirkstoff)))].sort()

  const filtered = products.filter(p => {
    if (aktiveKultur && !getKulturenForProduct(p.description).includes(aktiveKultur)) return false
    if (aktiveKategorie && !p.category.split(',').map(c => c.trim()).includes(aktiveKategorie)) return false
    if (aktiverWirkstoff && !parseWirkstoffe(p.wirkstoff).includes(aktiverWirkstoff)) return false
    return true
  })

  const rows = splitIntoRows(filtered)

  const galleryItems = galleryCategory
    ? products.filter(p => p.category.split(',').map(c => c.trim()).includes(galleryCategory))
    : products
  const galleryRows = buildDiamondRows(galleryItems)
  const BOXED_COLS = 10
  const boxedRows = buildRectRows(galleryItems, BOXED_COLS)
  const galleryTabs = allKategorien.slice(0, 5)

  const BULGE_COLS = 12
  const bulgeRows = buildRectRows(products, BULGE_COLS)

  const filters = [
    { key: 'kultur',    label: 'Kultur',        active: aktiveKultur,     options: allKulturen,    set: setAktiveKultur },
    { key: 'kategorie', label: 'Produktgruppe',  active: aktiveKategorie,  options: allKategorien,  set: setAktiveKategorie },
    { key: 'wirkstoff', label: 'Wirkstoffe',     active: aktiverWirkstoff, options: allWirkstoffe,  set: setAktiverWirkstoff },
  ]

  return (
    <>
      <Link to="/" className="produkte-back">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>

      <div className="produkte-page">
        <div className="produkte-header">
          <h1 className="produkte-title">Pflanzenschutzmittel</h1>
          <p className="produkte-count">{filtered.length} Produkte</p>
        </div>

        <div className="grid-scene">
          <div className="lenticular-grid">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="lenticular-row">
                {row.map((p, colIdx) => {
                  const midCol = (COLS - 1) / 2
                  const dx = (colIdx - midCol) / midCol
                  const dy = (rowIdx - MIDDLE_ROW) / MIDDLE_ROW
                  const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy) / Math.SQRT2)
                  const scale = Math.max(SCALE_MIN, SCALE_MAX - dist * 0.85)
                  return (
                    <a
                      key={p.name}
                      href={p.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lenticular-item"
                      title={p.name}
                      style={{ '--s': scale.toFixed(3) }}
                    >
                      <img
                        src={localSrc(p.local_image)}
                        alt={p.name}
                        onError={e => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = p.image_url
                        }}
                      />
                    </a>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <section className="product-gallery" aria-label="Alle Produkte">
          <div className="gallery-grid">
            {galleryRows.map((row, ri) => (
              <div
                key={ri}
                className="gallery-row"
                style={{ '--stagger': ri % 2 === 0 ? '0px' : '28px' }}
              >
                {row.map(p => (
                  <a
                    key={p.name}
                    href={p.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gallery-item"
                    title={p.name}
                  >
                    <img
                      src={localSrc(p.local_image)}
                      alt={p.name}
                      onError={e => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = p.image_url
                      }}
                    />
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div className="gallery-pill">
            <button className="gallery-plus" aria-label="Weitere Filter">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2.5V11.5M2.5 7H11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
            {galleryTabs.slice(0, 2).map(tab => (
              <button
                key={tab}
                className={`gallery-tab ${galleryCategory === tab ? 'active' : ''}`}
                onClick={() => setGalleryCategory(galleryCategory === tab ? null : tab)}
              >
                {tab}
              </button>
            ))}
            <button
              className={`gallery-tab ${galleryCategory === null ? 'active' : ''}`}
              onClick={() => setGalleryCategory(null)}
            >
              Alle
            </button>
            {galleryTabs.slice(2, 4).map(tab => (
              <button
                key={tab}
                className={`gallery-tab ${galleryCategory === tab ? 'active' : ''}`}
                onClick={() => setGalleryCategory(galleryCategory === tab ? null : tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section className="product-gallery product-gallery--sphere" aria-label="Produkt-Sphere">
          <ProductSphere products={galleryItems} />

          <div className="gallery-pill">
            <button className="gallery-plus" aria-label="Weitere Filter">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2.5V11.5M2.5 7H11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
            {galleryTabs.slice(0, 2).map(tab => (
              <button
                key={tab}
                className={`gallery-tab ${galleryCategory === tab ? 'active' : ''}`}
                onClick={() => setGalleryCategory(galleryCategory === tab ? null : tab)}
              >
                {tab}
              </button>
            ))}
            <button
              className={`gallery-tab ${galleryCategory === null ? 'active' : ''}`}
              onClick={() => setGalleryCategory(null)}
            >
              Alle
            </button>
            {galleryTabs.slice(2, 4).map(tab => (
              <button
                key={tab}
                className={`gallery-tab ${galleryCategory === tab ? 'active' : ''}`}
                onClick={() => setGalleryCategory(galleryCategory === tab ? null : tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section className="product-gallery product-gallery--magnetic" aria-label="Magnetisches Raster">
          <MagneticGrid products={galleryItems} />

          <div className="gallery-pill">
            <button className="gallery-plus" aria-label="Weitere Filter">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2.5V11.5M2.5 7H11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
            {galleryTabs.slice(0, 2).map(tab => (
              <button
                key={tab}
                className={`gallery-tab ${galleryCategory === tab ? 'active' : ''}`}
                onClick={() => setGalleryCategory(galleryCategory === tab ? null : tab)}
              >
                {tab}
              </button>
            ))}
            <button
              className={`gallery-tab ${galleryCategory === null ? 'active' : ''}`}
              onClick={() => setGalleryCategory(null)}
            >
              Alle
            </button>
            {galleryTabs.slice(2, 4).map(tab => (
              <button
                key={tab}
                className={`gallery-tab ${galleryCategory === tab ? 'active' : ''}`}
                onClick={() => setGalleryCategory(galleryCategory === tab ? null : tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section className="product-gallery product-gallery--bulge" aria-label="Alle Produkte in Wölbung">
          <div className="bulge-stage" style={{ '--bulge-cols': BULGE_COLS }}>
            <div className="bulge-grid">
              {bulgeRows.map((row, ri) => {
                const midRow = (bulgeRows.length - 1) / 2
                return (
                  <div key={ri} className="bulge-row">
                    {row.map((p, ci) => {
                      const midCol = (BULGE_COLS - 1) / 2
                      const dx = (ci - midCol) / midCol
                      const dy = midRow === 0 ? 0 : (ri - midRow) / midRow
                      const dist2 = Math.min(1, dx * dx + dy * dy)
                      const z = (1 - dist2) * 200
                      return (
                        <a
                          key={p.name}
                          href={p.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bulge-item"
                          title={p.name}
                          style={{ '--z': `${z.toFixed(1)}px` }}
                        >
                          <img
                            src={localSrc(p.local_image)}
                            alt={p.name}
                            onError={e => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = p.image_url
                            }}
                          />
                        </a>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <div className="filter-bar" ref={filterBarRef}>
          {filters.map(f => (
            <div key={f.key} className="filter-chip-wrap">
              {openFilter === f.key && (
                <div className="filter-dropdown">
                  <button
                    className={`filter-option ${!f.active ? 'selected' : ''}`}
                    onClick={() => { f.set(null); setOpenFilter(null) }}
                  >
                    Alle
                  </button>
                  {f.options.map(opt => (
                    <button
                      key={opt}
                      className={`filter-option ${f.active === opt ? 'selected' : ''}`}
                      onClick={() => { f.set(opt); setOpenFilter(null) }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              <button
                className={`filter-chip ${f.active ? 'active' : ''}`}
                onClick={() => setOpenFilter(openFilter === f.key ? null : f.key)}
              >
                {f.active ?? f.label}
                <svg className="chip-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 7.5L6 4.5L9.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}
