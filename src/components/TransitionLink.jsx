import { useNavigate } from 'react-router-dom'

/**
 * Ersetzt <Link to="..."> und <a href="..."> für interne Navigation.
 * Navigiert direkt ohne Übergangsanimation.
 */
export default function TransitionLink({
  to,
  href,
  state,
  children,
  onClick,
  ...props
}) {
  const navigate = useNavigate()
  const path = to ?? href

  function handleClick(e) {
    if (!path || !path.startsWith('/')) return
    e.preventDefault()
    onClick?.(e)
    navigate(path, { state })
  }

  return (
    <a href={path} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
