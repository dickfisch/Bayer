import { useEffect } from 'react'
import { motion } from 'framer-motion'
import MainNav from './components/MainNav'
import SubNav from './components/SubNav'
import Produkte from './pages/Produkte'
import Feldbericht from './pages/Feldbericht'
import Videos from './pages/Videos'
import Termine from './pages/Termine'
import Tools from './pages/Tools'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    function onScroll() {
      const subNavWrap = document.querySelector('.sub-nav-wrap')
      if (!subNavWrap) return
      subNavWrap.style.top = window.scrollY > 10 ? '10px' : '100px'
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <MainNav />
      <SubNav />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
      >
        <Produkte />
        <Feldbericht />
        <Videos />
        <Termine />
        <Tools />
        <Footer />
      </motion.div>
    </>
  )
}

export default App
