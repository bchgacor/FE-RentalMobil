"use client";

import Link from "next/link";
import { useState } from "react";
import { tanggal } from "@/lib/format";
import { tutupModal } from "@/lib/modal";
import Modal from "@/components/Modal";

/**
 * Pop-up konfirmasi umum (hapus, ubah status, catat servis).
 * buka({ judul, teks, label, bahaya, jalan(konfirmasi) }) lalu jalan() dipanggil saat "Ya" diklik.
 * Bila back-end menjawab 409 PESANAN_TERDAMPAK, daftar pesanan ditampilkan dan tombol
 * berubah menjadi "Tetap lanjutkan" yang memanggil jalan(true).
 */
export function useKonfirmasi({ onBerhasil, onGagal }) {
  const [aksi, setAksi] = useState(null);
  const [sibuk, setSibuk] = useState(false);
  const [terdampak, setTerdampak] = useState(null);

  function buka(a) {
    setAksi(a);
    setTerdampak(null);
    window.location.hash = "konfirmasi";
  }
  async function ya() {
    setSibuk(true);
    try {
      await aksi.jalan(!!terdampak);
      tutupModal();
      onBerhasil?.(aksi);
    } catch (err) {
      if (err.code === "PESANAN_TERDAMPAK") {
        setTerdampak(err);
      } else {
        tutupModal();
        onGagal?.(err);
      }
    } finally {
      setSibuk(false);
    }
  }

  const modal = (
    <Modal id="konfirmasi" label={aksi?.judul || "Konfirmasi"}>
      <h3>{aksi?.judul}</h3>
      {terdampak ? (
        <>
          <div className="alert peringatan">{terdampak.message}</div>
          <DaftarTerdampak err={terdampak} />
          <p className="kecil abu">
            Lanjutkan hanya jika pesanan di atas sudah diatur ulang atau pelanggan sudah dihubungi.
          </p>
        </>
      ) : (
        <p>{aksi?.teks}</p>
      )}
      <div className="baris">
        <a className="btn garis sm" href="#">
          Kembali
        </a>
        <button type="button" className={aksi?.bahaya ? "btn bahaya sm" : "btn sm"} onClick={ya} disabled={sibuk}>
          {sibuk ? "Memproses..." : terdampak ? "Tetap lanjutkan" : aksi?.label || "Ya"}
        </button>
      </div>
    </Modal>
  );
  return { buka, modal };
}

export function DaftarTerdampak({ err }) {
  const l = err?.data?.pesanan_terdampak || [];
  if (!l.length) return null;
  return (
    <ul className="daftar-tanda">
      {l.map((p) => (
        <li key={p.id}>
          <Link className="tautan" href={`/admin/pesanan/${p.id}`}>
            {p.nomor}
          </Link>{" "}
          · {p.nama} · {tanggal(p.tgl_mulai, true)} sampai {tanggal(p.tgl_kembali, true)}
        </li>
      ))}
    </ul>
  );
}
