import Link from "next/link";
import { Suspense } from "react";
import HalamanAdmin from "@/components/admin/HalamanAdmin";
import DetailPesananAdmin from "@/components/admin/pesanan/DetailPesananAdmin";

export const metadata = { title: "Detail Pesanan - Admin GantengnyaJatim Group" };

export default function HalamanDetailPesananAdmin() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link className="kembali" href="/admin/pesanan">
          ← Kembali ke pesanan
        </Link>
        <Suspense fallback={<p className="memuat">Memuat pesanan...</p>}>
          <DetailPesananAdmin />
        </Suspense>
      </main>
    </HalamanAdmin>
  );
}
