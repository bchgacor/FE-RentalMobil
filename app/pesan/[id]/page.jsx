import { Suspense } from "react";
import Halaman from "@/components/Halaman";
import FormPesan from "@/components/pesan/FormPesan";

export const metadata = { title: "Form Pesan" };

export default function HalamanPesan() {
  return (
    <Halaman aktif="katalog" gaya={["pesan"]}>
      <section className="hero banner">
        <h1>
          PESAN <span>MOBIL</span>
        </h1>
      </section>
      <main className="wrap">
        <Suspense fallback={<p className="memuat">Memuat...</p>}>
          <FormPesan />
        </Suspense>
      </main>
    </Halaman>
  );
}
