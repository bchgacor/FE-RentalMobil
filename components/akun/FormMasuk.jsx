"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiError, nextAman, sesi, tujuanSetelahLogin } from "@/lib/api";
import { useKirim } from "@/lib/useKirim";
import { AlertGalat, GalatKolom, tandai } from "@/components/ui/Galat";

const WA = "https://wa.me/6281234567890";

// Form login. Pelanggan dan admin memakai endpoint yang sama; peran menentukan siapa yang boleh lewat pintu ini.
export default function FormMasuk({ peran = "user" }) {
  const router = useRouter();
  const q = useSearchParams();
  const { sibuk, galat, kirim } = useKirim();
  const [emailTerakhir, setEmailTerakhir] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email")).trim();
    setEmailTerakhir(email);
    await kirim(async () => {
      const res = await api.post("/auth/login", { json: { email, password: fd.get("password") }, auth: false });
      const d = res.data;
      if (d.user.role !== peran) {
        // akun benar tetapi salah pintu masuk: cabut lagi token yang baru dibuat
        sesi.set(d);
        await api.post("/auth/logout", { alihkan401: false }).catch(() => {});
        sesi.hapus();
        throw new ApiError(403, {
          message:
            peran === "admin"
              ? "Akun ini bukan akun admin. Pelanggan masuk lewat halaman Masuk biasa."
              : "Ini akun admin. Silakan masuk lewat halaman login admin.",
        });
      }
      sesi.set(d);
      const aman = nextAman(q.get("next"), d.user.role);
      router.replace(aman && !d.wajib_ganti_password ? aman : tujuanSetelahLogin(d));
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      {q.get("sesi") === "habis" && (
        <div className="alert info" role="status">
          Sesi login Anda sudah berakhir. Silakan login lagi.
        </div>
      )}
      {q.get("reset") === "1" && (
        <div className="alert sukses" role="status">
          Kata sandi berhasil diganti. Silakan login dengan kata sandi baru.
        </div>
      )}
      {q.get("verif") === "1" && (
        <div className="alert sukses" role="status">
          Email berhasil diverifikasi. Silakan login.
        </div>
      )}
      <AlertGalat galat={galat} />
      {galat?.code === "EMAIL_BELUM_TERVERIFIKASI" && <KirimUlangSingkat email={emailTerakhir} />}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete={peran === "admin" ? "username" : "email"}
          {...tandai(galat, "email")}
        />
        <GalatKolom galat={galat} nama="email" />
      </div>
      <div className="field">
        <label htmlFor="sandi">Kata sandi</label>
        <input
          id="sandi"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          {...tandai(galat, "password")}
        />
        <GalatKolom galat={galat} nama="password" />
        {peran === "admin" ? (
          <p className="hint">
            {"Lupa kata sandi? Hubungi pemilik usaha lewat "}
            <a href={WA} className="tautan" target="_blank" rel="noopener">
              WhatsApp
            </a>
            .
          </p>
        ) : (
          <p className="hint">
            <Link href="/lupa-sandi" className="tautan">
              Lupa Kata Sandi?
            </Link>
          </p>
        )}
      </div>
      <button className="btn blok" type="submit" disabled={sibuk}>
        {sibuk ? "Masuk..." : "Login"}
      </button>
    </form>
  );
}

function KirimUlangSingkat({ email }) {
  const { sibuk, galat, kirim } = useKirim();
  const [terkirim, setTerkirim] = useState(false);
  if (terkirim) {
    return <p className="kecil">Tautan verifikasi baru sudah dikirim ke {email}. Cek kotak masuk atau folder spam.</p>;
  }
  return (
    <p className="kecil">
      {galat && (
        <span>
          {galat.status === 429 ? "Tautan sudah dikirim 3 kali dalam satu jam. Coba lagi nanti. " : galat.message + " "}
        </span>
      )}
      <button
        type="button"
        className="btn garis sm"
        disabled={sibuk}
        onClick={() =>
          kirim(async () => {
            await api.post("/auth/kirim-ulang-verifikasi", { json: { email }, auth: false });
            setTerkirim(true);
          })
        }
      >
        {sibuk ? "Mengirim..." : "Kirim ulang tautan verifikasi"}
      </button>
    </p>
  );
}
