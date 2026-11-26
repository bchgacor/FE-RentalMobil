import { Suspense } from "react";
import PanelAdmin from "@/components/admin/PanelAdmin";
import DaftarMobil from "@/components/admin/mobil/DaftarMobil";

export const metadata = { title: "Kelola Mobil - Admin GantengnyaJatim Group" };

export default function HalamanKelolaMobil() {
  return (
    <PanelAdmin aktif="kelola-mobil">
      <main className="main">
        <header>
          <h1>Kelola Mobil</h1>
          <p>Menambahkan atau mengedit info mobil.</p>
        </header>
        <Suspense fallback={<p className="memuat">Memuat data mobil...</p>}>
          <DaftarMobil />
        </Suspense>
      </main>
    </PanelAdmin>
  );
}
