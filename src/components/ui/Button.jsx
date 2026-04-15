const BTN_CLASSES = {
  primary: {
    root:  'hero-btn-primary',
    text:  'hero-btn-text',
    right: 'hero-btn-right',
    slash: 'hero-btn-slash',
    arrow: 'hero-btn-arrow',
  },
  secondary: {
    root:  'hero-btn-secondary',
    text:  'hero-btn-text',
    right: 'hero-btn-right',
    slash: 'hero-btn-slash',
    arrow: 'hero-btn-arrow',
  },
  produkte: {
    root:  'produkte-fokus-btn',
    text:  'produkte-fokus-btn-text',
    right: 'produkte-fokus-btn-right',
    slash: 'produkte-fokus-btn-slash',
    arrow: 'produkte-fokus-btn-arrow',
  },
}

export default function Button({ children, variant = 'primary', href, className = '', ...props }) {
  const cls = BTN_CLASSES[variant] ?? BTN_CLASSES.primary
  const Tag = href ? 'a' : 'button'

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
