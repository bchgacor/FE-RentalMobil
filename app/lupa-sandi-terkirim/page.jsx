import Halaman from "@/components/Halaman";
import Link from "next/link";

export const metadata = { title: "Lupa Kata Sandi" };

export default function HalamanLupaSandiTerkirim() {
  return (
    <Halaman mode="tamu">
      <section className="hero banner">
        <h1>
          {"LUPA "}
          <span>KATA SANDI</span>
        </h1>
      </section>
      <main className="wrap wrap-form">
        <div className="kotak kartu-akun">
          <h1>Cek email Anda</h1>
          <div className="alert sukses">
            {"Tautan reset dikirim ke "}
            <b>budi@contoh.id</b>, berlaku 1 jam.
          </div>
          <Link href="/masuk" className="btn garis blok">
            Kembali ke Login
          </Link>
          <p className="tengah kecil" style={{ marginTop: "16px" }}>
            <Link href="/reset-sandi" className="tautan">
              Buka tautan reset dari email
            </Link>
          </p>
        </div>
      </main>
    </Halaman>
  );
}
