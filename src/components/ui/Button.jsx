import TransitionLink from '../TransitionLink'

/**
 * Variants:
 *   outline   – transparent, #10384f border  (default – Resistenz-Stil)
 *   primary   – dark-blue  #10384f fill, white text
 *   inverted  – white fill, dark-blue #10384f text  (inverse of primary)
 *   dark      – black      #1d1d1f fill
 *   light     – white fill, dark text
 *   white     – transparent, white border + text  (for dark backgrounds)
 *
 * Legacy variants (hero / produkte) stay mapped for backward compat.
 */

const LEGACY = {
  'hero-primary': {
    root: 'hero-btn-primary',
    text: 'hero-btn-text',
    right: 'hero-btn-right',
    slash: 'hero-btn-slash',
    arrow: 'hero-btn-arrow',
  },
  'hero-secondary': {
    root: 'hero-btn-secondary',
    text: 'hero-btn-text',
    right: 'hero-btn-right',
    slash: 'hero-btn-slash',
    arrow: 'hero-btn-arrow',
  },
  produkte: {
    root: 'produkte-fokus-btn',
    text: 'produkte-fokus-btn-text',
    right: 'produkte-fokus-btn-right',
    slash: 'produkte-fokus-btn-slash',
    arrow: 'produkte-fokus-btn-arrow',
  },
}

const SHEET_MODIFIER = {
  outline:   'sheet-btn--outline',
  primary:   'sheet-btn--primary',
  inverted:  'sheet-btn--inverted',
  dark:      'sheet-btn--dark',
  light:     'sheet-btn--light',
  white:     'sheet-btn--white',
}

export default function Button({
  children,
  variant = 'outline',
  icon,
  href,
  className = '',
  ...props
}) {
  if (LEGACY[variant]) {
    const cls = LEGACY[variant]
    const isInternal = href && href.startsWith('/')
    const Tag = isInternal ? TransitionLink : href ? 'a' : 'button'
    return (
      <Tag className={`${cls.root}${className ? ` ${className}` : ''}`} href={href} {...props}>
        <span className={cls.text}>{children}</span>
        <span className={cls.right}>
          <span className={cls.slash}>/</span>
          <span className={cls.arrow}>›</span>
        </span>
      </Tag>
    )
  }

  const modifier = SHEET_MODIFIER[variant] ?? SHEET_MODIFIER.outline
  const isInternal = href && href.startsWith('/')
  const Tag = isInternal ? TransitionLink : href ? 'a' : 'button'

  return (
    <Tag
      className={`sheet-btn ${modifier} g-sheet-resistenz${className ? ` ${className}` : ''}`}
      href={href}
      {...props}
    >
      <span className="sheet-btn-left">
        {icon && <span className="sheet-btn-icon">{icon}</span>}
        <span className="sheet-btn-text">{children}</span>
      </span>
      <span className="sheet-btn-right">
        <span className="sheet-btn-slash">/</span>
        <span className="sheet-btn-arrow">›</span>
      </span>
    </Tag>
  )
}
