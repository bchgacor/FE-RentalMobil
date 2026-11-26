import Link from "next/link";
import { Suspense } from "react";
import HalamanAdmin from "@/components/admin/HalamanAdmin";
import FormUnit from "@/components/admin/mobil/FormUnit";

export const metadata = { title: "Unit Mobil - Admin GantengnyaJatim Group" };

export default function HalamanFormUnit() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link className="kembali" href="/admin/kelola-mobil">
          ← Kembali ke Kelola Mobil
        </Link>
        <Suspense fallback={<p className="memuat">Memuat...</p>}>
          <FormUnit />
        </Suspense>
      </main>
    </HalamanAdmin>
  );
}
