// HTML tiap halaman AngkaNusa. Semua angka datang dari data.js — tidak ada
// angka yang ditulis langsung di template, supaya sumbernya tunggal.

import { YEARS, INDICATORS, FACTS_2024, indicatorById, valueAt, fmt, fmtShort } from './data.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function statCard(indicator, link, override = null) {
  const v = override ? override.value : valueAt(indicator, 2024);
  const prev = valueAt(indicator, 2023);
  const delta = override
    ? override.delta
    : indicator.format === 'persen' || indicator.format === 'tahun'
      ? `${(v - prev) >= 0 ? '+' : ''}${(v - prev).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} poin dari 2023`
      : null;
  const shown = override ? override.display : fmt(v, indicator.format);
  const inner = `
    <p class="label">${esc(indicator.short)} · 2024</p>
    <p class="value">${esc(shown)}</p>
    ${delta ? `<p class="delta">${esc(delta)}</p>` : ''}
    <p class="source">${esc(override && override.source ? override.source : indicator.source)}</p>`;
  return `<div class="card">${link ? `<a class="card-link" href="${link}">${inner}</a>` : inner}</div>`;
}

function chartBlock(indicator, kind = 'line') {
  return `
  <div class="chart-box">
    <h3 data-chart-title>${esc(indicator.name)} 2015–2024</h3>
    <p class="chart-readout" data-readout>Klik titik pada grafik untuk melihat nilainya.</p>
    <svg class="chart-svg" data-chart data-indicator="${indicator.id}" data-kind="${kind}"></svg>
    <p class="small" data-chart-note>${esc(indicator.note)}</p>
    <p class="small">Sumber: ${esc(indicator.source)}</p>
  </div>`;
}

function switcher(ids, activeId) {
  return `<div class="switcher" role="group" aria-label="Pilih indikator">
    ${ids.map((id) => {
      const ind = indicatorById(id);
      return `<button type="button" data-metric="${id}" aria-pressed="${id === activeId}">${esc(ind.short)}</button>`;
    }).join('')}
  </div>`;
}

