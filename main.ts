// AngkaNusa — program penyerahan untuk make.fun (Node 22, standard library saja).
//
// Tugas program ini kecil dan sengaja begitu: salin app/ dan screenshots/ dari
// repo ini ke direktori keluaran, lalu tulis dossier.json — ringkasan yang
// dibaca juri (screenshot, file first load, dan sumber situs) — dengan library
// make.fun yang sudah divendor di vendor/makefun-frontend.ts.
//
// Jangan ubah vendor/makefun-frontend.ts: scorer membangun ulang dossier.json
// dengan salinan library yang sama dan membandingkan keduanya byte per byte.
//
// Di luar grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Batas-batas ini sama dengan yang dipakai scorer: teks dossier dibatasi
// 160 KiB, maksimal 4 screenshot @ 256 KiB, app/ maksimal 993 file dan 16 MiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
