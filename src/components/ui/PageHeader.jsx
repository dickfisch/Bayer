/**
 * variant="agrar"    → <p class="agrar-heading"> + optional <p class="agrar-subheading">
 *                      title = plain text before gradient word
 *                      highlight = gradient-colored word (placed after title)
 *
 * variant="produkte" → <h2 class="produkte-fokus-heading">
 *                      highlight = gradient-colored word (placed before title)
 *                      title = plain text after gradient word
 */
export default function PageHeader({ title, highlight, sub, variant = 'agrar' }) {
  if (variant === 'produkte') {
    return (
      <h2 className="produkte-fokus-heading">
        <span className="produkte-gradient">{highlight}</span> {title}
      </h2>
    )
  }

  return (
    <>
      <p className="agrar-heading">
        {title} <span className="produkte-gradient">{highlight}</span>
      </p>
      {sub && <p className="agrar-subheading">{sub}</p>}
    </>
  )
}
