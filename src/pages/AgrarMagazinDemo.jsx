import { useEffect, useRef, useState } from 'react'
import MainNav from '../components/MainNav'
import Footer from '../components/Footer'
import './AgrarMagazinDemo.css'

function ArticleSection({ title, intro, paragraphs = [], bullets, afterBullets = [], small }) {
  return (
    <section className={`article-section${small ? ' article-section--small' : ''}`}>
      <div className="article-section__inner">
        {intro && <p className="article-section__intro">{intro}</p>}
        {title && <h2 className="article-section__title">{title}</h2>}
        {paragraphs.map((p, i) => (
          <p key={i} className="article-section__text">{p}</p>
        ))}
        {bullets && (
          <ul className="article-section__bullets">
            {bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        )}
        {afterBullets.map((p, i) => (
          <p key={i} className="article-section__text">{p}</p>
        ))}
      </div>
    </section>
  )
}

function ArticleQuote({ text, author, img }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="article-quote" ref={ref}>
      <svg
        className="article-quote__bg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 615.12 103.04"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon
          className={`article-quote__box-shape${visible ? ' article-quote__box-shape--visible' : ''}`}
          points=".06 93.21 488.51 93.21 505.2 13.76 .06 13.76 .06 93.21"
        />
        <path
          className={`article-quote__deco${visible ? ' article-quote__deco--visible' : ''}`}
          d="M47.44,66.71c-3.12,0-5.82,2.18-6.47,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.46-5.24l4.52-21.26h-4.12,0ZM113.81,66.71c-3.12,0-5.81,2.18-6.46,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.13ZM147,66.71c-3.12,0-5.82,2.18-6.47,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.12ZM163.56,66.71c-3.12,0-5.82,2.18-6.47,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.12ZM246.48,66.71c-3.12,0-5.82,2.18-6.47,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.12ZM346,66.71c-3.12,0-5.82,2.18-6.46,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.13ZM379.16,66.71c-3.12,0-5.82,2.18-6.47,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.12ZM462.09,66.71c-3.12,0-5.82,2.18-6.47,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.12ZM545.02,66.71c-3.12,0-5.82,2.18-6.47,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.12ZM578.19,66.71c-3.12,0-5.82,2.18-6.46,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.13ZM66.85,53.48c-3.12,0-5.82,2.18-6.46,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.13ZM216.13,53.48c-3.12,0-5.82,2.18-6.47,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.12ZM265.87,53.48c-3.12,0-5.82,2.18-6.46,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.13ZM315.64,53.48c-3.12,0-5.82,2.18-6.46,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.13ZM365.41,53.48c-3.12,0-5.82,2.18-6.46,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.13ZM431.72,53.48c-3.12,0-5.82,2.18-6.47,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.12ZM481.48,53.48c-3.12,0-5.82,2.18-6.47,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.12ZM531.25,53.48c-3.12,0-5.82,2.18-6.47,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.12ZM597.59,53.48c-3.12,0-5.82,2.18-6.47,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.12ZM185.76,40.23c-3.12,0-5.82,2.18-6.47,5.23l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.12ZM567.21,40.23c-3.12,0-5.82,2.18-6.47,5.23l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.12ZM335.05,40.22c-3.12,0-5.82,2.18-6.47,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.12ZM108.47,13.76c-3.12,0-5.82,2.18-6.46,5.24l-15.78,74.21h4.12c3.12,0,5.82-2.18,6.47-5.24l15.78-74.21h-4.13ZM207.99,13.76c-3.12,0-5.82,2.18-6.47,5.24l-15.77,74.21h4.12c3.12,0,5.82-2.18,6.47-5.24l15.78-74.21h-4.13ZM307.49,13.76c-3.12,0-5.82,2.18-6.47,5.24l-15.77,74.21h4.12c3.12,0,5.82-2.18,6.47-5.24l15.77-74.21s-4.12,0-4.12,0ZM423.59,13.76c-3.12,0-5.82,2.18-6.47,5.24l-15.77,74.21h4.12c3.12,0,5.82-2.18,6.47-5.24l15.77-74.21s-4.12,0-4.12,0ZM506.53,13.76c-3.12,0-5.82,2.18-6.46,5.24l-15.77,74.21h4.12c3.12,0,5.82-2.18,6.47-5.24l15.77-74.21h-4.13ZM58.53,13.75c-3.07.05-5.71,2.22-6.35,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49s-4.24,0-4.24,0ZM91.79,13.75c-3.07.05-5.71,2.22-6.35,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49s-4.24,0-4.24,0ZM141.56,13.75c-3.07.05-5.71,2.22-6.35,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.24ZM158.13,13.75c-3.07.05-5.71,2.22-6.35,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.24ZM174.72,13.75c-3.07.05-5.71,2.22-6.35,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.24,0ZM241.04,13.75c-3.07.05-5.71,2.22-6.35,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.24,0ZM274.21,13.75c-3.07.05-5.71,2.22-6.35,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.24ZM290.8,13.75c-3.07.05-5.71,2.22-6.35,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.24ZM357.15,13.75c-3.07.05-5.71,2.22-6.35,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.24ZM390.32,13.75c-3.07.05-5.71,2.22-6.35,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.24ZM406.89,13.75c-3.07.05-5.71,2.22-6.35,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.24ZM456.66,13.75c-3.07.05-5.71,2.22-6.35,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.24ZM473.23,13.75c-3.07.05-5.71,2.22-6.35,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49s-4.24,0-4.24,0ZM522.99,13.75c-3.07.05-5.71,2.22-6.35,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49s-4.24,0-4.24,0ZM556.15,13.75c-3.07.05-5.71,2.22-6.35,5.24l-7.33,34.49h4.12c3.12,0,5.82-2.18,6.47-5.24l7.33-34.49h-4.24ZM605.92,13.75c-3.07.05-5.71,2.22-6.35,5.24l-4.52,21.26h4.12c3.12,0,5.82-2.18,6.47-5.24l4.52-21.26h-4.24Z"
        />
      </svg>
      <div className={`article-quote__inner${visible ? ' article-quote__inner--visible' : ''}`}>
        {img && <img src={img} alt={author || ''} className="article-quote__img" />}
        <div className="article-quote__body">
          <blockquote className="article-quote__text">„{text}"</blockquote>
          {author && <p className="article-quote__author">{author}</p>}
        </div>
      </div>
    </section>
  )
}

