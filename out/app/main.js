// AngkaNusa — router hash dan pengikat kontrol. Situs ini statis: semua halaman
// dirender dari data.js di browser, tanpa satu pun permintaan jaringan.
//
//   #/ .................... beranda
//   #/ekonomi ........... PDB, pertumbuhan, PDB/kapita, inflasi
//   #/penduduk .......... populasi, harapan hidup
//   #/ketenagakerjaan ... pengangguran, TPAK, upah
//   #/sosial ............ kemiskinan, gini
//   #/data .............. semua tabel + unduh CSV + sumber
//
// window.__shotReady false selama halaman dirender, true sesudahnya, supaya
// skrip screenshot tahu kapan menangkap layar.

import { YEARS, INDICATORS, indicatorById, valueAt, fmt } from './data.js';
import { drawChart } from './charts.js';
import * as views from './views.js';

const app = document.getElementById('app');

const ROUTES = {
  '': views.home,
  '/': views.home,
  '/ekonomi': views.ekonomi,
  '/penduduk': views.penduduk,
  '/ketenagakerjaan': views.ketenagakerjaan,
  '/sosial': views.sosial,
  '/data': views.semuaData,
};

// Gambar semua <svg data-chart> di halaman dan pasang readout klik-titik.
function mountCharts(root) {
  root.querySelectorAll('svg[data-chart]').forEach((svg) => {
    const box = svg.closest('.chart-box');
    const readout = box ? box.querySelector('[data-readout]') : null;
    const title = box ? box.querySelector('[data-chart-title]') : null;
    const note = box ? box.querySelector('[data-chart-note]') : null;
    const redraw = (indicator, kind) => {
      drawChart(svg, indicator, kind, (year, value) => {
        if (readout) {
          readout.innerHTML = `<strong>${year}:</strong> ${indicator.name} ${fmt(value, indicator.format)}`;
        }
      });
    };
    const indicator = indicatorById(svg.dataset.indicator);
    redraw(indicator, svg.dataset.kind || 'line');
    // Tombol pengalih metrik letaknya di luar .chart-box (di atas grafik), jadi
    // dipasang di level halaman: satu halaman punya satu grafik + satu switcher.
    root.querySelectorAll('[data-metric]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = indicatorById(btn.dataset.metric);
        root.querySelectorAll('[data-metric]').forEach((b) =>
          b.setAttribute('aria-pressed', String(b === btn)));
        if (title) title.textContent = `${next.name} 2015–2024`;
        if (note) note.textContent = next.note;
        if (readout) readout.textContent = 'Klik titik pada grafik untuk melihat nilainya.';
        // Pertumbuhan paling enak dibaca sebagai batang (ada nilai negatif 2020).
        redraw(next, next.id === 'pertumbuhan' ? 'bar' : 'line');
      });
    });
  });
}

// Panel "Sorotan tahun" di halaman Semua Data: semua indikator untuk satu tahun.
function renderSpotlight(year) {
  const host = document.getElementById('year-spotlight');
  if (!host) return;
  const cards = INDICATORS.map((ind) => {
    const v = valueAt(ind, year);
    return `<div class="card">
      <p class="label">${ind.short}</p>
      <p class="value" style="font-size:24px">${fmt(v, ind.format)}</p>
      <p class="source">${ind.source}</p>
    </div>`;
  }).join('');
  host.innerHTML = `<h2>Sorotan ${year}</h2><div class="cards">${cards}</div>`;
}

// Tabel lengkap -> CSV, dibuat di browser dari data.js (tanpa jaringan).
function downloadCsv() {
  const head = ['Indikator', 'Satuan', ...YEARS].join(',');
  const lines = INDICATORS.map((ind) => {
    const cells = YEARS.map((y) => valueAt(ind, y)).join(',');
    return `"${ind.name}","${ind.unit}",${cells}`;
  });
  const csv = [head, ...lines].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'indonesia-statistik-2015-2024.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function mountDataPage(root) {
  const select = root.querySelector('#year-select');
  if (select) {
    renderSpotlight(Number(select.value));
    select.addEventListener('change', () => renderSpotlight(Number(select.value)));
  }
  const search = root.querySelector('#indicator-search');
  const note = root.querySelector('#search-note');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      root.querySelectorAll('#all-table tbody tr').forEach((tr) => {
        const hit = !q || tr.dataset.name.includes(q);
        tr.style.display = hit ? '' : 'none';
        if (hit) shown += 1;
      });
      if (note) note.textContent = q ? `${shown} dari ${INDICATORS.length} indikator cocok dengan “${search.value.trim()}”.` : '';
    });
  }
  const btn = root.querySelector('#download-csv');
  if (btn) btn.addEventListener('click', downloadCsv);
}

function render() {
  window.__shotReady = false;
  const path = location.hash.replace(/^#/, '') || '/';
  const view = ROUTES[path] || null;
  document.title = view
    ? `${path === '/' || path === '' ? 'AngkaNusa — Statistik Indonesia dalam Angka' : `${documentTitle(path)} | AngkaNusa`}`
    : 'Tidak ditemukan | AngkaNusa';
  app.innerHTML = view ? view() : views.notFound(path);
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const key = a.dataset.nav;
    const active = (key === 'home' && (path === '/' || path === '')) || path === `/${key}`;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  mountCharts(app);
  mountDataPage(app);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function documentTitle(path) {
  return { '/ekonomi': 'Ekonomi', '/penduduk': 'Penduduk', '/ketenagakerjaan': 'Kerja', '/sosial': 'Sosial', '/data': 'Semua Data' }[path] || 'AngkaNusa';
}

window.addEventListener('hashchange', render);
render();
