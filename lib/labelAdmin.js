// Label isian admin (serah terima, pengembalian, jaminan).
export const METODE_ADMIN = {
  qris: "QRIS",
  bank_transfer: "Virtual account",
  echannel: "Mandiri Bill",
  cstore: "Gerai",
  gopay: "GoPay",
  shopeepay: "ShopeePay",
  credit_card: "Kartu kredit",
  tunai: "Tunai",
  transfer: "Transfer",
};
export const DOMISILI = { malang_raya: "Malang Raya", luar_malang_raya: "Luar Malang Raya" };
export const BBM = {
  penuh: "Penuh",
  tiga_perempat: "3/4",
  setengah: "1/2",
  seperempat: "1/4",
  hampir_kosong: "Hampir kosong",
};
export const BAGIAN = {
  depan: "Depan (bumper dan kap)",
  belakang: "Belakang (bumper dan bagasi)",
  sisi_kiri: "Sisi kiri",
  sisi_kanan: "Sisi kanan",
  atap: "Atap",
  kaca_lampu: "Kaca dan lampu",
  ban_velg: "Ban dan velg",
  interior: "Interior",
};
export const TAMBAHAN = {
  cuci: "Cuci",
  kelengkapan_hilang: "Kelengkapan hilang",
  biaya_antar: "Biaya antar",
  lainnya: "Lainnya",
};
export const JAMINAN = {
  ktp_asli: "KTP asli",
  sim_c_asli: "SIM C asli",
  ktm: "KTM",
  kk: "KK",
  npwp: "NPWP",
  bpjs: "BPJS",
  paspor: "Paspor",
  dokumen_tambahan: "Dokumen tambahan",
  motor_stnk: "Sepeda motor dan STNK",
  booking_transportasi: "Bukti booking transportasi",
  booking_hotel: "Bukti booking hotel",
};

/** Tautan WhatsApp dari nomor HP Indonesia. */
export function waLink(noHp) {
  const n = String(noHp || "")
    .replace(/\D/g, "")
    .replace(/^0/, "62");
  return n ? `https://wa.me/${n}` : "#";
}

/** Galat 422 dengan kunci bertitik (foto_jaminan.ktp_asli) diubah ke nama isian form (foto_jaminan[ktp_asli]). */
export function galatKeNamaIsian(galat) {
  if (!galat?.errors) return galat;
  const errors = {};
  for (const [k, v] of Object.entries(galat.errors)) errors[k.replace(/\.(\w+)/g, "[$1]")] = v;
  return Object.assign(Object.create(Object.getPrototypeOf(galat)), galat, { errors });
}

/** FormData tanpa isian file kosong dan teks kosong. */
export function bersihkanForm(fd, { tanpaFoto = false } = {}) {
  for (const k of Array.from(new Set(fd.keys()))) {
    const v = fd.getAll(k);
    if (v.length === 1 && v[0] instanceof File && (tanpaFoto || !v[0].name)) fd.delete(k);
    else if (v.length === 1 && v[0] === "") fd.delete(k);
  }
  return fd;
}
