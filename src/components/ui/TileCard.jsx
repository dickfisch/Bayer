import { motion } from 'framer-motion'

/**
 * header   – content placed between the overlay and the tile-title (e.g. SVG watermarks, logos)
 * children – content placed between the tile-title and the tile-footer (e.g. text blocks, nav)
 */
export default function TileCard({
  image,
  title,
  sub,
  header,
  children,
  className = '',
  titleClassName = '',
  initial,
  whileInView,
  whileHover,
  viewport,
  transition,
}) {
  return (
    <motion.div
      className={`tile${className ? ` ${className}` : ''}`}
      initial={initial}
      whileInView={whileInView}
      whileHover={whileHover}
      viewport={viewport}
      transition={transition}
    >
      <img src={image} alt="" className="tile-img" />
      <div className="tile-overlay" />
      {header}
      <span className={`tile-title${titleClassName ? ` ${titleClassName}` : ''}`}>{title}</span>
      {children}
      <div className="tile-footer">
        <span className="tile-sub">{sub}</span>
        <span className="tile-arrow">/ <span className="agrar-arrow-chevron">›</span></span>
      </div>
    </motion.div>
  )
}
