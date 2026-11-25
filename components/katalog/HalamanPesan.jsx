import Link from "next/link";
import { notFound } from "next/navigation";
import Halaman from "@/components/Halaman";
import DetailMobil from "./DetailMobil";
import FormPesan from "./FormPesan";
import { cariMobil } from "@/data/mobil";

// Satu halaman pesan untuk semua mobil (menggantikan 48 file form-pesan di versi HTML).
export default function HalamanPesan({ slug, masuk = false }) {
  const mobil = cariMobil(slug);
  if (!mobil) notFound();
  const base = masuk ? "/user" : "";
  return (
    <Halaman mode={masuk ? "pelanggan" : "tamu"} aktif="katalog" gaya={["pesan"]}>
      <section className="hero banner">
        <h1>
          PESAN <span>{mobil.nama.toUpperCase()}</span>
        </h1>
      </section>
      <main className="wrap">
        <Link className="kembali" href={`${base}/katalog-hasil`}>
          ← Kembali ke katalog
        </Link>
        <div className="dua-kolom">
          <DetailMobil mobil={mobil} />
          <FormPesan mobil={mobil} masuk={masuk} />
        </div>
      </main>
    </Halaman>
  );
}
