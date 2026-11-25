import Halaman from "@/components/Halaman";
import Link from "next/link";

export const metadata = { title: "Verifikasi Email" };

export default function HalamanVerifikasi() {
  return (
    <Halaman mode="tamu">
      <section className="hero banner">
        <h1>
          {"VERIFIKASI "}
          <span>EMAIL</span>
        </h1>
      </section>
      <main className="wrap wrap-form">
        <div className="kotak kartu-akun">
          <h1>Verifikasi email</h1>
          <div className="tengah">
            <div className="kosong" style={{ padding: "8px 0 16px" }}>
              <div className="ikon" aria-hidden="true">
                ✅
              </div>
            </div>
            <div className="alert sukses">Email terverifikasi, silakan masuk.</div>
            <Link href="/masuk" className="btn blok">
              Login
            </Link>
          </div>
        </div>
      </main>
    </Halaman>
  );
}
