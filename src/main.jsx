import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import Lenis from 'lenis'
import './index.css'
import Home from './pages/Home'
import BeratungStart from './pages/BeratungStart'
import App from './App'

function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis()
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])
  return null
}

function AppRoutes() {
  const location = useLocation()
  return (
    <LayoutGroup>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/beratung-start" element={<BeratungStart />} />
          <Route path="/beratung" element={<App />} />
          <Route path="/feldbericht" element={<App />} />
          <Route path="/termine" element={<App />} />
          <Route path="/tools" element={<App />} />
        </Routes>
      </AnimatePresence>
    </LayoutGroup>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LenisProvider />
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
)
