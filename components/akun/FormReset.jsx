"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useKirim } from "@/lib/useKirim";
import { AlertGalat } from "@/components/ui/Galat";
import FieldSandi from "./FieldSandi";

// Dibuka dari tautan di email: /reset-password?token=...&email=...
export default function FormReset() {
  const router = useRouter();
  const q = useSearchParams();
  const token = q.get("token");
  const email = q.get("email");
  const { sibuk, galat, kirim } = useKirim();

  if (!token || !email) {
    return (
      <div className="alert galat" role="alert">
        Tautan reset tidak lengkap. Buka lagi tautan dari email, atau minta tautan baru di halaman{" "}
        <Link className="tautan" href="/lupa-sandi">
          Lupa Kata Sandi
        </Link>
        .
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await kirim(async () => {
      try {
        await api.post("/auth/reset-password", {
          auth: false,
          json: { email, token, password: fd.get("password"), konfirmasi: fd.get("konfirmasi") },
        });
      } catch (err) {
        if (err.code === "TOKEN_RESET_KEDALUWARSA")
          err.message = "Tautan reset sudah lewat 60 menit. Minta tautan baru di halaman Lupa Kata Sandi.";
        if (err.code === "TOKEN_RESET_TIDAK_VALID")
          err.message = "Tautan reset tidak valid atau sudah dipakai. Minta tautan baru di halaman Lupa Kata Sandi.";
        throw err;
      }
      router.replace("/masuk?reset=1");
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <AlertGalat galat={galat} />
      <p className="abu kecil">Untuk akun {email}</p>
      <FieldSandi
        id="sandi"
        nama="password"
        label="Kata sandi baru"
        hint="Minimal 8 karakter dan ada angka."
        galat={galat}
      />
      <FieldSandi id="sandi2" nama="konfirmasi" label="Ulangi kata sandi" galat={galat} />
      <button className="btn blok" type="submit" disabled={sibuk}>
        {sibuk ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
