function Videos() {
  return (
    <section className="screen-section" id="videos">
      <div className="section-inner">
        <div className="videos-header-row">
          <div>
            <div className="section-tag">Videos</div>
            <div className="section-heading">Videoanalysen<br />aus ihrer Region</div>
          </div>
        </div>
        <div className="video-grid">
          <div className="video-card">
            <div className="video-thumb">
              <img src="https://static.wixstatic.com/media/8a20aa_814a095165fb4ff990088bcd5b0165f2~mv2.jpg" alt="Video 1" loading="lazy" />
              <div className="video-play-overlay"><div className="play-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="#10384f"><polygon points="5,3 19,12 5,21"/></svg></div></div>
              <div className="video-duration">11:03</div>
            </div>
            <div className="video-body">
              <div className="video-date">03.10.2025</div>
              <div className="video-title">Hier steht eine längere Überschrift</div>
            </div>
          </div>
          <div className="video-card">
            <div className="video-thumb">
              <img src="https://static.wixstatic.com/media/8a20aa_3632aded684c4b18a0abf35223791592~mv2.jpg" alt="Video 2" loading="lazy" />
              <div className="video-play-overlay"><div className="play-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="#10384f"><polygon points="5,3 19,12 5,21"/></svg></div></div>
              <div className="video-duration">11:03</div>
            </div>
            <div className="video-body">
              <div className="video-date">03.10.2025</div>
              <div className="video-title">Hier steht eine längere Überschrift</div>
            </div>
          </div>
          <div className="video-card">
            <div className="video-thumb">
              <img src="https://static.wixstatic.com/media/8a20aa_8329fb339a3f41e4bfcab1a6bdcb8f59~mv2.jpg" alt="Video 3" loading="lazy" />
              <div className="video-play-overlay"><div className="play-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="#10384f"><polygon points="5,3 19,12 5,21"/></svg></div></div>
              <div className="video-duration">11:03</div>
            </div>
            <div className="video-body">
              <div className="video-date">03.10.2025</div>
              <div className="video-title">Hier steht eine längere Überschrift</div>
            </div>
          </div>
        </div>
        <div className="videos-footer-row">
          <a href="#">Weitere Videos auf Agrar TV &#8594;</a>
          <a href="#">Premeo learn &amp; earn &#8594;</a>
        </div>
      </div>
    </section>
  )
}

export default Videos
