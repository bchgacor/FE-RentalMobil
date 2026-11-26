// Format tampilan yang dipakai banyak halaman.

/** 2400000 -> "Rp 2.400.000" */
export function rupiah(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/** "2026-11-10" -> "10 November 2026" (pendek: "10 Nov 2026") */
export function tanggal(iso, pendek = false) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
  if (!m) return iso || "";
  const b = BULAN[+m[2] - 1];
  return `${+m[3]} ${pendek ? b.slice(0, 3) : b} ${m[1]}`;
}

/** "2026-11-10T14:30:00+07:00" -> "10 Nov 2026, 14.30" */
export function tanggalJam(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const j = String(d.getHours()).padStart(2, "0") + "." + String(d.getMinutes()).padStart(2, "0");
  return `${tanggal(isoTanggal(d), true)}, ${j}`;
}

export function isoTanggal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Tanggal hari ini + n hari dalam format YYYY-MM-DD. */
export function tambahHari(n, dari) {
  const d = dari ? new Date(dari + "T12:00:00") : new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return isoTanggal(d);
}

export function inisial(nama) {
  return String(nama || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((k) => k.charAt(0))
    .join("")
    .toUpperCase();
}
