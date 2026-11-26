"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, unduh } from "@/lib/api";
import { rupiah, tanggal } from "@/lib/format";
import { st } from "@/lib/status";
import { useMuat } from "@/lib/useMuat";
import Badge from "@/components/Badge";

const PERIODE = { 7: "7 hari terakhir", 30: "30 hari terakhir", bulan_ini: "Bulan ini", bulan_lalu: "Bulan lalu" };

// Laporan: GET /admin/laporan?periode&status, PDF dari GET /admin/laporan/pdf (409 DATA_KOSONG bila tidak ada data).
export default function Laporan() {
  const q = useSearchParams();
  const router = useRouter();
  const periode = PERIODE[q.get("periode")] ? q.get("periode") : "7";
  const status = q.get("status") || "";
  const [pdf, setPdf] = useState({ sibuk: false, galat: null });
  const { data, galat, memuat } = useMuat(async () => {
    const [l, semua] = await Promise.all([
      api.get("/admin/laporan", { query: { periode, status } }),
      status ? api.get("/admin/laporan", { query: { periode } }) : null,
    ]);
    return {
      ...l.data,
      perStatus: (semua || l).data.ringkasan.per_status,
      jumlahSemua: (semua || l).data.ringkasan.jumlah_transaksi,
    };
  }, [periode, status]);
  const alamat = (s) => `/admin/laporan?${new URLSearchParams({ periode, ...(s ? { status: s } : {}) })}`;

  async function unduhPdf() {
    setPdf({ sibuk: true, galat: null });
    try {
      await unduh("/admin/laporan/pdf", `laporan-${periode}${status ? `-${status}` : ""}.pdf`, { periode, status });
      setPdf({ sibuk: false, galat: null });
    } catch (err) {
      setPdf({ sibuk: false, galat: err.code === "DATA_KOSONG" ? "Tidak ada data pada periode ini." : err.message });
    }
  }

  return (
    <>
      <form
        className="kartu filter"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/admin/laporan?${new URLSearchParams({ periode: e.currentTarget.elements.periode.value })}`);
        }}
      >
        <div>
          <label htmlFor="per">Periode (menurut tanggal mulai sewa)</label>
          <select id="per" name="periode" defaultValue={periode} key={periode}>
            {Object.entries(PERIODE).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button className="btn" type="submit">
            Terapkan
          </button>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button type="button" className="btn garis" onClick={unduhPdf} disabled={pdf.sibuk || !data?.data?.length}>
            {pdf.sibuk ? "Mengunduh..." : "Unduh PDF"}
          </button>
        </div>
      </form>
      {pdf.galat && <div className="alert galat">{pdf.galat}</div>}
      {galat && <div className="alert galat">{galat.message}</div>}
      {memuat && !data && <p className="memuat">Memuat laporan...</p>}
      {data && (
        <>
          <p className="abu">
            Periode: {tanggal(data.periode.dari, true)} sampai {tanggal(data.periode.sampai, true)} (
            {PERIODE[periode].toLowerCase()}){status ? `, status ${st(status).label.toLowerCase()}` : ""}.
          </p>
          <div className="grid grid-3">
            <div className="kartu stat warna">
              <div className="label">Total pendapatan</div>
              <div className="angka">{rupiah(data.ringkasan.total_pendapatan)}</div>
              <p className="ket">Dikonfirmasi, Berjalan, dan Selesai; sewa ditambah tagihan tambahan</p>
            </div>
            <div className="kartu stat">
              <div className="label">Jumlah transaksi</div>
              <div className="angka">{data.ringkasan.jumlah_transaksi}</div>
            </div>
            <div className="kartu stat">
              <div className="label">Dibatalkan</div>
              <div className="angka">{data.ringkasan.jumlah_dibatalkan}</div>
            </div>
          </div>
          <nav className="kartu saring jarak" aria-label="Tampilkan status">
            <span className="label">Tampilkan status</span>
            <Link href={alamat("")} className={status ? "semua" : "semua aktif"}>
              Semua {data.jumlahSemua}
            </Link>
            {Object.entries(data.perStatus || {}).map(([k, n]) => (
              <Link key={k} href={alamat(k)} className={status === k ? "aktif" : undefined}>
                {st(k).label} {n}
              </Link>
            ))}
          </nav>
          <section className="kartu">
            <h2>Pesanan pada periode ini</h2>
            {!data.data.length ? (
              <p className="memuat">Tidak ada pesanan pada periode ini.</p>
            ) : (
              <div className="tabel-bungkus">
                <table className="tabel">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Tanggal mulai</th>
                      <th>Pesanan</th>
                      <th>Pelanggan</th>
                      <th>Unit</th>
                      <th>Status</th>
                      <th className="angka">Sewa</th>
                      <th className="angka">Tagihan tambahan</th>
                      <th className="angka">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((b, i) => (
                      <tr key={b.nomor}>
                        <td>{i + 1}</td>
                        <td>{tanggal(b.tgl_mulai, true)}</td>
                        <td className="tebal">{b.nomor}</td>
                        <td>{b.pelanggan}</td>
                        <td>{b.unit}</td>
                        <td>
                          <Badge status={b.status} />
                        </td>
                        <td className="angka">{rupiah(b.sewa)}</td>
                        <td className="angka">{b.tagihan_tambahan ? rupiah(b.tagihan_tambahan) : "-"}</td>
                        <td className="angka">{rupiah(b.sewa + b.tagihan_tambahan)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
