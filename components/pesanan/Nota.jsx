"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { api, unduh } from "@/lib/api";
import { rupiah, tanggal } from "@/lib/format";
import { METODE, rentang, STATUS_BAYAR } from "@/lib/status";
import { useMuat } from "@/lib/useMuat";
import Badge from "@/components/Badge";
import Plat from "@/components/Plat";

// Nota pemesanan: data dari GET /pemesanan/{id} dan /me, PDF dari GET /pemesanan/{id}/nota.
export default function Nota() {
  const { id } = useParams();
  const { data, galat, awal } = useMuat(async () => {
    const [p, me] = await Promise.all([api.get(`/pemesanan/${encodeURIComponent(id)}`), api.get("/me")]);
    return { d: p.data, me: me.data };
  }, [id]);
  const [sibuk, setSibuk] = useState(false);
  const [galatUnduh, setGalatUnduh] = useState(null);

  if (awal) return <p className="memuat">Memuat nota...</p>;
  if (galat || !data.d.aksi?.bisa_unduh_nota) {
    return (
      <div className="kotak kosong">
        <div className="alert galat" role="alert">
          {galat
            ? galat.status === 404
              ? "Pesanan tidak ditemukan."
              : galat.message
            : "Nota tersedia setelah pembayaran diterima."}
        </div>
        <Link className="btn" href="/user/riwayat">
          Ke Riwayat Pemesanan
        </Link>
      </div>
    );
  }
  const { d, me } = data;
  const p = d.pembayaran || {};
  const metode = METODE[p.metode] || p.metode || "-";
  const kolom = (lebar) => ({ gridTemplateColumns: `${lebar}px 1fr` });

  async function unduhPdf() {
    setSibuk(true);
    setGalatUnduh(null);
    try {
      await unduh(`/pemesanan/${d.id}/nota`, `nota-${d.nomor}.pdf`);
    } catch (err) {
      setGalatUnduh(err);
    } finally {
      setSibuk(false);
    }
  }

  return (
    <div className="nota">
      <div className="kotak">
        <div className="kop">
          <div>
            <h1 style={{ fontSize: "24px", margin: 0 }}>Nota Pemesanan</h1>
            <span className="abu">No. {d.nomor}</span>
          </div>
          <div>
            <Badge status={d.status} />
          </div>
        </div>
        <div className="grid grid-2">
          <div>
            <h3>Data pelanggan</h3>
            <dl className="data-baris" style={kolom(110)}>
              <dt>Nama</dt>
              <dd>{me.nama}</dd>
              <dt>Email</dt>
              <dd>{me.email}</dd>
              <dt>WhatsApp</dt>
              <dd>{me.no_hp || "-"}</dd>
            </dl>
          </div>
          <div>
            <h3>Data pesanan</h3>
            <dl className="data-baris" style={kolom(110)}>
              <dt>Mobil</dt>
              <dd>{d.tipe.nama}</dd>
              <dt>Jenis</dt>
              <dd>
                {d.jenis_sewa === "dengan_sopir"
                  ? "Dengan sopir"
                  : `Lepas kunci${d.transmisi ? ` (${d.transmisi})` : ""}`}
              </dd>
              <dt>Tanggal</dt>
              <dd>{rentang(d.tgl_mulai, d.tgl_kembali)}</dd>
              <dt>Kembali</dt>
              <dd>{tanggal(d.tgl_kembali, true)}, 23.59</dd>
              {d.plat_nomor && (
                <>
                  <dt>Plat</dt>
                  <dd>
                    <Plat>{d.plat_nomor}</Plat>
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>
        <div className="info-bayar">
          <h3>Pembayaran</h3>
          <dl className="data-baris" style={kolom(150)}>
            <dt>Metode</dt>
            <dd>{metode}</dd>
            {p.order_id && (
              <>
                <dt>Nomor order</dt>
                <dd>
                  <span className="nomor-bayar">{p.order_id}</span>
                </dd>
              </>
            )}
            <dt>Status</dt>
            <dd>{STATUS_BAYAR[p.status] || p.status || "-"}</dd>
          </dl>
        </div>
        <h3 className="jarak-kecil" style={{ marginTop: "20px" }}>
          Rincian biaya
        </h3>
        <table className="tabel">
          <thead>
            <tr>
              <th>Uraian</th>
              <th className="angka">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Sewa {rupiah(Math.round(d.total_biaya / d.durasi))} × {d.durasi} hari
              </td>
              <td className="angka">{rupiah(d.total_biaya)}</td>
            </tr>
            <tr className="total">
              <td>Total dibayar ({metode})</td>
              <td className="angka">{rupiah(d.total_biaya)}</td>
            </tr>
          </tbody>
        </table>
        {galatUnduh && (
          <div className="alert galat" role="alert" style={{ marginTop: "12px" }}>
            {galatUnduh.message}
          </div>
        )}
        <div className="baris aksi-nota" style={{ marginTop: "20px" }}>
          <button className="btn" type="button" onClick={unduhPdf} disabled={sibuk}>
            {sibuk ? "Mengunduh..." : "Unduh PDF"}
          </button>
          <button className="btn garis" type="button" onClick={() => window.print()}>
            Cetak
          </button>
          <Link className="btn garis" href={`/user/pesanan/${d.id}`}>
            Lihat detail pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}
