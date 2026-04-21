import { useEffect, useState } from 'react'

function localSrc(localImage) {
  return localImage.replace('public/', '/')
}

function colsForWidth(w) {
  if (w < 520) return 6
  if (w < 720) return 7
  if (w < 960) return 9
  return 10
}

export default function MagneticGrid({ products }) {
  const [hoverIdx, setHoverIdx] = useState(null)
  const [cols, setCols] = useState(() =>
    typeof window !== 'undefined' ? colsForWidth(window.innerWidth) : 10,
  )

  useEffect(() => {
    const onResize = () => setCols(colsForWidth(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const N = products.length
  const rows = Math.max(1, Math.ceil(N / cols))
  const centerCol = (cols - 1) / 2
  const centerRow = (rows - 1) / 2
  const maxDist = Math.sqrt(centerCol * centerCol + centerRow * centerRow) || 1

  const MIN_SCALE = 0.35
  const MAX_SCALE = 1.7
  const MIN_OPACITY = 0.4
  const MAX_LIFT = 60
  const HOVER_MULT = 1.35
  const HOVER_LIFT = 10

  return (
    <div className="magnetic-stage">
      <div
        className="magnetic-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 88px)` }}
      >
        {products.map((p, i) => {
          const row = Math.floor(i / cols)
          const col = i % cols
          const dx = col - centerCol
          const dy = row - centerRow
          const d = Math.min(1, Math.sqrt(dx * dx + dy * dy) / maxDist)
          const falloff = Math.sqrt(Math.max(0, 1 - d * d))
          const baseScale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * falloff
          const baseOpacity = MIN_OPACITY + (1 - MIN_OPACITY) * falloff
          const baseLift = -MAX_LIFT * falloff
          const hovered = hoverIdx === i
          const scale = hovered ? baseScale * HOVER_MULT : baseScale
          const opacity = hovered ? 1 : baseOpacity
          const lift = hovered ? baseLift - HOVER_LIFT : baseLift
          return (
            <a
              key={p.name}
              href={p.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-item"
              title={p.name}
              style={{
                transform: `translateY(${lift.toFixed(2)}px) scale(${scale.toFixed(3)})`,
                opacity: opacity.toFixed(3),
                zIndex: hovered ? 20 : 1,
              }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(prev => (prev === i ? null : prev))}
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
    </div>
  )
}
