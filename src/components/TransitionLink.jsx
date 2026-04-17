import { usePageTransition } from '../context/TransitionContext'

/**
 * Ersetzt <Link to="..."> und <a href="..."> für interne Navigation.
 * Fängt den Klick ab, liest clientX/clientY und löst die Kreisanimation aus.
 */
export default function TransitionLink({
  to,
  href,
  state,
  children,
  onClick,
  ...props
}) {
  const { triggerTransition } = usePageTransition()
  const path = to ?? href

  function handleClick(e) {
    // Nur interne Routen abfangen
    if (!path || !path.startsWith('/')) return

    e.preventDefault()

    // Klick-Position (Fallback: Elementmitte bei Tastaturnavigation)
    let clientX = e.clientX
    let clientY = e.clientY
    if (!clientX && !clientY) {
      const r = e.currentTarget.getBoundingClientRect()
      clientX = r.left + r.width / 2
      clientY = r.top + r.height / 2
    }

    // Erst den eigenen onClick (z.B. closeMobileMenu), dann Transition
    onClick?.(e)
    triggerTransition(path, clientX, clientY, state)
  }

  return (
    <a href={path} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
