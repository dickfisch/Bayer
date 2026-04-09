function Feldbericht() {
  return (
    <section className="screen-section" id="feldbericht">
      <div className="section-inner">
        <div className="section-header-row">
          <div>
            <div className="section-tag">85665, Mais</div>
            <div className="section-heading">Feldbericht</div>
          </div>
          <button className="btn-outline">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Abonnieren
          </button>
        </div>

        <div className="fb-tile-grid">
          <div className="fb-tile">
            <div className="fb-tile-stripe"></div>
            <div className="fb-tile-body">
              <div className="fb-tile-advisor">
                <div className="fb-tile-avatar"><img src="https://static.wixstatic.com/media/8a20aa_d72e844801ba41b68a8bc0d71264ad51~mv2.png" alt="A. Selmayer" onError={(e) => { e.target.parentElement.style.background='#aaa' }} /></div>
                <div><div className="fb-tile-name">A. Selmayer</div><div className="fb-tile-role">Vertriebsberater</div></div>
              </div>
              <div className="fb-tile-date">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                20.02.2026
              </div>
              <div className="fb-tile-text">Add paragraph text. Click 'Edit Text' to update the font, size and more. To change and reuse text themes, go to Site Styles.</div>
            </div>
            <div className="fb-tile-footer">
              <button className="fb-tile-mehr">Mehr lesen &rarr;</button>
            </div>
          </div>
          <div className="fb-tile">
            <div className="fb-tile-stripe"></div>
            <div className="fb-tile-body">
              <div className="fb-tile-advisor">
                <div className="fb-tile-avatar"><img src="https://static.wixstatic.com/media/8a20aa_d72e844801ba41b68a8bc0d71264ad51~mv2.png" alt="A. Selmayer" onError={(e) => { e.target.parentElement.style.background='#aaa' }} /></div>
                <div><div className="fb-tile-name">A. Selmayer</div><div className="fb-tile-role">Vertriebsberater</div></div>
              </div>
              <div className="fb-tile-date">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                20.02.2026
              </div>
              <div className="fb-tile-text">Neue Situation bei Ackerfuchsschwanz: Resistenzentwicklung schreitet fort. Bitte Mittelwechsel einplanen und frühzeitig behandeln.</div>
            </div>
            <div className="fb-tile-footer">
              <button className="fb-tile-mehr">Mehr lesen &rarr;</button>
            </div>
          </div>
          <div className="fb-tile">
            <div className="fb-tile-stripe"></div>
            <div className="fb-tile-body">
              <div className="fb-tile-advisor">
                <div className="fb-tile-avatar"><img src="https://static.wixstatic.com/media/8a20aa_d72e844801ba41b68a8bc0d71264ad51~mv2.png" alt="A. Selmayer" onError={(e) => { e.target.parentElement.style.background='#aaa' }} /></div>
                <div><div className="fb-tile-name">A. Selmayer</div><div className="fb-tile-role">Vertriebsberater</div></div>
              </div>
              <div className="fb-tile-date">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                20.02.2026
              </div>
              <div className="fb-tile-text">Septoria-Druck in Ihrer Region erhöht. Fungizidmaßnahmen ab BBCH 32 unbedingt einplanen – besonders bei anfälligen Sorten.</div>
            </div>
            <div className="fb-tile-footer">
              <button className="fb-tile-mehr">Mehr lesen &rarr;</button>
            </div>
          </div>
        </div>
        <div className="fb-mehr-anzeigen-wrap">
          <button className="fb-mehr-anzeigen-btn">&rarr; Mehr anzeigen</button>
        </div>
      </div>
    </section>
  )
}

export default Feldbericht
