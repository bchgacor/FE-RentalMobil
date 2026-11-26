import Link from "next/link";
import { Suspense } from "react";
import Halaman from "@/components/Halaman";
import Penjaga from "@/components/sesi/Penjaga";
import FormMasuk from "@/components/akun/FormMasuk";

export const metadata = { title: "Login Admin" };

export default function HalamanMasukAdmin() {
  return (
    <Halaman>
      <Penjaga akses="tamu-saja" peran="admin">
        <section className="hero banner">
          <h1>
            LOGIN <span>ADMIN</span>
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
            <Suspense fallback={<p className="memuat">Memuat...</p>}>
              <FormMasuk peran="admin" />
            </Suspense>
            <p className="tengah kecil" style={{ margin: "16px 0 0" }}>
              <Link href="/masuk" className="tautan">
                Bukan admin? Masuk sebagai pelanggan
              </Link>
            </p>
          </div>
        </main>
      </Penjaga>
    </Halaman>
  );
}
