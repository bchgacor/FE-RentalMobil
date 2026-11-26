import Link from "next/link";
import { Suspense } from "react";
import Halaman from "@/components/Halaman";

// Kerangka halaman akun (masuk, daftar, lupa sandi, ...): banner dan kartu di tengah.
// tab: "masuk" | "daftar" untuk menampilkan tab Login/Register. Isi dibungkus Suspense karena memakai useSearchParams.
export default function KartuAkun({ banner, judul, tab, keterangan, akses, children }) {
  return (
    <Halaman akses={akses}>
      <section className="hero banner">
        <h1>{banner}</h1>
      </section>
      <main className="wrap wrap-form">
        <div className="kotak kartu-akun">
          {tab && (
            <div className="tab-akun">
              <Link href="/masuk" className={tab === "masuk" ? "aktif" : ""}>
                Login
              </Link>
              <Link href="/daftar" className={tab === "daftar" ? "aktif" : ""}>
                Register
              </Link>
            </div>
          )}
          <h1>{judul}</h1>
          {keterangan}
          <Suspense fallback={<p className="memuat">Memuat...</p>}>{children}</Suspense>
        </div>
      </main>
    </Halaman>
  );
}
