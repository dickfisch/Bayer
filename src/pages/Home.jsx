import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion'
import MainNav from '../components/MainNav'
import Footer from '../components/Footer'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Label from '../components/ui/Label'
import PageHeader from '../components/ui/PageHeader'
import TileCard from '../components/ui/TileCard'

const THEMEN_CARDS = [
  { title: 'Winterweizen',        icon: '/icons_website_dummy_video.svg',   sub: 'Mehr erfahren', image: '/wetter_back_2.jpg',  text: 'Flufencet-Verbot: Letzte Chance für Cadou SC und neue Lösungen für Landwirte.' },
  { title: 'Mais',                icon: '/icons_website_dummy_video.svg',   sub: 'Mehr erfahren', image: '/Mais.jpg',            text: 'Flufencet-Verbot: Letzte Chance für Cadou SC und neue Lösungen für Landwirte.' },
  { title: 'Resistenzmanagement', icon: '/icons_website_dummy_magazin.svg', sub: 'Mehr erfahren', image: '/Podcast_2.jpg',       text: 'Flufencet-Verbot: Letzte Chance für Cadou SC und neue Lösungen für Landwirte.' },
  { title: 'Beratung',            icon: '/icons_website_dummy_magazin.svg', sub: 'Mehr erfahren', image: '/image_beratung.jpg',  text: 'Flufencet-Verbot: Letzte Chance für Cadou SC und neue Lösungen für Landwirte.' },
  { title: 'Premeo',              icon: '/icons_website_dummy_video.svg',   sub: 'Mehr erfahren', image: '/premeo_back_1.jpg',   text: 'Flufencet-Verbot: Letzte Chance für Cadou SC und neue Lösungen für Landwirte.' },
  { title: 'Pflanzenschutz',      icon: '/icons_website_dummy_video.svg',   sub: 'Mehr erfahren', image: '/premeo_back_2.jpg',   text: 'Flufencet-Verbot: Letzte Chance für Cadou SC und neue Lösungen für Landwirte.' },
]

const AGRAR_FEATURED = [
  { title: 'Flufencet-Verbot',    icon: '/icons_website_dummy_magazin.svg', sub: 'Jetzt lesen',   image: '/Leitbild_Flufenacet_Verbot.jpg',  text: 'Letzte Chance für Cadou SC – und was kommt danach? Neue Lösungen für Landwirte.' },
  { title: 'Maiszüchtung',        icon: '/icons_website_dummy_video.svg',   sub: 'Video ansehen', image: '/Maiszuechtung-maisspitzen.jpg',    text: 'Innovation im Mais-Anbau: Neue Sorten und Ertragsoptimierung für die Saison 2026.' },
  { title: 'Wetter & Saison',     icon: '/icons_website_dummy_wetter.svg',  sub: 'Mehr erfahren', image: '/wetter_back_2.jpg',               text: 'Aktuelle Wetterlagen und saisonale Empfehlungen für Ihren Standort.' },
]

const AGRAR_LOOP   = [...AGRAR_FEATURED, ...AGRAR_FEATURED, ...AGRAR_FEATURED]

const AGRAR_SCROLL = [
  { title: 'Kartoffelbestand',    icon: '/icons_website_dummy_magazin.svg', sub: 'Lesen',          image: '/BCS_Kartoffelbestand_1600x805.jpg', text: 'Optimale Bestandsführung für höhere Erträge.' },
  { title: 'ReSoil',              icon: '/icons_website_dummy_magazin.svg', sub: 'Mehr erfahren',  image: '/Leitbild_ReSoil.jpg',               text: 'Bodengesundheit nachhaltig verbessern.' },
  { title: 'Podcast – Mais',      icon: '/icons_website_dummy_video.svg',   sub: 'Anhören',        image: '/Podcast_1.jpg',                     text: 'Experten diskutieren Anbaustrategien 2026.' },
  { title: 'Premeo 2026',         icon: '/icons_website_dummy_video.svg',   sub: 'Jetzt sichern',  image: '/Premeo_2023.jpg',                   text: 'Doppelte Punkte in der neuen Saison.' },
  { title: 'Mais Anbau',          icon: '/icons_website_dummy_video.svg',   sub: 'Mehr erfahren',  image: '/Mais.jpg',                          text: 'Neue Sorten und Ertragsoptimierung.' },
  { title: 'Beratungsgespräch',   icon: '/icons_website_dummy_magazin.svg', sub: 'Termin buchen',  image: '/image_beratung.jpg',                text: 'Persönliche Beratung für Ihren Betrieb.' },
  { title: 'Podcast – Raps',      icon: '/icons_website_dummy_video.svg',   sub: 'Anhören',        image: '/Podcast_2.jpg',                     text: 'Resistenzmanagement in der Praxis.' },
  { title: 'Wetter & Prognose',   icon: '/icons_website_dummy_wetter.svg',  sub: 'Mehr erfahren',  image: '/wetter_back_2.jpg',                 text: 'Saisonale Wetterlagen für Ihren Standort.' },
]

const AGRAR_SCROLL_LOOP = [...AGRAR_SCROLL, ...AGRAR_SCROLL, ...AGRAR_SCROLL]

const AGRAR_MOBILE_ALL  = [...AGRAR_FEATURED, ...AGRAR_SCROLL.slice(0, 3)]
const AGRAR_MOBILE_LOOP = [...AGRAR_MOBILE_ALL, ...AGRAR_MOBILE_ALL, ...AGRAR_MOBILE_ALL]

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

const HERO_SLIDES = [
  {
    image: '/key_header_02.jpg',
    boxColor: '#0d1b2a',
    label: 'Wissenschaft & Innovation',
    title: (<><span className="cyan">Inspiring the next</span><br /><span className="cyan">generation </span><span className="white">of</span><br /><span className="white">young scientists</span></>),
    desc: 'Bayer und die Baylab freuen sich, Sie zu einem interaktiven Wissenschafts-Workshop in unserem Labor begrüßen zu dürfen.',
  },
  {
    image: '/Maiszuechtung-maisspitzen.jpg',
    boxColor: '#10384f',
    label: 'Standortgenaue Beratung',
    title: (<><span className="cyan">Standortgenaue</span><br /><span className="white">Beratung für</span><br /><span className="white">Ihren Betrieb</span></>),
    desc: 'Erhalten Sie personalisierte Empfehlungen basierend auf Ihrem Standort und Ihrer Kultur.',
  },
  {
    image: '/Mais.jpg',
    boxColor: '#1a3a2a',
    label: 'Ernte & Ertrag',
    title: (<><span className="cyan">Intelligente</span><br /><span className="white">Lösungen für</span><br /><span className="white">Ihre Ernte</span></>),
    desc: 'Nutzen Sie modernste Technologie für optimale Ergebnisse in der Landwirtschaft.',
  },
]

// Klon von letztem Slide vorne + Klon von erstem Slide hinten → infinite loop in beide Richtungen
// [klon_letzter, slide0, slide1, slide2, klon_erster]  →  Startposition: Index 1
const HERO_SLIDES_MOBILE = [
  HERO_SLIDES[HERO_SLIDES.length - 1],
  ...HERO_SLIDES,
  HERO_SLIDES[0],
]

