import { Suspense } from "react";
import PanelAdmin from "@/components/admin/PanelAdmin";
import Laporan from "@/components/admin/lain/Laporan";

export const metadata = { title: "Laporan - Admin GantengnyaJatim Group" };

export default function HalamanLaporan() {
  return (
    <PanelAdmin aktif="laporan">
      <main className="main">
        <header>
          <h1>Laporan Transaksi</h1>
          <p>Semua pendapatan dari pesanan yang sudah dikonfirmasi.</p>
        </header>
        <Suspense fallback={<p className="memuat">Memuat laporan...</p>}>
          <Laporan />
        </Suspense>
      </main>
    </PanelAdmin>
  );
}
