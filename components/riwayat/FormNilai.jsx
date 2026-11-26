"use client";

import { Fragment, useState } from "react";
import { api } from "@/lib/api";
import { useKirim } from "@/lib/useKirim";
import { AlertGalat } from "@/components/ui/Galat";

// Form penilaian (bintang 1-5 + ulasan) untuk pesanan selesai: POST /pemesanan/{id}/review.
// Bintang memakai radio + CSS (urutan 5..1 dengan flex row-reverse).
export default function FormNilai({ idPesanan, judul = "Berikan penilaian", onTerkirim, children }) {
  const { sibuk, galat, setGalat, kirim } = useKirim();
  const [ok, setOk] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!fd.get("rating")) {
      setGalat(new Error("Pilih nilai bintang dulu."));
      return;
    }
    await kirim(async () => {
      await api.post(`/pemesanan/${idPesanan}/review`, {
        json: { rating: Number(fd.get("rating")), komentar: String(fd.get("komentar") || "").trim() || null },
      });
      setOk(true);
      onTerkirim?.();
    });
  }

  if (ok && !onTerkirim) {
    return (
      <div className="alert sukses" role="status" style={{ marginTop: "12px" }}>
        Terima kasih, penilaian Anda sudah dikirim.
      </div>
    );
  }
  return (
    <form className="nilai-inline" onSubmit={onSubmit} aria-label="Beri penilaian">
      {judul && (
        <p className="tebal" style={{ margin: "14px 0 6px" }}>
          {judul}
        </p>
      )}
      <AlertGalat galat={galat} />
      <div className="bintang-pilih">
        {[5, 4, 3, 2, 1].map((n) => (
          <Fragment key={n}>
            <input type="radio" id={`b${n}-${idPesanan}`} name="rating" value={n} />
            <label htmlFor={`b${n}-${idPesanan}`} title={`${n} bintang`}>
              ★
            </label>
          </Fragment>
        ))}
      </div>
      <textarea
        name="komentar"
        maxLength={500}
        placeholder="Ceritakan pengalaman Anda (opsional)"
        aria-label="Ulasan"
      />
      {children || (
        <button className="btn sm" type="submit" disabled={sibuk}>
          {sibuk ? "Mengirim..." : "Kirim"}
        </button>
      )}
    </form>
  );
}
