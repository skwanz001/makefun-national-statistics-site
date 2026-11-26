// AngkaNusa — data Indonesia 2015–2024.
//
// Setiap angka di bawah ini dicek ke sumbernya pada 26 November 2026 sebelum
// ditulis ke situs ini. Tidak ada angka karangan: kalau sebuah angka tidak
// ketemu sumbernya, angka itu tidak masuk.
//
// Sumber utama:
//   - World Bank, World Development Indicators (WDI), diakses lewat
//     api.worldbank.org, pembaruan data 11 November 2026:
//       populasi ......... SP.POP.TOTL
//       PDB .............. NY.GDP.MKTP.CD
//       PDB per kapita ... NY.GDP.PCAP.CD
//       pertumbuhan ...... NY.GDP.MKTP.KD.ZG
//       inflasi .......... FP.CPI.TOTL.ZG (rata-rata tahunan IHK)
//       harapan hidup .... SP.DYN.LE00.IN
//   - BPS (Badan Pusat Statistik), lewat rilis resmi dan publikasi:
//       kemiskinan ....... Susenas, Maret tiap tahun; September 2024
//       pengangguran ..... Sakernas Agustus tiap tahun
//       TPAK, upah ....... Sakernas Agustus 2024
//       inflasi Des yoy .. rilis BPS 2 Januari 2025
//   - United Nations, World Population Prospects 2024 (revisi 2024):
//       usia median, pangsa perkotaan, kepadatan penduduk.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Satu indikator = satu seri tahunan 2015–2024 plus metadata sumber.
// `format` dipakai untuk menampilkan nilai: 'jt' = jutaan jiwa,
// 'miliar-usd', 'usd', 'persen', 'tahun'.
export const INDICATORS = [
  {
    id: 'populasi',
    name: 'Populasi',
    short: 'Populasi',
    unit: 'jiwa',
    format: 'orang',
    source: 'World Bank WDI (SP.POP.TOTL), UN World Population Prospects 2024',
    note: 'Jumlah penduduk pertengahan tahun. Indonesia negara berpenduduk terbanyak ke-4 di dunia (3,47% populasi dunia).',
    values: [261799249, 264627418, 267346658, 269951846, 272489381, 274814866, 276758053, 278830529, 281190067, 283487931],
  },
  {
    id: 'pdb',
    name: 'PDB (nominal)',
    short: 'PDB',
    unit: 'miliar US$',
    format: 'miliar-usd',
    source: 'World Bank WDI (NY.GDP.MKTP.CD)',
    note: 'Produk domestik bruto atas dasar harga berlaku, dolar AS. Peringkat 16 dunia, sekitar 1,26% PDB dunia.',
    values: [860.85, 931.88, 1015.62, 1042.27, 1119.1, 1059.05, 1186.51, 1319.1, 1371.17, 1396.3],
  },
  {
    id: 'pdb-kapita',
    name: 'PDB per kapita',
    short: 'PDB/kapita',
    unit: 'US$',
    format: 'usd',
    source: 'World Bank WDI (NY.GDP.PCAP.CD)',
    note: 'PDB dibagi jumlah penduduk, dolar AS berlaku. Naik dari US$3.288 (2015) ke US$4.925 (2024).',
    values: [3288, 3521, 3799, 3861, 4107, 3854, 4287, 4731, 4876, 4925],
  },
  {
    id: 'pertumbuhan',
    name: 'Pertumbuhan ekonomi',
    short: 'Pertumbuhan',
    unit: '% per tahun',
    format: 'persen',
    source: 'World Bank WDI (NY.GDP.MKTP.KD.ZG); BPS',
    note: 'Pertumbuhan PDB riil tahunan. Kontraksi −2,07% pada 2020 adalah dampak pandemi COVID-19; setelah itu tumbuh di atas 5% tiga tahun beruntun.',
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.7, 5.31, 5.05, 5.03],
  },
  {
    id: 'inflasi',
    name: 'Inflasi (IHK, rata-rata tahunan)',
    short: 'Inflasi',
    unit: '% per tahun',
    format: 'persen',
    source: 'World Bank WDI (FP.CPI.TOTL.ZG); BPS',
    note: 'Rata-rata tahunan inflasi harga konsumen. Inflasi Desember 2024 (yoy) tercatat 1,57% menurut BPS — di bawah sasaran Bank Indonesia 2,5% ± 1%.',
    values: [6.36, 3.53, 3.81, 3.2, 3.03, 1.92, 1.56, 4.21, 3.67, 2.18],
  },
  {
    id: 'harapan-hidup',
    name: 'Harapan hidup saat lahir',
    short: 'Harapan hidup',
    unit: 'tahun',
    format: 'tahun',
    source: 'World Bank WDI (SP.DYN.LE00.IN)',
    note: 'Turun tajam pada 2020–2021 saat pandemi, lalu pulih dan mencapai 71,3 tahun pada 2024 — tertinggi dalam seri ini.',
    values: [69.52, 69.73, 69.95, 70.08, 70.35, 68.82, 67.45, 70.93, 71.15, 71.29],
  },
  {
    id: 'kemiskinan',
    name: 'Penduduk miskin',
    short: 'Kemiskinan',
    unit: '% penduduk',
    format: 'persen',
    source: 'BPS, Susenas (Maret tiap tahun)',
    note: 'Persentase penduduk dengan pengeluaran per kapita di bawah garis kemiskinan. September 2024: 8,57% atau 24,06 juta jiwa — pertama kali di bawah 9% — dengan garis kemiskinan Rp595.242 per kapita per bulan.',
    values: [11.22, 10.86, 10.64, 9.82, 9.41, 9.78, 10.14, 9.54, 9.36, 9.03],
  },
  {
    id: 'pengangguran',
    name: 'Tingkat pengangguran terbuka (TPT)',
    short: 'Pengangguran',
    unit: '% angkatan kerja',
    format: 'persen',
    source: 'BPS, Sakernas (Agustus tiap tahun)',
    note: 'Persentase angkatan kerja yang menganggur. Agustus 2024: 4,91% atau 7,47 juta orang — di bawah level sebelum pandemi (5,23% pada 2019).',
    values: [6.18, 5.61, 5.5, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
  },
];

