import Halaman from "@/components/Halaman";
import Link from "next/link";

export const metadata = { title: "Lupa Kata Sandi" };

export default function HalamanLupaSandi() {
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
          <h1>Lupa Kata Sandi</h1>
          <p className="abu tengah">Masukkan email akun Anda. Kami kirim tautan untuk membuat kata sandi baru.</p>
          <form action="/lupa-sandi-terkirim" method="get">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <button className="btn blok" type="submit">
              Kirim Tautan Reset
            </button>
            <p className="tengah" style={{ marginTop: "12px" }}>
              <Link href="/masuk" className="tautan">
                Kembali ke Login
              </Link>
            </p>
          </form>
        </div>
      </main>
    </Halaman>
  );
}
