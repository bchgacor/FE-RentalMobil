"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { rupiah, tanggal, tanggalJam } from "@/lib/format";
import { BAGIAN, BBM, DOMISILI, JAMINAN, METODE_ADMIN, TAMBAHAN, waLink } from "@/lib/labelAdmin";
import { tutupModal } from "@/lib/modal";
import { useKirim } from "@/lib/useKirim";
import { useMuat } from "@/lib/useMuat";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Plat from "@/components/Plat";
import Tahapan from "@/components/Tahapan";
import { AlertGalat } from "@/components/ui/Galat";

const PESAN_OK = {
  serah: "Unit sudah diserahkan. Pesanan sekarang Berjalan.",
  selesai: "Pengembalian tersimpan. Pesanan sudah Selesai.",
  setujui: "Pengajuan pembatalan disetujui.",
  tolak: "Pengajuan pembatalan ditolak, pesanan kembali dikonfirmasi.",
  refund: "Refund ditandai selesai.",
  lunas: "Tagihan tambahan ditandai lunas.",
  jaminan: "Jaminan sudah dikembalikan.",
  catatan: "Catatan tersimpan.",
};

// Detail pesanan di panel admin: GET /admin/pemesanan/{id} beserta semua tindakan admin.
// Admin tidak bisa membatalkan pesanan; hanya menyetujui atau menolak pengajuan pelanggan.
export default function DetailPesananAdmin() {
  const { id } = useParams();
  const q = useSearchParams();
  const {
    data: d,
    galat,
    awal,
    muatUlang,
  } = useMuat(async () => (await api.get(`/admin/pemesanan/${encodeURIComponent(id)}`)).data, [id]);
  // Next.js menyimpan halaman yang pernah dibuka (state ikut tersimpan), jadi pesan dicatat bersama alamatnya.
  const alamat = q.toString();
  const [pesanAksi, setPesanAksi] = useState(null);
  const pesan =
    pesanAksi?.alamat === alamat
      ? pesanAksi
      : PESAN_OK[q.get("ok")]
        ? { teks: PESAN_OK[q.get("ok")], jenis: "sukses" }
        : null;
  const setPesan = (x) => setPesanAksi(x && { ...x, alamat });
  const aksi = useKirim();

  async function jalankan(path, body, ok) {
    await aksi.kirim(async () => {
      try {
        await api.post(`/admin/pemesanan/${id}/${path}`, { json: body || {} });
        setPesan({ teks: PESAN_OK[ok], jenis: "sukses" });
        muatUlang();
      } finally {
        tutupModal();
      }
    });
  }

  // PATCH /admin/review/{id}: tampilkan atau sembunyikan ulasan dari katalog.
  async function aturUlasan(tampil) {
    await aksi.kirim(async () => {
      await api.patch(`/admin/review/${d.review.id}`, { json: { tampil_di_katalog: tampil } });
      setPesan({
        teks: tampil ? "Ulasan ditampilkan lagi di katalog." : "Ulasan disembunyikan dari katalog.",
        jenis: "sukses",
      });
      muatUlang();
    });
  }

  if (awal) return <p className="memuat">Memuat pesanan...</p>;
  if (galat)
    return (
      <section className="kartu">
        <div className="alert galat" role="alert">
          {galat.status === 404 ? "Pesanan tidak ditemukan." : galat.message}
        </div>
      </section>
    );

  const ds = d.jenis_sewa === "dengan_sopir";
  const pg = d.pengembalian;
  const stt = d.serah_terima;
  return (
    <>
      {pesan?.teks && (
        <div className={`alert ${pesan.jenis}`} role="status">
          {pesan.teks}
        </div>
      )}
      <AlertGalat galat={aksi.galat} />
      <div className="kepala-halaman">
        <div>
          <h1>{d.nomor}</h1>
          <span className="abu">
            Dipesan {tanggal(d.tgl_pesan, true)} · {d.tipe.nama} · {ds ? "Dengan sopir" : "Lepas kunci"}
          </span>
        </div>
        <Badge status={d.status} />
      </div>
      <section className="kartu">
        <Tindakan d={d} sibuk={aksi.sibuk} jalankan={jalankan} />
      </section>
      <section className="kartu">
        <h2>Tahapan</h2>
        <Tahapan status={d.status} />
      </section>
      <div className="grid grid-2 mulai">
        <div>
          <section className="kartu">
            <h2>Data Pesanan</h2>
            <Dl
              baris={[
                ["Tipe", `${d.tipe.nama}${d.transmisi ? ` (${d.transmisi})` : ""}`],
                ["Jenis sewa", ds ? "Dengan sopir" : "Lepas kunci"],
                [
                  "Plat nomor",
                  d.plat_nomor ? <Plat>{d.plat_nomor}</Plat> : "Belum ditetapkan (diisi saat Serahkan unit)",
                ],
                ["Tanggal", `${tanggal(d.tgl_mulai, true)} sampai ${tanggal(d.tgl_kembali, true)}`],
                [
                  ds ? "Jam jemput" : "Jam serah terima",
                  String(d.jam_serah || "")
                    .slice(0, 5)
                    .replace(":", "."),
                ],
                ["Durasi", `${d.durasi} hari`],
                ["Kembali paling lambat", `${tanggal(d.tgl_kembali, true)}, 23.59`],
                !ds && ["Cara terima unit", d.metode_ambil === "diantar" ? "Diantar" : "Ambil di kantor"],
                d.lokasi_jemput && [ds ? "Lokasi jemput" : "Alamat antar", d.lokasi_jemput],
                d.tujuan && ["Tujuan", d.tujuan],
                d.catatan && ["Catatan pelanggan", d.catatan],
              ]}
            />
          </section>
          <section className="kartu">
            <h2>Pembayaran</h2>
            {d.riwayat_pembayaran?.length ? (
              <div className="tabel-bungkus">
                <table className="tabel">
                  <thead>
                    <tr>
                      <th>Jenis</th>
                      <th>Metode</th>
                      <th>Status</th>
                      <th className="angka">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.riwayat_pembayaran.map((b, i) => (
                      <tr key={i}>
                        <td>{b.jenis === "tambahan" ? "Tagihan tambahan" : "Sewa"}</td>
                        <td>{METODE_ADMIN[b.metode] || b.metode || "-"}</td>
                        <td>{b.status}</td>
                        <td className="angka">{rupiah(b.jumlah)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="abu">Belum ada pembayaran.</p>
            )}
          </section>
          {stt && (
            <section className="kartu">
              <h2>Serah Terima</h2>
              <Dl
                baris={[
                  ["Waktu", tanggalJam(stt.tgl_serah)],
                  ["Plat", <Plat key="p">{stt.plat_nomor}</Plat>],
                  stt.odometer_awal != null && [
                    "Odometer awal",
                    `${Number(stt.odometer_awal).toLocaleString("id-ID")} km`,
                  ],
                  stt.bbm_awal && ["BBM awal", BBM[stt.bbm_awal] || stt.bbm_awal],
                  stt.catatan_kondisi && ["Kondisi awal", stt.catatan_kondisi],
                  ["Diserahkan oleh", stt.admin || "-"],
                ]}
              />
            </section>
          )}
          {d.jaminan && (
            <section className="kartu">
              <h2>Jaminan</h2>
              <p className="kecil abu">
                Status: {d.jaminan.status === "dikembalikan" ? "sudah dikembalikan" : "ditahan"}
              </p>
              <ul className="daftar-tanda">
                {d.jaminan.daftar.map((j, i) => (
                  <li key={i}>
                    {JAMINAN[j.jenis] || j.jenis}
                    {j.dikembalikan ? " (dikembalikan)" : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {pg && (
            <section className="kartu">
              <h2>Hasil Pemeriksaan</h2>
              <Dl
                baris={[
                  [
                    "Dikembalikan",
                    `${tanggal(pg.tgl_kembali, true)}, ${String(pg.jam_kembali || "")
                      .slice(0, 5)
                      .replace(":", ".")}`,
                  ],
                  pg.odometer_akhir != null && [
                    "Odometer akhir",
                    `${Number(pg.odometer_akhir).toLocaleString("id-ID")} km`,
                  ],
                  pg.bbm_akhir && ["BBM akhir", BBM[pg.bbm_akhir] || pg.bbm_akhir],
                  pg.kebersihan && ["Kebersihan", String(pg.kebersihan).replace(/_/g, " ")],
                  pg.catatan_admin && ["Catatan", pg.catatan_admin],
                ]}
              />
            </section>
          )}
          {d.review && (
            <section className="kartu">
              <h2>Ulasan Pelanggan</h2>
              <p>
                <b>{"★".repeat(d.review.rating)}</b> {d.review.komentar}
              </p>
              <p className="kecil abu">
                {tanggal(d.review.tgl_review, true)} ·{" "}
                {d.review.tampil_di_katalog === false ? "disembunyikan dari katalog" : "tampil di katalog"}
              </p>
              <button
                type="button"
                className="btn garis sm"
                disabled={aksi.sibuk}
                onClick={() => aturUlasan(d.review.tampil_di_katalog === false)}
              >
                {d.review.tampil_di_katalog === false ? "Tampilkan di katalog" : "Sembunyikan dari katalog"}
              </button>
            </section>
          )}
          <section className="kartu">
            <h2>Riwayat Aktivitas</h2>
            {d.log_aktivitas?.length ? (
              <ol className="timeline">
                {d.log_aktivitas.map((l, i) => (
                  <li key={i}>
                    {l.aksi} <span className="abu">oleh {l.oleh}</span>
                    <time>{tanggalJam(l.waktu)}</time>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="abu">Belum ada aktivitas.</p>
            )}
          </section>
        </div>
        <div>
          <section className="kartu">
            <h2>Data Pelanggan</h2>
            <Dl
              baris={[
                ["Nama", d.pelanggan.nama],
                ["WhatsApp", d.pelanggan.no_hp || "-"],
                ["Email", d.pelanggan.email],
                ["Kota", [d.pelanggan.kota, d.pelanggan.provinsi].filter(Boolean).join(", ") || "-"],
                ["Domisili pesanan", DOMISILI[d.domisili] || d.domisili || "-"],
                d.pelanggan.no_identitas && ["No. identitas", d.pelanggan.no_identitas],
              ]}
            />
          </section>
          <section className="kartu">
            <h2>Rincian Biaya</h2>
            <Rincian d={d} />
          </section>
          <Catatan
            id={id}
            awal={d.catatan_admin || ""}
            onOk={() => setPesan({ teks: PESAN_OK.catatan, jenis: "sukses" })}
          />
        </div>
      </div>

      <Modal id="setujui" label="Setujui pembatalan?">
        <h3>Setujui pembatalan?</h3>
        <p>
          Pesanan dibatalkan dan dana dikembalikan sesuai metode pembayaran. Untuk virtual account atau gerai, refund
          ditransfer manual ke rekening yang diisi pelanggan.
        </p>
        <div className="baris">
          <a className="btn garis sm" href="#">
            Kembali
          </a>
          <button
            className="btn bahaya sm"
            type="button"
            disabled={aksi.sibuk}
            onClick={() => jalankan("setujui-pembatalan", {}, "setujui")}
          >
            {aksi.sibuk ? "Memproses..." : "Ya, setujui"}
          </button>
        </div>
      </Modal>
      <Modal id="tolak" label="Tolak pengajuan?">
        <h3>Tolak pengajuan pembatalan?</h3>
        <p>Pesanan kembali ke status sebelumnya. Kabari pelanggan lewat WhatsApp.</p>
        <div className="baris">
          <a className="btn garis sm" href="#">
            Kembali
          </a>
          <button
            className="btn sm"
            type="button"
            disabled={aksi.sibuk}
            onClick={() => jalankan("tolak-pembatalan", {}, "tolak")}
          >
            {aksi.sibuk ? "Memproses..." : "Ya, tolak"}
          </button>
        </div>
      </Modal>
      <Modal id="lunas" label="Tandai tagihan lunas">
        <h3>Tandai tagihan lunas</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            jalankan("tagihan/lunas", { metode: new FormData(e.currentTarget).get("metode") }, "lunas");
          }}
        >
          <label htmlFor="metode-lunas">Dibayar dengan</label>
          <select id="metode-lunas" name="metode">
            <option value="tunai">Tunai</option>
            <option value="transfer">Transfer</option>
          </select>
          <div className="baris" style={{ marginTop: "12px" }}>
            <a className="btn garis sm" href="#">
              Kembali
            </a>
            <button className="btn sm" type="submit" disabled={aksi.sibuk}>
              {aksi.sibuk ? "Memproses..." : "Tandai lunas"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

function Dl({ baris }) {
  return (
    <dl className="data-baris">
      {baris.filter(Boolean).map(([k, v]) => (
        <div key={k} style={{ display: "contents" }}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Tindakan({ d, sibuk, jalankan }) {
  const a = d.aksi || {};
  const tombol = [];
  const isi = [];
  if (a.bisa_serahkan) {
    if (d.metode_ambil === "diantar" || d.jenis_sewa === "dengan_sopir") {
      isi.push(
        <p key="lokasi">
          Sebelum menyerahkan unit, periksa lokasi {d.jenis_sewa === "dengan_sopir" ? "jemput" : "antar"}:{" "}
          <b>{d.lokasi_jemput || "-"}</b>. Jika di luar batas antar gratis, hubungi pelanggan lewat WhatsApp untuk biaya
          antar.
        </p>,
      );
    }
    tombol.push(
      <Link key="serah" className="btn" href={`/admin/pesanan/${d.id}/serah-terima`}>
        Serahkan unit
      </Link>,
    );
  }
  if (a.bisa_selesaikan)
    tombol.push(
      <Link key="selesai" className="btn" href={`/admin/pesanan/${d.id}/pengembalian`}>
        Selesaikan pesanan
      </Link>,
    );
  if (a.bisa_setujui) {
    isi.push(
      <div key="ajuan" className="alert peringatan">
        Pelanggan mengajukan pembatalan. Alasan: <b>{d.alasan_pengajuan || "-"}</b>
      </div>,
    );
    tombol.push(
      <a key="setujui" className="btn" href="#setujui">
        Setujui pembatalan
      </a>,
    );
    tombol.push(
      <a key="tolak" className="btn garis" href="#tolak">
        Tolak pengajuan
      </a>,
    );
  }
  (d.refund_menunggu || []).forEach((r) => {
    const rk = d.refund?.id_pembayaran === r.id_pembayaran ? d.refund : {};
    isi.push(
      <div key={`r${r.id_pembayaran}`} className="alert info">
        Refund {rupiah(r.jumlah)} harus ditransfer manual
        {rk.bank && (
          <>
            {" ke "}
            <b>
              {rk.bank} {rk.no_rekening} a.n. {rk.nama_rekening}
            </b>
          </>
        )}{" "}
        (order {r.order_id}).
      </div>,
    );
    tombol.push(
      <button
        key={`b${r.id_pembayaran}`}
        className="btn garis"
        type="button"
        disabled={sibuk}
        onClick={() => jalankan("refund-selesai", { id_pembayaran: r.id_pembayaran }, "refund")}
      >
        Tandai refund {rupiah(r.jumlah)} selesai
      </button>,
    );
  });
  if (a.bisa_tandai_lunas) {
    isi.push(
      <div key="tagih" className="alert peringatan">
        Tagihan tambahan {rupiah(d.tagihan_tambahan?.jumlah)} belum dibayar.
      </div>,
    );
    tombol.push(
      <a key="lunas" className="btn" href="#lunas">
        Tandai tagihan lunas
      </a>,
    );
  }
  if (a.bisa_kembalikan_jaminan)
    tombol.push(
      <button
        key="jaminan"
        className="btn garis"
        type="button"
        disabled={sibuk}
        onClick={() => jalankan("jaminan/kembalikan", {}, "jaminan")}
      >
        Kembalikan jaminan
      </button>,
    );
  if (!tombol.length && !isi.length)
    isi.push(
      <p key="kosong" className="abu">
        Tidak ada tindakan untuk status ini.
      </p>,
    );
  return (
    <>
      <h2>Tindakan</h2>
      {isi}
      {tombol.length > 0 && <div className="aksi">{tombol}</div>}
      <p className="kecil" style={{ margin: "12px 0 0" }}>
        <a className="tautan" href={waLink(d.pelanggan.no_hp)} target="_blank" rel="noopener">
          Hubungi pelanggan lewat WhatsApp
        </a>
      </p>
    </>
  );
}

function Rincian({ d }) {
  const pg = d.pengembalian;
  const baris = [[`Sewa ${rupiah(Math.round(d.total_biaya / d.durasi))} × ${d.durasi} hari`, d.total_biaya]];
  if (pg) {
    if (pg.denda_keterlambatan) baris.push([`Denda keterlambatan (${pg.hari_terlambat} hari)`, pg.denda_keterlambatan]);
    if (pg.biaya_kekurangan_bbm) baris.push(["Kekurangan BBM", pg.biaya_kekurangan_bbm]);
    (pg.kondisi || [])
      .filter((k) => k.kondisi !== "baik")
      .forEach((k) =>
        baris.push([`Kerusakan ${(BAGIAN[k.bagian] || k.bagian).toLowerCase()} (${k.kondisi})`, k.biaya]),
      );
    (pg.biaya_tambahan || []).forEach((b) =>
      baris.push([`${TAMBAHAN[b.jenis] || b.jenis}${b.keterangan ? ` (${b.keterangan})` : ""}`, b.nominal]),
    );
  }
  // Baris label-nominal (bukan tabel) supaya nominal tetap terlihat di layar HP.
  return (
    <div className="ringkasan">
      {baris.map(([u, n], i) => (
        <div className="baris" key={i}>
          <span>{u}</span>
          <span>{rupiah(n)}</span>
        </div>
      ))}
      <div className="baris total">
        <span>Total sewa</span>
        <span>{rupiah(d.total_biaya)}</span>
      </div>
      {d.tagihan_tambahan && (
        <div className="baris total">
          <span>Tagihan tambahan ({d.tagihan_tambahan.status === "lunas" ? "lunas" : "belum dibayar"})</span>
          <span>{rupiah(d.tagihan_tambahan.jumlah)}</span>
        </div>
      )}
    </div>
  );
}

function Catatan({ id, awal, onOk }) {
  const { sibuk, galat, kirim } = useKirim();
  return (
    <section className="kartu">
      <h2>Catatan Admin</h2>
      <p className="ket kecil abu">Hanya terlihat oleh admin.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const isi = String(new FormData(e.currentTarget).get("catatan_admin")).trim();
          kirim(async () => {
            await api.put(`/admin/pemesanan/${id}/catatan`, { json: { catatan_admin: isi || null } });
            onOk();
          });
        }}
      >
        <AlertGalat galat={galat} />
        <label htmlFor="cat">Catatan</label>
        <textarea
          id="cat"
          name="catatan_admin"
          maxLength={2000}
          defaultValue={awal}
          placeholder="Misalnya: bukti booking sudah dicek"
        />
        <button className="btn sm" type="submit" disabled={sibuk}>
          {sibuk ? "Menyimpan..." : "Simpan catatan"}
        </button>
      </form>
    </section>
  );
}
