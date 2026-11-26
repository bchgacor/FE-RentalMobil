// Label dan warna status yang dipakai halaman pelanggan dan admin.
import { tambahHari, tanggal } from "./format";

export const STATUS = {
  menunggu_pembayaran: { label: "Menunggu pembayaran", badge: "menunggu", tahap: 1 },
  dikonfirmasi: { label: "Dikonfirmasi", badge: "dikonfirmasi", tahap: 2 },
  berjalan: { label: "Berjalan", badge: "berjalan", tahap: 3 },
  selesai: { label: "Selesai", badge: "selesai", tahap: 4 },
  pengajuan_pembatalan: { label: "Pengajuan pembatalan", badge: "pengajuan", tahap: 2 },
  dibatalkan: { label: "Dibatalkan", badge: "dibatalkan", tahap: 0 },
};
export const st = (s) => STATUS[s] || { label: s, badge: "", tahap: 0 };

export const METODE = {
  qris: "QRIS",
  bank_transfer: "Virtual account",
  echannel: "Mandiri Bill",
  cstore: "Gerai (Indomaret/Alfamart)",
  gopay: "GoPay",
  shopeepay: "ShopeePay",
  credit_card: "Kartu kredit",
  dana: "DANA",
  ovo: "OVO",
  akulaku: "Akulaku",
  kredivo: "Kredivo",
};
export const STATUS_BAYAR = {
  menunggu: "Menunggu pembayaran",
  lunas: "Lunas",
  gagal: "Gagal",
  dikembalikan: "Dikembalikan (refund)",
  kedaluwarsa: "Kedaluwarsa",
};
// Metode yang refund-nya lewat transfer, jadi pelanggan perlu mengisi rekening
export const WAJIB_REKENING = ["bank_transfer", "echannel", "cstore"];

/** Tanggal kembali = tanggal mulai + durasi - 1. */
export function tglKembali(mulai, durasi) {
  return /^\d{4}-\d{2}-\d{2}/.test(mulai || "") ? tambahHari((durasi || 1) - 1, mulai.slice(0, 10)) : "";
}

/** "10 sampai 12 Nov 2026" */
export function rentang(mulai, kembali) {
  if (!kembali || mulai === kembali) return tanggal(mulai, true);
  const a = tanggal(mulai, true).split(" ");
  const b = tanggal(kembali, true).split(" ");
  if (a[1] === b[1] && a[2] === b[2]) return `${a[0]} sampai ${b.join(" ")}`;
  return `${a.join(" ")} sampai ${b.join(" ")}`;
}

export const jenisSewa = (d) =>
  d.jenis_sewa === "dengan_sopir" ? "Dengan sopir" : `Lepas kunci${d.transmisi ? ` (${d.transmisi})` : ""}`;
