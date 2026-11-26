// Foto bawaan tampilan, dipakai bila tipe mobil belum punya foto di back-end.
const GAMBAR = {
  ds: [
    "alphard-2022",
    "avanza-2022",
    "avanza-2024",
    "brio",
    "fortuner-vrz",
    "grand-innova",
    "hiace-commuter",
    "hiace-premio-luxury",
    "hiace-premio",
    "innova-reborn",
    "innova-venturer",
    "rush-trd",
    "xl7",
    "zenix-g",
    "zenix-q",
    "zenix-v",
  ],
  ts: [
    "avanza-2022",
    "avanza-2024-manual",
    "avanza-2024-matic",
    "brio",
    "rush-trd",
    "xenia-2018",
    "xl7",
    "zenix-reborn-manual",
    "zenix-reborn-matic",
  ],
};

function slugLokal(nama, jenis, transmisi) {
  const s = String(nama || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const urut = jenis === "lepas_kunci" ? ["ts", "ds"] : ["ds", "ts"];
  for (const awalan of urut) {
    const cocok = GAMBAR[awalan].filter((x) => x === s || x.startsWith(s + "-"));
    if (!cocok.length) continue;
    const pas = transmisi && cocok.find((x) => x.includes(transmisi));
    return `${awalan}-${pas || cocok[0]}`;
  }
  return null;
}

/** Foto kartu katalog: foto pertama dari API, atau gambar bawaan. */
export function fotoKartu(tipe, jenis, transmisi) {
  if (tipe.foto?.length) return fotoUrl(tipe.foto[0]);
  const s = slugLokal(tipe.nama, jenis, transmisi);
  return s ? `/img/mobil/${s}.png` : "/img/logo.png";
}

/** Galeri halaman pesan: foto dari API (maks 4), atau 4 foto bawaan. */
export function fotoGaleri(tipe, jenis, transmisi) {
  if (tipe.foto?.length) return tipe.foto.slice(0, 4).map(fotoUrl);
  const s = slugLokal(tipe.nama, jenis, transmisi);
  if (!s) return ["/img/logo.png"];
  return [1, 2, 3, 4].map((n) => `/img/mobil/foto/${s}-${n}.jpg`);
}

// API bisa mengirim string URL atau objek { id, url }
export function fotoUrl(f) {
  return typeof f === "string" ? f : f?.url;
}
