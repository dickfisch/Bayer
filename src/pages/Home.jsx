import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion'
import MainNav from '../components/MainNav'
import Footer from '../components/Footer'

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
    image: '/demo_header.jpg',
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

const PREMEO_SLIDES = [
  {
    headline: 'Doppelte Punkte für MaisTer power Flexx und Merlin Duo Pack',
  },
  {
    headline: '222 Extra-Punkte pro Liter (= 2 €/L) für Getreidefungizide',
  },
]

function Home() {
  const navigate = useNavigate()
  const [plz, setPlz] = useState('')
  const [premeoIdx, setPremeoIdx] = useState(0)
  const [heroCount, setHeroCount] = useState(0)
  const heroIdx = heroCount % HERO_SLIDES.length
  const TICKER_H = 28

  useEffect(() => {
    const t = setInterval(() => {
      setPremeoIdx(i => (i + 1) % PREMEO_SLIDES.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setHeroCount(c => c + 1)
    }, 9000)
    return () => clearInterval(t)
  }, [])

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

  useEffect(() => {
    const speeds  = [0.05, 0.16, 0.28]
    const offsets = [0,    0,    -80]
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
        setStickyBar(r.bottom < 0)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const [kultur, setKultur] = useState('')

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
    const duration = 900
    const startTime = performance.now()

    // disable snap while animating
    el.style.scrollSnapType = 'none'

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
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

  // Auto-advance every 5 s
  useEffect(() => {
    const t = setInterval(() => {
      if (!agrPausedRef.current) advanceFeat()
    }, 5000)
    return () => clearInterval(t)
  }, [advanceFeat])


  const sloganRef = useRef(null)
  const { scrollYProgress: sloganProgress } = useScroll({
    target: sloganRef,
    offset: ['start end', 'end start'],
  })

  // Einmal-Entrance per IntersectionObserver (nicht scroll-getrieben)
  const sloganEntrance   = useMotionValue(0)
  const sloganInView     = useInView(sloganRef, { once: true, amount: 0.35 })
  useEffect(() => {
    if (sloganInView) animate(sloganEntrance, 1, { duration: 0.9, ease: [0.32, 0, 0.18, 1] })
  }, [sloganInView, sloganEntrance])

  // Oben: Einflug von links, ab 60% Scroll-Exit nach rechts
  const sloganLeftX = useTransform(
    [sloganEntrance, sloganProgress],
    ([ent, prog]) => (1 - ent) * -160 + (prog > 0.6 ? ((prog - 0.6) / 0.4) * 400 : 0)
  )
  // Unten: Einflug von rechts, ab 60% Scroll-Exit nach links
  const sloganRightX = useTransform(
    [sloganEntrance, sloganProgress],
    ([ent, prog]) => (1 - ent) * 160 + (prog > 0.6 ? ((prog - 0.6) / 0.4) * -400 : 0)
  )
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

  return (
    <>
      <MainNav />

      {/* Sticky Beratungs-Bar */}
      <AnimatePresence>
        {stickyBar && (
          <div className="cta-sticky-wrapper">
          <motion.div
            className="cta-sticky-glass"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="cta-sticky-inner">
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
                  className="bg-transparent border-none outline-none text-xl text-[#333] placeholder-[#aaa] min-w-0 w-full"
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
      <section className="hero">

        {/* Parallax-Wrapper für Maus-Effekt */}
        <div ref={heroImgRef} className="hero-parallax-wrap">
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
        <div className="hero-box-wrap">
          <div className="hero-box-clip-outer">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIdx}
                className="hero-box"
                style={{ background: HERO_SLIDES[heroIdx].boxColor }}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 1.0, ease: [0.32, 0, 0.18, 1] }}
              >
                <h1>{HERO_SLIDES[heroIdx].title}</h1>
                <p>{HERO_SLIDES[heroIdx].desc}</p>
                <div className="hero-buttons">
                  <a href="/beratung-start" className="hero-btn-primary">MEINE Produkt BERATUNG ›</a>
                  <a href="/beratung" className="hero-btn-secondary">MEHR ERFAHREN ›</a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots */}
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === heroIdx ? ' hero-dot-active' : ''}`}
              onClick={() => setHeroCount(c => c + ((i - (c % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length) || HERO_SLIDES.length)}
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
              className="bg-transparent border-none outline-none text-xl text-[#333] placeholder-[#aaa] flex-1 min-w-0"
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
              <motion.div
                className="tile tile-premeo"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <img src="wetter_back_2.jpg" alt="" className="tile-img" />
                <div className="tile-overlay" />
                <span className="tile-title">Wetter</span>
                <div className="tile-footer">
                  <span className="tile-sub">Aktuelles Wetter für Ihren Standort</span>
                  <span className="tile-arrow">/ <span className="agrar-arrow-chevron">›</span></span>
                </div>
              </motion.div>
            </div>

            {/* Termine */}
            <div ref={el => parallaxRefs.current[1] = el} style={{ willChange: 'transform' }}>
              <motion.div
                className="tile tile-termine"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              >
                <img src="/image_beratung.jpg" alt="" className="tile-img" />
                <div className="tile-overlay" />
                <span className="tile-title">Termine</span>
                <div className="tile-footer">
                  <span className="tile-sub">Ihre Beratungstermine im Überblick</span>
                  <span className="tile-arrow">/ <span className="agrar-arrow-chevron">›</span></span>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Rechte Spalte – Premeo */}
          <div ref={el => parallaxRefs.current[2] = el} style={{ willChange: 'transform' }}>
          <motion.div
            className="tile tile-premeo-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >

            <img src="premeo_back_1.jpg" alt="" className="tile-img" />
            <div className="tile-overlay" />

            {/* Logo oben rechts */}
            <div className="premeo-logo-tr">
              <svg viewBox="0 0 1000 1000" height="72" xmlns="http://www.w3.org/2000/svg">
                <path fill="white" d="M229.4,516.6h-18.2v36.2h19.2c6.3,0.5,12.6-1.1,17.9-4.7c4.1-3.6,6.2-8.8,5.8-14.2C254.1,522.3,245.8,516.6,229.4,516.6"/>
                <path fill="white" d="M245.6,489.5c3.8-2.9,5.8-7.5,5.4-12.2c0.4-4.6-1.9-9-5.8-11.4c-5.8-2.7-12.1-3.9-18.5-3.5h-15.5v30.8h17.1C234.3,493.7,240.3,492.4,245.6,489.5"/>
                <path fill="white" d="M370.5,460.6c-10.2-0.7-20.1,3.7-26.5,11.8c-11.9,21.8-11.9,48.2-0.1,70.1c6.3,8.1,16.2,12.5,26.4,11.8c23.5,0,35.2-15.6,35.2-46.8C405.5,476.3,393.8,460.6,370.5,460.6"/>
                <path fill="white" d="M982.7,449.5c-9.1-39.1-44-66.8-84.2-66.8H99.5c-47.7,0-86.4,38.7-86.4,86.4v75.6c0,47.7,38.7,86.4,86.4,86.4h799.1c47.7,0,86.4-38.6,86.4-86.3c0,0,0,0,0-0.1V469C985,462.5,984.3,455.9,982.7,449.5z M270.9,566.4c-10.9,7.6-24,11.4-37.2,10.6h-51.9V438.3h43.1c14.8-1.1,29.6,1.8,42.9,8.4c9,5.8,14.1,16,13.3,26.7c0.3,7.3-1.7,14.4-5.8,20.4c-3.7,5.2-9.3,8.6-15.5,9.5v0.9c7.5,1.2,14.3,5.1,19.1,11.1c4.2,6.4,6.2,13.9,5.8,21.4C285.1,548.3,280,559.4,270.9,566.4z M419.3,560.4c-12.9,12.9-30.7,19.7-49,18.5c-18.2,1.2-36.1-5.6-49-18.5c-12.3-14.9-18.4-33.9-17.1-53.1c-1.3-19.2,4.8-38.2,17.1-52.9c13-12.8,30.9-19.4,49.1-18.2c18.2-1.2,36,5.5,48.9,18.4C442,486.2,442,528.8,419.3,560.4z M586.3,577h-37.4l-60.4-104.9h-0.9c1.2,18.5,1.8,31.7,1.8,39.7V577h-26.3V438.3h37.1l60.3,103.9h0.7c-0.9-18-1.4-30.8-1.4-38.2v-65.7h26.5V577z M732.2,528c0.2,9.4-2.2,18.8-6.9,27c-4.7,7.8-11.6,14-19.9,17.8c-9.7,4.3-20.2,6.4-30.8,6.2c-15.1,0.9-30-4-41.6-13.7c-10.1-9.8-15.5-23.5-14.8-37.5v-89.4h29.3v85c-0.7,8.4,1.6,16.7,6.4,23.5c5.7,5.5,13.5,8.3,21.4,7.5c7.7,0.7,15.4-2,20.9-7.5c4.9-6.9,7.2-15.3,6.5-23.7v-84.8h29.3L732.2,528z M832.6,568.1c-10.9,7.8-24.2,11.6-37.6,10.8c-13.6,0.3-27-2.6-39.3-8.4v-27.3c7.7,3.6,15.6,6.5,23.8,8.8c5.8,1.6,11.8,2.5,17.8,2.6c5.2,0.3,10.4-1,14.9-3.7c3.5-2.5,5.5-6.7,5.2-11c0-2.6-0.8-5.1-2.3-7.3c-1.8-2.4-4.1-4.5-6.7-6.1c-5.8-3.5-11.8-6.6-18-9.4c-6.8-3-13.3-6.8-19.1-11.5c-4.2-3.6-7.6-7.9-10.2-12.8c-2.6-5.3-3.9-11.2-3.8-17.1c-0.5-11.1,4.1-21.7,12.5-28.9c9.9-7.5,22.1-11.3,34.5-10.5c7,0,13.9,0.9,20.6,2.6c7,1.9,13.9,4.3,20.5,7.2l-9.5,22.8c-6-2.5-12.1-4.7-18.4-6.4c-4.7-1.2-9.5-1.8-14.3-1.8c-4.6-0.3-9.2,1.1-12.8,3.9c-2.9,2.5-4.6,6.3-4.5,10.2c-0.1,2.4,0.6,4.7,1.8,6.8c1.5,2.2,3.5,4.1,5.7,5.6c6,3.6,12.2,6.9,18.7,9.7c10.2,4.2,19.3,10.5,26.7,18.7c4.9,6.6,7.5,14.7,7.2,22.9C846.6,550,841.6,561,832.6,568.1z"/>
                <path fill="none" stroke="white" strokeWidth="43" d="M886.1,726.1V279.8L499.6,56.6L113,279.8v446.3l386.5,223.1L886.1,726.1z"/>
              </svg>
            </div>

            <span className="tile-title premeo-title-abs">Premeo</span>

            {/* Text */}
            <div className="premeo-text-wrap">
              <p className="premeo-subtitle">Premeo Bonusaktion 01.03.–30.09.2026</p>
              <p key={premeoIdx} className="premeo-headline premeo-headline-fade">{PREMEO_SLIDES[premeoIdx].headline}</p>
            </div>

            {/* Nav arrows */}
            <div className="premeo-nav">
              <button
                className="premeo-arrow-btn"
                onClick={() => setPremeoIdx(i => (i - 1 + PREMEO_SLIDES.length) % PREMEO_SLIDES.length)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              </button>
              <button
                className="premeo-arrow-btn"
                onClick={() => setPremeoIdx(i => (i + 1) % PREMEO_SLIDES.length)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>

            <div className="tile-footer">
              <span className="tile-sub">Ihr persönlicher Beratungsbereich</span>
              <span className="tile-arrow">/ <span className="agrar-arrow-chevron">›</span></span>
            </div>

          </motion.div>
          </div>

        </div>
      </section>

      {/* Slogan */}
      <section className="slogan-section" ref={sloganRef}>
        <motion.div className="slogan-bg-overlay" style={{ opacity: sloganBgOpacity }} />
        <motion.p
          className="slogan-left"
          style={{ x: sloganLeftX, opacity: sloganOpacity }}
        >
          Health for All,
        </motion.p>
        <motion.p
          className="slogan-right"
          style={{ x: sloganRightX, opacity: sloganOpacity }}
        >
          Hunger for None
        </motion.p>
      </section>

      </div>{/* end dark-gradient-wrap */}

      {/* Agrar Magazin – Apple TV Style */}
      <section className="agrar-section">
        <p className="agrar-heading">Agrar Magazin</p>
        <p className="agrar-subheading">Artikel / Videos / Podcast / Märkte</p>

        {/* Featured Carousel – infinite loop via triple copy */}
        <div className="agrar-featured-wrap" onMouseEnter={() => { agrPausedRef.current = true }} onMouseLeave={() => { agrPausedRef.current = false }}>
          <motion.div className="agrar-featured" style={{ x: featXMotion }}>
            {AGRAR_LOOP.map((card, i) => (
              <div className="agrar-card agrar-card-feat" key={i}>
                <img src={card.image} alt="" className="agrar-card-img" />
                <div className="agrar-card-grad" />
                <div className="agrar-card-label-tr">
                  <img src={card.icon} alt="" className="agrar-icon" />
                </div>
                <span className="agrar-scroll-tit-tl">{card.title}</span>
                <div className="agrar-scroll-foot agrar-feat-foot">
                  <div className="agrar-feat-left">
                    <p className="agrar-card-desc">{card.text}</p>
                  </div>
                  <span className="agrar-scroll-arrow">/ <span className="agrar-arrow-chevron">›</span></span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Row – 3 static boxes */}
        <div className="agrar-scroll-wrap">
          <div className="agrar-scroll-row">
            {AGRAR_SCROLL.slice(0, 3).map((card, i) => (
              <motion.div
                className="agrar-scroll-card"
                key={i}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.18 }}
              >
                <img src={card.image} alt="" className="agrar-card-img" />
                <div className="agrar-card-grad" />
                <div className="agrar-card-label-tr">
                  <img src={card.icon} alt="" className="agrar-icon" />
                </div>
                <span className="agrar-scroll-tit-tl">{card.title}</span>
                <div className="agrar-scroll-foot agrar-feat-foot">
                  <div className="agrar-feat-left">
                    <p className="agrar-card-desc">{card.text}</p>
                  </div>
                  <span className="agrar-scroll-arrow">/ <span className="agrar-arrow-chevron">›</span></span>
                </div>
              </motion.div>
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
          <div className="markt-ticker-track">
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
