import Link from "next/link";
import { Suspense } from "react";
import Halaman from "@/components/Halaman";
import DetailPesanan from "@/components/pesanan/DetailPesanan";

export const metadata = { title: "Detail Pesanan" };

export default function HalamanDetailPesanan() {
  return (
    <Halaman aktif="riwayat" gaya={["riwayat"]} akses="user">
      <section className="hero banner">
        <h1>
          DETAIL <span>PESANAN</span>
        </h1>
      </section>
      <main className="wrap">
        <p className="kecil">
          <Link className="tautan" href="/user/riwayat">
            ← Riwayat Pemesanan
          </Link>
        </p>
        <Suspense fallback={<p className="memuat">Memuat pesanan...</p>}>
          <DetailPesanan />
        </Suspense>
      </main>
    </Halaman>
  );
}
