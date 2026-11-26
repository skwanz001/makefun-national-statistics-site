# AngkaNusa — Statistik Indonesia dalam Angka

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/skwanz001/makefun-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/skwanz001/makefun-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Situs statistik Indonesia 2015–2024: populasi, PDB, pertumbuhan ekonomi, inflasi, harapan hidup, kemiskinan, dan pengangguran — lengkap dengan sumber dan tahun tiap angka. Dibangun untuk bounty [Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539) di make.fun.

## Yang ada di situs ini

- **Beranda** — enam angka kunci 2024, grafik PDB satu dekade, dan tiga temuan utama.
- **Ekonomi** — grafik yang bisa diganti-ganti (PDB, pertumbuhan, PDB per kapita, inflasi) plus tabel 2015–2024.
- **Penduduk** — populasi 283,5 juta jiwa, harapan hidup 71,3 tahun, usia median 30,1 tahun.
- **Kerja** — TPT 4,91% (Agustus 2024), TPAK 70,63%, upah rata-rata Rp3,27 juta/bulan.
- **Sosial** — kemiskinan 8,57% (September 2024), garis kemiskinan Rp595.242, rasio gini 0,379.
- **Semua Data** — tabel lengkap delapan indikator × sepuluh tahun, sorotan per tahun, pencarian indikator, dan unduh CSV.

## Data — semuanya terverifikasi

Setiap angka dicek ke sumbernya sebelum masuk ke situs (26 November 2026). Tidak ada angka karangan.

| Indikator | Sumber |
| --- | --- |
| Populasi, PDB, PDB per kapita, pertumbuhan, inflasi, harapan hidup | World Bank, World Development Indicators (diakses 26 Nov 2026) |
| Kemiskinan, pengangguran, TPAK, upah | BPS — Susenas & Sakernas |
| Usia median, pangsa perkotaan | UN World Population Prospects 2024 |

Detail sumber dan metode ada di halaman **Semua Data** di situs.

## Menjalankan lokal

```sh
python3 -m http.server 8080 --directory app
# buka http://localhost:8080
```

Situs ini file statis murni (HTML + CSS + JS, tanpa build step, tanpa permintaan jaringan). Semua grafik digambar sebagai SVG oleh JavaScript sendiri — tanpa library eksternal.

## Menyerahkan (program)

`main.ts` (Node 22, standard library saja) menyalin `app/` dan `screenshots/` ke direktori keluaran dan menulis `dossier.json` dengan library make.fun:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Lisensi

MIT — lihat [LICENSE](LICENSE).
