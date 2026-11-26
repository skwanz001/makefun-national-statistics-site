// Grafik SVG buatan sendiri (tanpa library): garis dan batang dari seri tahunan.
// Satu-satunya dependensi adalah data.js — tidak ada fetch, tidak ada CDN.

import { YEARS, fmt, fmtShort } from './data.js';

const NS = 'http://www.w3.org/2000/svg';
const W = 920;
const H = 340;
const PAD = { top: 26, right: 14, bottom: 34, left: 62 };

function el(tag, attrs = {}, text = null) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== null) node.textContent = text;
  return node;
}

function niceTicks(min, max, count = 5) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const raw = span / (count - 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = norm < 1.5 ? mag : norm < 3.5 ? 2 * mag : norm < 7.5 ? 5 * mag : 10 * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step * 0.5; v += step) ticks.push(v);
  return { lo, hi, ticks };
}

// Gambar satu grafik seri tahunan ke dalam <svg> yang sudah ada di halaman.
// `onPick(year, value)` dipanggil saat pengguna mengeklik / mengetuk titik.
export function drawChart(svg, indicator, kind, onPick) {
  const values = indicator.values;
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const padMin = kind === 'bar' ? Math.min(0, minV) : minV;
  const { lo, hi, ticks } = niceTicks(padMin, maxV);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (i / (YEARS.length - 1)) * innerW;
  const y = (v) => PAD.top + (1 - (v - lo) / (hi - lo)) * innerH;

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Grafik ${indicator.name} Indonesia 2015–2024`);
  svg.innerHTML = '';

  for (const t of ticks) {
    svg.appendChild(el('line', { x1: PAD.left, x2: W - PAD.right, y1: y(t), y2: y(t), class: 'grid' }));
    svg.appendChild(el('text', { x: PAD.left - 8, y: y(t) + 4, 'text-anchor': 'end', class: 'tick-label' }, fmtShort(t, indicator.format)));
  }
  svg.appendChild(el('line', { x1: PAD.left, x2: W - PAD.right, y1: y(lo), y2: y(lo), class: 'axis' }));
  YEARS.forEach((yr, i) => {
    svg.appendChild(el('text', { x: x(i), y: H - 10, 'text-anchor': 'middle', class: 'tick-label' }, String(yr)));
  });

  if (kind === 'bar') {
    const bw = Math.min(46, (innerW / YEARS.length) * 0.62);
    values.forEach((v, i) => {
      const top = y(Math.max(v, 0));
      const bottom = y(Math.min(v, 0));
      const bar = el('rect', {
        x: x(i) - bw / 2, y: top, width: bw, height: Math.max(1, bottom - top),
        class: v < 0 ? 'bar neg' : 'bar', rx: 2,
      });
      bar.appendChild(el('title', {}, `${YEARS[i]}: ${fmt(v, indicator.format)}`));
      svg.appendChild(bar);
      svg.appendChild(el('text', { x: x(i), y: top - 6, 'text-anchor': 'middle', class: 'dot-label' }, fmtShort(v, indicator.format)));
    });
  } else {
    const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const area = `M ${x(0).toFixed(1)},${y(lo).toFixed(1)} L ${values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' L ')} L ${x(YEARS.length - 1).toFixed(1)},${y(lo).toFixed(1)} Z`;
    svg.appendChild(el('path', { d: area, class: 'area' }));
    svg.appendChild(el('path', { d: `M ${pts.replaceAll(' ', ' L ')}`, class: 'line' }));
    values.forEach((v, i) => {
      const dot = el('circle', { cx: x(i), cy: y(v), r: 6, class: 'dot', tabindex: 0 });
      dot.appendChild(el('title', {}, `${YEARS[i]}: ${fmt(v, indicator.format)}`));
      dot.addEventListener('click', () => onPick && onPick(YEARS[i], v));
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick && onPick(YEARS[i], v); }
      });
      svg.appendChild(dot);
    });
    // Label nilai di titik pertama, terendah, dan terakhir supaya terbaca tanpa hover.
    // Label titik pertama/terakhir digeser ke samping titik (bukan di atasnya)
    // supaya tidak menabrak label sumbu-y di tepi grafik.
    const labelIdx = [0, values.indexOf(minV), YEARS.length - 1].filter((v, i, a) => a.indexOf(v) === i);
    labelIdx.forEach((i) => {
      if (i === 0) {
        svg.appendChild(el('text', { x: x(i) + 11, y: y(values[i]) + 4, 'text-anchor': 'start', class: 'dot-label' }, fmtShort(values[i], indicator.format)));
      } else if (i === YEARS.length - 1) {
        svg.appendChild(el('text', { x: x(i) - 11, y: y(values[i]) + 4, 'text-anchor': 'end', class: 'dot-label' }, fmtShort(values[i], indicator.format)));
      } else {
        svg.appendChild(el('text', { x: x(i), y: y(values[i]) - 13, 'text-anchor': 'middle', class: 'dot-label' }, fmtShort(values[i], indicator.format)));
      }
    });
  }
}
