import { useState } from 'react'
import { motion } from 'framer-motion'
import MainNav from '../components/MainNav'
import { usePageTransition } from '../context/TransitionContext'

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

function BeratungStart() {
  const { triggerWeiterTransition } = usePageTransition()
  const [plz, setPlz] = useState('')
  const [kultur, setKultur] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (plz.length !== 5 || !kultur) return
    sessionStorage.setItem('nav_plz', plz)
    sessionStorage.setItem('nav_kultur', kultur)
    window.dispatchEvent(new CustomEvent('nav-context-update', { detail: { plz, kultur } }))
    const rect = e.currentTarget.getBoundingClientRect()
    triggerWeiterTransition('/beratung', rect, { plz, kultur })
  }

  const canSubmit = plz.length === 5 && kultur !== ''

  return (
    <div className="bs-root">

      <div className="bs-bg-photo" />
      <div className="bs-panel" />

      <MainNav />

      <div className="bs-content">
        <div className="bs-inner">

          <h1 className="bs-heading">
            <span className="bs-heading-white">Meine </span>
            <span className="bs-heading-gradient">Beratung</span>
          </h1>

          <p className="bs-subtitle">
            Erhalte eine personalisierte Empfehlung für Kultur, Region
            und die nächsten saisonalen Entscheidungen.
          </p>

          <div className="bs-form">

            <div className="bs-select-wrapper">
              <select
                className="bs-select"
                value={kultur}
                onChange={e => setKultur(e.target.value)}
              >
                <option value="" disabled>Kultur wählen</option>
                {KULTUREN.map(k => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
              <svg
                className="bs-chevron"
                width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            <input
              className="bs-input"
              type="text"
              inputMode="numeric"
              placeholder="PLZ eingeben"
              value={plz}
              onChange={e => setPlz(e.target.value.replace(/\D/g, '').slice(0, 5))}
              maxLength={5}
              autoComplete="postal-code"
            />

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
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </motion.button>

            <p className="bs-login-hint">Abonnieren Sie den Season view</p>

            <div className="bs-auth-row">
              <button className="bs-auth-btn">Login</button>
              <button className="bs-auth-btn">Registrieren</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default BeratungStart
