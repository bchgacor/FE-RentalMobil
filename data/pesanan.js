// Data contoh daftar pesanan untuk panel admin (tahap slicing, belum dari back-end).
export const STATUS = [
  { kunci: "menunggu", label: "Menunggu pembayaran" },
  { kunci: "dikonfirmasi", label: "Dikonfirmasi" },
  { kunci: "berjalan", label: "Berjalan" },
  { kunci: "selesai", label: "Selesai" },
  { kunci: "pengajuan", label: "Pengajuan pembatalan" },
  { kunci: "dibatalkan", label: "Dibatalkan" },
];

export const PESANAN = [
  {
    mulai: "10 Nov 2026",
    nomor: "RM-20261103-0010",
    pelanggan: "Siti Rahma",
    unit: "Avanza 2024 Matic",
    jenis: "Lepas kunci",
    status: "dikonfirmasi",
    detail: "detail-dikonfirmasi",
  },
  {
    mulai: "3 Nov 2026",
    nomor: "RM-20261101-0004",
    pelanggan: "Dimas Prakoso",
    unit: "Rush TRD",
    plat: "N 3003 EF",
    jenis: "Lepas kunci",
    status: "berjalan",
    detail: "detail-berjalan",
  },
  {
    mulai: "12 Nov 2026",
    nomor: "RM-20261102-0006",
    pelanggan: "Rina Wulandari",
    unit: "Brio",
    jenis: "Dengan sopir",
    status: "pengajuan",
    detail: "detail-pengajuan-pembatalan",
  },
  {
    mulai: "10 Nov 2026",
    nomor: "RM-20261104-0012",
    pelanggan: "Budi Santoso",
    unit: "Innova Reborn",
    jenis: "Dengan sopir",
    status: "menunggu",
    detail: "detail-menunggu-pembayaran",
  },
  {
    mulai: "29 Okt 2026",
    nomor: "RM-20261024-0002",
    pelanggan: "Andi Wijaya",
    unit: "Rush TRD",
    plat: "N 3003 EF",
    jenis: "Lepas kunci",
    status: "selesai",
    detail: "detail-selesai",
  },
  {
    mulai: "30 Okt 2026",
    nomor: "RM-20261018-0003",
    pelanggan: "Eko Prasetyo",
    unit: "Brio",
    plat: "N 5005 GH",
    jenis: "Lepas kunci",
    status: "selesai",
    detail: "detail-selesai-lunas",
  },
  {
    mulai: "1 Nov 2026",
    nomor: "RM-20261020-0001",
    pelanggan: "Budi Santoso",
    unit: "Xenia 2018",
    jenis: "Lepas kunci",
    status: "dibatalkan",
    detail: "detail-dibatalkan",
  },
];

export function labelStatus(kunci) {
  return STATUS.find((s) => s.kunci === kunci)?.label ?? kunci;
}