const MARKT_DATA = [
  { name: 'Jonagold, 70-90mm, lose', kategorie: 'Tafeläpfel',    preis: '105,63', einheit: 'EUR/dt', trend: 'stable', change: '0,00' },
  { name: 'Conference, 65-75mm',     kategorie: 'Tafelbirnen',   preis: '145,00', einheit: 'EUR/dt', trend: 'stable', change: '0,00' },
  { name: 'Weisskohl',               kategorie: 'Gemüse',        preis: '55,00',  einheit: 'EUR/dt', trend: 'up',     change: '+6,02' },
  { name: 'Möhren',                  kategorie: 'Gemüse',        preis: '91,00',  einheit: 'EUR/dt', trend: 'up',     change: '+5,20' },
  { name: 'Porree',                  kategorie: 'Gemüse',        preis: '102,50', einheit: 'EUR/dt', trend: 'down',   change: '-18,54' },
  { name: 'Winterweizen, A-Weizen',  kategorie: 'Getreide',      preis: '198,00', einheit: 'EUR/t',  trend: 'up',     change: '+1,28' },
  { name: 'Raps, inl. Ernte',        kategorie: 'Ölsaaten',      preis: '462,75', einheit: 'EUR/t',  trend: 'down',   change: '-0,86' },
  { name: 'Braugerste',              kategorie: 'Getreide',      preis: '174,50', einheit: 'EUR/t',  trend: 'stable', change: '0,00' },
  { name: 'Körnermais, trocken',     kategorie: 'Getreide',      preis: '186,25', einheit: 'EUR/t',  trend: 'up',     change: '+2,14' },
  { name: 'Zuckerrüben',             kategorie: 'Hackfrüchte',   preis: '38,90',  einheit: 'EUR/t',  trend: 'stable', change: '0,00' },
  { name: 'Speisekartoffeln',        kategorie: 'Hackfrüchte',   preis: '215,00', einheit: 'EUR/dt', trend: 'down',   change: '-3,37' },
  { name: 'Rotkohl',                 kategorie: 'Gemüse',        preis: '49,50',  einheit: 'EUR/dt', trend: 'up',     change: '+4,21' },
]
const MARKT_LOOP = [...MARKT_DATA, ...MARKT_DATA]

const ADVISORS = [
  '/selmayer_portrait.png',
  '/Berater1.png',
  '/Berater2.png',
  '/Berater3.png',
  '/Berater4.png',
]

const PORTRAIT_SLOTS = [
  { size: 100, z: 1 },
  { size: 136, z: 3 },
  { size: 174, z: 5 },
  { size: 136, z: 3 },
  { size: 100, z: 1 },
]

const PORTRAIT_SLOTS_MOBILE = [
  { size: 64, z: 1 },
  { size: 86, z: 3 },
  { size: 108, z: 5 },
  { size: 86, z: 3 },
  { size: 64, z: 1 },
]

const PREMEO_SLIDES = [
  {
    headline: 'Doppelte Punkte für MaisTer power Flexx und Merlin Duo Pack',
  },
  {
    headline: '222 Extra-Punkte pro Liter (= 2 €/L) für Getreidefungizide',
  },
]

const PRODUKTE_SLIDES = [
  {
    image: '/Husar_Plus.png',
    tag: 'HERBIZID',
    name: 'Husar® Plus',
    desc: 'Herbizid zur Bekämpfung von Gemeinem Windhalm, Weidelgras-Arten, Rispen-Arten und einjährigen zweikeimblättrigen Unkräutern in Wintergetreide (Winterweichweizen, -triticale, -roggen und Dinkel) und Sommergetreide (Sommerweichweizen, -gerste und -hartweizen)',
    bonus: true,
    color: '#e85d1a',
  },
  {
    image: '/Prosaro.png',
    tag: 'FUNGIZID',
    name: 'Prosaro®',
    desc: 'Fungizid gegen pilzliche Krankheiten in Getreide, Raps und Mais',
    bonus: false,
    color: '#2e7d32',
  },
  {
    image: '/Movento.png',
    tag: 'INSEKTIZID',
    name: 'Movento® SC 100',
    desc: 'Insektizid/Akarizid zur Bekämpfung von Erdbeermilben an Erdbeeren und div. Gemüsekulturen im Gewächshaus',
    bonus: false,
    color: '#1565c0',
  },
  {
    image: '/Adengo.png',
    tag: 'HERBIZID',
    name: 'Adengo®',
    desc: 'Herbizid zur Bekämpfung von Einjährigen ein- und zweikeimblättrigen Unkräutern in Mais im Vorauflauf bzw. frühen Nachauflauf sowie in Baumschulgehölzpflanzen',
    bonus: false,
    color: '#e85d1a',
  },
]

function ProdukteSlider() {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)
  const slide = PRODUKTE_SLIDES[active]

  const goTo = (i) => {
    setDir(i > active ? 1 : -1)
    setActive(i)
  }

  const prev = () => goTo((active - 1 + PRODUKTE_SLIDES.length) % PRODUKTE_SLIDES.length)
  const next = () => goTo((active + 1) % PRODUKTE_SLIDES.length)

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => {
      setDir(1)
      setActive(a => (a + 1) % PRODUKTE_SLIDES.length)
    }, 5000)
    return () => clearTimeout(id)
  }, [active, paused])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <section className="produkte-fokus-section">
      <PageHeader highlight="Produkte" title="im Fokus" variant="produkte" />
      <div
        className="produkte-fokus-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button className="produkte-fokus-nav produkte-fokus-nav--prev" onClick={prev} aria-label="Vorheriges Produkt">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M14 4L7 11L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Circles + Product Image */}
        <div className="produkte-fokus-visual">
          <div className="produkte-fokus-ring produkte-fokus-ring--pulse3" />
          <div className="produkte-fokus-ring produkte-fokus-ring--outer" />
          <div className="produkte-fokus-ring produkte-fokus-ring--inner" />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.img
              key={active + '-img'}
              src={slide.image}
              alt={slide.name}
              className="produkte-fokus-product-img"
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.38, ease: [0.32, 0, 0.18, 1] }}
            />
          </AnimatePresence>
          {slide.bonus && (
            <img src="/icons_bonus.svg" alt="Bonus" className="produkte-fokus-bonus" />
          )}
        </div>

        {/* Info Panel */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={active + '-info'}
            className="produkte-fokus-info"
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.38, ease: [0.32, 0, 0.18, 1] }}
          >
            <Label color={slide.color}>{slide.tag}</Label>
            <h3 className="produkte-fokus-name" style={{ color: slide.color }}>
              {slide.name.includes('®')
                ? <>{slide.name.split('®')[0]}<sup>®</sup>{slide.name.split('®')[1]}</>
                : slide.name}
            </h3>
            <p className="produkte-fokus-desc">{slide.desc}</p>
            <Button variant="produkte" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>ZUM PRODUKT</Button>
          </motion.div>
        </AnimatePresence>

        <button className="produkte-fokus-nav produkte-fokus-nav--next" onClick={next} aria-label="Nächstes Produkt">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M8 4L15 11L8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Dots */}
      <div className="produkte-fokus-dots">
        {PRODUKTE_SLIDES.map((_, i) => (
          <span
            key={i}
            className={`produkte-fokus-dot${i === active ? ' produkte-fokus-dot--active' : ''}`}
            style={i === active ? { animationPlayState: paused ? 'paused' : 'running' } : {}}
            onClick={() => goTo(i)}
          >
            {i === active && <span key={active} className="produkte-fokus-dot-progress" style={{ animationPlayState: paused ? 'paused' : 'running' }} />}
          </span>
        ))}
      </div>
    </section>
  )
}

