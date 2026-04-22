import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import TransitionLink from '../components/TransitionLink'
import Footer from '../components/Footer'
import './Produkte3D.css'

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Alle' },
  { value: 'Akarizid', label: 'Akarizid' },
  { value: 'Beizmittel', label: 'Beizmittel' },
  { value: 'Dünger', label: 'Dünger' },
  { value: 'Fungizid', label: 'Fungizid' },
  { value: 'Herbizid', label: 'Herbizid' },
  { value: 'Insektizid', label: 'Insektizid' },
  { value: 'Pflanzenhilfsmittel', label: 'Pflanzenhilfsmittel' },
  { value: 'Wachstumsregler', label: 'Wachstumsregler' },
  { value: 'Zusatzstoff', label: 'Zusatzstoff' },
]

const KULTUR_GROUPS = [
  {
    label: 'Getreide',
    items: [
      'Getreide',
      'Dinkel',
      'Gerste, Sommer',
      'Gerste, Winter',
      'Hafer',
      'Roggen, Winter',
      'Triticale',
      'Weizen, Hart- (Durum)',
      'Weizen, Sommer',
      'Weizen, Winter',
    ],
  },
  {
    label: 'Rübe',
    items: [
      'Kartoffel',
      'Mais',
      'Raps',
      'Sonnenblume',
      'Senf',
    ],
  },
  {
    label: 'Leguminose',
    items: [
      'Leguminose',
      'Bohne, Acker',
      'Erbse, Feld',
      'Lupine',
    ],
  },
  {
    label: 'Gemüse',
    items: [
      'Gemüse',
      'Aubergine',
      'Blumenkohl',
      'Bohne, Busch',
      'Bohne, Stangen',
      'Brokkoli',
      'Chicoree',
      'Chinakohl',
      'Endivien',
      'Fenchel',
      'Grünkohl',
      'Gurke',
      'Kohlrabi',
      'Kürbis',
      'Möhre',
      'Paprika',
      'Porree',
      'Radieschen',
      'Rettich',
      'Rosenkohl',
      'Rotkohl',
      'Salat, Feld',
      'Salat, Kopf',
      'Sellerie',
      'Spargel',
      'Spinat',
      'Spitzkohl',
      'Tomate',
      'Weißkohl',
      'Wirsing',
      'Zucchini',
      'Zwiebel',
    ],
  },
  {
    label: 'Grünland',
    items: ['Grünland', 'Grassamenvermehrung'],
  },
  {
    label: 'Zierpflanzen',
    items: ['Zierpflanzen'],
  },
  {
    label: 'Baumschule',
    items: ['Baumschule', 'Ziergehölze'],
  },
  {
    label: 'Obst',
    items: [
      'Obst',
      'Apfel',
      'Birne',
      'Brombeere',
      'Erdbeere',
      'Heidelbeere',
      'Himbeere',
      'Johannisbeere',
      'Kirsche',
      'Melone',
      'Pfirsich',
      'Pflaume/Zwetschge',
      'Stachelbeere',
    ],
  },
  {
    label: 'Weinbau',
    items: ['Hopfen'],
  },
  {
    label: 'Kräuter',
    items: [
      'Kräuter',
      'Dill',
      'Kamille, Echte',
      'Kerbel',
      'Koriander',
      'Kümmel',
      'Liebstöckel',
      'Pastinak',
      'Petersilie',
      'Ringelblume',
      'Salbei',
      'Schnittlauch',
    ],
  },
]

const SORT_OPTIONS = [
  { value: 'default', label: 'Standard' },
  { value: 'az', label: 'Name A – Z' },
  { value: 'za', label: 'Name Z – A' },
]

