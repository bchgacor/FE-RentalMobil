import { Suspense } from "react";
import Halaman from "@/components/Halaman";
import FormCari from "@/components/katalog/FormCari";
import HasilKatalog from "@/components/katalog/HasilKatalog";

export const metadata = { title: "Hasil Pencarian Mobil" };

export default function HalamanKatalogHasil() {
  return (
    <Halaman aktif="katalog" gaya={["katalog"]}>
      <section className="hero banner">
        <h1>
          {"KATALOG "}
          <span>MOBIL</span>
        </h1>
      </section>
      <main className="wrap">
        <Suspense fallback={<p className="memuat">Memuat...</p>}>
          <FormCari />
          <p className="kecil">Tanggal mulai paling cepat besok dan paling jauh 30 hari. Durasi 1 sampai 30 hari.</p>
          <HasilKatalog />
        </Suspense>
      </main>
    </Halaman>
  );
}
