import Halaman from "@/components/Halaman";

export const metadata = { title: "Buat Password Baru" };

export default function HalamanResetSandi() {
  return (
    <Halaman mode="tamu">
      <section className="hero banner">
        <h1>
          {"PASSWORD "}
          <span>BARU</span>
        </h1>
      </section>
      <main className="wrap wrap-form">
        <div className="kotak kartu-akun">
          <h1>Buat Password Baru</h1>
          <form action="/masuk" method="get">
            <div className="field">
              <label htmlFor="sandi">Kata sandi baru</label>
              <input
                id="sandi"
                name="sandi"
                type="password"
                required
                pattern="(?=.*\\d).{8,}"
                minLength="8"
                title="Minimal 8 karakter dan mengandung angka"
                autoComplete="new-password"
              />
              <p className="hint">Minimal 8 karakter dan ada angka.</p>
            </div>
            <div className="field">
              <label htmlFor="sandi2">Ulangi kata sandi</label>
              <input
                id="sandi2"
                name="sandi2"
                type="password"
                required
                pattern="(?=.*\\d).{8,}"
                minLength="8"
                title="Minimal 8 karakter dan mengandung angka"
                autoComplete="new-password"
              />
            </div>
            <button className="btn blok" type="submit">
              Simpan
            </button>
          </form>
        </div>
      </main>
    </Halaman>
  );
}
