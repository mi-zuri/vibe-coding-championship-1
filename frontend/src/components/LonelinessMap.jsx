import { useEffect, useRef, useState } from 'react';

const VOIVS = [
  { id: 'ZP', name: 'Zachodniopomorskie',  loc: 'Zachodniopomorskiem',  n: 210, cx: 260,  cy: 340 },
  { id: 'PM', name: 'Pomorskie',           loc: 'Pomorskiem',           n: 248, cx: 620,  cy: 230 },
  { id: 'WM', name: 'Warmińsko-Mazurskie', loc: 'Warmińsko-Mazurskiem', n: 176, cx: 920,  cy: 310 },
  { id: 'LB', name: 'Lubuskie',            loc: 'Lubuskiem',            n: 118, cx: 230,  cy: 620 },
  { id: 'WP', name: 'Wielkopolskie',       loc: 'Wielkopolsce',         n: 312, cx: 480,  cy: 640 },
  { id: 'KP', name: 'Kujawsko-Pomorskie',  loc: 'Kujawsko-Pomorskiem',  n: 196, cx: 660,  cy: 500 },
  { id: 'MZ', name: 'Mazowieckie',         loc: 'Mazowieckiem',         n: 520, cx: 940,  cy: 620 },
  { id: 'PD', name: 'Podlaskie',           loc: 'Podlaskiem',           n: 164, cx: 1180, cy: 500 },
  { id: 'LD', name: 'Łódzkie',             loc: 'Łódzkiem',             n: 218, cx: 700,  cy: 770 },
  { id: 'LU', name: 'Lubelskie',           loc: 'Lubelskiem',           n: 246, cx: 1120, cy: 830 },
  { id: 'SW', name: 'Świętokrzyskie',      loc: 'Świętokrzyskiem',      n:  96, cx: 870,  cy: 940 },
  { id: 'DS', name: 'Dolnośląskie',        loc: 'Dolnośląskiem',        n: 236, cx: 330,  cy: 880 },
  { id: 'OP', name: 'Opolskie',            loc: 'Opolskiem',             n:  88, cx: 530,  cy: 980 },
  { id: 'SL', name: 'Śląskie',             loc: 'Śląskiem',             n: 285, cx: 680,  cy: 1060 },
  { id: 'MA', name: 'Małopolskie',         loc: 'Małopolsce',           n: 182, cx: 840,  cy: 1140 },
  { id: 'PK', name: 'Podkarpackie',        loc: 'Podkarpackiem',        n: 204, cx: 1100, cy: 1140 },
];
const VOIV_BY_ID = Object.fromEntries(VOIVS.map(v => [v.id, v]));
const TOTAL_WAITING = VOIVS.reduce((s, v) => s + v.n, 0);
const N_VALS = VOIVS.map(v => v.n);
const N_MIN = Math.min(...N_VALS);
const N_MAX = Math.max(...N_VALS);

const CITIES = [
  { name: 'Warszawa', x: 1000, y: 660 },
  { name: 'Kraków',   x: 840,  y: 1160 },
  { name: 'Gdańsk',   x: 620,  y: 180 },
  { name: 'Wrocław',  x: 340,  y: 870 },
  { name: 'Poznań',   x: 430,  y: 600 },
  { name: 'Łódź',     x: 720,  y: 770 },
];

function fillFor(n) {
  const t = (n - N_MIN) / (N_MAX - N_MIN);
  const pct = Math.round(22 + t * 70);
  return `color-mix(in srgb, var(--primary) ${pct}%, var(--primary-tint))`;
}

function firstCoord(d) {
  if (!d) return null;
  const m = d.match(/[Mm]\s*(-?\d*\.?\d+)[\s,]+(-?\d*\.?\d+)/);
  if (!m) return null;
  return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
}

function nearestVoiv(x, y) {
  let best = VOIVS[0];
  let bestD = Infinity;
  for (const v of VOIVS) {
    const dx = v.cx - x;
    const dy = v.cy - y;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestD) { bestD = d2; best = v; }
  }
  return best;
}