// Wirkstoff-Überbegriffe (chemische Klasse / Wirkmechanismus),
// abgeleitet aus dem wirkstoff-Feld in public/data/products.json
const WIRKSTOFF_OPTIONS = [
  { value: 'all', label: 'Alle' },
  { value: 'auxin', label: 'Auxin-Herbizide' },
  { value: 'biologicals', label: 'Biologicals' },
  { value: 'carbamate', label: 'Carbamate' },
  { value: 'chloracetamide', label: 'Chloracetamide' },
  { value: 'fettsaeuren', label: 'Fettsäuren' },
  { value: 'hppd', label: 'HPPD-Hemmer' },
  { value: 'neonicotinoide', label: 'Neonicotinoide / Butenolide' },
  { value: 'phosphonate', label: 'Phosphonate' },
  { value: 'pyrethroide', label: 'Pyrethroide' },
  { value: 'safener', label: 'Safener' },
  { value: 'sdhi', label: 'SDHI (Carboxamide)' },
  { value: 'strobilurine', label: 'Strobilurine' },
  { value: 'sulfonylharnstoffe', label: 'Sulfonylharnstoffe' },
  { value: 'triazine', label: 'Triazine' },
  { value: 'triazole', label: 'Triazole (Azole)' },
  { value: 'wachstumsregler', label: 'Wachstumsregler' },
]

// Zuordnung: Einzelwirkstoff → Überbegriffs-Key. Reihenfolge wichtig —
// spezifischere Namen zuerst, damit z. B. "Iodosulfuron-methyl-natrium"
// vor "Iodosulfuron" geprüft wird (bei Substring-Match dennoch egal).
const WIRKSTOFF_GROUP_MAP = [
  // Sulfonylharnstoffe
  ['Amidosulfuron', 'sulfonylharnstoffe'],
  ['Foramsulfuron', 'sulfonylharnstoffe'],
  ['Iodosulfuron', 'sulfonylharnstoffe'],
  ['Mesosulfuron', 'sulfonylharnstoffe'],
  ['Thiencarbazone', 'sulfonylharnstoffe'],
  ['Propoxycarbazone', 'sulfonylharnstoffe'],
  // Triazole
  ['Prothioconazol', 'triazole'],
  ['Tebuconazol', 'triazole'],
  // Strobilurine
  ['Fluoxastrobin', 'strobilurine'],
  ['Trifloxystrobin', 'strobilurine'],
  ['Fenpicoxamid', 'strobilurine'],
  // SDHI
  ['Bixafen', 'sdhi'],
  ['Fluopyram', 'sdhi'],
  // HPPD
  ['Isoxaflutole', 'hppd'],
  ['Mesotrione', 'hppd'],
  ['Tembotrione', 'hppd'],
  // Triazine
  ['Terbuthylazin', 'triazine'],
  // Phosphonate
  ['Glyphosat', 'phosphonate'],
  ['Fosetyl-Al', 'phosphonate'],
  // Auxin-Herbizide
  ['Dicamba', 'auxin'],
  // Chloracetamide
  ['Flufenacet', 'chloracetamide'],
  // Carbamate
  ['Prosulfocarb', 'carbamate'],
  ['Propamocarb', 'carbamate'],
  ['Iprovalicarb', 'carbamate'],
  // Wachstumsregler
  ['Chlormequatchlorid', 'wachstumsregler'],
  ['Ethephon', 'wachstumsregler'],
  // Pyrethroide
  ['Deltamethrin', 'pyrethroide'],
  // Neonicotinoide / Butenolide
  ['Flupyradifurone', 'neonicotinoide'],
  // Biologicals
  ['Bacillus amyloliquefaciens', 'biologicals'],
  // Safener
  ['Mefenpyr', 'safener'],
  ['Cyprosulfamide', 'safener'],
  // Fettsäuren
  ['Fettsäuren', 'fettsaeuren'],
]

function hasWirkstoff(product, key) {
  if (!key || key === 'all') return true
  const text = product.wirkstoff || ''
  if (!text) return false
  for (const [ingredient, group] of WIRKSTOFF_GROUP_MAP) {
    if (group === key && text.includes(ingredient)) return true
  }
  return false
}

