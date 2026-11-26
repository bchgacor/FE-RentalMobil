import { Suspense } from "react";
import Halaman from "@/components/Halaman";
import Nota from "@/components/pesanan/Nota";

export const metadata = { title: "Nota Pemesanan" };

export default function HalamanNota() {
  return (
    <Halaman aktif="riwayat" gaya={["riwayat"]} akses="user">
      <section className="hero banner">
        <h1>
          NOTA <span>PEMESANAN</span>
        </h1>
      </section>
      <main className="wrap">
        <Suspense fallback={<p className="memuat">Memuat...</p>}>
          <Nota />
        </Suspense>
      </main>
    </Halaman>
  );
}
