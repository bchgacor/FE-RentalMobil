"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useKirim } from "@/lib/useKirim";
import { AlertGalat } from "@/components/ui/Galat";

// Tombol kirim ulang tautan verifikasi (halaman Cek Email dan Verifikasi gagal).
export default function KirimUlang({ pakaiIsian = false }) {
  const emailUrl = useSearchParams().get("email") || "";
  const { sibuk, galat, kirim } = useKirim();
  const [terkirim, setTerkirim] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const email = pakaiIsian ? String(new FormData(e.currentTarget).get("email")).trim() : emailUrl;
    await kirim(async () => {
      try {
        await api.post("/auth/kirim-ulang-verifikasi", { json: { email }, auth: false });
      } catch (err) {
        if (err.code === "EMAIL_TIDAK_TERDAFTAR") err.message = "Email ini belum terdaftar. Silakan daftar dulu.";
        if (err.status === 429) err.message = "Tautan sudah dikirim 3 kali dalam satu jam. Coba lagi nanti.";
        throw err;
      }
      setTerkirim(email);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <AlertGalat galat={galat} />
      {galat?.code === "EMAIL_SUDAH_TERVERIFIKASI" && (
        <p>
          <Link className="btn blok" href="/masuk">
            Login
          </Link>
        </p>
      )}
      {terkirim && (
        <div className="alert sukses" role="status">
          Tautan verifikasi baru sudah dikirim ke {terkirim}. Tautan lama tidak berlaku lagi.
        </div>
      )}
      {pakaiIsian && (
        <div className="field" style={{ textAlign: "left" }}>
          <label htmlFor="email-ulang">Email</label>
          <input id="email-ulang" name="email" type="email" required defaultValue={emailUrl} autoComplete="email" />
        </div>
      )}
      <button className="btn garis" type="submit" disabled={sibuk || (!pakaiIsian && !emailUrl)}>
        {sibuk ? "Mengirim..." : "Kirim ulang tautan"}
      </button>
      <p className="hint kecil abu" style={{ marginTop: "8px" }}>
        Kirim ulang maksimal 3 kali per jam.
      </p>
    </form>
  );
}
