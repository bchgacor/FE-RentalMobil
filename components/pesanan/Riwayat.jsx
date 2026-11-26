"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { rupiah } from "@/lib/format";
import { fotoKartu } from "@/lib/fotoMobil";
import { rentang, tglKembali } from "@/lib/status";
import { useMuat } from "@/lib/useMuat";
import Badge from "@/components/Badge";
import Tahapan from "@/components/Tahapan";
import FormNilai from "@/components/riwayat/FormNilai";

// Riwayat pemesanan pelanggan dari GET /pemesanan?tab=berlangsung|riwayat (10 per halaman).
export default function Riwayat() {
  return (
    <>
      <input className="tab-radio" type="radio" name="tab-riwayat" id="tab-1" defaultChecked />
      <input className="tab-radio" type="radio" name="tab-riwayat" id="tab-2" />
      <div className="tab-bar">
        <label className="tab" htmlFor="tab-1">
          Berlangsung
        </label>
        <label className="tab" htmlFor="tab-2">
          Riwayat
        </label>
      </div>
      <div className="panel p-1">
        <DaftarTab tab="berlangsung" />
      </div>
      <div className="panel p-2">
        <DaftarTab tab="riwayat" />
      </div>
    </>
  );
}

function DaftarTab({ tab }) {
  const [halaman, setHalaman] = useState(1);
  const { data, galat, awal, memuat } = useMuat(async () => {
    // ambil semua halaman sampai yang diminta (tombol "Muat lebih banyak")
    const semua = [];
    let meta = {};
    for (let p = 1; p <= halaman; p++) {
      const res = await api.get("/pemesanan", { query: { tab, page: p, per_page: 10 } });
      semua.push(...res.data);
      meta = res.meta || {};
    }
    return { semua, ada_lagi: meta.page * meta.per_page < meta.total };
  }, [tab, halaman]);

  if (awal) return <p className="memuat">Memuat pesanan...</p>;
  if (galat)
    return (
      <div className="alert galat" role="alert">
        {galat.message}
      </div>
    );
  if (!data.semua.length) {
    return (
      <div className="kotak kosong">
        <div className="ikon" aria-hidden="true">
          🧾
        </div>
        <h2>{tab === "berlangsung" ? "Tidak ada pesanan berlangsung" : "Belum ada riwayat"}</h2>
        <p className="abu">
          {tab === "berlangsung"
            ? "Pesanan yang sedang diproses akan tampil di sini."
            : "Pesanan yang selesai atau dibatalkan akan tampil di sini."}
        </p>
        <Link className="btn" href="/katalog">
          Buka Katalog
        </Link>
      </div>
    );
  }
  return (
    <>
      {data.semua.map((p) => (
        <KartuPesanan key={p.id} p={p} />
      ))}
      {data.ada_lagi && (
        <button className="btn garis blok" type="button" disabled={memuat} onClick={() => setHalaman((h) => h + 1)}>
          {memuat ? "Memuat..." : "Muat lebih banyak"}
        </button>
      )}
    </>
  );
}

const AKSI = {
  bayar: (p) => ({ href: `/user/pesanan/${p.id}/bayar`, label: "Bayar sekarang", kelas: "btn sm" }),
  ajukan_pembatalan: (p) => ({
    href: `/user/pesanan/${p.id}#ajukan-batal`,
    label: "Ajukan pembatalan",
    kelas: "btn sm garis",
  }),
  pesan_lagi: () => ({ href: "/katalog", label: "Pesan lagi", kelas: "btn sm garis" }),
};

function KartuPesanan({ p }) {
  const aksi = AKSI[p.aksi_utama]?.(p);
  return (
    <div className="kartu">
      <img src={fotoKartu({ nama: p.tipe.nama, foto: p.tipe.foto || [] }, p.jenis_sewa)} alt={p.tipe.nama} />
      <div className="detail">
        <b>{p.tipe.nama}</b> · {p.nomor} <Badge status={p.status} />
        <br />
        {rentang(p.tgl_mulai, tglKembali(p.tgl_mulai, p.durasi))} · {p.durasi} hari · {rupiah(p.total_biaya)}
        <Tahapan status={p.status} />
        {aksi && (
          <Link className={aksi.kelas} href={aksi.href}>
            {aksi.label}
          </Link>
        )}{" "}
        <Link className="tautan" href={`/user/pesanan/${p.id}`}>
          Lihat detail
        </Link>
        {p.aksi_utama === "beri_review" && <FormNilai idPesanan={p.id} />}
      </div>
    </div>
  );
}
