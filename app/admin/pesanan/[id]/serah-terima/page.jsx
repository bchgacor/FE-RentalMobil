import Link from "next/link";
import { Suspense } from "react";
import HalamanAdmin from "@/components/admin/HalamanAdmin";
import SerahTerima from "@/components/admin/pesanan/SerahTerima";

export const metadata = { title: "Serah Terima Unit - Admin GantengnyaJatim Group" };

export default function HalamanSerahTerima() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link className="kembali" href="/admin/pesanan">
          ← Kembali ke pesanan
        </Link>
        <Suspense fallback={<p className="memuat">Memuat pesanan...</p>}>
          <SerahTerima />
        </Suspense>
      </main>
    </HalamanAdmin>
  );
}
