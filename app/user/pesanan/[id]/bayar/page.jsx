import { Suspense } from "react";
import Halaman from "@/components/Halaman";
import Pembayaran from "@/components/pesanan/Pembayaran";

export const metadata = { title: "Pembayaran" };

export default function HalamanPembayaran() {
  return (
    <Halaman aktif="katalog" akses="user">
      <section className="hero banner">
        <h1>PEMBAYARAN</h1>
      </section>
      <main className="wrap wrap-sempit latar-bayar">
        <Suspense fallback={<p className="memuat">Memuat...</p>}>
          <Pembayaran />
        </Suspense>
      </main>
    </Halaman>
  );
}
