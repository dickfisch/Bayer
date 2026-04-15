export default function Label({ children, color, className = '' }) {
  return (
    <span
      className={`produkte-fokus-tag${className ? ` ${className}` : ''}`}
      style={{ background: color }}
    >
      {children}
    </span>
  )
}
