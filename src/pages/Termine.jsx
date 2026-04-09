import { useState } from 'react'

function Termine() {
  const [activeChip, setActiveChip] = useState(0)
  const chips = ['Alle', 'Vor Ort', 'Online', 'Nachlese']

  return (
    <section className="screen-section" id="termine">
      <div className="section-inner">
        <div className="section-tag">85665 (Umkreis 50 km)</div>
        <div className="section-heading">Termine in<br />ihrer Region</div>
        <div className="filter-row" style={{marginTop:'22px'}}>
          {chips.map((chip, i) => (
            <button
              key={chip}
              className={'filter-chip' + (activeChip === i ? ' active' : '')}
              onClick={() => setActiveChip(i)}
            >{chip}</button>
          ))}
        </div>
        <div className="termine-cards">
          <div className="event-card">
            <div className="event-img"><img src="https://static.wixstatic.com/media/8a20aa_8329fb339a3f41e4bfcab1a6bdcb8f59~mv2.jpg" alt="Feldtag" loading="lazy" /></div>
            <div className="event-body">
              <div className="event-cat">Feldtag</div>
              <div className="event-title">Neue Herausforderungen im Getreide- und Mais ...</div>
              <div className="event-location-row"><span className="event-location-label">Ort</span><span>85447, Grucking</span></div>
              <div className="event-footer"><span className="event-date">03.04.2026</span><div className="event-arrow">&#8594;</div></div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-img"><img src="https://static.wixstatic.com/media/8a20aa_8329fb339a3f41e4bfcab1a6bdcb8f59~mv2.jpg" alt="Feldtag" loading="lazy" /></div>
            <div className="event-body">
              <div className="event-cat">Feldtag</div>
              <div className="event-title">Hier steht eine längere Überschrift</div>
              <div className="event-location-row"><span className="event-location-label">Ort</span><span>85447, Grucking</span></div>
              <div className="event-footer"><span className="event-date">03.10.2025</span><div className="event-arrow">&#8594;</div></div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-img"><img src="https://static.wixstatic.com/media/8a20aa_8329fb339a3f41e4bfcab1a6bdcb8f59~mv2.jpg" alt="Feldtag Online" loading="lazy" /></div>
            <div className="event-body">
              <div className="event-cat">Feldtag</div>
              <div className="event-title">Hier steht eine längere Überschrift</div>
              <div className="event-location-row"><span className="event-location-label">Ort</span><span>Online</span></div>
              <div className="event-footer"><span className="event-date">03.10.2025</span><div className="event-arrow">&#8594;</div></div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-img"><img src="https://static.wixstatic.com/media/8a20aa_8329fb339a3f41e4bfcab1a6bdcb8f59~mv2.jpg" alt="Feldtag Online" loading="lazy" /></div>
            <div className="event-body">
              <div className="event-cat">Feldtag</div>
              <div className="event-title">Hier steht eine längere Überschrift</div>
              <div className="event-location-row"><span className="event-location-label">Ort</span><span>Online</span></div>
              <div className="event-footer"><span className="event-date">03.10.2025</span><div className="event-arrow">&#8594;</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Termine