function Home() {
  const navigate = useNavigate()
  const [plz, setPlz] = useState(() => sessionStorage.getItem('nav_plz') || '')
  const [premeoIdx, setPremeoIdx] = useState(0)
  const [heroCount, setHeroCount] = useState(0)
  const [heroDir, setHeroDir]     = useState(1) // 1 = vorwärts, -1 = rückwärts
  const heroIdx = heroCount % HERO_SLIDES.length

  // Mobile infinite-loop: separater Track-Index
  // Track: [klon_letzter, slide0, slide1, slide2, klon_erster]
  // Reale Slides: Index 1..3 → Startposition: 1
  const [mobileTrackIdx, setMobileTrackIdx] = useState(1)
  const [mobileAnimated, setMobileAnimated] = useState(true)
  const prevHeroCountRef = useRef(0)
  const TICKER_H = 28

  const heroTouchStartX = useRef(null)
  const heroTouchStartY = useRef(null)

  function handleHeroTouchStart(e) {
    heroTouchStartX.current = e.touches[0].clientX
    heroTouchStartY.current = e.touches[0].clientY
  }
  function handleHeroTouchEnd(e) {
    if (heroTouchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - heroTouchStartX.current
    const dy = e.changedTouches[0].clientY - heroTouchStartY.current
    heroTouchStartX.current = null
    heroTouchStartY.current = null
    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 50) return // vertikal oder zu kurz → ignorieren
    if (dx < 0) { setHeroDir(1);  setHeroCount(c => c + 1) }                          // links → nächste
    else        { setHeroDir(-1); setHeroCount(c => c + HERO_SLIDES.length - 1) }     // rechts → vorherige
    startHeroTimer() // Timer nach manuellem Swipe neu starten
  }

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setPremeoIdx(i => (i + 1) % PREMEO_SLIDES.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const heroIntervalRef = useRef(null)
  function startHeroTimer() {
    if (heroIntervalRef.current) clearInterval(heroIntervalRef.current)
    heroIntervalRef.current = setInterval(() => {
      setHeroDir(1)
      setHeroCount(c => c + 1)
    }, 9000)
  }
  useEffect(() => {
    startHeroTimer()
    return () => clearInterval(heroIntervalRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync mobileTrackIdx mit heroCount (infinite loop in beide Richtungen)
  useEffect(() => {
    if (heroCount === prevHeroCountRef.current) return
    prevHeroCountRef.current = heroCount
    setMobileAnimated(true)
    if (heroDir === 1) {
      // Vorwärts: +1, max = letzter Klon (Index 4)
      setMobileTrackIdx(idx => Math.min(idx + 1, HERO_SLIDES_MOBILE.length - 1))
    } else {
      // Rückwärts: -1, min = vorderer Klon (Index 0)
      setMobileTrackIdx(idx => Math.max(idx - 1, 0))
    }
  }, [heroCount]) // eslint-disable-line react-hooks/exhaustive-deps

  const heroImgRef = useRef(null)

  useEffect(() => {
    let targetX = 0, targetY = 0
    let currentX = 0, currentY = 0
    let rafId

    const handleMouseMove = (e) => {
      const { innerWidth: w, innerHeight: h } = window
      targetX = (e.clientX / w - 0.5) * 30
      targetY = (e.clientY / h - 0.5) * 20
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.05
      currentY += (targetY - currentY) * 0.05
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.08)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafId = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const parallaxRefs = useRef([])
  const ctaDecoRef = useRef(null)
  const ctaDecoBrRef = useRef(null)
  const ctaRowRef = useRef(null)
  const [stickyBar, setStickyBar] = useState(false)
  const [pillWidth, setPillWidth] = useState(null)
  const lastScrollY = useRef(0)
  const pastCtaRow  = useRef(false)

  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    // Mobile: Wetter(0) langsam, Premeo(2) mittel, Termine(1) schnell
    const speeds  = isMobile ? [0.08, 0.22, 0.12] : [0.05, 0.16, 0.28]
    const offsets = isMobile ? [0,    0,    0]     : [0,    0,    -80]
    const handleScroll = () => {
      parallaxRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2 - window.innerHeight / 2
        el.style.transform = `translateY(${offsets[i] + center * speeds[i]}px)`
      })
      if (ctaDecoRef.current) {
        ctaDecoRef.current.style.transform = `translateY(${window.scrollY * 0.2}px)`
      }
      if (ctaDecoBrRef.current) {
        ctaDecoBrRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`
      }
      if (ctaRowRef.current) {
        const r = ctaRowRef.current.getBoundingClientRect()
        pastCtaRow.current = r.bottom < 0
      }
      const pill = document.querySelector('.nav-pill')
      if (pill) setPillWidth(pill.offsetWidth)

      const scrollingDown = window.scrollY > lastScrollY.current
      lastScrollY.current = window.scrollY
      setStickyBar(pastCtaRow.current && scrollingDown)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [kultur, setKultur] = useState(() => sessionStorage.getItem('nav_kultur') || '')
  const [portraitRot, setPortraitRot] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setPortraitRot(r => (r + 1) % ADVISORS.length), 2500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    sessionStorage.setItem('nav_plz', plz)
    sessionStorage.setItem('nav_kultur', kultur)
    window.dispatchEvent(new CustomEvent('nav-context-update', { detail: { plz, kultur } }))
  }, [plz, kultur])

  function handlePlzChange(e) {
    setPlz(e.target.value.replace(/\D/g, '').slice(0, 5))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (plz.length !== 5 || !kultur) return
    navigate('/beratung', { state: { plz, kultur } })
  }

  const canSubmit = plz.length === 5 && kultur !== ''

  const themenScrollRef = useRef(null)
  const scrollAnimRef = useRef(null)

  const scrollThemen = useCallback((dir) => {
    const el = themenScrollRef.current
    if (!el) return

    if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current)

    const card = el.querySelector('.themen-card')
    const step = card ? card.offsetWidth + 24 : 360
    const start = el.scrollLeft
    const target = Math.max(0, Math.min(start + dir * step, el.scrollWidth - el.clientWidth))
    const duration = 1200
    const startTime = performance.now()

    // disable snap while animating
    el.style.scrollSnapType = 'none'

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = easeOutQuart(Math.min(elapsed / duration, 1))
      el.scrollLeft = start + (target - start) * progress
      if (progress < 1) {
        scrollAnimRef.current = requestAnimationFrame(tick)
      } else {
        el.style.scrollSnapType = ''
      }
    }

    scrollAnimRef.current = requestAnimationFrame(tick)
  }, [])

  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 })

  const [agrFeatIdx, setAgrFeatIdx] = useState(0)
  const [agrPaused,  setAgrPaused]  = useState(false)
  const agrPausedRef = useRef(false)

  const toggleAgrPause = useCallback(() => {
    agrPausedRef.current = !agrPausedRef.current
    setAgrPaused(p => !p)
  }, [])

  // Transform-based infinite carousel – no scroll API, no scrollend dependency
  const getFeatStep    = () => window.innerWidth * 0.64 - 12 + 20   // cardWidth + gap
  const getFeatPadding = () => window.innerWidth * 0.18

  const agrAbsPosRef  = useRef(AGRAR_FEATURED.length)  // start at middle copy
  const featXMotion   = useMotionValue(
    -(AGRAR_FEATURED.length * (window.innerWidth * 0.64 - 12 + 20)) + window.innerWidth * 0.18
  )

  const advanceFeat = useCallback(() => {
    const step    = getFeatStep()
    const padding = getFeatPadding()
    let pos = agrAbsPosRef.current

    // If approaching end of 3-copy array, silently jump back to middle copy
    if (pos >= AGRAR_FEATURED.length * 2) {
      pos -= AGRAR_FEATURED.length
      agrAbsPosRef.current = pos
      featXMotion.set(-(pos * step) + padding)  // instant, no animation
    }

    pos += 1
    agrAbsPosRef.current = pos
    animate(featXMotion, -(pos * step) + padding, { duration: 0.7, ease: [0.32, 0, 0.18, 1] })
    setAgrFeatIdx(pos % AGRAR_FEATURED.length)
  }, [featXMotion])

  const jumpToFeat = useCallback((idx) => {
    const step    = getFeatStep()
    const padding = getFeatPadding()
    const pos     = AGRAR_FEATURED.length + idx   // always target middle copy
    agrAbsPosRef.current = pos
    animate(featXMotion, -(pos * step) + padding, { duration: 0.7, ease: [0.32, 0, 0.18, 1] })
    setAgrFeatIdx(idx)
  }, [featXMotion])

  // Drag-to-scroll for featured carousel
  const featDragRef    = useRef({ dragging: false, startX: 0, startMotionX: 0 })
  const [featDragging, setFeatDragging] = useState(false)

  const snapFeat = useCallback(() => {
    const step    = getFeatStep()
    const padding = getFeatPadding()
    const n       = AGRAR_FEATURED.length
    const floatPos = -(featXMotion.get() - padding) / step
    let pos = Math.round(floatPos)

    // Wrap pos into middle copy [n, 2n) while adjusting x by the same amount
    // so the teleport is invisible (same visual card, different copy)
    let adjustedX = featXMotion.get()
    while (pos < n)      { pos += n; adjustedX -= n * step }
    while (pos >= n * 2) { pos -= n; adjustedX += n * step }

    if (adjustedX !== featXMotion.get()) featXMotion.set(adjustedX)

    agrAbsPosRef.current = pos
    animate(featXMotion, -(pos * step) + padding, { duration: 0.45, ease: [0.32, 0, 0.18, 1] })
    setAgrFeatIdx(pos % n)
  }, [featXMotion])

  const onFeatMouseDown = useCallback((e) => {
    featDragRef.current = { dragging: true, startX: e.clientX, startMotionX: featXMotion.get() }
    setFeatDragging(true)
    agrPausedRef.current = true
  }, [featXMotion])

  const onFeatMouseMove = useCallback((e) => {
    if (!featDragRef.current.dragging) return
    const delta = e.clientX - featDragRef.current.startX
    featXMotion.set(featDragRef.current.startMotionX + delta)
  }, [featXMotion])

  const onFeatMouseUp = useCallback(() => {
    if (!featDragRef.current.dragging) return
    featDragRef.current.dragging = false
    setFeatDragging(false)
    agrPausedRef.current = false
    snapFeat()
  }, [snapFeat])

  // Auto-advance every 5 s
  useEffect(() => {
    const t = setInterval(() => {
      if (!agrPausedRef.current) advanceFeat()
    }, 5000)
    return () => clearInterval(t)
  }, [advanceFeat])

  // ── Mobile Agrar Slider (motion-value, infinite loop, Touch-Swipe) ──
  const MOB_N             = AGRAR_MOBILE_ALL.length   // 6
  // Dimensionen werden einmalig nach dem Mount gemessen (useLayoutEffect),
  // damit step und padding immer konsistent sind.
  const mobStepRef        = useRef(window.innerWidth * 0.76 + 14)
  const mobPaddingRef     = useRef(window.innerWidth * 0.12)
  const getMobStep        = () => mobStepRef.current
  const getMobPadding     = () => mobPaddingRef.current
  const [mobIdx, setMobIdx]         = useState(0)
  const mobPausedRef                = useRef(false)
  const mobAbsPosRef                = useRef(MOB_N)   // starte in mittlerer Kopie
  const mobXMotion                  = useMotionValue(
    -(MOB_N * (window.innerWidth * 0.76 + 14)) + window.innerWidth * 0.12
  )
  const mobDragRef                  = useRef({ dragging: false, startX: 0, startY: 0, startMX: 0, isHorizontal: null })
  const [mobDragging, setMobDragging] = useState(false)
  const mobWrapRef                  = useRef(null)

  // Exakte Dimensionen nach DOM-Layout messen und initiale Position korrigieren
  useLayoutEffect(() => {
    const w = window.innerWidth
    mobStepRef.current    = w * 0.76 + 14
    mobPaddingRef.current = w * 0.12
    mobXMotion.set(-(MOB_N * mobStepRef.current) + mobPaddingRef.current)
  }, [mobXMotion])

  const snapMob = useCallback(() => {
    const step    = getMobStep()
    const padding = getMobPadding()
    const floatPos = -(mobXMotion.get() - padding) / step
    let pos = Math.round(floatPos)
    // Stiller Sprung in die mittlere Kopie, damit Loop unendlich wirkt
    let adjX = mobXMotion.get()
    while (pos < MOB_N)         { pos += MOB_N; adjX -= MOB_N * step }
    while (pos >= MOB_N * 2)    { pos -= MOB_N; adjX += MOB_N * step }
    if (adjX !== mobXMotion.get()) mobXMotion.set(adjX)
    mobAbsPosRef.current = pos
    animate(mobXMotion, -(pos * step) + padding, { duration: 0.45, ease: [0.32, 0, 0.18, 1] })
    setMobIdx(pos % MOB_N)
  }, [mobXMotion])

  const jumpToMob = useCallback((idx) => {
    const step    = getMobStep()
    const padding = getMobPadding()
    const pos     = MOB_N + idx   // immer mittlere Kopie
    mobAbsPosRef.current = pos
    animate(mobXMotion, -(pos * step) + padding, { duration: 0.7, ease: [0.32, 0, 0.18, 1] })
    setMobIdx(idx)
  }, [mobXMotion])

  const advanceMob = useCallback(() => {
    const step    = getMobStep()
    const padding = getMobPadding()
    let pos = mobAbsPosRef.current
    if (pos >= MOB_N * 2) { pos -= MOB_N; mobAbsPosRef.current = pos; mobXMotion.set(-(pos * step) + padding) }
    pos += 1
    mobAbsPosRef.current = pos
    animate(mobXMotion, -(pos * step) + padding, { duration: 0.7, ease: [0.32, 0, 0.18, 1] })
    setMobIdx(pos % MOB_N)
  }, [mobXMotion])

  const onMobTouchStart = useCallback((e) => {
    const t = e.touches[0]
    mobDragRef.current = { dragging: true, startX: t.clientX, startY: t.clientY, startMX: mobXMotion.get(), isHorizontal: null }
    setMobDragging(true)
    mobPausedRef.current = true
  }, [mobXMotion])

  const onMobTouchMove = useCallback((e) => {
    if (!mobDragRef.current.dragging) return
    const dx = e.touches[0].clientX - mobDragRef.current.startX
    const dy = e.touches[0].clientY - mobDragRef.current.startY
    // Richtung beim ersten signifikanten Move festlegen
    if (mobDragRef.current.isHorizontal === null && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      mobDragRef.current.isHorizontal = Math.abs(dx) >= Math.abs(dy)
    }
    if (!mobDragRef.current.isHorizontal) return
    e.preventDefault()
    mobXMotion.set(mobDragRef.current.startMX + dx)
  }, [mobXMotion])

  const onMobTouchEnd = useCallback(() => {
    if (!mobDragRef.current.dragging) return
    mobDragRef.current.dragging = false
    setMobDragging(false)
    mobPausedRef.current = false
    // Nur snappen wenn horizontal gewischt wurde (oder kurzer Tap)
    if (mobDragRef.current.isHorizontal !== false) snapMob()
  }, [snapMob])

  // Native Event Listener (passive:false) – damit preventDefault() im Move funktioniert
  useEffect(() => {
    const el = mobWrapRef.current
    if (!el) return
    el.addEventListener('touchstart', onMobTouchStart, { passive: true })
    el.addEventListener('touchmove',  onMobTouchMove,  { passive: false })
    el.addEventListener('touchend',   onMobTouchEnd,   { passive: true })
    return () => {
      el.removeEventListener('touchstart', onMobTouchStart)
      el.removeEventListener('touchmove',  onMobTouchMove)
      el.removeEventListener('touchend',   onMobTouchEnd)
    }
  }, [onMobTouchStart, onMobTouchMove, onMobTouchEnd])

  useEffect(() => {
    const t = setInterval(() => { if (!mobPausedRef.current) advanceMob() }, 5000)
    return () => clearInterval(t)
  }, [advanceMob])


  const sloganRef = useRef(null)
  const { scrollYProgress: sloganProgress } = useScroll({
    target: sloganRef,
    offset: ['start end', 'end start'],
  })

  // Desktop: originale Entrance-Animation (2 Zeilen)
  const sloganEntrance = useMotionValue(0)
  // Mobile: 4 individuelle Entrance-Animationen mit unterschiedlichen Geschwindigkeiten
  const sloganEnt1 = useMotionValue(0)
  const sloganEnt2 = useMotionValue(0)
  const sloganEnt3 = useMotionValue(0)
  const sloganEnt4 = useMotionValue(0)
  const sloganInView = useInView(sloganRef, { once: true, amount: 0.35 })
  useEffect(() => {
    if (sloganInView) {
      animate(sloganEntrance, 1, { duration: 0.9, ease: [0.32, 0, 0.18, 1] })
      animate(sloganEnt1, 1, { duration: 0.7,  ease: [0.32, 0, 0.18, 1] })
      animate(sloganEnt2, 1, { duration: 1.05, delay: 0.1,  ease: [0.32, 0, 0.18, 1] })
      animate(sloganEnt3, 1, { duration: 0.85, ease: [0.32, 0, 0.18, 1] })
      animate(sloganEnt4, 1, { duration: 1.2,  delay: 0.15, ease: [0.32, 0, 0.18, 1] })
    }
  }, [sloganInView, sloganEntrance, sloganEnt1, sloganEnt2, sloganEnt3, sloganEnt4])

  // Desktop: original links/rechts
  const sloganLeftX  = useTransform([sloganEntrance, sloganProgress], ([ent, prog]) => (1 - ent) * -120 + (-60 + 120 * prog))
  const sloganRightX = useTransform([sloganEntrance, sloganProgress], ([ent, prog]) => (1 - ent) *  120 + ( 60 - 120 * prog))

  // Mobile: 4 Zeilen mit unterschiedlicher Geschwindigkeit
  const sloganLine1X = useTransform([sloganEnt1, sloganProgress], ([ent, prog]) => (1 - ent) * -280 + (-120 + 240 * prog))
  const sloganLine2X = useTransform([sloganEnt2, sloganProgress], ([ent, prog]) => (1 - ent) * -100 + (-45 +  90 * prog))
  const sloganLine3X = useTransform([sloganEnt3, sloganProgress], ([ent, prog]) => (1 - ent) *  130 + ( 55 - 110 * prog))
  const sloganLine4X = useTransform([sloganEnt4, sloganProgress], ([ent, prog]) => (1 - ent) *  160 + ( 70 - 140 * prog))

  // Opacity: fade-in mit Entrance, fade-out beim Scroll-Exit
  const sloganOpacity = useTransform(
    [sloganEntrance, sloganProgress],
    ([ent, prog]) => Math.min(ent, prog > 0.75 ? Math.max(0, 1 - (prog - 0.75) / 0.25) : 1)
  )

  // Hintergrund-Overlay: faded erst wenn Text weg ist (ab 0.88), fertig bei 0.97
  const sloganBgOpacity = useTransform(sloganProgress, [0.62, 0.85], [0, 1])

  const onDragStart = useCallback((e) => {
    const el = themenScrollRef.current
    if (!el) return
    dragState.current = { active: true, startX: e.pageX, scrollLeft: el.scrollLeft }
    el.classList.add('is-dragging')
  }, [])

  const onDragMove = useCallback((e) => {
    if (!dragState.current.active || !themenScrollRef.current) return
    e.preventDefault()
    const dx = e.pageX - dragState.current.startX
    themenScrollRef.current.scrollLeft = dragState.current.scrollLeft - dx
  }, [])

  const onDragEnd = useCallback(() => {
    dragState.current.active = false
    themenScrollRef.current?.classList.remove('is-dragging')
  }, [])

  // Markt-Ticker Touch-Swipe
  const marktTrackRef = useRef(null)
  const marktTouch    = useRef({ active: false, startX: 0, startTranslate: 0 })

  const onMarktTouchStart = useCallback((e) => {
    const el = marktTrackRef.current
    if (!el) return
    const matrix = new DOMMatrix(getComputedStyle(el).transform)
    const currentX = matrix.m41
    el.style.animation = 'none'
    el.style.transform = `translateX(${currentX}px)`
    marktTouch.current = { active: true, startX: e.touches[0].clientX, startTranslate: currentX }
  }, [])

  const onMarktTouchMove = useCallback((e) => {
    if (!marktTouch.current.active) return
    const el = marktTrackRef.current
    if (!el) return
    const delta = e.touches[0].clientX - marktTouch.current.startX
    el.style.transform = `translateX(${marktTouch.current.startTranslate + delta}px)`
  }, [])

  const onMarktTouchEnd = useCallback(() => {
    const el = marktTrackRef.current
    if (!el || !marktTouch.current.active) return
    marktTouch.current.active = false
    const match = el.style.transform.match(/-?[\d.]+/)
    const currentX = match ? parseFloat(match[0]) : 0
    const halfWidth = el.scrollWidth / 2
    let normalized = ((currentX % halfWidth) - halfWidth) % (-halfWidth)
    if (normalized > 0) normalized -= halfWidth
    const delay = (normalized / halfWidth) * 60
    el.style.transform = ''
    el.style.animation = `markt-scroll 60s linear ${delay}s infinite`
  }, [])

  return (
    <>
      <MainNav />

      {/* Sticky Beratungs-Bar */}
      <AnimatePresence>
        {stickyBar && (
          <div className="cta-sticky-wrapper">
          <motion.div
            className="cta-sticky-glass"
            style={pillWidth && window.innerWidth > 768 ? { width: pillWidth } : {}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="cta-sticky-inner">
              <select
                className="sub-nav-kultur-select flex-1"
                value={kultur}
                onChange={e => setKultur(e.target.value)}
              >
                <option value="" disabled>Kultur wählen</option>
                {KULTUREN.map(k => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
              <div className="pill flex-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
                </svg>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="PLZ"
                  value={plz}
                  onChange={handlePlzChange}
                  maxLength={5}
                  autoComplete="postal-code"
                  className="bg-transparent border-none outline-none text-[#333] placeholder-[#aaa] min-w-0 w-full"
                />
              </div>
              <motion.button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={[
                  'home-cta-circle-btn',
                  'bg-gradient-to-r from-[#10384f] to-[#00617f]',
                  canSubmit ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed',
                ].join(' ')}
                whileHover={canSubmit ? { scale: 1.08, boxShadow: '0 10px 32px rgba(0,97,127,0.5)' } : {}}
                whileTap={canSubmit ? { scale: 0.94 } : {}}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="hero" onTouchStart={handleHeroTouchStart} onTouchEnd={handleHeroTouchEnd}>

        {/* Parallax-Wrapper für Maus-Effekt */}
        <div ref={heroImgRef} className="hero-parallax-wrap" style={isMobile ? { background: HERO_SLIDES[heroIdx].boxColor } : {}}>
          <AnimatePresence mode="sync">
            <motion.img
              key={heroIdx}
              src={HERO_SLIDES[heroIdx].image}
              alt=""
              className="hero-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6 }}
            />
          </AnimatePresence>
        </div>

        {/* Box-Slider */}
        <div className="hero-box-wrap" style={isMobile ? { background: HERO_SLIDES[heroIdx].boxColor } : {}}>
          <div className="hero-box-clip-outer">
            {isMobile ? (
              /* Mobile: Track-Slider – infinite loop mit Klon von Slide 0 am Ende */
              <motion.div
                className="hero-box-track"
                animate={{ x: `-${(mobileTrackIdx / HERO_SLIDES_MOBILE.length) * 100}%` }}
                transition={mobileAnimated ? { duration: 1.0, ease: [0.32, 0, 0.18, 1] } : { duration: 0 }}
                onAnimationComplete={() => {
                  if (mobileTrackIdx === HERO_SLIDES_MOBILE.length - 1) {
                    // Klon von Slide 1 am Ende → snap zu realem Slide 1 (Index 1)
                    setMobileAnimated(false)
                    setMobileTrackIdx(1)
                  } else if (mobileTrackIdx === 0) {
                    // Klon von letztem Slide vorne → snap zu realem letzten Slide (Index 3)
                    setMobileAnimated(false)
                    setMobileTrackIdx(HERO_SLIDES.length)
                  }
                }}
              >
                {HERO_SLIDES_MOBILE.map((slide, i) => (
                  <div key={i} className="hero-box" style={{ background: slide.boxColor }}>
                    <h1>{slide.title}</h1>
                    <p>{slide.desc}</p>
                    <div className="hero-buttons">
                      <Button href="/beratung-start" variant="primary">MEINE Produkt BERATUNG</Button>
                      <Button href="/beratung" variant="secondary">MEHR ERFAHREN</Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              /* Desktop: original AnimatePresence */
              <AnimatePresence mode="wait" custom={heroDir}>
                <motion.div
                  key={heroIdx}
                  custom={heroDir}
                  className="hero-box"
                  style={{ background: HERO_SLIDES[heroIdx].boxColor }}
                  variants={{
                    enter:  { y: '100%', opacity: 0 },
                    center: { y: 0, opacity: 1 },
                    exit:   { y: '-100%', opacity: 0 },
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 1.0, ease: [0.32, 0, 0.18, 1] }}
                >
                  <h1>{HERO_SLIDES[heroIdx].title}</h1>
                  <p>{HERO_SLIDES[heroIdx].desc}</p>
                  <div className="hero-buttons">
                    <Button href="/beratung-start" variant="primary">MEINE Produkt BERATUNG</Button>
                    <Button href="/beratung" variant="secondary">MEHR ERFAHREN</Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Dots */}
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === heroIdx ? ' hero-dot-active' : ''}`}
              onClick={() => {
                setHeroDir(i > heroIdx ? 1 : -1)
                setHeroCount(c => c + ((i - (c % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length) || HERO_SLIDES.length)
              }}
            />
          ))}
        </div>

        {/* SVG Overlay – Basis (immer sichtbar, gedimmt) */}
        <img src="/code_3.svg" alt="" className="hero-code-svg hero-code-base" />
        {/* SVG Overlay – Fortschritts-Füllung (9 s, reset pro Folie) */}
        <img key={heroIdx} src="/code_3.svg" alt="" className="hero-code-svg hero-code-fill" />

        {/* Vertikaler Label-Ticker */}
        <div className="hero-ticker-viewport">
          <motion.div
            className="hero-ticker-track"
            animate={{ y: TICKER_H - heroCount * TICKER_H }}
            transition={{ duration: 1.0, ease: [0.32, 0, 0.18, 1] }}
          >
            {Array.from({ length: heroCount + 3 }, (_, i) => {
              const slideIdx = i % HERO_SLIDES.length
              const isActive = i === heroCount
              const isVisible = i >= heroCount - 1 && i <= heroCount + 1
              return (
                <p
                  key={i}
                  className={isActive ? 'hero-ticker-active' : 'hero-ticker-dim'}
                  style={{ opacity: isVisible ? (isActive ? 1 : 0.35) : 0 }}
                >
                  {HERO_SLIDES[slideIdx].label}
                </p>
              )
            })}
          </motion.div>
        </div>

      </section>

      {/* Gradient-Wrapper: Meine Beratung + Kacheln + Slogan */}
      <div className="dark-gradient-wrap">

        {/* Deko-SVGs – außerhalb der Sektionen damit kein clip */}
        <img ref={ctaDecoRef}   src="/code_2.svg" alt="" className="cta-deco-tl-wrap" />
        <img ref={ctaDecoBrRef} src="/code_1.svg" alt="" className="cta-deco-br-wrap" />

      {/* Beratungs-Einstieg */}
      <section className="home-cta">

        {/* Scroll Down */}
        <div className="home-cta-scroll-hint">
          <span className="home-cta-scroll-label">Scroll Down</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <motion.p
          className="home-cta-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        ><span className="home-cta-title-meine">Meine</span> <span className="home-cta-title-beratung">Beratung</span></motion.p>

        {/* Berater-Portraits */}
        <motion.div
          className="home-cta-portraits"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.18 }}
        >
          {ADVISORS
            .map((src, j) => ({
              src,
              j,
              slotIdx: (j - portraitRot + ADVISORS.length) % ADVISORS.length,
            }))
            .sort((a, b) => a.slotIdx - b.slotIdx)
            .map((p) => {
              const isMob = typeof window !== 'undefined' && window.innerWidth <= 768
              const slot = (isMob ? PORTRAIT_SLOTS_MOBILE : PORTRAIT_SLOTS)[p.slotIdx]
              const overlap = isMob ? -32 : -40
              return (
                <motion.div
                  key={p.j}
                  layoutId={`portrait-${p.j}`}
                  layout
                  animate={{ width: slot.size, height: slot.size }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  className="home-cta-portrait"
                  style={{ zIndex: slot.z, marginLeft: p.slotIdx === 0 ? 0 : overlap }}
                >
                  <img src={p.src} alt={`Berater ${p.j + 1}`} />
                </motion.div>
              )
            })}
        </motion.div>

        <motion.p
          className="home-cta-subtitle"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 }}
        >Erhalten Sie eine personalisierte saisonale Produktberatung mit Einsatzstartegie - von ihrem regionalen Vertriebsberater</motion.p>

        <motion.div
          ref={ctaRowRef}
          className="home-cta-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.24 }}
        >

          {/* Kultur */}
          <select
            className="sub-nav-kultur-select !text-xl !py-4 !pl-7 !pr-12 flex-1"
            value={kultur}
            onChange={e => setKultur(e.target.value)}
          >
            <option value="" disabled>Kultur wählen</option>
            {KULTUREN.map(k => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </select>

          {/* PLZ */}
          <div className="pill !text-xl !py-4 !px-7 !gap-3 flex-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
            </svg>
            <input
              type="text"
              inputMode="numeric"
              placeholder="PLZ"
              value={plz}
              onChange={handlePlzChange}
              maxLength={5}
              autoComplete="postal-code"
              className="bg-transparent border-none outline-none text-xl text-white placeholder-[rgba(255,255,255,0.5)] flex-1 min-w-0"
            />
          </div>

          {/* Weiter – Kreis mit Pfeil */}
          <motion.button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={[
              'home-cta-circle-btn',
              'bg-gradient-to-r from-[#10384f] to-[#00617f]',
              canSubmit ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed',
            ].join(' ')}
            whileHover={canSubmit ? { scale: 1.08, boxShadow: '0 10px 32px rgba(0,97,127,0.5)' } : {}}
            whileTap={canSubmit ? { scale: 0.94 } : {}}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </motion.button>

        </motion.div>

        <p className="home-cta-hint">
          Erhalten Sie eine personalisierte saisonale Produktberatung mit Einsatzstartegie.
        </p>

      </section>

      {/* Kachel-Grid */}
      <section className="tile-grid-section">
        <div className="tile-grid">

          {/* Linke Spalte */}
          <div className="tile-col-left">

            {/* Wetter */}
            <div ref={el => parallaxRefs.current[0] = el} style={{ willChange: 'transform' }}>
              <TileCard
                className="tile-premeo"
                image="wetter_back_2.jpg"
                title="Wetter"
                sub="Aktuelles Wetter für Ihren Standort"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                header={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 615.12 723.89" style={{ position: 'absolute', bottom: '-5%', right: '-8%', width: '70%', height: 'auto', opacity: 0.35, pointerEvents: 'none' }}>
                    <path fill="none" stroke="white" strokeWidth="1" d="M396.92,484c-27.59,0-51.43,19.3-57.17,46.3l-39.96,187.99h36.47c27.6,0,51.45-19.3,57.19-46.3l39.95-187.99h-36.48Z"/>
                    <path fill="none" stroke="white" strokeWidth="1" d="M128.41,366.99c-27.6,0-51.44,19.3-57.17,46.3L6.41,718.29h36.46c27.61,0,51.45-19.3,57.2-46.3l64.82-305h-36.48Z"/>
                    <path fill="none" stroke="white" strokeWidth="1" d="M568.53,366.99c-27.59,0-51.44,19.3-57.17,46.3l-64.83,305h36.46c27.61,0,51.46-19.3,57.19-46.3l64.82-305h-36.47Z"/>
                    <path fill="none" stroke="white" strokeWidth="1" d="M300.06,249.74c-27.59,0-51.43,19.3-57.18,46.3l-39.95,188.01h36.47c27.6,0,51.44-19.32,57.19-46.31l39.94-188h-36.47Z"/>
                    <path fill="none" stroke="white" strokeWidth="1" d="M532.96,15.64c-52-3-87.98,19.62-93.64,46.31l-64.83,305.01h36.47c27.6,0,51.45-19.32,57.19-46.31L532.96,15.64"/>
                  </svg>
                }
              />
            </div>

            {/* Termine */}
            <div ref={el => parallaxRefs.current[1] = el} style={{ willChange: 'transform' }}>
              <TileCard
                className="tile-termine"
                image="/image_beratung.jpg"
                title="Termine"
                sub="Alle Termine im Überblick"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              />
            </div>

          </div>

          {/* Rechte Spalte – Premeo */}
          <div ref={el => parallaxRefs.current[2] = el} style={{ willChange: 'transform' }}>
          <TileCard
            className="tile-premeo-card"
            image="premeo_back_1.jpg"
            title="Premeo"
            titleClassName="premeo-title-abs"
            sub="Alle Aktionen"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            header={
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 495.64" style={{ position: 'absolute', bottom: '-5%', right: '-8%', width: '70%', height: 'auto', opacity: 0.12, pointerEvents: 'none' }}>
                  <path fill="none" stroke="white" strokeWidth="1" d="M142.02,9.9c-37.09.62-68.97,26.78-76.69,63.21L10.78,329.71h49.76c37.69,0,70.24-26.36,78.06-63.2L193.13,9.9h-51.11Z"/>
                  <path fill="none" stroke="white" strokeWidth="1" d="M342.06,9.9c-37.09.62-68.95,26.78-76.69,63.21l-88.49,416.32h49.76c37.69,0,70.24-26.37,78.07-63.21L393.19,9.9h-51.13Z"/>
                </svg>
                <div className="premeo-logo-tr">
                  <svg viewBox="0 0 1000 1000" height="72" xmlns="http://www.w3.org/2000/svg">
                    <path fill="white" d="M229.4,516.6h-18.2v36.2h19.2c6.3,0.5,12.6-1.1,17.9-4.7c4.1-3.6,6.2-8.8,5.8-14.2C254.1,522.3,245.8,516.6,229.4,516.6"/>
                    <path fill="white" d="M245.6,489.5c3.8-2.9,5.8-7.5,5.4-12.2c0.4-4.6-1.9-9-5.8-11.4c-5.8-2.7-12.1-3.9-18.5-3.5h-15.5v30.8h17.1C234.3,493.7,240.3,492.4,245.6,489.5"/>
                    <path fill="white" d="M370.5,460.6c-10.2-0.7-20.1,3.7-26.5,11.8c-11.9,21.8-11.9,48.2-0.1,70.1c6.3,8.1,16.2,12.5,26.4,11.8c23.5,0,35.2-15.6,35.2-46.8C405.5,476.3,393.8,460.6,370.5,460.6"/>
                    <path fill="white" d="M982.7,449.5c-9.1-39.1-44-66.8-84.2-66.8H99.5c-47.7,0-86.4,38.7-86.4,86.4v75.6c0,47.7,38.7,86.4,86.4,86.4h799.1c47.7,0,86.4-38.6,86.4-86.3c0,0,0,0,0-0.1V469C985,462.5,984.3,455.9,982.7,449.5z M270.9,566.4c-10.9,7.6-24,11.4-37.2,10.6h-51.9V438.3h43.1c14.8-1.1,29.6,1.8,42.9,8.4c9,5.8,14.1,16,13.3,26.7c0.3,7.3-1.7,14.4-5.8,20.4c-3.7,5.2-9.3,8.6-15.5,9.5v0.9c7.5,1.2,14.3,5.1,19.1,11.1c4.2,6.4,6.2,13.9,5.8,21.4C285.1,548.3,280,559.4,270.9,566.4z M419.3,560.4c-12.9,12.9-30.7,19.7-49,18.5c-18.2,1.2-36.1-5.6-49-18.5c-12.3-14.9-18.4-33.9-17.1-53.1c-1.3-19.2,4.8-38.2,17.1-52.9c13-12.8,30.9-19.4,49.1-18.2c18.2-1.2,36,5.5,48.9,18.4C442,486.2,442,528.8,419.3,560.4z M586.3,577h-37.4l-60.4-104.9h-0.9c1.2,18.5,1.8,31.7,1.8,39.7V577h-26.3V438.3h37.1l60.3,103.9h0.7c-0.9-18-1.4-30.8-1.4-38.2v-65.7h26.5V577z M732.2,528c0.2,9.4-2.2,18.8-6.9,27c-4.7,7.8-11.6,14-19.9,17.8c-9.7,4.3-20.2,6.4-30.8,6.2c-15.1,0.9-30-4-41.6-13.7c-10.1-9.8-15.5-23.5-14.8-37.5v-89.4h29.3v85c-0.7,8.4,1.6,16.7,6.4,23.5c5.7,5.5,13.5,8.3,21.4,7.5c7.7,0.7,15.4-2,20.9-7.5c4.9-6.9,7.2-15.3,6.5-23.7v-84.8h29.3L732.2,528z M832.6,568.1c-10.9,7.8-24.2,11.6-37.6,10.8c-13.6,0.3-27-2.6-39.3-8.4v-27.3c7.7,3.6,15.6,6.5,23.8,8.8c5.8,1.6,11.8,2.5,17.8,2.6c5.2,0.3,10.4-1,14.9-3.7c3.5-2.5,5.5-6.7,5.2-11c0-2.6-0.8-5.1-2.3-7.3c-1.8-2.4-4.1-4.5-6.7-6.1c-5.8-3.5-11.8-6.6-18-9.4c-6.8-3-13.3-6.8-19.1-11.5c-4.2-3.6-7.6-7.9-10.2-12.8c-2.6-5.3-3.9-11.2-3.8-17.1c-0.5-11.1,4.1-21.7,12.5-28.9c9.9-7.5,22.1-11.3,34.5-10.5c7,0,13.9,0.9,20.6,2.6c7,1.9,13.9,4.3,20.5,7.2l-9.5,22.8c-6-2.5-12.1-4.7-18.4-6.4c-4.7-1.2-9.5-1.8-14.3-1.8c-4.6-0.3-9.2,1.1-12.8,3.9c-2.9,2.5-4.6,6.3-4.5,10.2c-0.1,2.4,0.6,4.7,1.8,6.8c1.5,2.2,3.5,4.1,5.7,5.6c6,3.6,12.2,6.9,18.7,9.7c10.2,4.2,19.3,10.5,26.7,18.7c4.9,6.6,7.5,14.7,7.2,22.9C846.6,550,841.6,561,832.6,568.1z"/>
                    <path fill="none" stroke="white" strokeWidth="43" d="M886.1,726.1V279.8L499.6,56.6L113,279.8v446.3l386.5,223.1L886.1,726.1z"/>
                  </svg>
                </div>
              </>
            }
          >
            {/* Text */}
            <div className="premeo-text-wrap">
              <p className="premeo-subtitle">Premeo Bonusaktion 01.03.–30.09.2026</p>
              <p key={premeoIdx} className="premeo-headline premeo-headline-fade">{PREMEO_SLIDES[premeoIdx].headline}</p>
            </div>

            {/* Nav arrows */}
            <div className="premeo-nav">
              <button className="premeo-arrow-btn" onClick={() => setPremeoIdx(i => (i - 1 + PREMEO_SLIDES.length) % PREMEO_SLIDES.length)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <button className="premeo-arrow-btn" onClick={() => setPremeoIdx(i => (i + 1) % PREMEO_SLIDES.length)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>
          </TileCard>
          </div>

        </div>
      </section>

      {/* Slogan */}
      <section className="slogan-section" ref={sloganRef}>
        <motion.div className="slogan-bg-overlay" style={{ opacity: sloganBgOpacity }} />
        {/* Desktop: 2 Zeilen original */}
        <motion.p className="slogan-line slogan-line--left  slogan-desktop" style={{ x: sloganLeftX,  opacity: sloganOpacity }}>Health for All,</motion.p>
        <motion.p className="slogan-line slogan-line--right slogan-desktop" style={{ x: sloganRightX, opacity: sloganOpacity }}>Hunger for None</motion.p>
        {/* Mobile: 4 einzeln animierte Zeilen */}
        <motion.p className="slogan-line slogan-line--left  slogan-mobile" style={{ x: sloganLine1X, opacity: sloganOpacity }}>Health</motion.p>
        <motion.p className="slogan-line slogan-line--left  slogan-mobile" style={{ x: sloganLine2X, opacity: sloganOpacity }}>for All,</motion.p>
        <motion.p className="slogan-line slogan-line--right slogan-mobile" style={{ x: sloganLine3X, opacity: sloganOpacity }}>Hunger</motion.p>
        <motion.p className="slogan-line slogan-line--right slogan-mobile" style={{ x: sloganLine4X, opacity: sloganOpacity }}>for None</motion.p>
      </section>

      </div>{/* end dark-gradient-wrap */}

      {/* Produkte im Fokus */}
      <ProdukteSlider />

      {/* Agrar Magazin – Apple TV Style */}
      <section className="agrar-section">
        <PageHeader title="Agrar" highlight="Magazin" sub="Artikel / Videos / Podcast / Märkte" variant="agrar" />

        {/* Featured Carousel – infinite loop via triple copy */}
        <div
          className="agrar-featured-wrap"
          style={{ cursor: featDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
          onMouseDown={onFeatMouseDown}
          onMouseMove={onFeatMouseMove}
          onMouseUp={onFeatMouseUp}
          onMouseLeave={onFeatMouseUp}
        >
          <motion.div className="agrar-featured" style={{ x: featXMotion }}>
            {AGRAR_LOOP.map((card, i) => (
              <Card
                key={i}
                className="agrar-card agrar-card-feat"
                image={card.image}
                icon={card.icon}
                title={card.title}
                text={card.text}
                draggable={false}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll Row – 3 static boxes */}
        <div className="agrar-scroll-wrap">
          <div className="agrar-scroll-row">
            {AGRAR_SCROLL.slice(0, 3).map((card, i) => (
              <Card
                key={i}
                as={motion.div}
                className="agrar-scroll-card"
                image={card.image}
                icon={card.icon}
                title={card.title}
                text={card.text}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.18 }}
              />
            ))}
          </div>
        </div>

        {/* Mobile Slider – motion-value, infinite loop */}
        <div
          ref={mobWrapRef}
          className="agrar-mobile-wrap"
          style={{ cursor: mobDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
        >
          <motion.div className="agrar-mobile-track" style={{ x: mobXMotion }}>
            {AGRAR_MOBILE_LOOP.map((card, i) => (
              <Card
                key={i}
                className="agrar-card agrar-mobile-card"
                image={card.image}
                icon={card.icon}
                title={card.title}
                text={card.text}
                draggable={false}
              />
            ))}
          </motion.div>
        </div>

        {/* Mobile Controls – Dots */}
        <div className="agrar-mobile-controls">
          <div className="agrar-dots">
            {AGRAR_MOBILE_ALL.map((_, i) => (
              <button
                key={i}
                className={`agrar-dot${i === mobIdx ? ' agrar-dot-active' : ''}`}
                onClick={() => jumpToMob(i)}
              >
                {i === mobIdx && <span key={mobIdx} className="agrar-dot-progress" />}
              </button>
            ))}
          </div>
        </div>

        {/* Dots + Pause-Button */}
        <div className="agrar-controls">
          <div className="agrar-dots">
            {AGRAR_FEATURED.map((_, i) => (
              <button
                key={i}
                className={`agrar-dot${i === agrFeatIdx ? ' agrar-dot-active' : ''}`}
                onClick={() => jumpToFeat(i)}
              >
                {i === agrFeatIdx && <span key={agrFeatIdx} className="agrar-dot-progress" />}
              </button>
            ))}
          </div>
          <button className="agrar-pause-btn" onClick={toggleAgrPause} aria-label={agrPaused ? 'Abspielen' : 'Pausieren'}>
            {agrPaused ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <polygon points="3,1 13,7 3,13" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="2" y="1" width="3.5" height="12" rx="1" />
                <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* Marktnotierungen Ticker */}
      <section className="markt-section">
        <div className="markt-header">
          <span className="markt-label">Stand: {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        </div>
        <div className="markt-ticker-outer">
          <div
            className="markt-ticker-track"
            ref={marktTrackRef}
            onTouchStart={onMarktTouchStart}
            onTouchMove={onMarktTouchMove}
            onTouchEnd={onMarktTouchEnd}
          >
            {MARKT_LOOP.map((item, i) => (
              <div className="markt-item" key={i}>
                <p className="markt-item-name">{item.name}</p>
                <p className="markt-item-kategorie">{item.kategorie}</p>
                <p className="markt-item-preis">
                  <span className="markt-preis-num">{item.preis}</span>
                  <span className="markt-preis-unit">{item.einheit}</span>
                </p>
                <div className="markt-item-footer">
                  <span className="markt-footer-label">Trend</span>
                  <span className={`markt-trend-arrow markt-trend-${item.trend}`}>
                    {item.trend === 'up'     && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>}
                    {item.trend === 'down'   && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>}
                    {item.trend === 'stable' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
                  </span>
                  <span className="markt-divider" />
                  <span className="markt-footer-label">+/-</span>
                  <span className={`markt-change markt-change-${item.trend}`}>{item.change} %</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themen Horizontal Scroller – hidden, replaced by agrar-section */}
      <section className="themen-section" style={{ display: 'none' }}>
        <div className="themen-header">
          <h2 className="themen-heading">
            <span className="themen-heading-agrar">Agrar</span> <span className="themen-heading-magazin">Magazin</span>
          </h2>
          <p className="themen-subline">Artikel, News, Videos und Podcast</p>
        </div>

        <div className="themen-scroll-wrap">
          <div
            className="themen-scroll"
            ref={themenScrollRef}
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
          >
            {THEMEN_CARDS.map((card, i) => (
              <div className="themen-card" key={i}>
                <img src={card.image} alt={card.title} className="themen-card-img" />
                <div className="themen-card-overlay" />
                <div className="themen-card-header">
                  <span className="themen-card-title">{card.title}</span>
                </div>
                <img src={card.icon} alt="" className="themen-card-icon" />
                <p className="themen-card-text">{card.text}</p>
                <div className="themen-card-footer">
                  <span className="themen-card-sub">{card.sub}</span>
                  <span className="themen-card-arrow">/ ›</span>
                </div>
              </div>
            ))}
          </div>

          <div className="themen-nav">
            <button className="themen-nav-btn" onClick={() => scrollThemen(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button className="themen-nav-btn" onClick={() => scrollThemen(1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Home
