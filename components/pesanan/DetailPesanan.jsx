"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { rupiah, tambahHari, tanggal } from "@/lib/format";
import { tutupModal } from "@/lib/modal";
import { METODE, rentang, STATUS_BAYAR, WAJIB_REKENING } from "@/lib/status";
import { useKirim } from "@/lib/useKirim";
import { useMuat } from "@/lib/useMuat";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Plat from "@/components/Plat";
import Tahapan from "@/components/Tahapan";
import FormNilai from "@/components/riwayat/FormNilai";
import { AlertGalat, GalatKolom } from "@/components/ui/Galat";

const WA = "https://wa.me/6281234567890";

// Detail pesanan pelanggan: GET /pemesanan/{id}, batalkan, ajukan pembatalan, beri penilaian.
export default function DetailPesanan() {
  const { id } = useParams();
  const q = useSearchParams();
  const {
    data: d,
    galat,
    awal,
    muatUlang,
  } = useMuat(async () => (await api.get(`/pemesanan/${encodeURIComponent(id)}`)).data, [id]);
  const [pesanOk, setPesanOk] = useState("");
  const menungguBayar = q.get("bayar") === "proses" && d?.status === "menunggu_pembayaran";

  // Kembali dari Midtrans: status berubah setelah back-end menerima notifikasi, jadi periksa ulang berkala
  const [coba, setCoba] = useState(0);
  useEffect(() => {
    if (!menungguBayar || coba >= 20) return;
    const t = setTimeout(() => {
      setCoba((c) => c + 1);
      muatUlang();
    }, 3000);
    return () => clearTimeout(t);
  }, [menungguBayar, coba, muatUlang]);

  if (awal) return <p className="memuat">Memuat pesanan...</p>;
  if (galat) {
    return (
      <div className="kotak kosong">
        <div className="alert galat" role="alert">
          {galat.status === 404 ? "Pesanan tidak ditemukan." : galat.message}
        </div>
        <Link className="btn" href="/user/riwayat">
          Ke Riwayat Pemesanan
        </Link>
      </div>
    );
  }

  const ds = d.jenis_sewa === "dengan_sopir";
  const p = d.pembayaran;
  const selesaiMuat = (teks) => {
    tutupModal();
    setPesanOk(teks);
    muatUlang();
  };

  return (
    <>
      {q.get("bayar") === "proses" && (
        <div className={`alert ${menungguBayar ? "info" : "sukses"}`} role="status">
          {!menungguBayar
            ? d.status === "dikonfirmasi"
              ? "Pembayaran diterima. Pesanan Anda sudah dikonfirmasi."
              : "Status pesanan diperbarui."
            : coba >= 20
              ? "Konfirmasi pembayaran belum diterima. Muat ulang halaman ini beberapa saat lagi."
              : "Menunggu konfirmasi pembayaran dari Midtrans. Halaman ini diperbarui otomatis."}
        </div>
      )}
      {pesanOk && (
        <div className="alert sukses" role="status">
          {pesanOk}
        </div>
      )}
      <div className="kepala-detail">
        <div>
          <h1>Pesanan {d.nomor}</h1>
          <span className="abu">
            {d.tipe.nama} · {ds ? "Dengan sopir" : "Lepas kunci"}
          </span>
        </div>
        <Badge status={d.status} />
      </div>
      <div className="kotak">
        <Tindakan d={d} />
      </div>
      <div className="grid grid-2" style={{ marginTop: "20px" }}>
        <div className="grid" style={{ alignContent: "start" }}>
          <div className="kotak">
            <h3>Tahapan</h3>
            <Tahapan status={d.status} />
          </div>
          <div className="kotak">
            <h3>Data Pesanan</h3>
            <dl className="data-baris">
              <dt>Tipe</dt>
              <dd>
                {d.tipe.nama}
                {d.transmisi ? ` (${d.transmisi})` : ""}
              </dd>
              <dt>Jenis sewa</dt>
              <dd>{ds ? "Dengan sopir" : "Lepas kunci"}</dd>
              <dt>Tanggal</dt>
              <dd>{rentang(d.tgl_mulai, d.tgl_kembali)}</dd>
              <dt>{ds ? "Jam jemput" : "Jam serah terima"}</dt>
              <dd>
                {String(d.jam_serah || "")
                  .slice(0, 5)
                  .replace(":", ".")}
              </dd>
              <dt>Durasi</dt>
              <dd>{d.durasi} hari</dd>
              <dt>Kembali paling lambat</dt>
              <dd>{tanggal(d.tgl_kembali, true)}, 23.59</dd>
              {!ds && (
                <>
                  <dt>Cara terima unit</dt>
                  <dd>{d.metode_ambil === "diantar" ? "Diantar" : "Ambil di kantor"}</dd>
                </>
              )}
              {d.lokasi_jemput && (
                <>
                  <dt>{ds ? "Lokasi jemput" : "Alamat pengantaran"}</dt>
                  <dd>{d.lokasi_jemput}</dd>
                </>
              )}
              {d.tujuan && (
                <>
                  <dt>Tujuan</dt>
                  <dd>{d.tujuan}</dd>
                </>
              )}
              {d.plat_nomor && (
                <>
                  <dt>Plat nomor</dt>
                  <dd>
                    <Plat>{d.plat_nomor}</Plat>
                  </dd>
                </>
              )}
            </dl>
          </div>
          <div className="kotak">
            <h3>Pembayaran</h3>
            <dl className="data-baris">
              <dt>Metode</dt>
              <dd>{p?.metode ? METODE[p.metode] || p.metode : "Belum dipilih"}</dd>
              <dt>Status</dt>
              <dd>{p ? STATUS_BAYAR[p.status] || p.status : "Belum ada"}</dd>
              {p?.order_id && (
                <>
                  <dt>Nomor order</dt>
                  <dd>{p.order_id}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
        <div className="grid" style={{ alignContent: "start" }}>
          <div className="kotak">
            <h3>Rincian Biaya</h3>
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
                  <td>Total sewa</td>
                  <td className="angka">{rupiah(d.total_biaya)}</td>
                </tr>
              </tbody>
            </table>
            {d.tagihan_tambahan && (
              <p className="tebal" style={{ marginTop: "12px" }}>
                Tagihan tambahan: {rupiah(d.tagihan_tambahan.jumlah)} (
                {d.tagihan_tambahan.status === "lunas" ? "lunas" : "belum lunas"})
              </p>
            )}
          </div>
        </div>
      </div>

      <ModalBatal id={id} onSelesai={() => selesaiMuat("Pesanan dibatalkan.")} />
      <ModalAjukan
        id={id}
        wajibRekening={!!p && WAJIB_REKENING.includes(p.metode)}
        onSelesai={() => selesaiMuat("Pengajuan pembatalan terkirim.")}
      />
      <Modal id="beri-nilai" label="Beri penilaian">
        <h3>Beri penilaian</h3>
        <p className="abu kecil">Penilaian hanya dapat diberikan sekali.</p>
        <FormNilai
          idPesanan={id}
          judul=""
          onTerkirim={() => selesaiMuat("Terima kasih, penilaian Anda sudah dikirim.")}
        >
          <div className="baris">
            <a className="btn garis sm" href="#">
              Batal
            </a>
            <button className="btn sm" type="submit">
              Kirim
            </button>
          </div>
        </FormNilai>
      </Modal>
    </>
  );
}

function Tindakan({ d }) {
  const a = d.aksi || {};
  const tombol = [];
  const info = [];
  if (d.status === "menunggu_pembayaran") {
    if (a.bisa_bayar)
      tombol.push(
        <Link key="bayar" className="btn" href={`/user/pesanan/${d.id}/bayar`}>
          Bayar sekarang
        </Link>,
      );
    else
      info.push(
        <div key="lewat" className="alert peringatan">
          Batas pembayaran 1 jam sudah lewat. Pesanan akan dibatalkan otomatis.
        </div>,
      );
    if (a.bisa_batalkan)
      tombol.push(
        <a key="batal" className="btn bahaya" href="#batal-langsung">
          Batalkan pesanan
        </a>,
      );
  }
  if (a.bisa_ajukan_pembatalan) {
    info.push(
      <p key="h1" className="abu">
        Pembatalan hanya dapat diajukan sampai H-1. Plat nomor tampil setelah status Berjalan.
      </p>,
    );
    tombol.push(
      <a key="ajukan" className="btn garis" href="#ajukan-batal">
        Ajukan pembatalan
      </a>,
    );
  }
  if (d.status === "pengajuan_pembatalan")
    info.push(
      <div key="periksa" className="alert info">
        Pengajuan pembatalan sedang diperiksa admin. Kabar selanjutnya dikirim lewat email atau WhatsApp.
      </div>,
    );
  if (d.status === "dibatalkan" && d.pembayaran?.status === "dikembalikan")
    info.push(
      <div key="refund" className="alert info">
        Dana pembayaran sudah dikembalikan.
      </div>,
    );
  if (d.tagihan_tambahan && d.tagihan_tambahan.status !== "lunas")
    info.push(
      <div key="tagihan" className="alert peringatan">
        Tagihan tambahan {rupiah(d.tagihan_tambahan.jumlah)}, hubungi admin untuk pembayaran.
      </div>,
    );
  if (a.bisa_review)
    tombol.push(
      <a key="nilai" className="btn" href="#beri-nilai">
        Beri penilaian
      </a>,
    );
  if (a.bisa_unduh_nota)
    tombol.push(
      <Link key="nota" className={tombol.length ? "btn garis" : "btn"} href={`/user/pesanan/${d.id}/nota`}>
        Lihat nota
      </Link>,
    );
  if (a.bisa_perpanjang)
    tombol.push(
      <Link
        key="panjang"
        className="btn garis"
        href={`/katalog-hasil?tgl_mulai=${tambahHari(1, d.tgl_kembali)}&durasi=1`}
      >
        Perpanjang sewa
      </Link>,
    );
  if (a.bisa_pesan_lagi)
    tombol.push(
      <Link key="lagi" className="btn garis" href="/katalog">
        Pesan lagi
      </Link>,
    );
  tombol.push(
    <a key="wa" className="btn garis" href={WA} target="_blank" rel="noopener">
      Hubungi admin
    </a>,
  );
  return (
    <>
      <h3>Tindakan</h3>
      {info}
      <div className="aksi-detail">{tombol}</div>
    </>
  );
}

function ModalBatal({ id, onSelesai }) {
  const { sibuk, galat, kirim } = useKirim();
  return (
    <Modal id="batal-langsung" label="Batalkan pesanan?">
      <h3>Batalkan pesanan?</h3>
      <p>Pesanan yang belum dibayar akan dibatalkan dan unit dilepas.</p>
      <AlertGalat galat={galat} />
      <div className="baris">
        <a className="btn garis sm" href="#">
          Kembali
        </a>
        <button
          className="btn bahaya sm"
          type="button"
          disabled={sibuk}
          onClick={() =>
            kirim(async () => {
              await api.post(`/pemesanan/${id}/batalkan`);
              onSelesai();
            })
          }
        >
          {sibuk ? "Membatalkan..." : "Ya, batalkan"}
        </button>
      </div>
    </Modal>
  );
}

function ModalAjukan({ id, wajibRekening, onSelesai }) {
  const { sibuk, galat, kirim } = useKirim();
  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {};
    for (const [k, v] of new FormData(form)) if (String(v).trim()) body[k] = String(v).trim();
    await kirim(async () => {
      try {
        await api.post(`/pemesanan/${id}/ajukan-pembatalan`, { json: body });
      } catch (err) {
        if (err.code === "LEWAT_BATAS_H1")
          err.message = "Pembatalan hanya bisa diajukan paling lambat H-1 sebelum tanggal mulai.";
        throw err;
      }
      form.reset();
      onSelesai();
    });
  }
  return (
    <Modal id="ajukan-batal" label="Ajukan pembatalan">
      <h3>Ajukan pembatalan</h3>
      <p className="abu kecil">
        Admin akan memeriksa pengajuan Anda. Tanggal sewa tetap tertahan sampai pengajuan diputuskan.
      </p>
      <form onSubmit={onSubmit}>
        <AlertGalat galat={galat} />
        <div className="field">
          <label htmlFor="alasan">Alasan pembatalan</label>
          <textarea id="alasan" name="alasan" maxLength={255} required />
          <GalatKolom galat={galat} nama="alasan" />
        </div>
        {wajibRekening && (
          <>
            <p className="kecil abu">
              Pembayaran lewat virtual account atau gerai dikembalikan dengan transfer. Isi rekening tujuan refund:
            </p>
            <div className="field">
              <label htmlFor="bank">Nama bank</label>
              <input id="bank" name="bank" type="text" maxLength={50} required />
              <GalatKolom galat={galat} nama="bank" />
            </div>
            <div className="field">
              <label htmlFor="no-rek">Nomor rekening</label>
              <input id="no-rek" name="no_rekening" type="text" inputMode="numeric" maxLength={50} required />
              <GalatKolom galat={galat} nama="no_rekening" />
            </div>
            <div className="field">
              <label htmlFor="nama-rek">Nama pemilik rekening</label>
              <input id="nama-rek" name="nama_rekening" type="text" maxLength={100} required />
              <GalatKolom galat={galat} nama="nama_rekening" />
            </div>
          </>
        )}
        <div className="baris">
          <a className="btn garis sm" href="#">
            Kembali
          </a>
          <button className="btn bahaya sm" type="submit" disabled={sibuk}>
            {sibuk ? "Mengirim..." : "Ajukan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
