function Tools() {
  return (
    <section className="tools-section" id="tools">
      <div className="tools-section-label">Wichtige Tools</div>
      <div className="tools-grid">
        <div className="tool-card">
          <img className="tool-card-img" src="https://static.wixstatic.com/media/8a20aa_814a095165fb4ff990088bcd5b0165f2~mv2.jpg" alt="Resistenzmanagement" loading="lazy" />
          <div className="tool-card-overlay">
            <div className="tool-tag">Resistenzmanagement</div>
            <div className="tool-title">Ist der Wirkstoff noch<br />wirksam? Jetzt prüfen.</div>
            <button className="tool-btn">Resistenz bestimmen</button>
          </div>
          <div className="tool-help">Hilfe</div>
        </div>
        <div className="tool-card">
          <img className="tool-card-img" src="https://static.wixstatic.com/media/8a20aa_3632aded684c4b18a0abf35223791592~mv2.jpg" alt="Diagnose" loading="lazy" />
          <div className="tool-card-overlay">
            <div className="tool-tag">Diagnose</div>
            <div className="tool-title">Schaderreger bestimmen.<br />Passende Lösung finden.</div>
            <button className="tool-btn">Diagnose starten</button>
          </div>
          <div className="tool-help">Hilfe</div>
        </div>
      </div>
    </section>
  )
}

export default Tools
