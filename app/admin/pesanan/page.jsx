import { Suspense } from "react";
import PanelAdmin from "@/components/admin/PanelAdmin";
import DaftarPesanan from "@/components/admin/pesanan/DaftarPesanan";

export const metadata = { title: "Pesanan - Admin GantengnyaJatim Group" };

export default function HalamanPesanan() {
  return (
    <PanelAdmin aktif="pesanan">
      <main className="main">
        <header>
          <h1>Pesanan</h1>
          <p>Kelola serah terima dan penyelesaian pesanan.</p>
        </header>
        <Suspense fallback={<p className="memuat">Memuat...</p>}>
          <DaftarPesanan />
        </Suspense>
      </main>
    </PanelAdmin>
  );
}