export default function LonelinessMap() {
  const containerRef = useRef(null);
  const tipRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let svg = null;

    (async () => {
      let raw;
      try {
        const res = await fetch('/poland.svg');
        raw = await res.text();
      } catch {
        if (!cancelled) setFailed(true);
        return;
      }
      if (cancelled) return;

      let srcSvg = null;
      try {
        const xdoc = new DOMParser().parseFromString(raw, 'image/svg+xml');
        srcSvg = xdoc.querySelector('parsererror') ? null : xdoc.querySelector('svg');
      } catch (_) {}
      if (!srcSvg) {
        const hdoc = new DOMParser().parseFromString(raw, 'text/html');
        srcSvg = hdoc.querySelector('svg');
      }
      if (!srcSvg) { setFailed(true); return; }

      const svgNS = 'http://www.w3.org/2000/svg';
      svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', srcSvg.getAttribute('viewBox') || '0 0 1500 1428.8');
      svg.setAttribute('class', 'map-svg');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'Mapa Polski — seniorzy oczekujący na wolontariusza wg województw');

      const srcPaths = srcSvg.querySelectorAll('path');
      srcPaths.forEach(sp => {
        const d = sp.getAttribute('d');
        if (!d) return;
        const p = document.createElementNS(svgNS, 'path');
        p.setAttribute('d', d);
        p.setAttribute('stroke', 'var(--bg)');
        p.setAttribute('stroke-width', '1.2');
        p.setAttribute('stroke-linejoin', 'round');
        const c = firstCoord(d);
        const voiv = c ? nearestVoiv(c.x, c.y) : null;
        if (voiv) {
          p.setAttribute('fill', fillFor(voiv.n));
          p.setAttribute('data-voiv', voiv.id);
        } else {
          p.setAttribute('fill', 'var(--primary-tint)');
        }
        svg.appendChild(p);
      });

      VOIVS.forEach(v => {
        const label = document.createElementNS(svgNS, 'text');
        label.setAttribute('x', v.cx);
        label.setAttribute('y', v.cy);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-family', 'Lora, Georgia, serif');
        label.setAttribute('font-style', 'italic');
        label.setAttribute('font-size', '22');
        label.setAttribute('fill', '#2a2a2a');
        label.setAttribute('opacity', '0.55');
        label.setAttribute('pointer-events', 'none');
        label.textContent = v.name.length > 14 ? v.id : v.name.toLowerCase();
        svg.appendChild(label);
      });

      CITIES.forEach(c => {
        const dot = document.createElementNS(svgNS, 'circle');
        dot.setAttribute('cx', c.x);
        dot.setAttribute('cy', c.y);
        dot.setAttribute('r', 6);
        dot.setAttribute('fill', '#2a2a2a');
        dot.setAttribute('opacity', '0.8');
        dot.setAttribute('pointer-events', 'none');
        svg.appendChild(dot);
        const t = document.createElementNS(svgNS, 'text');
        t.setAttribute('x', c.x + 12);
        t.setAttribute('y', c.y + 6);
        t.setAttribute('font-family', 'Source Sans 3, sans-serif');
        t.setAttribute('font-size', '22');
        t.setAttribute('font-weight', '600');
        t.setAttribute('fill', '#2a2a2a');
        t.setAttribute('opacity', '0.95');
        t.setAttribute('pointer-events', 'none');
        t.textContent = c.name;
        svg.appendChild(t);
      });

      container.appendChild(svg);

      const tip = tipRef.current;
      let currentSelected = null;
      const setCurrentSelected = (id) => {
        currentSelected = id;
        setSelected(id);
      };

      const highlightVoiv = (id) => {
        svg.querySelectorAll('path[data-voiv]').forEach(p => {
          if (p.getAttribute('data-voiv') === id) {
            p.setAttribute('stroke', '#2a2a2a');
            p.setAttribute('stroke-width', '1.8');
          } else {
            p.setAttribute('stroke', 'var(--bg)');
            p.setAttribute('stroke-width', '1.2');
            p.style.opacity = currentSelected && currentSelected !== id ? '0.55' : '1';
          }
        });
      };

      const clearHighlight = () => {
        svg.querySelectorAll('path[data-voiv]').forEach(p => {
          p.setAttribute('stroke', 'var(--bg)');
          p.setAttribute('stroke-width', '1.2');
          p.style.opacity = currentSelected
            ? (p.getAttribute('data-voiv') === currentSelected ? '1' : '0.55')
            : '1';
        });
        if (currentSelected) {
          svg.querySelectorAll(`path[data-voiv="${currentSelected}"]`).forEach(p => {
            p.setAttribute('stroke', '#2a2a2a');
            p.setAttribute('stroke-width', '2');
          });
        }
      };

      const onMove = (e) => {
        const target = e.target.closest('path[data-voiv]');
        if (!target) { tip.classList.remove('vis'); clearHighlight(); return; }
        const id = target.getAttribute('data-voiv');
        const v = VOIV_BY_ID[id];
        tip.querySelector('.t-name').textContent = v.name;
        tip.querySelector('.t-num').textContent = `${v.n} osób czeka`;
        tip.classList.add('vis');
        const rect = container.getBoundingClientRect();
        tip.style.left = (e.clientX - rect.left) + 'px';
        tip.style.top = (e.clientY - rect.top) + 'px';
        highlightVoiv(id);
      };
      const onLeave = () => { tip.classList.remove('vis'); clearHighlight(); };
      const onClick = (e) => {
        const target = e.target.closest('path[data-voiv]');
        if (!target) return;
        setCurrentSelected(target.getAttribute('data-voiv'));
        clearHighlight();
      };

      svg.addEventListener('mousemove', onMove);
      svg.addEventListener('mouseleave', onLeave);
      svg.addEventListener('click', onClick);
    })();

    return () => {
      cancelled = true;
      if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
    };
  }, []);

  const selectedVoiv = selected ? VOIV_BY_ID[selected] : null;

  return (
    <section className="section section-alt" id="mapa">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="kicker">Mapa samotności</div>
            <h2>Gdzie seniorzy czekają na wolontariusza.</h2>
          </div>
          <p className="lede">
            Liczby zgłoszeń z linii wsparcia i placówek partnerskich — stan na
            kwiecień 2026. Najedź na województwo.
          </p>
        </div>

        <div className="map-wrap">
          <div ref={containerRef} style={{ position: 'relative' }}>
            {failed && (
              <p style={{ color: 'var(--ink-mute)', padding: 40, textAlign: 'center' }}>
                Mapa chwilowo niedostępna.
              </p>
            )}
          </div>

          <div className="map-side">
            <h3>
              Ponad <em>{TOTAL_WAITING.toLocaleString('pl-PL').replace(',', ' ')}</em> seniorów w kolejce
            </h3>
            <p>
              To są osoby, które samodzielnie zadzwoniły lub zostały zgłoszone
              przez ośrodek pomocy. Każda czeka średnio <strong>6 tygodni</strong> na
              pierwsze spotkanie. Twój region może być najbliżej Ciebie.
            </p>

            <div className="map-legend" aria-hidden="true">
              <span>mniej</span>
              <div className="bar" />
              <span>więcej</span>
            </div>

            <div className="map-readout">
              <div className="label">W twoim regionie</div>
              <div className="value">
                {selectedVoiv ? (
                  <><em>{selectedVoiv.n}</em> osób czeka w {selectedVoiv.loc}</>
                ) : (
                  <span className="placeholder">wybierz województwo na mapie</span>
                )}
              </div>
              <div className="hint">
                Kliknij w dowolne województwo, aby zobaczyć liczbę oczekujących.
              </div>
            </div>
          </div>

          <div className="map-tooltip" ref={tipRef} role="tooltip">
            <div className="t-name">—</div>
            <div className="t-num">—</div>
          </div>
        </div>
      </div>
    </section>
  );
}