function seriesTable(indicatorIds) {
  const rows = indicatorIds.map((id) => {
    const ind = indicatorById(id);
    const cells = YEARS.map((y) => {
      const v = valueAt(ind, y);
      return `<td class="${v < 0 ? 'neg' : ''}">${esc(fmt(v, ind.format))}</td>`;
    }).join('');
    return `<tr><th scope="row" style="text-align:left">${esc(ind.name)} <span class="small">(${esc(ind.unit)})</span></th>${cells}</tr>`;
  }).join('');
  const head = YEARS.map((y) => `<th scope="col">${y}</th>`).join('');
  return `<div class="table-scroll"><table class="data">
    <thead><tr><th scope="col">Indikator</th>${head}</tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function factList(facts) {
  return `<div class="cards">${facts.map((f) => `
    <div class="card">
      <p class="label">${esc(f.label)}</p>
      <p class="value">${esc(f.value)}</p>
      <p class="detail">${esc(f.detail)}</p>
      <p class="source">Sumber: ${esc(f.source)}</p>
    </div>`).join('')}
  </div>`;
}

export function home() {
  const gdp = indicatorById('pdb');
  const pop = indicatorById('populasi');
  const growth = indicatorById('pertumbuhan');
  const inflation = indicatorById('inflasi');
  const poverty = indicatorById('kemiskinan');
  const life = indicatorById('harapan-hidup');
  return `
  <p class="eyebrow">Indonesia · 2015–2024</p>
  <h1>Statistik Indonesia,<br>dalam angka yang bisa dicek.</h1>
  <p class="lede">Populasi, PDB, inflasi, kemiskinan, dan pengangguran — sepuluh tahun data resmi dari World Bank dan BPS, lengkap dengan sumber dan tahunnya. Tanpa angka karangan.</p>

  <div class="cards">
    ${statCard(pop, '#/penduduk')}
    ${statCard(gdp, '#/ekonomi')}
    ${statCard(growth, '#/ekonomi')}
    ${statCard(indicatorById('pdb-kapita'), '#/ekonomi')}
    ${statCard(inflation, '#/ekonomi')}
    ${statCard(poverty, '#/sosial', { value: 8.57, display: '8,57%', delta: '−0,46 poin dari Mar 2024 · Sep 2024', source: 'BPS, Susenas (September 2024)' })}
  </div>

  <h2>Satu dekade PDB</h2>
  <p class="muted">Dari US$860,85 miliar pada 2015 menjadi US$1.396,30 miliar pada 2024 — naik 62% dalam sepuluh tahun, dengan satu-satunya penurunan pada 2020.</p>
  ${chartBlock(gdp)}

  <h2>Tiga hal yang menonjol dari data 2024</h2>
  <div class="findings">
    <div class="finding"><p class="big">5,03%</p><p>Pertumbuhan ekonomi 2024 — tahun ketiga berturut-turut di atas 5% setelah kontraksi −2,07% pada 2020. Sumber: BPS.</p></div>
    <div class="finding"><p class="big">8,57%</p><p>Kemiskinan September 2024 — pertama kali di bawah 9%, turun dari 11,22% pada 2015. Sumber: BPS.</p></div>
    <div class="finding"><p class="big">71,3 tahun</p><p>Harapan hidup 2024 — pulih penuh dari 67,5 tahun pada 2021, saat pandemi. Sumber: World Bank WDI.</p></div>
  </div>

  <h2>Jelajahi datanya</h2>
  <div class="explore">
    <a href="#/ekonomi"><h3>Ekonomi →</h3><p>PDB, PDB per kapita, pertumbuhan, dan inflasi 2015–2024.</p></a>
    <a href="#/penduduk"><h3>Penduduk →</h3><p>Populasi 283,5 juta jiwa, harapan hidup, dan usia median.</p></a>
    <a href="#/ketenagakerjaan"><h3>Kerja →</h3><p>Pengangguran 4,91%, partisipasi angkatan kerja, dan upah.</p></a>
    <a href="#/sosial"><h3>Sosial →</h3><p>Kemiskinan 8,57%, garis kemiskinan, dan rasio gini.</p></a>
  </div>
  <div class="callout"><p><strong>Semua angka di situs ini bisa diverifikasi.</strong> Buka <a href="#/data">Semua Data</a> untuk tabel lengkap 2015–2024, unduh sebagai CSV, dan lihat sumber tiap indikator.</p></div>
  <p class="small">Harapan hidup: ${esc(fmt(valueAt(life, 2024), 'tahun'))} (World Bank WDI). Data terakhir diperbarui November 2026.</p>`;
}

export function ekonomi() {
  return `
  <p class="eyebrow">Ekonomi</p>
  <h1>Ekonomi Indonesia 2015–2024</h1>
  <p class="lede">Ekonomi terbesar di Asia Tenggara: PDB US$1.396,3 miliar pada 2024, tumbuh 5,03%, dengan inflasi rata-rata 2,18% — di dalam sasaran Bank Indonesia.</p>
  ${switcher(['pdb', 'pertumbuhan', 'pdb-kapita', 'inflasi'], 'pdb')}
  ${chartBlock(indicatorById('pdb'))}
  <h2>Angka kunci 2024</h2>
  ${factList(FACTS_2024.filter((f) => ['PDB', 'PDB per kapita', 'Pertumbuhan ekonomi', 'Inflasi', 'Peringkat ekonomi'].includes(f.label)))}
  <h2>Tabel 2015–2024</h2>
  ${seriesTable(['pdb', 'pdb-kapita', 'pertumbuhan', 'inflasi'])}
  <p class="small">PDB dan PDB per kapita dalam dolar AS berlaku (World Bank WDI). Pertumbuhan adalah PDB riil tahunan (BPS/WDI). Inflasi adalah rata-rata tahunan IHK; inflasi Desember 2024 (yoy) menurut BPS adalah 1,57%.</p>`;
}

export function penduduk() {
  return `
  <p class="eyebrow">Penduduk</p>
  <h1>Penduduk Indonesia 2015–2024</h1>
  <p class="lede">283.487.931 jiwa pada 2024 — negara berpenduduk terbanyak ke-4 di dunia. Populasi tumbuh sekitar 0,8% per tahun, dengan usia median 30,1 tahun.</p>
  ${switcher(['populasi', 'harapan-hidup'], 'populasi')}
  ${chartBlock(indicatorById('populasi'))}
  <h2>Angka kunci 2024</h2>
  ${factList(FACTS_2024.filter((f) => ['Populasi', 'Harapan hidup', 'Usia median', 'Penduduk usia kerja'].includes(f.label)))}
  <h2>Tabel 2015–2024</h2>
  ${seriesTable(['populasi', 'harapan-hidup'])}
  <p class="small">Populasi: World Bank WDI (SP.POP.TOTL), berdasarkan UN World Population Prospects 2024. Harapan hidup: World Bank WDI (SP.DYN.LE00.IN). Penurunan harapan hidup 2020–2021 mencerminkan dampak pandemi COVID-19.</p>`;
}

export function ketenagakerjaan() {
  const tpt = indicatorById('pengangguran');
  return `
  <p class="eyebrow">Ketenagakerjaan</p>
  <h1>Kerja dan pengangguran</h1>
  <p class="lede">Tingkat pengangguran terbuka Agustus 2024 sebesar 4,91% — 7,47 juta orang — lebih rendah dari sebelum pandemi. Partisipasi angkatan kerja 70,63%, tertinggi dalam belasan tahun.</p>
  ${chartBlock(tpt)}
  <h2>Angka kunci Agustus 2024</h2>
  ${factList(FACTS_2024.filter((f) => ['Pengangguran (TPT)', 'Penduduk usia kerja'].includes(f.label)))}
  <div class="cards">
    <div class="card"><p class="label">TPAK · Agt 2024</p><p class="value">70,63%</p><p class="detail">Persentase angkatan kerja dari penduduk usia kerja; tertinggi dalam belasan tahun.</p><p class="source">Sumber: BPS Sakernas</p></div>
    <div class="card"><p class="label">Upah rata-rata · Agt 2024</p><p class="value">Rp3,27<small> jt/bln</small></p><p class="detail">Rata-rata upah/gaji sebulan buruh, karyawan, dan pegawai.</p><p class="source">Sumber: BPS Sakernas</p></div>
    <div class="card"><p class="label">Lapangan kerja baru 2024</p><p class="value">4,78<small> jt</small></p><p class="detail">Pekerja formal bertambah 3,44 juta menjadi 56,2 juta orang.</p><p class="source">Sumber: BPS via Kemenkeu</p></div>
  </div>
  <h2>Tabel 2015–2024</h2>
  ${seriesTable(['pengangguran'])}
  <p class="small">TPT Agustus tiap tahun, BPS Sakernas. Puncak 7,07% pada Agustus 2020 terjadi saat pandemi; sejak itu turun setiap tahun.</p>`;
}

export function sosial() {
  const pov = indicatorById('kemiskinan');
  return `
  <p class="eyebrow">Sosial</p>
  <h1>Kemiskinan dan ketimpangan</h1>
  <p class="lede">Pada September 2024, 8,57% penduduk — 24,06 juta jiwa — hidup di bawah garis kemiskinan. Itu level terendah yang pernah dicatat BPS, turun dari 11,22% pada 2015.</p>
  ${chartBlock(pov)}
  <h2>Angka kunci 2024</h2>
  ${factList(FACTS_2024.filter((f) => ['Kemiskinan', 'Rasio gini'].includes(f.label)))}
  <div class="cards">
    <div class="card"><p class="label">Garis kemiskinan · Sep 2024</p><p class="value">Rp595.242</p><p class="detail">Per kapita per bulan; naik 2,21% dari Maret 2024. Siapa pun di bawah garis ini dihitung miskin.</p><p class="source">Sumber: BPS</p></div>
    <div class="card"><p class="label">Penurunan Mar → Sep 2024</p><p class="value">−1,16<small> jt jiwa</small></p><p class="detail">Dari 25,22 juta (9,03%) pada Maret menjadi 24,06 juta (8,57%) pada September 2024.</p><p class="source">Sumber: BPS</p></div>
    <div class="card"><p class="label">Rasio gini · 2024</p><p class="value">0,379</p><p class="detail">Membaik dari 0,388 pada 2023 — ketimpangan pengeluaran sedikit menurun.</p><p class="source">Sumber: BPS</p></div>
  </div>
  <h2>Tabel 2015–2024</h2>
  ${seriesTable(['kemiskinan'])}
  <p class="small">Persentase penduduk miskin, Maret tiap tahun (BPS Susenas). Kenaikan pada 2020–2021 terjadi saat pandemi; tren menurun berlanjut setelahnya. Angka September 2024 (8,57%) adalah angka terbaru yang dirilis BPS.</p>`;
}

export function semuaData() {
  const rows = INDICATORS.map((ind) => {
    const cells = YEARS.map((y) => {
      const v = valueAt(ind, y);
      return `<td class="${v < 0 ? 'neg' : ''}">${esc(fmt(v, ind.format))}</td>`;
    }).join('');
    return `<tr data-name="${esc(`${ind.name} ${ind.short} ${ind.source}`.toLowerCase())}">
      <th scope="row" style="text-align:left">${esc(ind.name)} <span class="small">(${esc(ind.unit)})</span></th>${cells}
    </tr>`;
  }).join('');
  const head = YEARS.map((y) => `<th scope="col">${y}</th>`).join('');
  return `
  <p class="eyebrow">Semua data</p>
  <h1>Semua data, 2015–2024</h1>
  <p class="lede">Delapan indikator, sepuluh tahun, dua sumber resmi. Pilih satu tahun untuk melihat semua indikatornya, cari indikator, atau unduh semuanya sebagai CSV.</p>

  <div class="controls">
    <div>
      <label for="year-select">Sorotan tahun</label>
      <select id="year-select">
        ${YEARS.map((y) => `<option value="${y}" ${y === 2024 ? 'selected' : ''}>${y}</option>`).join('')}
      </select>
    </div>
    <div>
      <label for="indicator-search">Cari indikator</label>
      <input type="search" id="indicator-search" placeholder="mis. inflasi, PDB, miskin…" aria-label="Cari indikator">
    </div>
    <div>
      <label>&nbsp;</label>
      <button type="button" class="btn" id="download-csv">Unduh CSV</button>
    </div>
  </div>

  <div id="year-spotlight" aria-live="polite"></div>

  <div class="table-scroll"><table class="data" id="all-table">
    <thead><tr><th scope="col">Indikator</th>${head}</tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p class="small" id="search-note"></p>

  <h2>Sumber dan metode</h2>
  <ul class="sources">
    <li><strong>World Bank, World Development Indicators</strong> (data.worldbank.org, diakses 26 November 2026; pembaruan data 11 November 2026): populasi (SP.POP.TOTL), PDB (NY.GDP.MKTP.CD), PDB per kapita (NY.GDP.PCAP.CD), pertumbuhan PDB (NY.GDP.MKTP.KD.ZG), inflasi IHK rata-rata tahunan (FP.CPI.TOTL.ZG), harapan hidup (SP.DYN.LE00.IN).</li>
    <li><strong>BPS — Badan Pusat Statistik</strong> (bps.go.id): kemiskinan dari Susenas (Maret tiap tahun; September 2024: 8,57%, 24,06 juta jiwa, garis kemiskinan Rp595.242/kapita/bulan); pengangguran dari Sakernas (Agustus tiap tahun; 2024: TPT 4,91%, TPAK 70,63%, upah rata-rata Rp3,27 juta); pertumbuhan ekonomi 2024 5,03% (rilis 5 Februari 2025); inflasi Desember 2024 yoy 1,57% (rilis 2 Januari 2025).</li>
    <li><strong>United Nations, World Population Prospects 2024</strong>: usia median 30,1 tahun, 59% penduduk tinggal di perkotaan, kepadatan 156 jiwa/km², pangsa 3,47% populasi dunia.</li>
    <li><strong>Catatan:</strong> angka dibulatkan untuk tampilan; seri lengkap memakai nilai asli sumber. Rasio gini 2024 (0,379) dan lapangan kerja baru 2024 (4,78 juta) berasal dari rilis pemerintah berdasarkan data BPS. Situs ini bukan publikasi resmi BPS atau World Bank.</li>
  </ul>`;
}

export function notFound(path) {
  return `
  <h1>Halaman tidak ditemukan</h1>
  <p class="lede">Tidak ada halaman statistik di alamat “${esc(path)}”.</p>
  <p><a href="#/">Kembali ke Beranda</a> · <a href="#/data">Lihat Semua Data</a></p>`;
}
