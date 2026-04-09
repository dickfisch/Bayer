import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MainNav from '../components/MainNav'

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

const LAYOUT_TRANSITION = { type: 'spring', stiffness: 380, damping: 22 }

function BeratungStart() {
  const navigate = useNavigate()
  const [plz, setPlz] = useState('')
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

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hintergrund-Gradient – faded beim Exit eigenständig aus */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: 'linear-gradient(-45deg, #e0f2f7, #f5fafd, #cce8f2, #e8f5f9, #f0f9fc, #d0edf5)',
          backgroundSize: '400% 400%',
        }}
        initial={{ opacity: 0, backgroundPosition: '0% 50%' }}
        animate={{ opacity: 1, backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 0.3, ease: 'easeInOut' },
          backgroundPosition: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <MainNav />

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <motion.h1
          className="text-4xl font-bold text-[#10384f]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          Beratung starten
        </motion.h1>

        {/* Diese motion.div hat dieselbe layoutId wie das sub-nav in SubNav.jsx */}
        <motion.div
          layoutId="context-bar"
          className="sub-nav !w-[70%] !items-stretch !py-5 !px-8 !gap-6 !bg-white/20 !backdrop-blur-2xl !border-white/50 ![box-shadow:0_8px_32px_rgba(0,97,127,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]"
          transition={{ layout: LAYOUT_TRANSITION }}
        >
          {/* PLZ – editierbares Pill */}
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

          {/* Kultur – identisch zu SubNav */}
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

          {/* Weiter-Button – Bayer-Gradient mit Framer Motion */}
          <motion.button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={[
              'flex items-center justify-center gap-3 rounded-full !px-16 !py-4',
              'text-xl font-semibold text-white whitespace-nowrap shrink-0',
              'bg-gradient-to-r from-[#10384f] to-[#00617f]',
              canSubmit ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed',
            ].join(' ')}
            whileHover={canSubmit ? { scale: 1.04, boxShadow: '0 10px 32px rgba(0,97,127,0.5)' } : {}}
            whileTap={canSubmit ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            Weiter
            <motion.span
              className="flex items-center"
              animate={canSubmit ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default BeratungStart
