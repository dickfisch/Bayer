import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import Lenis from 'lenis'
import './index.css'
import Home from './pages/Home'
import BeratungStart from './pages/BeratungStart'
import Beratung from './pages/Beratung'
import AgrarMagazinDemo from './pages/AgrarMagazinDemo'
import { TransitionProvider } from './context/TransitionContext'


function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis()
    window.__lenis = lenis
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => { lenis.destroy(); window.__lenis = null }
  }, [])
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])
  return null
}

function AppRoutes() {
  const location = useLocation()
  return (
    <LayoutGroup>
      <ScrollToTop />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/beratung-start" element={<BeratungStart />} />
          <Route path="/beratung" element={<Beratung />} />
          <Route path="/agrar-magazin-demo" element={<AgrarMagazinDemo />} />
        </Routes>
      </AnimatePresence>
    </LayoutGroup>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LenisProvider />
      <TransitionProvider>
        <AppRoutes />
      </TransitionProvider>
    </BrowserRouter>
  </StrictMode>,
)
