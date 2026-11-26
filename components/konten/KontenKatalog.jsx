import { Suspense } from "react";
import FormCari from "@/components/katalog/FormCari";
// Isi halaman yang sama untuk pengunjung (base "") dan pelanggan (base "/user").
export default function KontenKatalog() {
  return (
    <>
      <section className="hero banner">
        <h1>
          {"KATALOG "}
          <span>MOBIL</span>
        </h1>
      </section>
      <main className="wrap">
        <Suspense fallback={null}>
          <FormCari />
        </Suspense>
        <p className="kecil">Tanggal mulai paling cepat besok dan paling jauh 30 hari. Durasi 1 sampai 30 hari.</p>
        <div className="kotak kosong jarak-kecil">
          <div className="ikon" aria-hidden="true">
            📅
          </div>
          <h2>Pilih tanggal dan durasi</h2>
          <p className="abu">Pilih tanggal dan durasi untuk melihat mobil yang tersedia.</p>
        </div>
      </main>
    </>
  );
}
