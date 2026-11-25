import Halaman from "@/components/Halaman";
import Link from "next/link";

export const metadata = { title: "Masuk Admin" };

export default function HalamanMasuk() {
  return (
    <Halaman mode="tamu">
      <section className="hero banner">
        <h1>
          {"MASUK "}
          <span>ADMIN</span>
        </h1>
      </section>
      <main className="wrap wrap-form">
        <div className="kotak kartu-akun">
          <div className="tab-akun">
            <Link href="/admin/masuk" className="aktif">
              Login Admin
            </Link>
          </div>
          <h1>Masuk</h1>
          <p className="abu tengah kecil" style={{ marginTop: "-6px" }}>
            Khusus pengelola GantengnyaJatim Group.
          </p>
          <form action="/admin/dashboard" method="get">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="username" />
            </div>
            <div className="field">
              <label htmlFor="sandi">Kata sandi</label>
              <input id="sandi" name="password" type="password" required autoComplete="current-password" />
              <p className="hint">
                {"Lupa kata sandi? Hubungi pemilik usaha lewat "}
                <a href="https://wa.me/6281234567890" className="tautan" target="_blank" rel="noopener">
                  WhatsApp
                </a>
                .
              </p>
            </div>
            <button className="btn blok" type="submit">
              Login
            </button>
          </form>
          <p className="tengah kecil" style={{ margin: "16px 0 0" }}>
            <Link href="/masuk" className="tautan">
              Bukan admin? Masuk sebagai pelanggan
            </Link>
          </p>
        </div>
      </main>
    </Halaman>
  );
}
