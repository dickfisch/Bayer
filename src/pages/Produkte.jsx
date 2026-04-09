import { useState, useEffect, useRef } from 'react'

/* ── Module-level constants (shared between main setup + cursor hooks) ── */
const ST = [10, 13, 21, 25, 29, 30, 31, 32, 37, 39, 49, 51, 59, 61, 69, 89]
const N  = ST.length - 1
function pos(b) { return (ST.indexOf(b) / N) * 100 }

function Produkte() {
  const [activeTab, setActiveTab] = useState(0)
  const [cursorIdx, setCursorIdx] = useState(ST.indexOf(32)) // BBCH 32 = index 7

  const ticksRef  = useRef(null)
  const bubbleRef = useRef(null)

  /* Derived positioning values */
  const cursorPct = cursorIdx / N * 100
  /* Left of the vertical line inside gantt-inner (200px label col + proportional track) */
  const lineLeft  = `calc(${(200 * (1 - cursorIdx / N)).toFixed(2)}px + ${cursorPct.toFixed(2)}%)`

  /* ── Sync active tick dots / labels whenever cursorIdx changes ── */
  useEffect(() => {
    document.querySelectorAll('.gantt-tick-dot').forEach((d, i) => {
      d.classList.toggle('active', i === cursorIdx)
    })
    document.querySelectorAll('.gantt-tick-label').forEach((l, i) => {
      l.classList.toggle('active', i === cursorIdx)
    })
  }, [cursorIdx])

  /* ── Drag + Tick-click (single effect, refs never change) ── */
  useEffect(() => {
    const ticks  = ticksRef.current
    const bubble = bubbleRef.current
    if (!ticks || !bubble) return

    function nearestIdx(pct) {
      let best = 0, bestD = Infinity
      for (let i = 0; i <= N; i++) {
        const d = Math.abs(i / N * 100 - pct)
        if (d < bestD) { bestD = d; best = i }
      }
      return best
    }

    let dragging = false

    function startDrag(e) {
      e.preventDefault()
      dragging = true
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('touchmove', onDrag, { passive: false })
      document.addEventListener('mouseup',   endDrag)
      document.addEventListener('touchend',  endDrag)
    }

    function onDrag(e) {
      if (!dragging) return
      e.preventDefault()
      const rect    = ticks.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const pct     = Math.max(0, Math.min(100, (clientX - rect.left) / rect.width * 100))
      setCursorIdx(nearestIdx(pct))
    }

    function endDrag() {
      dragging = false
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('touchmove', onDrag)
      document.removeEventListener('mouseup',   endDrag)
      document.removeEventListener('touchend',  endDrag)
    }

    function onTickClick(e) {
      const tick = e.target.closest('.gantt-tick')
      if (!tick) return
      const rect = ticks.getBoundingClientRect()
      const pct  = (tick.getBoundingClientRect().left + 4 - rect.left) / rect.width * 100
      setCursorIdx(nearestIdx(pct))
    }

    bubble.addEventListener('mousedown',  startDrag)
    bubble.addEventListener('touchstart', startDrag, { passive: false })
    ticks.addEventListener('click',       onTickClick)

    return () => {
      bubble.removeEventListener('mousedown',  startDrag)
      bubble.removeEventListener('touchstart', startDrag)
      ticks.removeEventListener('click',       onTickClick)
      endDrag()
    }
  }, [])

  /* ── Main Gantt setup (imperative DOM: ticks, phases, bars, overlays) ── */
  useEffect(() => {
    (function() {

      /* ── BBCH Plant SVGs ── */
      var PLANT_SVG = {
        tiller: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200"><g fill="none" stroke="#2D7D3A" stroke-linecap="round" stroke-linejoin="round"><!-- ground --><line x1="10" y1="182" x2="90" y2="182" stroke="#c5d9b0" stroke-width="1.5"/><!-- central stem --><path d="M50 182 C50 162 50 145 50 110" stroke-width="3.5"/><!-- left tiller --><path d="M47 172 C40 160 28 148 18 135" stroke-width="2.5"/><!-- left tiller leaf --><path d="M18 135 C10 126 8 115 14 108" stroke-width="2"/><!-- right tiller --><path d="M53 168 C62 156 74 146 83 133" stroke-width="2.5"/><!-- right tiller leaf --><path d="M83 133 C91 123 92 112 86 106" stroke-width="2"/><!-- left leaf --><path d="M50 148 C38 140 26 134 17 128" stroke-width="2.5"/><!-- right leaf --><path d="M50 136 C62 130 74 125 82 119" stroke-width="2.5"/><!-- apical bud --></g><ellipse cx="50" cy="104" rx="7" ry="10" fill="#3a9648"/></svg>',
        shoot:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200"><g fill="none" stroke="#2D7D3A" stroke-linecap="round" stroke-linejoin="round"><!-- ground --><line x1="10" y1="188" x2="90" y2="188" stroke="#c5d9b0" stroke-width="1.5"/><!-- central stem --><path d="M50 188 C50 168 50 140 50 70" stroke-width="3.5"/><!-- node 1 dot --></g><circle cx="50" cy="155" r="4" fill="#2D7D3A"/><!-- node 2 --><circle cx="50" cy="118" r="4" fill="#2D7D3A"/><!-- left leaf node1 --><path d="M50 155 C36 150 22 140 14 130" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- right leaf node2 --><path d="M50 118 C65 114 78 106 86 96" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- left low tiller --><path d="M48 178 C38 168 25 160 16 152" stroke="#2D7D3A" stroke-width="2" fill="none" stroke-linecap="round"/><!-- bud --><ellipse cx="50" cy="62" rx="7" ry="12" fill="#3a9648"/></svg>',
        flag:   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200"><g fill="none" stroke="#2D7D3A" stroke-linecap="round" stroke-linejoin="round"><!-- ground --><line x1="10" y1="192" x2="90" y2="192" stroke="#c5d9b0" stroke-width="1.5"/><!-- stem --><path d="M50 192 L50 32" stroke-width="3.5"/><!-- nodes --></g><circle cx="50" cy="160" r="4" fill="#2D7D3A"/><circle cx="50" cy="120" r="4" fill="#2D7D3A"/><circle cx="50" cy="80" r="4" fill="#2D7D3A"/><!-- flag leaf --><path d="M50 80 C60 74 76 64 82 52" stroke="#2D7D3A" stroke-width="3" fill="none" stroke-linecap="round"/><!-- leaf 2 --><path d="M50 120 C38 114 24 106 16 96" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- leaf 3 --><path d="M50 160 C64 155 76 148 83 140" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- base leaf --><path d="M48 178 C36 170 22 164 14 158" stroke="#2D7D3A" stroke-width="2" fill="none" stroke-linecap="round"/><!-- bud emerging --><ellipse cx="50" cy="25" rx="7" ry="11" fill="#3a9648"/></svg>',
        ear:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200"><g fill="none" stroke="#2D7D3A" stroke-linecap="round" stroke-linejoin="round"><!-- ground --><line x1="10" y1="192" x2="90" y2="192" stroke="#c5d9b0" stroke-width="1.5"/><!-- stem --><path d="M50 192 L50 25" stroke-width="3.5"/><!-- nodes --></g><circle cx="50" cy="165" r="4" fill="#2D7D3A"/><circle cx="50" cy="130" r="4" fill="#2D7D3A"/><!-- flag leaf --><path d="M50 90 C62 82 78 72 85 60" stroke="#2D7D3A" stroke-width="3" fill="none" stroke-linecap="round"/><!-- leaf 2 --><path d="M50 130 C37 124 23 116 15 106" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- leaf 3 --><path d="M50 165 C63 160 76 154 83 146" stroke="#2D7D3A" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- ear shape --><path d="M50 88 C50 72 50 50 50 22" stroke="#2D7D3A" stroke-width="3" fill="none"/><!-- spikelets left --><path d="M50 70 C44 66 38 62 35 56" stroke="#2D7D3A" stroke-width="2" fill="none"/><!-- awn 1 --><path d="M35 56 C32 50 32 44 34 38" stroke="#2D7D3A" stroke-width="1.5" fill="none"/><!-- spikelets right --><path d="M50 62 C56 58 62 54 65 48" stroke="#2D7D3A" stroke-width="2" fill="none"/><!-- spikelets right 2 --><path d="M50 76 C44 72 38 69 35 64" stroke="#2D7D3A" stroke-width="1.8" fill="none"/><!-- awn tip --><path d="M50 22 C50 16 51 10 52 4" stroke="#2D7D3A" stroke-width="1.5" fill="none"/></svg>'
      };

      var DATA = {
        f1: { cat: 'fungizid',  crop: 'Winter- / Sommerweizen',  label: 'T1 \u2014 Halmkrankheiten', plant: 'shoot', img: 'productimage.image.png',
              from: 29, to: 32,
              products: [{n:'Input Triple', d:'1,0 l/ha'},{n:'Delaro Forte', d:'1,5 l/ha', alt:true}],
              targets: ['Septoria','Halmbruch','Mehltau','Rostarten','DTR','Fusarium','DON-Reduktion'],
              note: 'CCC 720 in diesem Stadium als Wachstumsregler kombinierbar. Verbessert Stresstoleranz.' },
        f2: { cat: 'fungizid',  crop: 'Winter- / Sommerweizen',  label: 'T2 \u2014 Blatt & Abreife', plant: 'flag', img: 'productimage.image.png',
              from: 37, to: 51,
              products: [{n:'Ascra Xpro', d:'1,2 \u2013 1,5 l/ha'}],
              targets: ['Septoria','Rostarten','DTR','Fusarium','Blattfleckenkrankheiten'],
              note: 'Cerone\u00ae 660 kombinierbar. Abverkauf bis 15.05.2026 \u00b7 Aufbrauchfrist bis 15.05.2027' },
        f3: { cat: 'fungizid',  crop: 'Winter- / Sommerweizen',  label: 'T3 \u2014 \u00c4hrenkrankheiten', plant: 'ear', img: 'productimage.image.png',
              from: 59, to: 69,
              products: [{n:'Prosaro', d:'1,0 l/ha'},{n:'Skyway Xpro', d:'1,0 \u2013 1,25 l/ha', alt:true}],
              targets: ['\u00c4hrenfusarium','DON-Reduktion','\u00c4hrenseptoria'],
              note: null },
        h1: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'Winterweizen \u00b7 Triticale', label: 'Ackerfuchsschwanz normal',
              from: 21, to: 37,
              products: [{n:'Incelo Komplett', d:'Incelo 300 g/ha + Biopower 1,0 l/ha + Husar OD 0,1 l/ha'}],
              targets: ['Ackerfuchsschwanz','Weidelgr\u00e4ser','Windhalm','Rispen','Flughafer','Mischverunkrautung'],
              note: '+30 l/ha AHL oder +10 kg/ha SSA zur Wirkungsverst\u00e4rkung (nur WW & Triticale, nicht bei Winterhartweizen)' },
        h2: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'WW \u00b7 WHW \u00b7 Triticale',  label: 'Ackerfuchsschwanz extrem & Trespen',
              from: 21, to: 37,
              products: [{n:'Atlantis Flex', d:'Atlantis Flex 330 g/ha + Biopower 1,0 l/ha'}],
              targets: ['Ackerfuchsschwanz','Trespen-Arten','Flughafer','Windhalm','Kamille','Ausfallraps','Hirtent\u00e4schel','Vogelmiere'],
              note: 'Keine ausreichende Wirkung auf Clearfield (reg.)-Sorten bei Ausfallraps' },
        h3: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'Winterweizen', label: 'Trespen \u2014 kein Rapsnachbau',
              from: 25, to: 37,
              products: [{n:'Attribut**', d:'100 g/ha + Additiv*'}],
              targets: ['Trespen-Arten'],
              note: '* M\u00f6gliche Additive: Break-Thru, Kantor, Mero (Gebrauchsanleitung beachten)\n** Einsatz ab BBCH 20' },
        h4: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'Winterweizen', label: 'Trespen \u2014 mit Rapsnachbau',
              from: 21, to: 37,
              products: [{n:'Atlantis Flex', d:'Atlantis Flex 330 g/ha + Biopower 1,0 l/ha'}],
              targets: ['Trespen-Arten'],
              note: null },
        h5: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'WW \u2014 Windhalmstandorte', label: 'Windhalm & Mischverunkrautung + AHL',
              from: 29, to: 37,
              products: [{n:'Husar Plus**', d:'0,2 l/ha + AHL'}],
              targets: ['Windhalm','Rispe','Weidelgr\u00e4ser','Klettenlabkraut','Kamille','Stief m\u00fctterchen','Erdrauch','Hundskerbel'],
              note: '** Kein Zusatz von Mero bei AHL-Anwendung!' },
        h6: { cat: 'herbizid', plant: 'tiller', img: 'productimage.image.png', crop: 'WW \u00b7 Roggen \u00b7 Triticale', label: 'Windhalm \u2014 Standardbehandlung',
              from: 29, to: 37,
              products: [{n:'Husar Plus', d:'0,2 l/ha + Mero 1,0 l/ha'}],
              targets: ['Windhalm','Rispe','Weidelgr\u00e4ser','Klettenlabkraut','Kamille','Kerbel','Kornblume'],
              note: 'Bei Kornblume: + Pointer SX 35 g/ha' }
      };

      var ROWS = ['f1','f2','f3','h1','h2','h3','h4','h5','h6'];

      /* Build scale ticks (dots) */
      var ticksEl = document.getElementById('ganttTicks');
      if (!ticksEl) return;
      /* Clear any previously injected ticks (StrictMode double-mount) */
      ticksEl.innerHTML = '';

      ST.forEach(function(b, i) {
        var t = document.createElement('div');
        t.className = 'gantt-tick';
        var isFirst = i === 0;
        var isLast  = i === ST.length - 1;
        var transform = isFirst ? 'translateX(0)' : isLast ? 'translateX(-100%)' : 'translateX(-50%)';
        t.style.cssText = 'position:absolute; top:0; left:' + (i / N * 100) + '%;';
        t.innerHTML = '<div class="gantt-tick-label" id="lbl_' + i + '" style="transform:' + transform + '; display:block;">' + b + '</div>' +
                      '<div class="gantt-tick-dot" id="dot_' + i + '"></div>';
        ticksEl.appendChild(t);
      });

      /* Build phase labels */
      var PHASES = [
        { label: 'Herbst /\nBlattentwicklung', from: 10, to: 21 },
        { label: 'Bestockung',                  from: 21, to: 29 },
        { label: 'Schossen bis\nFahnenblatt',  from: 29, to: 51 },
        { label: '\u00c4hrenschieben\nbis Bl\u00fcte', from: 51, to: 69 },
        { label: 'Kornf\u00fcllung\nbis Reife', from: 69, to: 89 }
      ];
      var phasesTrack = document.getElementById('ganttPhasesTrack');
      if (phasesTrack) {
        phasesTrack.innerHTML = '';
        PHASES.forEach(function(ph) {
          var l = pos(ph.from), w = pos(ph.to) - l;
          var box = document.createElement('div');
          box.className = 'gantt-phase-box';
          box.style.left  = 'calc(' + l + '% + 4px)';
          box.style.width = 'calc(' + w + '% - 8px)';
          box.innerHTML = ph.label.replace(/\n/g, '<br>');
          phasesTrack.appendChild(box);
        });
      }

      /* Build grid lines + bars per row */
      ROWS.forEach(function(id) {
        var d    = DATA[id];
        var glEl = document.getElementById('gg_' + id);
        if (!glEl) return;
        glEl.innerHTML = '';
        ST.forEach(function(b, i) {
          var line = document.createElement('div');
          line.className = 'gantt-gl-line';
          line.style.left = (i / N * 100) + '%';
          glEl.appendChild(line);
        });
        var trk   = document.getElementById('gt_' + id);
        /* remove previously injected bars */
        var existingBar = trk.querySelector('.gantt-bar');
        if (existingBar) existingBar.remove();
        var left  = pos(d.from);
        var width = pos(d.to) - left;
        var bar   = document.createElement('div');
        bar.className = 'gantt-bar gantt-bar-' + d.cat;
        bar.style.left  = left + '%';
        bar.style.width = width + '%';
        var barLabel = d.products[0].n;
        bar.innerHTML = '<span class="gantt-bar-text">' + barLabel + '</span>';
        bar.onclick = (function(rowId) {
          return function(e) { e.stopPropagation(); window.ganttOpen(rowId); };
        })(id);
        trk.appendChild(bar);
      });

      window.ganttOpen = function(id) {
        var d = DATA[id];
        var cat = d.cat;
        var isFung = cat === 'fungizid';
        var badgeLabel = isFung ? 'Fungizid' : 'Herbizid';
        var accentColor = isFung ? '#2D7D3A' : '#E8590C';
        var accentBg    = isFung ? 'rgba(45,125,58,0.08)' : 'rgba(232,89,12,0.08)';
        var accentGrad  = isFung
            ? 'linear-gradient(135deg,rgba(45,125,58,0.15),rgba(45,125,58,0.45))'
            : 'linear-gradient(135deg,rgba(232,89,12,0.15),rgba(232,89,12,0.45))';

        /* Tags */
        var tagsHtml = d.targets.map(function(t) {
            return '<span style="border:1px solid rgba(0,0,0,0.15);border-radius:999px;padding:5px 12px;font-size:13px;font-weight:500;display:inline-flex;align-items:center;">' + t + '</span>';
        }).join('');

        /* Products table rows */
        var prodRows = d.products.map(function(pr) {
            return '<tr><td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.07);font-size:14px;color:#1d1d1f;">' + pr.n +
                   '</td><td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.07);font-size:14px;font-weight:700;text-align:right;color:#1d1d1f;">' + pr.d + '</td></tr>';
        }).join('');

        /* Product SVG illustration */
        var plantSvg = d.plant ? PLANT_SVG[d.plant] : '';

        /* Note */
        var noteText = d.note
            ? d.note.replace(/\n/g, '<br>')
            : '\u2013';

        document.getElementById('ganttSheetContent').innerHTML =
            /* ── HEAD ── */
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">' +
                '<div style="display:flex;align-items:center;gap:10px;">' +
                    '<span style="border:1.5px solid ' + accentColor + ';color:' + accentColor + ';border-radius:999px;padding:3px 12px;font-size:12px;font-weight:600;">' + badgeLabel + '</span>' +
                    '<span style="font-size:13px;color:#6e6e73;">BBCH ' + d.from + '\u2013' + d.to + '</span>' +
                '</div>' +
            '</div>' +
            '<div style="font-size:32px;font-weight:800;letter-spacing:-0.5px;color:#1d1d1f;margin:0 0 4px;line-height:1.1;">' + d.label + '</div>' +
            '<div style="font-size:15px;color:#6e6e73;margin-bottom:24px;">' + d.crop + '</div>' +

            /* ── 3 INFO CARDS ── */
            '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;">' +

                /* Card 1 – Wirkt gegen */
                '<div style="background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,0.08);padding:18px;">' +
                    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6e6e73;margin-bottom:12px;">Wirkt gegen</div>' +
                    '<div style="display:flex;flex-wrap:wrap;gap:6px;">' + tagsHtml + '</div>' +
                '</div>' +

                /* Card 2 – Anwendungsfenster */
                '<div style="background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,0.08);padding:18px;">' +
                    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6e6e73;margin-bottom:12px;">Anwendungsfenster</div>' +
                    '<div style="font-size:44px;font-weight:800;letter-spacing:-1px;color:#1d1d1f;line-height:1;">' + d.from + '\u2013' + d.to + '</div>' +
                    '<div style="font-size:13px;color:#6e6e73;margin-top:6px;">BBCH-Fenster der Kultur</div>' +
                '</div>' +

                /* Card 3 – Einsatzhinweis */
                '<div style="background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,0.08);padding:18px;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
                        '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6e6e73;">Einsatzhinweis</div>' +
                        '<span style="font-size:14px;color:#6e6e73;">\u2197</span>' +
                    '</div>' +
                    '<div style="font-size:14px;color:#3a3a3c;line-height:1.6;">' + noteText + '</div>' +
                '</div>' +

            '</div>' +

            /* ── PRODUKTKARTE ── */
            '<div style="border-top:1px solid rgba(0,0,0,0.08);margin:0 0 20px;"></div>' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">' +
                '<div>' +
                    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6e6e73;margin-bottom:4px;">Produktkarte</div>' +
                    '<div style="font-size:18px;font-weight:700;color:#1d1d1f;">Produkt, Details &amp; Downloads</div>' +
                '</div>' +
                '<span style="font-size:18px;color:#6e6e73;">\u2197</span>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:60% 40%;gap:16px;">' +

                /* Left: product mockup */
                '<div style="background:#f5f5f7;border-radius:14px;padding:24px;display:flex;flex-direction:column;gap:16px;">' +
                    '<span style="border:1.5px solid ' + accentColor + ';color:' + accentColor + ';border-radius:999px;padding:3px 10px;font-size:11px;font-weight:600;width:fit-content;">' + badgeLabel + '</span>' +
                    (d.img ? '<img src="/' + d.img + '" style="display:block;width:70%;max-height:260px;object-fit:contain;margin:0 auto;padding:16px;background:#f5f5f7;border-radius:10px;">' : '') +
                    '<div>' +
                        '<div style="font-size:16px;font-weight:700;color:#1d1d1f;line-height:1.3;">' + d.products[0].n + '</div>' +
                        '<div style="font-size:11px;color:#6e6e73;margin-top:8px;">Bayer CropScience Deutschland GmbH</div>' +
                    '</div>' +
                '</div>' +

                /* Right: downloads + dosage */
                '<div>' +
                    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6e6e73;margin-bottom:4px;">Downloads</div>' +
                    ['Sicherheitsdatenblatt','Gebrauchsanleitung','Leistungsprofil','L\u00fcckenindikationen','Abst\u00e4nde Gew\u00e4sser &amp; Hangneigung'].map(function(dl) {
                        return '<div style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.07);display:flex;justify-content:space-between;font-size:14px;color:#1d1d1f;cursor:pointer;">' + dl + '<span style="color:#6e6e73;">\u2197</span></div>';
                    }).join('') +
                    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6e6e73;margin:16px 0 8px;">Aufwandmengen</div>' +
                    '<table style="width:100%;border-collapse:collapse;">' +
                        '<tr><th style="font-size:11px;text-transform:uppercase;color:#6e6e73;font-weight:700;text-align:left;padding-bottom:6px;">Produkt</th>' +
                            '<th style="font-size:11px;text-transform:uppercase;color:#6e6e73;font-weight:700;text-align:right;padding-bottom:6px;">Aufwandmenge</th></tr>' +
                        prodRows +
                    '</table>' +
                '</div>' +
            '</div>' +

            /* ── FOOTER BUTTON ── */
            '<button onclick="ganttClose()" style="width:100%;margin-top:24px;padding:16px 24px;background:#1d1d1f;color:#fff;border:none;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:background 0.15s;" onmouseover="this.style.background=\'#3a3a3c\'" onmouseout="this.style.background=\'#1d1d1f\'">Zur Produktdetailseite \u2197</button>';

        document.getElementById('ganttOv').classList.add('on');
        document.getElementById('ganttSheet').classList.add('on');
      };

      /* Sync horizontal scroll: sticky head slides with gantt-wrap */
      (function() {
        var wrapEl = document.getElementById('ganttWrap');
        var ganttInnerHead = document.getElementById('ganttInnerHead');
        if (!wrapEl || !ganttInnerHead) return;
        wrapEl.addEventListener('scroll', function() {
          ganttInnerHead.style.marginLeft = '-' + wrapEl.scrollLeft + 'px';
        });
      })();

      window.toggleBbchImg = function() {
        var wrap = document.getElementById('bbchImgWrap');
        var hint = document.getElementById('bbchImgHint');
        if (!wrap) return;
        wrap.classList.toggle('expanded');
        hint.textContent = wrap.classList.contains('expanded')
            ? 'Tippen zum Verkleinern \u2195'
            : 'Tippen zum Vergr\u00f6\u00dfern \u2195';
      };

      window.ganttClose = function() {
        document.getElementById('ganttOv').classList.remove('on');
        document.getElementById('ganttSheet').classList.remove('on');
      };

      window.applyDropdownFilter = function() {
        var unkraut   = document.getElementById('filterUnkraut').value.toLowerCase();
        var krankheit = document.getElementById('filterKrankheit').value.toLowerCase();
        document.querySelectorAll('.gantt-row').forEach(function(row) {
          var id = row.dataset.id;
          var d = DATA[id];
          if (!d) { row.classList.remove('g-hidden'); return; }
          var targets = d.targets.map(function(t){ return t.toLowerCase(); });
          var okU = !unkraut   || targets.some(function(t){ return t.indexOf(unkraut) !== -1; });
          var okK = !krankheit || targets.some(function(t){ return t.indexOf(krankheit) !== -1; });
          row.classList.toggle('g-hidden', !(okU && okK));
        });
        /* Hide groups where all rows are hidden */
        document.querySelectorAll('.gantt-group').forEach(function(grp) {
          var rows = grp.querySelectorAll('.gantt-row');
          var anyVisible = Array.prototype.some.call(rows, function(r) { return !r.classList.contains('g-hidden'); });
          grp.style.display = anyVisible ? '' : 'none';
        });
      };
      window.ganttFilter = window.applyDropdownFilter;
    })();

    return () => {
      delete window.ganttOpen;
      delete window.ganttClose;
      delete window.applyDropdownFilter;
      delete window.ganttFilter;
      delete window.toggleBbchImg;
      delete window.refreshCursorLine;
    };
  }, [])

  function handleTabClick(idx) {
    setActiveTab(idx)
  }

  return (
    <>
      <section className="screen-section" id="produkte">
        <div className="section-inner">
          <div className="breadcrumb">Frühjahrssaison / 85665, Mais</div>
          <h1 className="page-title">Produkte im Einsatz</h1>
          <div className="page-subtitle">Einsatzempfehlungen nach BBCH-Stadien</div>

          <div className="tab-row">
            <button
              className={'tab-btn' + (activeTab === 0 ? ' active' : '')}
              onClick={() => handleTabClick(0)}
            >BBCH – Einsatzempfehlungen aktuell</button>
            <button
              className={'tab-btn' + (activeTab === 1 ? ' active' : '')}
              onClick={() => handleTabClick(1)}
            >Berater – Empfehlungen</button>
          </div>

          {/* Filter Dropdowns */}
          <div className="filter-dropdowns">
            <div className="fc-card">
              <div className="fc-eyebrow">Filter</div>
              <div className="fc-cardtitle">Unkräuter / Gräser</div>
              <div className="fc-selectwrap">
                <select className="filter-select" id="filterUnkraut" onChange={() => window.applyDropdownFilter && window.applyDropdownFilter()}>
                  <option value="">Alle Unkräuter und Gräser</option>
                  <option>Ackerfuchsschwanz</option>
                  <option>Windhalm</option>
                  <option>Trespen-Arten</option>
                  <option>Weidelgräser</option>
                  <option>Rispen</option>
                  <option>Flughafer</option>
                  <option>Mischverunkrautung</option>
                </select>
                <div className="fc-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg></div>
              </div>
            </div>
            <div className="fc-card">
              <div className="fc-eyebrow">Filter</div>
              <div className="fc-cardtitle">Krankheiten / Schaderreger</div>
              <div className="fc-selectwrap">
                <select className="filter-select" id="filterKrankheit" onChange={() => window.applyDropdownFilter && window.applyDropdownFilter()}>
                  <option value="">Alle Krankheiten und Schaderreger</option>
                  <option>Septoria</option>
                  <option>Halmbruch</option>
                  <option>Mehltau</option>
                  <option>Rostarten</option>
                  <option>DTR</option>
                  <option>Fusarium</option>
                  <option>Ährenfusarium</option>
                  <option>DON-Reduktion</option>
                </select>
                <div className="fc-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg></div>
              </div>
            </div>
          </div>

          {/* Legende */}
          <div className="gantt-legend">
            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
              <span className="gantt-legend-pill gantt-legend-pill-f">Fungizid</span>
              <span className="gantt-legend-pill gantt-legend-pill-h">Herbizid</span>
            </div>
            <span className="gantt-legend-hint">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Balken antippen für Details
            </span>
          </div>

          {/* Gantt Chart – outer container */}
          <div className="gantt-outer-container">

            {/* Sticky BBCH Header (scale + phases) */}
            <div className="gantt-sticky-head" id="ganttStickyHead">
              <div className="gantt-inner-head" id="ganttInnerHead">
                {/* Scale row */}
                <div className="gantt-scale" style={{overflow:'visible',position:'relative'}}>
                  <div className="gantt-scale-label">BBCH</div>
                  <div className="gantt-scale-ticks" id="ganttTicks" ref={ticksRef}>
                    {/* React-controlled cursor bubble */}
                    <div
                      className="bbch-cursor"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: `${cursorPct}%`,
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        pointerEvents: 'none',
                      }}
                    >
                      <div
                        ref={bubbleRef}
                        className="bbch-cursor-bubble"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#007AFF',
                          color: '#fff',
                          borderRadius: '12px',
                          padding: '6px 12px',
                          minWidth: '52px',
                          cursor: 'grab',
                          userSelect: 'none',
                          pointerEvents: 'auto',
                          boxShadow: '0 4px 16px rgba(0,122,255,0.45)',
                          gap: '1px',
                        }}
                      >
                        <span className="bbch-cursor-label" style={{fontSize:'9px',fontWeight:600,letterSpacing:'0.5px',opacity:0.85,lineHeight:1}}>BBCH</span>
                        <strong className="bbch-cursor-val" style={{fontSize:'18px',fontWeight:800,lineHeight:1}}>{ST[cursorIdx]}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Phase Labels Row */}
                <div className="gantt-phases" id="ganttPhases">
                  <div className="gantt-phases-spacer"></div>
                  <div className="gantt-phases-track" id="ganttPhasesTrack"></div>
                </div>
              </div>
            </div>

            {/* Scrollable rows */}
            <div className="gantt-wrap" id="ganttWrap">
              <div className="gantt-inner" id="ganttInner">
                {/* React-controlled vertical cursor line */}
                <div
                  className="bbch-cursor-line"
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: lineLeft,
                    width: '2px',
                    background: '#007AFF',
                    opacity: 0.6,
                    pointerEvents: 'none',
                    zIndex: 4,
                  }}
                />

                {/* FUNGIZIDE GROUP */}
                <div className="gantt-group gantt-group-fungizid">
                  <div className="gantt-group-hd">
                    <div className="gantt-group-hd-left">
                      <span className="gantt-group-dot" style={{color:'#2D7D3A'}}>●</span>
                      <div>
                        <div className="gantt-group-title">Fungizid</div>
                        <div className="gantt-group-sub">Krankheitsbekämpfung</div>
                      </div>
                    </div>
                    <span className="gantt-group-count">3 MASSNAHMEN</span>
                  </div>
                  <div className="gantt-group-rows">
                    <div className="gantt-row" data-id="f1" data-cat="fungizid" onClick={() => window.ganttOpen && window.ganttOpen('f1')}>
                      <div className="gantt-row-label">
                        <div className="gantt-row-bbch">BBCH 29–32</div>
                        <div className="gantt-row-name">T1 — Halmkrankheiten</div>
                        <div className="gantt-row-cat">Winter- / Sommerweizen</div>
                      </div>
                      <div className="gantt-track" id="gt_f1"><div className="gantt-gl" id="gg_f1"></div></div>
                    </div>
                    <div className="gantt-row" data-id="f2" data-cat="fungizid" onClick={() => window.ganttOpen && window.ganttOpen('f2')}>
                      <div className="gantt-row-label">
                        <div className="gantt-row-bbch">BBCH 37–51</div>
                        <div className="gantt-row-name">T2 — Blatt &amp; Abreife</div>
                        <div className="gantt-row-cat">Winter- / Sommerweizen</div>
                      </div>
                      <div className="gantt-track" id="gt_f2"><div className="gantt-gl" id="gg_f2"></div></div>
                    </div>
                    <div className="gantt-row" data-id="f3" data-cat="fungizid" onClick={() => window.ganttOpen && window.ganttOpen('f3')}>
                      <div className="gantt-row-label">
                        <div className="gantt-row-bbch">BBCH 59–69</div>
                        <div className="gantt-row-name">T3 — Ährenkrankheiten</div>
                        <div className="gantt-row-cat">Winter- / Sommerweizen</div>
                      </div>
                      <div className="gantt-track" id="gt_f3"><div className="gantt-gl" id="gg_f3"></div></div>
                    </div>
                  </div>
                </div>

                {/* HERBIZIDE GROUP */}
                <div className="gantt-group gantt-group-herbizid">
                  <div className="gantt-group-hd">
                    <div className="gantt-group-hd-left">
                      <span className="gantt-group-dot" style={{color:'#E8590C'}}>●</span>
                      <div>
                        <div className="gantt-group-title">Herbizid</div>
                        <div className="gantt-group-sub">Gräser- und Unkrautkontrolle</div>
                      </div>
                    </div>
                    <span className="gantt-group-count">6 MASSNAHMEN</span>
                  </div>
                  <div className="gantt-group-rows">
                    <div className="gantt-row" data-id="h1" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h1')}>
                      <div className="gantt-row-label">
                        <div className="gantt-row-bbch">BBCH 21–37</div>
                        <div className="gantt-row-name">Ackerfuchsschwanz normal</div>
                        <div className="gantt-row-cat">Winterweizen · Triticale</div>
                      </div>
                      <div className="gantt-track" id="gt_h1"><div className="gantt-gl" id="gg_h1"></div></div>
                    </div>
                    <div className="gantt-row" data-id="h2" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h2')}>
                      <div className="gantt-row-label">
                        <div className="gantt-row-bbch">BBCH 21–37</div>
                        <div className="gantt-row-name">Ackerfuchsschwanz extrem &amp; Trespen</div>
                        <div className="gantt-row-cat">WW · WHW · Triticale</div>
                      </div>
                      <div className="gantt-track" id="gt_h2"><div className="gantt-gl" id="gg_h2"></div></div>
                    </div>
                    <div className="gantt-row" data-id="h3" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h3')}>
                      <div className="gantt-row-label">
                        <div className="gantt-row-bbch">BBCH 25–37</div>
                        <div className="gantt-row-name">Trespen — kein Rapsnachbau</div>
                        <div className="gantt-row-cat">Winterweizen</div>
                      </div>
                      <div className="gantt-track" id="gt_h3"><div className="gantt-gl" id="gg_h3"></div></div>
                    </div>
                    <div className="gantt-row" data-id="h4" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h4')}>
                      <div className="gantt-row-label">
                        <div className="gantt-row-bbch">BBCH 21–37</div>
                        <div className="gantt-row-name">Trespen — mit Rapsnachbau</div>
                        <div className="gantt-row-cat">Winterweizen</div>
                      </div>
                      <div className="gantt-track" id="gt_h4"><div className="gantt-gl" id="gg_h4"></div></div>
                    </div>
                    <div className="gantt-row" data-id="h5" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h5')}>
                      <div className="gantt-row-label">
                        <div className="gantt-row-bbch">BBCH 29–37</div>
                        <div className="gantt-row-name">Windhalm &amp; Mischverunkrautung + AHL</div>
                        <div className="gantt-row-cat">WW — Windhalmstandorte</div>
                      </div>
                      <div className="gantt-track" id="gt_h5"><div className="gantt-gl" id="gg_h5"></div></div>
                    </div>
                    <div className="gantt-row" data-id="h6" data-cat="herbizid" onClick={() => window.ganttOpen && window.ganttOpen('h6')}>
                      <div className="gantt-row-label">
                        <div className="gantt-row-bbch">BBCH 29–37</div>
                        <div className="gantt-row-name">Windhalm — Standardbehandlung</div>
                        <div className="gantt-row-cat">WW · Roggen · Triticale</div>
                      </div>
                      <div className="gantt-track" id="gt_h6"><div className="gantt-gl" id="gg_h6"></div></div>
                    </div>
                  </div>
                </div>

              </div>{/* /gantt-inner */}
            </div>{/* /gantt-wrap */}
          </div>{/* /gantt-outer-container */}

        </div>
      </section>

      {/* GANTT OVERLAY + BOTTOM SHEET */}
      <div className="g-overlay" id="ganttOv" onClick={() => window.ganttClose && window.ganttClose()}></div>
      <div className="g-sheet" id="ganttSheet">
        <div className="g-drag-handle"></div>
        <button className="g-sheet-close" onClick={() => window.ganttClose && window.ganttClose()}>&#x2715;</button>
        <div id="ganttSheetContent"></div>
      </div>
    </>
  )
}

export default Produkte
