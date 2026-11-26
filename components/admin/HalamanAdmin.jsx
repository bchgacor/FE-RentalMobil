import Link from "next/link";
import Penjaga from "@/components/sesi/Penjaga";
import TombolKeluar from "./TombolKeluar";

// Kerangka halaman kerja admin tanpa sidebar (detail pesanan, serah terima, form tipe/unit).
export default function HalamanAdmin({ children }) {
  return (
    <div className="h-admin">
      <header className="topbar">
        <Link className="brand" href="/admin/dashboard">
          <img src="/img/logo.png" alt="Dashboard admin" />
        </Link>
        <span className="peran">Admin Rental</span>
        <TombolKeluar className="btn garis sm" />
      </header>
      <Penjaga akses="admin">{children}</Penjaga>
    </div>
  );
}
