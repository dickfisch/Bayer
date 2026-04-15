export default function Card({ image, icon, title, text, className = '', as: As = 'div', draggable, ...rest }) {
  return (
    <As className={className} {...rest}>
      <img src={image} alt="" className="agrar-card-img" draggable={draggable} />
      <div className="agrar-card-grad" />
      <div className="agrar-card-label-tr">
        <img src={icon} alt="" className="agrar-icon" />
      </div>
      <span className="agrar-scroll-tit-tl">{title}</span>
      <div className="agrar-scroll-foot agrar-feat-foot">
        <div className="agrar-feat-left">
          <p className="agrar-card-desc">{text}</p>
        </div>
        <span className="agrar-scroll-arrow">/ <span className="agrar-arrow-chevron">›</span></span>
      </div>
    </As>
  )
}
