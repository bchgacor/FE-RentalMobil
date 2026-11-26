"use client";

import { useRouter } from "next/navigation";
import { api, sesi } from "@/lib/api";
import { useKirim } from "@/lib/useKirim";
import { AlertGalat, GalatKolom, tandai } from "@/components/ui/Galat";
import FieldSandi from "./FieldSandi";

// Admin wajib mengganti kata sandi sementara saat login pertama.
export default function FormGantiSandi() {
  const router = useRouter();
  const { sibuk, galat, kirim } = useKirim();

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await kirim(async () => {
      await api.put("/profil/password", {
        json: {
          password_lama: fd.get("password_lama"),
          password_baru: fd.get("password_baru"),
          konfirmasi: fd.get("konfirmasi"),
        },
      });
      sesi.ubahAkun({ wajib_ganti_password: false });
      router.replace("/admin/dashboard");
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <AlertGalat galat={galat} />
      <div className="field">
        <label htmlFor="lama">Kata sandi sementara</label>
        <input
          id="lama"
          name="password_lama"
          type="password"
          required
          autoComplete="current-password"
          {...tandai(galat, "password_lama")}
        />
        <GalatKolom galat={galat} nama="password_lama" />
      </div>
      <FieldSandi
        id="baru"
        nama="password_baru"
        label="Kata sandi baru"
        hint="Minimal 8 karakter dan ada angka."
        galat={galat}
      />
      <FieldSandi id="baru2" nama="konfirmasi" label="Ulangi kata sandi baru" galat={galat} />
      <button className="btn blok" type="submit" disabled={sibuk}>
        {sibuk ? "Menyimpan..." : "Simpan dan lanjut"}
      </button>
    </form>
  );
}
