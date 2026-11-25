import Link from "next/link";
import Halaman from "@/components/Halaman";

export const metadata = { title: "Halaman tidak ditemukan" };

export default function TidakDitemukan() {
  return (
    <Halaman mode="tamu">
      <section className="hero banner">
        <h1>
          HALAMAN <span>TIDAK DITEMUKAN</span>
        </h1>
      </section>
      <main className="wrap">
        <div className="kotak kosong">
          <h2>Halaman yang Anda cari tidak ada</h2>
          <p className="abu">Mungkin alamatnya salah ketik atau halaman sudah dipindahkan.</p>
          <Link className="btn" href="/">
            Kembali ke beranda
          </Link>
        </div>
      </main>
    </Halaman>
  );
}
