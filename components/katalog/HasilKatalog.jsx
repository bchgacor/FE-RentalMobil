"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/api";
import { tanggal } from "@/lib/format";
import { useMuat } from "@/lib/useMuat";
import KartuMobil from "./KartuMobil";

// Daftar mobil tersedia dari GET /katalog/tipe. Ketersediaan dihitung back-end dari pesanan dan unit.
export default function HasilKatalog() {
  const q = useSearchParams();
  const router = useRouter();
  const cari = {
    tgl_mulai: q.get("tgl_mulai") || "",
    durasi: q.get("durasi") || "",
    kursi: q.get("kursi") || "",
    transmisi: q.get("transmisi") || "",
  };
  const lengkap = cari.tgl_mulai && cari.durasi;
  const kunci = q.toString();

  useEffect(() => {
    if (!lengkap) router.replace("/katalog");
  }, [lengkap, router]);

  const { data, galat, memuat } = useMuat(async () => {
    if (!lengkap) return [];
    const res = await api.get("/katalog/tipe", {
      auth: false,
      query: { ...cari, kursi: cari.kursi === "9+" ? "" : cari.kursi }, // "9 ke atas" disaring di tampilan
    });
    const semua = res.data || [];
    return cari.kursi === "9+" ? semua.filter((t) => t.kursi >= 9) : semua;
  }, [kunci]);

  if (!lengkap) return null;
  if (memuat) return <p className="memuat">Mencari mobil yang tersedia...</p>;
  if (galat) {
    return (
      <div className="alert galat" role="alert">
        {galat.errors ? Object.values(galat.errors).flat().join(" ") : galat.message}
      </div>
    );
  }
  if (!data.length) {
    return (
      <div className="kotak kosong jarak-kecil">
        <div className="ikon" aria-hidden="true">
          🚗
        </div>
        <h2>Mobil tidak tersedia</h2>
        <p className="abu">
          Tidak ada mobil yang tersedia untuk {tanggal(cari.tgl_mulai)} selama {cari.durasi} hari
          {cari.kursi || cari.transmisi ? " dengan filter yang dipilih" : ""}. Coba tanggal, durasi, atau filter lain.
        </p>
        <Link className="btn" href="/katalog">
          Ubah pencarian
        </Link>
      </div>
    );
  }

  // tarif kosong (null) = jenis sewa itu tidak ditawarkan untuk tipe tersebut
  const ds = data.filter((t) => t.tarif.dengan_sopir);
  const ts = data.filter((t) =>
    cari.transmisi ? t.tarif[`lepas_kunci_${cari.transmisi}`] : t.tarif.lepas_kunci_manual || t.tarif.lepas_kunci_matic,
  );
  const kosong = (teks) => <p className="memuat">{teks}</p>;

  return (
    <>
      <p className="abu">
        Mobil tersedia untuk {tanggal(cari.tgl_mulai)}, {cari.durasi} hari.
      </p>
      <input className="radio-tab" type="radio" name="tab" id="tab-ds" defaultChecked />{" "}
      <input className="radio-tab" type="radio" name="tab" id="tab-ts" />
      <div className="tab-baris">
        <label className="tab tab-ds" htmlFor="tab-ds">
          Dengan Sopir
        </label>{" "}
        <label className="tab tab-ts" htmlFor="tab-ts">
          Lepas Kunci
        </label>
      </div>
      <div className="grid-mobil daftar-ds">
        {ds.length
          ? ds.map((t) => <KartuMobil key={t.id} tipe={t} jenis="dengan_sopir" cari={cari} />)
          : kosong("Belum ada mobil dengan sopir yang tersedia untuk pencarian ini.")}
      </div>
      <div className="grid-mobil daftar-ts">
        {ts.length
          ? ts.map((t) => <KartuMobil key={t.id} tipe={t} jenis="lepas_kunci" cari={cari} />)
          : kosong("Belum ada mobil lepas kunci yang tersedia untuk pencarian ini.")}
      </div>
    </>
  );
}
