"use client";

import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useKirim } from "@/lib/useKirim";
import { AlertGalat, GalatKolom, tandai } from "@/components/ui/Galat";
import FieldDomisili from "./FieldDomisili";
import FieldSandi from "./FieldSandi";

export default function FormDaftar() {
  const router = useRouter();
  const { sibuk, galat, setGalat, kirim } = useKirim();

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("password") !== fd.get("password_confirmation")) {
      setGalat(new ApiError(422, { errors: { password_confirmation: ["Harus sama dengan kata sandi di atas."] } }));
      return;
    }
    await kirim(async () => {
      const res = await api.post("/auth/register", { form: fd, auth: false });
      router.push("/cek-email?email=" + encodeURIComponent(res.data.email));
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <AlertGalat galat={galat} />
      <div className="field">
        <label htmlFor="nama">Nama lengkap</label>
        <input
          id="nama"
          name="nama"
          type="text"
          maxLength={100}
          required
          autoComplete="name"
          {...tandai(galat, "nama")}
        />
        <GalatKolom galat={galat} nama="nama" />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" {...tandai(galat, "email")} />
        <GalatKolom galat={galat} nama="email" />
      </div>
      <div className="field">
        <label htmlFor="wa">Nomor WhatsApp</label>
        <input
          id="wa"
          name="no_hp"
          type="tel"
          required
          pattern="(08|\+62)[0-9]{8,13}"
          title="Nomor Indonesia, diawali 08 atau +62"
          placeholder="08xxxxxxxxxx"
          {...tandai(galat, "no_hp")}
        />
        <GalatKolom galat={galat} nama="no_hp" />
      </div>
      <FieldDomisili galat={galat} />
      <FieldSandi
        id="sandi"
        nama="password"
        label="Kata sandi"
        hint="Minimal 8 karakter dan ada angka."
        galat={galat}
      />
      <FieldSandi
        id="sandi2"
        nama="password_confirmation"
        label="Konfirmasi kata sandi"
        hint="Harus sama dengan kata sandi di atas."
        galat={galat}
      />
      <button className="btn blok" type="submit" disabled={sibuk}>
        {sibuk ? "Mendaftar..." : "Daftar"}
      </button>
    </form>
  );
}
