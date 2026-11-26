"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { tanggal } from "@/lib/format";
import { st, STATUS } from "@/lib/status";
import { useMuat } from "@/lib/useMuat";
import Badge from "@/components/Badge";
import Plat from "@/components/Plat";

// Daftar pesanan admin: GET /admin/pemesanan?status&q&page (15 per halaman).
// Filter status berupa tombol (sesuai Figma); pilihan disimpan di alamat halaman.
export default function DaftarPesanan() {
  const q = useSearchParams();
  const status = q.get("status") || "";
  const cari = q.get("q") || "";
  const page = Number(q.get("page") || 1);
  const { data, galat, awal } = useMuat(
    async () => await api.get("/admin/pemesanan", { query: { status, q: cari, page, per_page: 15 } }),
    [status, cari, page],
  );
  const alamat = (ubah) => {
    const x = new URLSearchParams(q);
    for (const [k, v] of Object.entries(ubah)) v ? x.set(k, v) : x.delete(k);
    if (!("page" in ubah)) x.delete("page");
    const s = x.toString();
    return "/admin/pesanan" + (s ? "?" + s : "");
  };

  return (
    <>
      <nav className="kartu saring" aria-label="Saring status pesanan">
        <span className="label">Status</span>
        <Link className={status ? undefined : "aktif"} href={alamat({ status: "" })}>
          Semua
        </Link>
        {Object.entries(STATUS).map(([k, v]) => (
          <Link key={k} className={status === k ? "aktif" : undefined} href={alamat({ status: k })}>
            {v.label}
          </Link>
        ))}
        <form className="cari-pesanan" action="/admin/pesanan" method="get" key={cari}>
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            type="search"
            maxLength={100}
            defaultValue={cari}
            placeholder="Nomor pesanan atau nama pelanggan"
            aria-label="Cari pesanan"
          />
          <button className="btn sm" type="submit">
            Cari
          </button>
        </form>
      </nav>
      {awal ? (
        <section className="kartu">
          <p className="memuat">Memuat pesanan...</p>
        </section>
      ) : galat ? (
        <div className="alert galat">{galat.message}</div>
      ) : !data.data.length ? (
        <section className="kartu kosong">
          <div className="ikon" aria-hidden="true">
            🧾
          </div>
          <h2>Tidak ada pesanan</h2>
          <p className="abu">
            {status || cari ? "Tidak ada pesanan yang cocok dengan filter ini." : "Belum ada pesanan yang masuk."}
          </p>
          <Link className="btn" href="/admin/pesanan">
            Tampilkan semua
          </Link>
        </section>
      ) : (
        <Tabel res={data} status={status} alamat={alamat} />
      )}
    </>
  );
}

function Tabel({ res, status, alamat }) {
  const m = res.meta || {};
  const jmlHal = Math.ceil((m.total || 0) / (m.per_page || 15));
  return (
    <section className="kartu">
      <p className="filter-info">
        Menampilkan {res.data.length} dari {m.total} pesanan
        {status ? ` berstatus ${st(status).label.toLowerCase()}` : ""}.
      </p>
      <div className="tabel-bungkus">
        <table className="tabel">
          <thead>
            <tr>
              <th>Tanggal mulai</th>
              <th>Pesanan</th>
              <th>Pelanggan</th>
              <th>Unit</th>
              <th>Dipesan</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {res.data.map((p) => (
              <tr key={p.id}>
                <td>{tanggal(p.tgl_mulai, true)}</td>
                <td className="tebal">{p.nomor}</td>
                <td>{p.pelanggan.nama}</td>
                <td>
                  {p.tipe.nama}
                  {p.plat_nomor && (
                    <>
                      {" · "}
                      <Plat>{p.plat_nomor}</Plat>
                    </>
                  )}
                </td>
                <td>{tanggal(p.tgl_pesan, true)}</td>
                <td>
                  <Badge status={p.status} />
                </td>
                <td>
                  <Link className="tautan" href={`/admin/pesanan/${p.id}`}>
                    Lihat detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {jmlHal > 1 && (
        <div className="baris" style={{ justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
          {m.page > 1 ? (
            <Link className="btn garis sm" href={alamat({ page: m.page - 1 })}>
              ← Sebelumnya
            </Link>
          ) : (
            <span />
          )}
          <span className="abu kecil">
            Halaman {m.page} dari {jmlHal}
          </span>
          {m.page < jmlHal ? (
            <Link className="btn garis sm" href={alamat({ page: m.page + 1 })}>
              Berikutnya →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
      <p className="kecil abu" style={{ margin: "12px 0 0" }}>
        Daftar hanya menampilkan status. Semua tindakan ada di halaman detail pesanan.
      </p>
    </section>
  );
}
