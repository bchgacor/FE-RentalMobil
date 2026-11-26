"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { rupiah } from "@/lib/format";
import { fotoKartu } from "@/lib/fotoMobil";
import { useMuat } from "@/lib/useMuat";
import { useKonfirmasi } from "@/components/admin/Konfirmasi";
import Plat from "@/components/Plat";

export const STATUS_UNIT = {
  tersedia: "Tersedia",
  disewa: "Disewa",
  dalam_perawatan: "Dalam servis",
  dalam_servis: "Dalam servis",
  tidak_tersedia: "Tidak tersedia",
};
const BADGE_UNIT = {
  tersedia: "tersedia",
  disewa: "disewa",
  dalam_perawatan: "servis",
  dalam_servis: "servis",
  tidak_tersedia: "netral",
};
export const BAHAN_BAKAR = { bensin: "Bensin", diesel: "Diesel", listrik: "Listrik" };
const OK = { tipe: "Tipe tersimpan. Katalog sudah diperbarui.", unit: "Unit tersimpan." };

const harga = (n) => (n ? rupiah(n) : "-");

// Kelola Mobil: GET /admin/tipe, GET /admin/unit, hapus tipe/unit, PATCH status unit.
export default function DaftarMobil() {
  const q = useSearchParams();
  const [saring, setSaring] = useState(q.get("tipe") || "");
  // Next.js menyimpan halaman yang pernah dibuka (state ikut tersimpan), jadi pesan dicatat bersama alamatnya.
  const alamat = q.toString();
  const [infoAksi, setInfoAksi] = useState(null);
  const info =
    infoAksi?.alamat === alamat ? infoAksi : OK[q.get("ok")] ? { teks: OK[q.get("ok")], jenis: "sukses" } : null;
  const setInfo = (x) => setInfoAksi({ ...x, alamat });
  const { data, galat, awal, muatUlang } = useMuat(async () => {
    const [t, u] = await Promise.all([api.get("/admin/tipe"), api.get("/admin/unit")]);
    return { tipe: t.data, unit: u.data };
  });
  const { buka, modal } = useKonfirmasi({
    onBerhasil: (a) => {
      setInfo({ teks: a.ok, jenis: "sukses" });
      muatUlang();
    },
    onGagal: (err) => setInfo({ teks: err.message, jenis: "galat" }),
  });

  if (awal) return <p className="memuat">Memuat data mobil...</p>;
  if (galat) return <div className="alert galat">{galat.message}</div>;
  const { tipe, unit } = data;
  const unitTampil = unit.filter((u) => !saring || String(u.id_tipe) === saring);

  function hapusTipe(t) {
    buka({
      judul: "Hapus tipe?",
      teks: `Tipe ${t.nama} dipindahkan ke tempat sampah dan tidak tampil di katalog. Tipe yang masih punya unit tidak bisa dihapus.`,
      label: "Ya, hapus",
      bahaya: true,
      ok: `Tipe ${t.nama} dihapus.`,
      jalan: () => api.del(`/admin/tipe/${t.id}`),
    });
  }
  function hapusUnit(u) {
    buka({
      judul: "Hapus unit?",
      teks: `Unit ${u.plat_nomor} dipindahkan ke tempat sampah.`,
      label: "Ya, hapus",
      bahaya: true,
      ok: `Unit ${u.plat_nomor} dihapus.`,
      jalan: (k) => api.del(`/admin/unit/${u.id}`, { query: { konfirmasi: k ? 1 : undefined } }),
    });
  }
  function ubahStatus(u, ke) {
    const non = ke === "tidak_tersedia";
    buka({
      judul: non ? "Tandai tidak tersedia?" : "Tandai tersedia?",
      teks: non
        ? `Unit ${u.plat_nomor} tidak muncul di katalog sampai ditandai tersedia lagi. Jika ada pesanan Dikonfirmasi yang kekurangan unit, sistem menampilkan daftarnya lebih dulu.`
        : `Unit ${u.plat_nomor} kembali muncul di katalog dan bisa dipesan.`,
      label: "Ya, tandai",
      bahaya: non,
      ok: `Status unit ${u.plat_nomor} diubah menjadi ${STATUS_UNIT[ke].toLowerCase()}.`,
      jalan: (k) => api.patch(`/admin/unit/${u.id}/status`, { json: { status: ke, konfirmasi: k } }),
    });
  }

  return (
    <>
      {info && (
        <div className={`alert ${info.jenis}`} role="status">
          {info.teks}
        </div>
      )}
      <div className="baris" style={{ marginBottom: "16px" }}>
        <Link href="/admin/kelola-mobil/tipe/baru" className="btn">
          Tambah tipe
        </Link>
        <Link href={`/admin/kelola-mobil/unit/baru${saring ? `?tipe=${saring}` : ""}`} className="btn garis">
          Tambah unit
        </Link>
      </div>
      <section className="kartu">
        <h2>Tipe mobil</h2>
        <p className="ket">Tarif per hari. Tipe yang masih punya unit atau pemesanan tidak bisa dihapus.</p>
        <div className="tabel-bungkus">
          <table className="tabel">
            <thead>
              <tr>
                <th></th>
                <th>Tipe</th>
                <th>Merk</th>
                <th>Kursi</th>
                <th>BBM</th>
                <th className="angka">Dengan sopir</th>
                <th className="angka">Lepas kunci manual</th>
                <th className="angka">Lepas kunci matic</th>
                <th>Unit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!tipe.length && (
                <tr>
                  <td colSpan={10} className="memuat">
                    Belum ada tipe. Klik Tambah tipe.
                  </td>
                </tr>
              )}
              {tipe.map((t) => (
                <tr key={t.id}>
                  <td>
                    {}
                    <img
                      className="thumb"
                      src={
                        t.foto?.[0]?.url ||
                        fotoKartu({ nama: t.nama, foto: [] }, t.harga_sopir_per_hari ? "dengan_sopir" : "lepas_kunci")
                      }
                      alt=""
                    />
                  </td>
                  <td className="tebal">{t.nama}</td>
                  <td>{t.merk}</td>
                  <td>{t.kursi}</td>
                  <td>{BAHAN_BAKAR[t.bahan_bakar] || t.bahan_bakar}</td>
                  <td className="angka">{harga(t.harga_sopir_per_hari)}</td>
                  <td className="angka">{harga(t.harga_lepas_kunci_manual)}</td>
                  <td className="angka">{harga(t.harga_lepas_kunci_matic)}</td>
                  <td>
                    <button type="button" className="tautan" onClick={() => setSaring(String(t.id))}>
                      {t.jumlah_unit}
                    </button>
                  </td>
                  <td>
                    <Link href={`/admin/kelola-mobil/tipe/${t.id}`} className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <button type="button" className="tautan" onClick={() => hapusTipe(t)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="kartu" id="unit">
        <div className="baris" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>Unit mobil</h2>
          <select
            aria-label="Saring tipe"
            value={saring}
            onChange={(e) => setSaring(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="">Semua tipe</option>
            {tipe.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nama}
              </option>
            ))}
          </select>
        </div>
        <p className="ket">
          Status Disewa mengikuti pesanan Berjalan. Unit yang sedang disewa tidak bisa diubah statusnya.
        </p>
        <div className="tabel-bungkus">
          <table className="tabel">
            <thead>
              <tr>
                <th>Plat nomor</th>
                <th>Tipe</th>
                <th>Tahun</th>
                <th>Warna</th>
                <th>Transmisi</th>
                <th className="angka">Odometer</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!unitTampil.length && (
                <tr>
                  <td colSpan={8} className="memuat">
                    Belum ada unit{saring ? " untuk tipe ini" : ""}.
                  </td>
                </tr>
              )}
              {unitTampil.map((u) => {
                const s = u.status_tampil || u.status;
                const kunci = s === "disewa" || s === "dalam_perawatan" || s === "dalam_servis";
                return (
                  <tr key={u.id}>
                    <td>
                      <Plat>{u.plat_nomor}</Plat>
                    </td>
                    <td>{u.tipe?.nama || "-"}</td>
                    <td>{u.tahun}</td>
                    <td>{u.warna}</td>
                    <td>{u.transmisi === "matic" ? "Matic" : "Manual"}</td>
                    <td className="angka">
                      {u.km_terakhir != null ? `${Number(u.km_terakhir).toLocaleString("id-ID")} km` : "-"}
                    </td>
                    <td>
                      <span className={`badge ${BADGE_UNIT[s] || ""}`}>{STATUS_UNIT[s] || s}</span>
                    </td>
                    <td className="aksi-baris">
                      {s === "tersedia" && (
                        <button type="button" className="btn garis sm" onClick={() => ubahStatus(u, "tidak_tersedia")}>
                          Tandai tidak tersedia
                        </button>
                      )}
                      {s === "tidak_tersedia" && (
                        <button type="button" className="btn garis sm" onClick={() => ubahStatus(u, "tersedia")}>
                          Tandai tersedia
                        </button>
                      )}{" "}
                      <Link href={`/admin/kelola-mobil/unit/${u.id}`} className="tautan">
                        Ubah
                      </Link>
                      {!kunci && (
                        <>
                          {" · "}
                          <button type="button" className="tautan" onClick={() => hapusUnit(u)}>
                            Hapus
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      {modal}
    </>
  );
}
