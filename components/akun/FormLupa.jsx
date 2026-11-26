"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useKirim } from "@/lib/useKirim";
import { AlertGalat, GalatKolom, tandai } from "@/components/ui/Galat";

export default function FormLupa() {
  const router = useRouter();
  const { sibuk, galat, kirim } = useKirim();

  async function onSubmit(e) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    await kirim(async () => {
      await api.post("/auth/lupa-password", { json: { email }, auth: false });
      router.push("/lupa-sandi-terkirim?email=" + encodeURIComponent(email));
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <AlertGalat galat={galat} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" {...tandai(galat, "email")} />
        <GalatKolom galat={galat} nama="email" />
      </div>
      <button className="btn blok" type="submit" disabled={sibuk}>
        {sibuk ? "Mengirim..." : "Kirim Tautan Reset"}
      </button>
      <p className="tengah" style={{ marginTop: "12px" }}>
        <Link href="/masuk" className="tautan">
          Kembali ke Login
        </Link>
      </p>
    </form>
  );
}
