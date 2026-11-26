"use client";

import Link from "next/link";
import { api } from "@/lib/api";
import { rupiah } from "@/lib/format";
import { useMuat } from "@/lib/useMuat";
import Plat from "@/components/Plat";

export const TUGAS = {
  pengajuan_pembatalan: "Putuskan pembatalan",
  refund_transfer: "Transfer refund",
  serahkan_unit: "Serahkan unit",
  pengembalian_jatuh_tempo: "Terima pengembalian",
  tagihan_belum_dibayar: "Tagih biaya tambahan",
  jaminan_siap_dikembalikan: "Kembalikan jaminan",
};
const PENGINGAT = { perlu_servis: ["Perlu servis", "perlu"], segera: ["Segera", "segera"], aman: ["Aman", "aman"] };

// Dashboard: GET /admin/dashboard, pendapatan 7 hari dari GET /admin/laporan?periode=7.
export default function Dashboard() {
  const { data, galat, awal } = useMuat(async () => {
    const [d, l] = await Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/laporan", { query: { periode: "7" } }).catch(() => null),
    ]);
    return { ...d.data, pendapatan: l ? l.data.ringkasan.total_pendapatan : null };
  });

  if (awal) return <p className="memuat">Memuat ringkasan...</p>;
  if (galat) return <div className="alert galat">{galat.message}</div>;
  const h = data.hitungan;
  const tugas = data.tugas_admin || [];
  const pengingat = data.pengingat_servis || [];

  return (
    <>
      <div className="grid grid-4">
        <Stat
          label="Menunggu pembayaran"
          isi={h.menunggu_pembayaran}
          href="/admin/pesanan?status=menunggu_pembayaran"
        />
        <Stat label="Dikonfirmasi" isi={h.dikonfirmasi} href="/admin/pesanan?status=dikonfirmasi" />
        <Stat label="Berjalan" isi={h.berjalan} href="/admin/pesanan?status=berjalan" />
        <Stat
          label="Pengajuan pembatalan"
          isi={h.pengajuan_pembatalan}
          href="/admin/pesanan?status=pengajuan_pembatalan"
        />
      </div>
      <div className="grid grid-3 jarak">
        <Stat label="Unit tersedia" isi={h.unit_tersedia} ket="siap dipesan" />
        <Stat label="Unit dalam servis" isi={h.unit_dalam_servis} ket="tidak muncul di katalog" />
        <Stat
          label="Pendapatan terkonfirmasi"
          isi={data.pendapatan == null ? "-" : rupiah(data.pendapatan)}
          ket="7 hari terakhir (Dikonfirmasi, Berjalan, Selesai)"
          warna
        />
      </div>
      <section className="kartu jarak">
        <h2>Perlu tindakan</h2>
        <p className="ket">Pesanan yang menunggu keputusan atau pengerjaan admin.</p>
        <div className="tabel-bungkus">
          <table className="tabel">
            <thead>
              <tr>
                <th>Tindakan</th>
                <th>Keterangan</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!tugas.length && (
                <tr>
                  <td colSpan={3} className="memuat">
                    Tidak ada yang perlu ditindaklanjuti.
                  </td>
                </tr>
              )}
              {tugas.map((t, i) => (
                <tr key={`${t.jenis}-${t.id}-${i}`}>
                  <td className="tebal">{TUGAS[t.jenis] || t.jenis}</td>
                  <td>{t.keterangan}</td>
                  <td>
                    <Link href={`/admin/pesanan/${t.id}`} className="tautan">
                      Buka
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="kartu">
        <h2>Pengingat servis</h2>
        <p className="ket">
          {"Status dihitung dari odometer dan jadwal servis. "}
          <Link href="/admin/servis" className="tautan">
            Buka halaman Servis
          </Link>
        </p>
        <div className="tabel-bungkus">
          <table className="tabel">
            <tbody>
              {!pengingat.length && (
                <tr>
                  <td colSpan={2} className="memuat">
                    Semua unit masih aman dari jadwal servis.
                  </td>
                </tr>
              )}
              {pengingat.map((x) => {
                const [label, jenis] = PENGINGAT[x.status] || [x.status, ""];
                return (
                  <tr key={x.id_kendaraan}>
                    <td className="tebal">
                      <Plat>{x.plat_nomor}</Plat>
                    </td>
                    <td>
                      <span className={`badge ${jenis}`}>{label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Stat({ label, isi, ket, warna, href }) {
  const isiKartu = (
    <>
      <div className="label">{label}</div>
      <div className="angka">{isi}</div>
      {ket && <p className="ket">{ket}</p>}
    </>
  );
  if (href)
    return (
      <Link href={href} className="kartu stat" style={{ textDecoration: "none", color: "inherit" }}>
        {isiKartu}
      </Link>
    );
  return <div className={warna ? "kartu stat warna" : "kartu stat"}>{isiKartu}</div>;
}