// Kultur → Substring-Patterns in description/name
const KULTUR_PATTERNS = {
  // Getreide
  'Getreide': ['Getreide', 'Weizen', 'Gerste', 'Roggen', 'Hafer', 'Triticale', 'Dinkel'],
  'Dinkel': ['Dinkel'],
  'Gerste, Sommer': ['Sommergerste'],
  'Gerste, Winter': ['Wintergerste'],
  'Hafer': ['Hafer'],
  'Roggen, Winter': ['Winterroggen'],
  'Triticale': ['Triticale'],
  'Weizen, Hart- (Durum)': ['Hartweizen', 'Durum'],
  'Weizen, Sommer': ['Sommerweizen', 'Sommerweichweizen'],
  'Weizen, Winter': ['Winterweizen', 'Winterweichweizen'],
  // Rübe (Kategorie des Users — enthält Hackfrüchte/Öl-/Sonstige)
  'Kartoffel': ['Kartoffel'],
  'Mais': ['Mais'],
  'Raps': ['Raps'],
  'Sonnenblume': ['Sonnenblume'],
  'Senf': ['Senf'],
  // Leguminose
  'Leguminose': ['Leguminose', 'Bohne', 'Erbse', 'Lupine'],
  'Bohne, Acker': ['Ackerbohne'],
  'Erbse, Feld': ['Futtererbse', 'Feldebse', 'Felderbse', 'Erbse'],
  'Lupine': ['Lupine'],
  // Gemüse
  'Gemüse': ['Gemüse', 'Kohl', 'Salat', 'Tomate', 'Gurke', 'Zwiebel', 'Möhre', 'Karotte'],
  'Aubergine': ['Aubergine'],
  'Blumenkohl': ['Blumenkohl'],
  'Bohne, Busch': ['Buschbohne'],
  'Bohne, Stangen': ['Stangenbohne'],
  'Brokkoli': ['Brokkoli'],
  'Chicoree': ['Chicoree', 'Chicorée'],
  'Chinakohl': ['Chinakohl'],
  'Endivien': ['Endivien'],
  'Fenchel': ['Fenchel'],
  'Grünkohl': ['Grünkohl'],
  'Gurke': ['Gurke'],
  'Kohlrabi': ['Kohlrabi'],
  'Kürbis': ['Kürbis'],
  'Möhre': ['Möhre', 'Karotte'],
  'Paprika': ['Paprika'],
  'Porree': ['Porree', 'Lauch'],
  'Radieschen': ['Radieschen'],
  'Rettich': ['Rettich'],
  'Rosenkohl': ['Rosenkohl'],
  'Rotkohl': ['Rotkohl'],
  'Salat, Feld': ['Feldsalat'],
  'Salat, Kopf': ['Kopfsalat'],
  'Sellerie': ['Sellerie'],
  'Spargel': ['Spargel'],
  'Spinat': ['Spinat'],
  'Spitzkohl': ['Spitzkohl'],
  'Tomate': ['Tomate'],
  'Weißkohl': ['Weißkohl'],
  'Wirsing': ['Wirsing'],
  'Zucchini': ['Zucchini'],
  'Zwiebel': ['Zwiebel'],
  // Grünland
  'Grünland': ['Grünland', 'Wiesen', 'Weiden'],
  'Grassamenvermehrung': ['Grassamen', 'Gräservermehrung'],
  // Zierpflanzen
  'Zierpflanzen': ['Zierpflanze', 'Zierpflanzen'],
  // Baumschule
  'Baumschule': ['Baumschule'],
  'Ziergehölze': ['Ziergehölz'],
  // Obst
  'Obst': ['Obst', 'Apfel', 'Birne', 'Kirsche', 'Erdbeere', 'Heidelbeere', 'Himbeere', 'Johannisbeere', 'Stachelbeere', 'Brombeere', 'Pfirsich', 'Pflaume', 'Melone', 'Zwetschge'],
  'Apfel': ['Apfel', 'Äpfel'],
  'Birne': ['Birne'],
  'Brombeere': ['Brombeere'],
  'Erdbeere': ['Erdbeere'],
  'Heidelbeere': ['Heidelbeere'],
  'Himbeere': ['Himbeere'],
  'Johannisbeere': ['Johannisbeere'],
  'Kirsche': ['Kirsche'],
  'Melone': ['Melone'],
  'Pfirsich': ['Pfirsich'],
  'Pflaume/Zwetschge': ['Pflaume', 'Zwetschge'],
  'Stachelbeere': ['Stachelbeere'],
  // Weinbau
  'Hopfen': ['Hopfen'],
  // Kräuter
  'Kräuter': ['Kräuter', 'Petersilie', 'Dill', 'Kamille', 'Schnittlauch', 'Salbei', 'Koriander'],
  'Dill': ['Dill'],
  'Kamille, Echte': ['Kamille'],
  'Kerbel': ['Kerbel'],
  'Koriander': ['Koriander'],
  'Kümmel': ['Kümmel'],
  'Liebstöckel': ['Liebstöckel'],
  'Pastinak': ['Pastinak'],
  'Petersilie': ['Petersilie'],
  'Ringelblume': ['Ringelblume'],
  'Salbei': ['Salbei'],
  'Schnittlauch': ['Schnittlauch'],
}

