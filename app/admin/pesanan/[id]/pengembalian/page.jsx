import Link from "next/link";
import { Suspense } from "react";
import HalamanAdmin from "@/components/admin/HalamanAdmin";
import Pengembalian from "@/components/admin/pesanan/Pengembalian";

export const metadata = { title: "Pengembalian Unit - Admin GantengnyaJatim Group" };

export default function HalamanPengembalian() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link className="kembali" href="/admin/pesanan">
          ← Kembali ke pesanan
        </Link>
        <Suspense fallback={<p className="memuat">Memuat pesanan...</p>}>
          <Pengembalian />
        </Suspense>
      </main>
    </HalamanAdmin>
  );
}