// Fakta satu tahun (2024) yang tidak punya seri tahunan di atas. Masing-masing
// sudah dicek ke sumber yang tertulis.
export const FACTS_2024 = [
  { label: 'Populasi', value: '283,5 juta', detail: 'Terbanyak ke-4 di dunia; 3,47% populasi dunia.', source: 'UN WPP 2024 / WDI' },
  { label: 'PDB', value: 'US$1.396,3 miliar', detail: 'Peringkat 16 dunia; 1,26% PDB dunia.', source: 'World Bank WDI' },
  { label: 'PDB per kapita', value: 'US$4.925', detail: 'Naik 1,0% dari US$4.876 pada 2023.', source: 'World Bank WDI' },
  { label: 'Pertumbuhan ekonomi', value: '5,03%', detail: 'Konsumsi rumah tangga tumbuh 4,94%; investasi 4,61%.', source: 'BPS, 5 Feb 2025' },
  { label: 'Inflasi', value: '2,18% rata-rata; 1,57% Des yoy', detail: 'Dalam sasaran Bank Indonesia 2,5% ± 1%.', source: 'WDI; BPS' },
  { label: 'Harapan hidup', value: '71,3 tahun', detail: 'Pulih penuh dari penurunan pandemi 2020–2021.', source: 'World Bank WDI' },
  { label: 'Kemiskinan', value: '8,57% (Sep 2024)', detail: '24,06 juta jiwa; garis kemiskinan Rp595.242/kapita/bulan.', source: 'BPS, Jan 2025' },
  { label: 'Pengangguran (TPT)', value: '4,91% (Agt 2024)', detail: '7,47 juta orang; TPAK 70,63%; upah rata-rata Rp3,27 juta/bulan.', source: 'BPS Sakernas' },
  { label: 'Rasio gini', value: '0,379', detail: 'Membaik dari 0,388 pada 2023.', source: 'BPS' },
  { label: 'Usia median', value: '30,1 tahun', detail: 'Populasi muda; 59% tinggal di perkotaan; kepadatan 156 jiwa/km².', source: 'UN WPP 2024' },
  { label: 'Penduduk usia kerja', value: '215,37 juta', detail: 'Naik 2,78 juta orang dibanding Agustus 2023.', source: 'BPS Sakernas' },
  { label: 'Peringkat ekonomi', value: '16 besar dunia', detail: 'Ekonomi terbesar di Asia Tenggara; 35% PDB kawasan.', source: 'World Bank WDI' },
];

export function indicatorById(id) {
  return INDICATORS.find((i) => i.id === id);
}

export function valueAt(indicator, year) {
  const idx = YEARS.indexOf(year);
  return idx === -1 ? null : indicator.values[idx];
}

// Format angka Indonesia: pemisah ribuan titik, desimal koma.
export function fmt(value, format) {
  if (value === null || value === undefined) return '—';
  const id = (n, d = 0) =>
    n.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
  switch (format) {
    case 'orang':
      return id(value);
    case 'miliar-usd':
      return `US$${id(value, 2)} miliar`;
    case 'usd':
      return `US$${id(value)}`;
    case 'persen':
      return `${id(value, 2)}%`;
    case 'tahun':
      return `${id(value, 1)} tahun`;
    default:
      return id(value, 2);
  }
}

// Angka ringkas untuk kartu dan sumbu grafik (mis. 283,5 jt).
export function fmtShort(value, format) {
  if (value === null || value === undefined) return '—';
  const id = (n, d = 0) =>
    n.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
  switch (format) {
    case 'orang':
      return `${id(value / 1e6, 1)} jt`;
    case 'miliar-usd':
      return `${id(value, 0)}`;
    case 'usd':
      return `${id(value)}`;
    case 'persen':
      return `${id(value, 2)}%`;
    case 'tahun':
      return `${id(value, 1)}`;
    default:
      return id(value, 2);
  }
}
