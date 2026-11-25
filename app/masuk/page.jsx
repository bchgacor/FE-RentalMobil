import Halaman from "@/components/Halaman";
import Link from "next/link";

export const metadata = { title: "Masuk" };

export default function HalamanMasuk() {
  return (
    <Halaman mode="tamu">
      <section className="hero banner">
        <h1>MASUK</h1>
      </section>
      <main className="wrap wrap-form">
        <div className="kotak kartu-akun">
          <div className="tab-akun">
            <Link href="/masuk" className="aktif">
              Login
            </Link>
            <Link href="/daftar" className="">
              Register
            </Link>
          </div>
          <h1>Masuk</h1>
          <form action="/user" method="get">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="sandi">Kata sandi</label>
              <input id="sandi" name="sandi" type="password" required autoComplete="current-password" />
              <p className="hint">
                <Link href="/lupa-sandi" className="tautan">
                  Lupa Kata Sandi?
                </Link>
              </p>
            </div>
            <button className="btn blok" type="submit">
              Login
            </button>
          </form>
        </div>
      </main>
    </Halaman>
  );
}
