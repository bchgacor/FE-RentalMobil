"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import KirimUlang from "./KirimUlang";

// Dibuka dari tautan di email: /verifikasi-email?token=...
export default function Verifikasi() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [galat, setGalat] = useState(null);

  useEffect(() => {
    if (!token) return;
    api.post("/auth/verifikasi-email", { json: { token }, auth: false }).then(
      () => router.replace("/masuk?verif=1"),
      (err) => setGalat(err),
    );
  }, [token, router]);

  if (token && !galat) {
    return (
      <p className="memuat tengah" role="status">
        Memverifikasi email...
      </p>
    );
  }
  return (
    <div className="tengah">
      <div className="kosong" style={{ padding: "8px 0 16px" }}>
        <div className="ikon" aria-hidden="true">
          ⚠️
        </div>
      </div>
      <div className="alert galat" role="alert">
        {galat?.status === 0 ? galat.message : "Tautan verifikasi tidak valid atau sudah kedaluwarsa (berlaku 12 jam)."}
      </div>
      <p>Minta tautan baru dengan email yang Anda pakai saat mendaftar.</p>
      <KirimUlang pakaiIsian />
      <p className="kecil" style={{ marginTop: "16px" }}>
        <Link className="tautan" href="/masuk">
          Kembali ke Login
        </Link>
      </p>
    </div>
  );
}