function ArticleImage({ src, caption }) {
  return (
    <section className="article-image">
      <div className="article-image__inner">
        <img src={src} alt={caption || ''} className="article-image__img" />
        {caption && <p className="article-image__caption">{caption}</p>}
      </div>
    </section>
  )
}

function SocialBar() {
  const [flow, setFlow] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver(
      ([entry]) => setFlow(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`social-bar${flow ? ' social-bar--flow' : ''}`}>
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-bar__link" aria-label="Facebook">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      </a>
      <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="social-bar__link" aria-label="X">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      <a href="mailto:" className="social-bar__link" aria-label="E-Mail">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      </a>
    </div>
  )
}

export default function AgrarMagazinDemo() {
  return (
    <>
      <MainNav />
      <div className="page-content">
        <SocialBar />
        <section className="agrar-hero">
        <div className="agrar-hero__overlay" />
        <img src="/code_2.svg" alt="" className="agrar-hero__deco" />
        <div className="agrar-hero__content">
          <p className="agrar-hero__date">20. April 2026</p>
          <h1 className="agrar-hero__title">
            Ein Umdenken in der Maisherbizid-Strategie: Ein Markt im Wandel
          </h1>
          <p className="agrar-hero__subtitle">
            Aktuelle Themen, Anbauempfehlungen und Neuigkeiten aus der Agrarwelt
          </p>
          <span className="agrar-hero__label">Mais – Pflanzenschutz</span>
        </div>
      </section>

      <ArticleSection
        intro="Der Maisanbau steht vor tiefgreifenden Veränderungen: immer weniger verfügbare Wirkstoffe, keine Neuzulassungen und gleichzeitig zunehmende Resistenzentwicklungen setzen Landwirtinnen und Landwirte unter Druck. Spätestens 2025 hat sich gezeigt, dass die bisherige Herbizid-Strategie nicht mehr ohne Weiteres fortgeführt werden kann."
        title="Welche Alternativen gibt es ohne Flufenacet?"
        paragraphs={[
          <>Mit dem <strong>Wegfall der beiden Bodenwirkstoffe S-Metolachlor und Flufenacet</strong> – die 2024 noch auf über 50 % der SDA-Fläche eingesetzt wurden – mussten viele Betriebe etablierte Verfahren neu denken. Parallel dazu war 2025 auch klimatisch ein <strong>Extremjahr für den Mais</strong>:</>,
        ]}
        bullets={[
          "bundesweit sehr trockenes Frühjahr,",
          "starke Tag-/Nacht-Temperaturschwankungen,",
          "ungewöhnlich kalte Nächte – kaum über 10 °C.",
        ]}
      />

       <ArticleQuote
        img="/Wolfgang_Jerebic.jpg"
        text="Dem Mais ging es auch ohne Herbizidanwendung nicht gut. Die Kombination aus Wetterstress und eingeschränkter Wirkstoff-Auswahl verschärfte die Situation zusätzlich."
        author="Wolfgang Jerebic, Beratungsmanager Nord-West von Bayer CropScience Deutschland"
      />

      <ArticleSection
        paragraphs={[
          <>Auch regulatorische Einschränkungen wie u.a. die <strong>drei-Jahresauflage für terbuthylazinhaltige Produkte</strong> reduzieren die strategischen Optionen in der Unkrautbekämpfung weiter.</>,
        ]}
      />

      <ArticleSection
        title="Neue Strategien sind gefragt – Bayer liefert Antworten"
        paragraphs={[
          <><strong>„Die abnehmenden Möglichkeiten zwingen uns zu einem echten Umdenken“</strong>, erklärt Bernhard Meyer, Beratungsmanger Süd-Ost. Genau aus diesem Grund brachte Bayer 2025 <strong>zwei neue isoxaflutolhaltige Packlösungen</strong> auf den Markt, um Landwirten für unterschiedliche Herausforderungen passende Optionen zu bieten.</>,
        ]}
      />

      <ArticleSection
        title="Was ist Isoxaflutole?"
        paragraphs={[
          <>Isoxaflutole ist ein systemischer Wirkstoff aus der <strong>Wirkstoff-Gruppe 27 (Isoxazol)</strong>. Er weist eine ausgezeichnete Residualwirkung im Boden sowie eine gute Blattwirkung bei einer breiten Mischverunkrautung auf. Isoxaflutole hemmt ein Enzym, welches wichtig für den Aufbau und den Erhalt von Chlorophyll und damit die Photosynthese ist.</>,
          <>Die Folge: Behandelte Unkräuter und Hirsen vergilben und sterben ab. Verträglich ist der Wirkstoff für den Einsatz im <strong>Vor- sowie im frühen Nachauflauf (bis BBCH 13)</strong>.</>,
        ]}
        bullets={[
          "Bekannt und bewährt",
          "Zunehmende Rolle bei der Unkrautkontrolle im Mais",
          "Aktives Resistenzmanagement",
          "Aktuell langfristig zugelassen",
          "Hervorragende Ergebnisse auf ALS-resistente Biotypen",
        ]}
      />

      <ArticleImage src="/demo_header.jpg" caption="Isoxaflutole – Platzhalterbild" />

      <ArticleSection
        title="Die neuen Packlösungen im Überblick"
        paragraphs={[
          <>Für starke Gräser- und Unkrautkontrolle – mit Resistenzmanagement</>,
          <><strong>MaisTer® power Flexx</strong>, bestehend aus dem bewährten MaisTer power mit den Sulfonylharnstoffen (ALS-Hemmer, HRAC Gruppe 2) Thiencarbazone, Foramsulfuron und Iodosulfuron sowie <strong>Merlin® Flexx</strong>, bestehend aus Isoxaflutole und dem Safener Cyprosulfamide.</>,
          "Diese Wirkstoffkombination vereint zahlreiche Vorteile:",
        ]}
        bullets={[
          "Hervorragende Gräser- und Unkrautkontrolle",
          "Dauerwirkung durch TBA-freien Bodenpartner",
          "Aktives Resistenzmanagement durch zwei Wirkstoffgruppen",
        ]}
        afterBullets={[
          <><strong>MaisTer® power Flexx</strong> ist im frühen Nachauflauf des Maises (BBCH 12–13) anzuwenden. Dies bietet den Vorteil, dass der Mais damit in seiner empfindlichen Jugendphase bis zum Reihenschluss sicher vor konkurrierenden Unkräutern geschützt ist.</>,
        ]}
      />

      <ArticleImage src="/MaisterPowerFlexx_Langfoerden.jpg" />
      <ArticleImage src="/MerlinDuoPack.jpg" caption="MaisTer® power Flexx" />

      <ArticleSection
        paragraphs={[
          <><strong>Breite Wirkung auch bei ALS-Resistenzen – für nachhaltige Kontrolle</strong></>,
          <><strong>Merlin® Duo Pack</strong>, bestehend aus den beiden Produkten Merlin Duo mit den Wirkstoffen Isoxaflutole, Terbuthylazin³ und dem Safener Cyprosulfamide und Fluva, ein Mesotrione. Das Merlin® Duo Pack wurde für eine <strong>breite Unkraut- und Hirsenwirkung, auch auf ALS-resistente Biotypen</strong>, entwickelt. Dank ihrer guten Residualwirkung bekämpft die Herbizidkombination aufgelaufene und nachkeimende Schadkräuter effektiv und nachhaltig.</>,
          "Das Pack kombiniert zahlreiche Vorteile:",
        ]}
        bullets={[
          "Breite Unkraut- und Hirsenwirkung",
          "Gute Residualwirkung durch Isoxaflutole und Terbuthylazin",
          "Wirkung auf ALS-resistente Biotypen",
        ]}
      />

      <ArticleImage src="/MerlinDuoPack_Oschersleben.jpg" caption="Merlin® Duo Pack" />

      <ArticleSection
        title="Wichtige Anwendungsbestimmung: NG368"
        paragraphs={[
          <>Für <strong>Merlin® Flexx</strong> und <strong>Merlin® Duo</strong> gilt die Auflage NG368:</>,
        ]}
        bullets={[
          "Im folgenden Kalenderjahr darf kein isoxaflutolhaltiges Produkt auf derselben Fläche eingesetzt werden.",
          <>Das bedeutet: Nach Merlin® Flexx oder Merlin® Duo kein Merlin® Produkt und kein <strong>Adengo®</strong>.</>,
          <>Umgekehrt: Nach einer Adengo®-Anwendung ist ein Einsatz von Merlin® Flexx/Duo im Folgejahr erlaubt.</>,
        ]}
      />

      <ArticleQuote
        img="/Wolfgang_Jerebic.jpg"
        text="Die abnehmenden Möglichkeiten zwingen uns auch zu einem Umdenken in unserer Anwendungsstrategie. Jede/r wünscht sich, dass man nur einmal in den Mais fahren muss und der Bestand anschließend sauber ist. Wir sehen aber jetzt schon Tendenzen, Produkte zum Wohle der Pflanze auch in Splitting-Applikation anzuwenden. Ich beobachte diese Entwicklung schon seit Jahren und begleite sie mit Versuchen, um fundierte Daten liefern zu können, dass sich eine mehrmalige Überfahrt auch positiv auf den Ertrag auswirken kann."
        author="Wolfgang Jerebic, Beratungsmanager Nord-West von Bayer CropScience Deutschland"
      />

      <ArticleSection
        title="Strategieoptionen mit Adengo® und Laudis® Plus"
        paragraphs={[
          <>Auch mit etablierten Produkten lassen sich moderne Strategien umsetzen. Durch die Vorlage mit <strong>Adengo®</strong>, einem bewährten Isoxaflutol + Thiencarbazone, mit einer Boden- & Blattwirkung wird die Unkrautkonkurrenz sehr früh ausgeschaltet. Mit <strong>Laudis® Plus</strong>, bestehend aus Laudis (Tembotrione) und Delion (Dicamba), können erfolgreich späte Hirsewellen und eine breite Mischverunkrautung, inkl. Amarant, Knöterich- und Windenarten behandelt werden. Der Einsatz unterschiedlicher Wirkstoffgruppen trägt hier aktiv zu einem guten Resistenzmanagement bei.</>,
        ]}
      />

      <ArticleImage src="/Versuchsergebnis_Laudis_Plus_Unkrautdruck.jpg" />

      <ArticleSection
        title="Fazit"
        paragraphs={[
          <>Um die bestmöglichen Ergebnisse zu erzielen, ist es entscheidend, die <strong>regionalen Bedingungen bei der Anwendung zu berücksichtigen</strong>. So können Landwirte mit den neuen Produktkonzepten trotz des Wegfalls wichtiger Wirkstoffe weiterhin für unkraut- und ungrasfreie Maisbestände sorgen. Umfassende Informationen zu passenden Strategien sind über Ihren Bayer Vertriebsberater, die Amtlichen Dienste oder die regionalen Pflanzenschutzberater erhältlich.</>,
        ]}
      />

      <ArticleSection
        small
        paragraphs={[
          <>¹ Anbaufläche × Behandlungen pro ha × Produkte im Tank &nbsp;|&nbsp; ² Kynetec Marktdaten 2024 und 2025 &nbsp;|&nbsp; ³ In Baden-Württemberg ist der Einsatz terbuthylazinhaltiger Produkte in Wasserschutzgebieten verboten</>,
          <>Alle mit ® gekennzeichneten Produkte sind eingetragene Marken des Bayer-Konzerns.</>,
        ]}
      />

      </div>
      <Footer />
    </>
  )
}