function hasKultur(product, key) {
  if (!key || key === 'all') return true
  const patterns = KULTUR_PATTERNS[key]
  if (!patterns) return false
  const haystack = `${product.description || ''} ${product.name || ''}`.toLowerCase()
  return patterns.some(p => haystack.includes(p.toLowerCase()))
}

const FILTERS_LEGACY = [
  { key: 'all', label: 'Alle' },
  { key: 'Herbizid', label: 'Herbizid' },
  { key: 'Fungizid', label: 'Fungizid' },
  { key: 'Insektizid', label: 'Insektizid' },
  { key: 'Zusatzstoff', label: 'Zusatzstoff' },
  { key: 'Beizmittel', label: 'Beizmittel' },
]

function localSrc(localImage) {
  return (localImage || '').replace('public/', '/')
}

function hasCategory(product, key) {
  if (!key || key === 'all') return true
  const cats = (product.category || '').split(',').map(s => s.trim())
  return cats.includes(key)
}

function Produkte3DSection({ products, variant = 'legacy', onSelectProduct }) {
  const [filter, setFilter] = useState(variant === 'cta' ? '' : 'all')
  const [kultur, setKultur] = useState('')
  const [wirkstoff, setWirkstoff] = useState('')
  const [sort, setSort] = useState('default')
  const [transitioning, setTransitioning] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)

  const visible = useMemo(
    () =>
      products.filter(
        p =>
          hasCategory(p, filter) &&
          hasKultur(p, kultur) &&
          hasWirkstoff(p, wirkstoff)
      ),
    [products, filter, kultur, wirkstoff]
  )

  // CTA-Variante: zweiphasige Exit-Animation (fly forward + fade out),
  // Bleibende Kacheln behalten stabile Identität und wandern smooth in neue Positionen
  const [displayed, setDisplayed] = useState([])
  const [exitingSet, setExitingSet] = useState(() => new Set())
  const displayedRef = useRef([])
  const sceneRef = useRef(null)
  const planeRef = useRef(null)

  useEffect(() => {
    const scene = sceneRef.current
    const plane = planeRef.current
    if (!scene || !plane) return

    let rafId = null
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let rect = scene.getBoundingClientRect()

    function updateRect() {
      rect = scene.getBoundingClientRect()
    }
    function onMove(e) {
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const hw = rect.width / 2
      const hh = rect.height / 2
      const nx = (e.clientX - cx) / hw
      const ny = (e.clientY - cy) / hh
      targetX = nx < -1 ? -1 : nx > 1 ? 1 : nx
      targetY = ny < -1 ? -1 : ny > 1 ? 1 : ny
    }
    function onLeave() {
      targetX = 0
      targetY = 0
    }
    function tick() {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12
      const rx = (currentY * -5).toFixed(3)
      const ry = (currentX * 7).toFixed(3)
      const tx = (currentX * 18).toFixed(2)
      const ty = (currentY * 12).toFixed(2)
      plane.style.transform =
        'translate3d(' + tx + 'px,' + ty + 'px,0) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)'
      rafId = requestAnimationFrame(tick)
    }

    scene.addEventListener('mousemove', onMove, { passive: true })
    scene.addEventListener('mouseleave', onLeave)
    window.addEventListener('scroll', updateRect, { passive: true })
    window.addEventListener('resize', updateRect)
    rafId = requestAnimationFrame(tick)

    return () => {
      scene.removeEventListener('mousemove', onMove)
      scene.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('scroll', updateRect)
      window.removeEventListener('resize', updateRect)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    if (variant !== 'cta') {
      displayedRef.current = visible
      setDisplayed(visible)
      return
    }
    const visibleNames = new Set(visible.map(p => p.name))
    const prev = displayedRef.current
    const toExit = prev.filter(p => !visibleNames.has(p.name))
    if (toExit.length === 0) {
      displayedRef.current = visible
      setDisplayed(visible)
      setExitingSet(new Set())
      return
    }
    setExitingSet(new Set(toExit.map(p => p.name)))
    const t = setTimeout(() => {
      displayedRef.current = visible
      setDisplayed(visible)
      setExitingSet(new Set())
    }, 780)
    return () => clearTimeout(t)
  }, [visible, variant])

  const renderList = variant === 'cta' ? displayed : visible

  const cols = Math.max(
    3,
    Math.min(16, Math.ceil(Math.sqrt(renderList.length * 1.55)))
  )
  const rows = Math.max(1, Math.ceil(renderList.length / cols))

  function triggerTransition(cb) {
    if (variant === 'cta') {
      cb()
      return
    }
    setTransitioning(true)
    setTimeout(() => {
      cb()
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitioning(false))
      })
    }, 260)
  }

  function selectFilter(next) {
    if (next === filter) return
    triggerTransition(() => setFilter(next))
  }

  function handleCategoryChange(e) {
    const next = e.target.value
    if (next === filter) return
    triggerTransition(() => setFilter(next))
  }

  function handleKulturChange(e) {
    const next = e.target.value
    if (next === kultur) return
    triggerTransition(() => setKultur(next))
  }

  function handleWirkstoffChange(e) {
    const next = e.target.value
    if (next === wirkstoff) return
    triggerTransition(() => setWirkstoff(next))
  }

  return (
    <section className="produkte3d-section">
      <div className="produkte3d-title">
        <span className="produkte3d-title-main">PFLANZENSCHUTZMITTEL A–Z</span>
      </div>

      <div className="produkte3d-scene" ref={sceneRef}>
        <div
          ref={planeRef}
          className={`produkte3d-plane ${transitioning ? 'is-transitioning' : ''} ${renderList.length < 18 ? 'no-hover-expand' : ''}`}
          style={{ '--cols': cols, '--rows': rows }}
        >
          {renderList.map((p, i) => {
            const ci = i % cols
            const ri = Math.floor(i / cols)
            const midC = (cols - 1) / 2
            const midR = (rows - 1) / 2
            const dx = midC === 0 ? 0 : (ci - midC) / midC
            const dy = midR === 0 ? 0 : (ri - midR) / midR
            const dist2 = Math.min(1, dx * dx + dy * dy)
            const flat = renderList.length < 18
            const z = flat ? 0 : (1 - dist2) * 220 - 40
            const rx = flat ? 0 : dy * -8
            const ry = flat ? 0 : dx * 8
            const delay = (Math.abs(dx) + Math.abs(dy)) * 60 + i * 3
            const exiting = variant === 'cta' && exitingSet.has(p.name)
            const cellTransform = exiting
              ? `translateZ(620px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`
              : `translateZ(${z.toFixed(1)}px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`
            const key =
              variant === 'cta'
                ? p.name
                : `${filter}-${kultur}-${wirkstoff}-${p.name}`
            return (
              <div
                key={key}
                className={`produkte3d-cell ${exiting ? 'is-exiting' : ''}`}
                title={p.name}
                onClick={() => {
                  if (exiting) return
                  onSelectProduct && onSelectProduct(p)
                }}
                style={{
                  '--cell-transform': cellTransform,
                  animationDelay: `${delay}ms`,
                  zIndex: exiting ? 9998 : Math.round(1000 + z),
                }}
              >
                <img
                  src={localSrc(p.local_image)}
                  alt={p.name}
                  loading="lazy"
                  onError={e => {
                    e.currentTarget.onerror = null
                    if (p.image_url) e.currentTarget.src = p.image_url
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {variant === 'cta' ? (
        <div className="produkte3d-ctabar-wrap">
          {visible.length > 0 && visible.length < 5 && (
            <button
              type="button"
              className="produkte3d-compare-bar"
              onClick={() => setCompareOpen(true)}
            >
              <span className="produkte3d-compare-label">Produkte vergleichen</span>
            </button>
          )}
          <div className="cta-sticky-glass produkte3d-ctabar">
            <div className="cta-sticky-inner">
              <button
                type="button"
                className="produkte3d-ctabar-all"
                onClick={() => {
                  triggerTransition(() => {
                    setFilter('all')
                    setKultur('all')
                    setWirkstoff('all')
                  })
                }}
              >
                Alle
              </button>
              <select
                className="beratung-nav-kultur-select flex-1"
                value={filter}
                onChange={handleCategoryChange}
              >
                <option value="" disabled>Produktgruppe</option>
                {CATEGORY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <select
                className="beratung-nav-kultur-select flex-1"
                value={kultur}
                onChange={handleKulturChange}
              >
                <option value="" disabled>Kultur</option>
                <option value="all">Alle</option>
                {KULTUR_GROUPS.map(group => (
                  <optgroup key={group.label} label={group.label}>
                    {group.items.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <select
                className="beratung-nav-kultur-select flex-1"
                value={wirkstoff}
                onChange={handleWirkstoffChange}
              >
                <option value="" disabled>Wirkstoffe</option>
                {WIRKSTOFF_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="produkte3d-filters">
          {FILTERS_LEGACY.map(f => (
            <button
              key={f.key}
              className={`produkte3d-pill ${filter === f.key ? 'is-active' : ''}`}
              onClick={() => selectFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {compareOpen && (
        <ProduktVergleichLayer
          products={visible.slice(0, 5)}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </section>
  )
}

const VERGLEICH_ROWS = [
  { label: 'Produktgruppe', render: p => p.category || '—' },
  { label: 'Formulierung', render: p => p.formulierung || '—' },
  {
    label: 'Wirkstoff',
    render: p => {
      const list = Array.isArray(p.wirkstoffe) ? p.wirkstoffe : []
      if (list.length > 0) {
        return (
          <ul className="produkte3d-vergleich-wirkstoffe">
            {list.map((w, i) => (
              <li key={i}>
                <span className="amount">{w.amount}</span>
                <span className="name">{w.name}</span>
                {w.safener && <span className="safener">Safener</span>}
              </li>
            ))}
          </ul>
        )
      }
      return p.wirkstoff || '—'
    },
  },
  {
    label: 'Eigenschaften',
    render: p => {
      const list = Array.isArray(p.eigenschaften) ? p.eigenschaften : []
      if (list.length === 0) return '—'
      return (
        <ul className="produkte3d-vergleich-chips">
          {list.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )
    },
  },
  {
    label: 'Beschreibung',
    className: 'produkte3d-vergleich-cell--desc',
    render: p => p.description || '—',
  },
]

function ProduktVergleichLayer({ products, onClose }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="produkte3d-vergleich-overlay" onClick={onClose}>
      <div
        className="produkte3d-vergleich-panel"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className="produkte3d-vergleich-close"
          onClick={onClose}
          aria-label="Schließen"
        >
          ×
        </button>
        <div className="produkte3d-vergleich-grid">
          {products.map((p, i) => (
            <div
              key={p.name}
              className="produkte3d-vergleich-head"
              style={{ gridColumn: i + 2, gridRow: 1 }}
            >
              <div className="produkte3d-vergleich-image">
                <img
                  src={localSrc(p.local_image)}
                  alt={p.name}
                  onError={e => {
                    e.currentTarget.onerror = null
                    if (p.image_url) e.currentTarget.src = p.image_url
                  }}
                />
              </div>
              <div className="produkte3d-vergleich-name">{p.name}</div>
            </div>
          ))}
          {VERGLEICH_ROWS.map((row, rowIdx) => (
            <Fragment key={row.label}>
              <div
                className="produkte3d-vergleich-label"
                style={{ gridColumn: 1, gridRow: rowIdx + 2 }}
              >
                {row.label}
              </div>
              {products.map((p, i) => (
                <div
                  key={p.name + row.label}
                  className={`produkte3d-vergleich-cell ${row.className || ''}`}
                  style={{ gridColumn: i + 2, gridRow: rowIdx + 2 }}
                >
                  {row.render(p)}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

const STATIC_PDF_DOWNLOADS = [
  'Sicherheitsdatenblatt',
  'Gebrauchsanleitung',
  'Leistungsprofil',
  'Abstände Gewässer, Saumstrukturen und Hangneigung',
]

function ProduktDetailPanel({ product, onClose }) {
  useEffect(() => {
    if (!product) return
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, onClose])

  if (!product) return null

  const wirkstoffeList = Array.isArray(product.wirkstoffe) ? product.wirkstoffe : []
  const eigenschaften = Array.isArray(product.eigenschaften) ? product.eigenschaften : []
  const gebinde = Array.isArray(product.gebinde) ? product.gebinde : []

  return (
    <div className="produkte3d-detail-overlay" onClick={onClose}>
      <aside
        className="produkte3d-detail-panel"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className="produkte3d-detail-close"
          onClick={onClose}
          aria-label="Schließen"
        >
          ×
        </button>
        <div className="produkte3d-detail-image">
          <img
            src={localSrc(product.local_image)}
            alt={product.name}
            onError={e => {
              e.currentTarget.onerror = null
              if (product.image_url) e.currentTarget.src = product.image_url
            }}
          />
        </div>
        <div className="produkte3d-detail-info">
          <div className="produkte3d-detail-titlebar">
            <h2 className="produkte3d-detail-name">{product.name}</h2>
            <div className="produkte3d-detail-meta">
              {product.category && (
                <span className="produkte3d-detail-category">{product.category}</span>
              )}
              {product.formulierung && (
                <span className="produkte3d-detail-formulierung">{product.formulierung}</span>
              )}
            </div>
          </div>
          {product.description && (
            <p className="produkte3d-detail-description">
              {product.description}
            </p>
          )}
          {eigenschaften.length > 0 && (
            <div className="produkte3d-detail-row">
              <span className="produkte3d-detail-label">Eigenschaften</span>
              <ul className="produkte3d-detail-chips">
                {eigenschaften.map((e, i) => (
                  <li key={i} className="produkte3d-detail-chip">{e}</li>
                ))}
              </ul>
            </div>
          )}
          {wirkstoffeList.length > 0 ? (
            <div className="produkte3d-detail-row">
              <span className="produkte3d-detail-label">Wirkstoff</span>
              <ul className="produkte3d-detail-wirkstoffe">
                {wirkstoffeList.map((w, i) => (
                  <li key={i} className="produkte3d-detail-wirkstoff">
                    <span className="produkte3d-detail-wirkstoff-amount">{w.amount}</span>
                    <span className="produkte3d-detail-wirkstoff-name">{w.name}</span>
                    {w.safener && (
                      <span className="produkte3d-detail-wirkstoff-badge">Safener</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : product.wirkstoff ? (
            <div className="produkte3d-detail-row">
              <span className="produkte3d-detail-label">Wirkstoff</span>
              <span className="produkte3d-detail-value">{product.wirkstoff}</span>
            </div>
          ) : null}
          {gebinde.length > 0 && (
            <div className="produkte3d-detail-row">
              <span className="produkte3d-detail-label">Artikel &amp; Logistik</span>
              <table className="produkte3d-detail-gebinde">
                <thead>
                  <tr>
                    <th>Artikelnummer</th>
                    <th>Verpackungsgröße</th>
                    <th>Paletteneinheit</th>
                  </tr>
                </thead>
                <tbody>
                  {gebinde.map((g, i) => (
                    <tr key={i}>
                      <td>{g.artikelnummer}</td>
                      <td>{g.verpackungsgroesse}</td>
                      <td>{g.paletteneinheit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="produkte3d-detail-row">
            <span className="produkte3d-detail-label">Downloads</span>
            <ul className="produkte3d-detail-pdflist">
              {STATIC_PDF_DOWNLOADS.map(label => (
                <li key={label} className="produkte3d-detail-pdfitem" title={label}>
                  <span className="produkte3d-detail-pdficon" aria-hidden="true">PDF</span>
                  <span className="produkte3d-detail-pdflabel">{label}</span>
                </li>
              ))}
            </ul>
          </div>
          {product.source_url && (
            <a
              className="produkte3d-detail-link"
              href={product.source_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Zur Herstellerseite
            </a>
          )}
        </div>
      </aside>
    </div>
  )
}

export default function Produkte3D() {
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('/data/products.json').then(r => r.json()).then(setProducts)
  }, [])

  return (
    <div className="produkte3d-page">
      <TransitionLink to="/" className="produkte3d-back" aria-label="Zurück zur Startseite">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </TransitionLink>
      <Produkte3DSection
        products={products}
        variant="cta"
        onSelectProduct={setSelected}
      />
      <ProduktDetailPanel
        product={selected}
        onClose={() => setSelected(null)}
      />
      <Footer />
    </div>
  )
}
